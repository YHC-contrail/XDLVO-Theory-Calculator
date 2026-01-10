(function() {
  'use strict';

  // XDLVO model core - for membrane fouling analysis in water treatment
  // Reference: van Oss, 2006; Braghetta, 1995
  window.XDLVOModel = window.XDLVOModel || {};

  // Physical constants - these don't change
  const PHYS = Object.freeze({
    e: 1.602176634e-19,          // elementary charge (C)
    ε0: 8.8541878128e-12,        // vacuum permittivity (F/m)
    k: 1.380649e-23,             // Boltzmann constant (J/K)
    NA: 6.02214076e23            // Avogadro's number (1/mol)
  });

  // Model parameters - defaults from literature
  const PARAMS = Object.freeze({
    γ_diiodo: 50.8,              // diiodomethane surface tension (mJ/m²)
    γ_form_LW: 39,               // formamide LW component
    γ_form_plus: 2.28,           // formamide electron acceptor
    γ_form_minus: 39.6,          // formamide electron donor
    γ_water_LW: 21.8,
    γ_water_plus: 25.5,
    γ_water_minus: 25.5,
    h0: 0.158,                   // minimum separation (nm) - atomic scale
    λ: 0.6,                      // AB decay length (nm)
    dh: 0.05,                    // distance step for energy profiles
    hmax: 25,                    // max separation to calculate
    hmin: 0.15                   // avoids division by zero
  });

  window.XDLVOModel.PHYS = PHYS;
  window.XDLVOModel.PARAMS = PARAMS;

  // Helper: find closest distance index (binary search for long arrays)
  window.XDLVOModel.findClosestIndex = function(arr, target) {
    if (!arr?.length) return -1;
    if (target <= arr[0]) return 0;
    if (target >= arr[arr.length - 1]) return arr.length - 1;
    
    let lo = 0, hi = arr.length - 1;
    while (lo < hi - 1) {
      const mid = (lo + hi) >> 1;
      if (arr[mid] === target) return mid;
      arr[mid] < target ? lo = mid : hi = mid;
    }
    return Math.abs(arr[lo] - target) <= Math.abs(arr[hi] - target) ? lo : hi;
  };

  // Hyperbolic functions with numerical stability
  // Needed for electrical double layer calculations at small κh
  window.XDLVOModel.hyperbolics = function(x) {
    const SMALL = 1e-10, LARGE = 20;
    
    // For very small arguments, use series expansion to avoid division by zero
    if (Math.abs(x) < SMALL) {
      return { 
        coth: x !== 0 ? 1/x + x/3 : Infinity,  // coth(x) ≈ 1/x + x/3
        csch: x !== 0 ? 1/x - x/6 : Infinity   // csch(x) ≈ 1/x - x/6
      };
    }
    
    // For large arguments, asymptotic to ±1 or 0
    if (Math.abs(x) > LARGE) {
      return { 
        coth: x > 0 ? 1 : -1, 
        csch: 0 
      };
    }
    
    // Normal case - use built-in functions
    const tanh = Math.tanh(x);
    const sinh = Math.sinh(x);
    return { coth: 1 / tanh, csch: 1 / sinh };
  };

  // Floating point comparison helpers
  window.XDLVOModel.almostEqual = function(a, b, eps = 1e-10) {
    return Math.abs(a - b) < eps;
  };
  
  window.XDLVOModel.almostLE = function(a, b, eps = 1e-10) {
    return a < b || window.XDLVOModel.almostEqual(a, b, eps);
  };
  
  window.XDLVOModel.almostGE = function(a, b, eps = 1e-10) {
    return a > b || window.XDLVOModel.almostEqual(a, b, eps);
  };

  window.XDLVOModel.rad = function(deg) {
    return deg * Math.PI / 180;
  };

  /**
   * Calculate surface energy components from contact angles
   * 
   * Uses extended Young-Dupré equation with three test liquids:
   * 1 non-polar (diiodomethane) → γ_LW only
   * 2 polar (water + formamide) → solve for γ⁺ and γ⁻
   * 
   * Equation: γ_l(1+cosθ) = 2[√(γ_s^LW·γ_l^LW) + √(γ_s^+·γ_l^-) + √(γ_s^-·γ_l^+)]
   * 
   * Reference: van Oss et al., 1988 - "Interfacial Lifshitz-van der Waals and polar interactions"
   */
  window.XDLVOModel.surfaceEnergyFromContactAngles = function(θ_diiodo, θ_water, θ_form, 
                                                               liquid_diiodo, liquid_water, liquid_form) {
    const θ1 = window.XDLVOModel.rad(θ_diiodo);
    const θ2 = window.XDLVOModel.rad(θ_water);
    const θ3 = window.XDLVOModel.rad(θ_form);

    // Non-polar liquid gives γ_LW directly
    const γ_lw = Math.pow(
      liquid_diiodo.LW * (1 + Math.cos(θ1)) / (2 * Math.sqrt(liquid_diiodo.LW)),
      2
    );

    // Polar liquids - construct 2×2 system for √γ⁺ and √γ⁻
    const γ2_total = liquid_water.LW + 2 * Math.sqrt(liquid_water.Plus * liquid_water.Minus);
    const γ3_total = liquid_form.LW + 2 * Math.sqrt(liquid_form.Plus * liquid_form.Minus);

    const C1 = γ2_total * (1 + Math.cos(θ2)) / 2 - Math.sqrt(liquid_water.LW * γ_lw);
    const C2 = γ3_total * (1 + Math.cos(θ3)) / 2 - Math.sqrt(liquid_form.LW * γ_lw);

    // Matrix: [√γ₂⁻  √γ₂⁺] [√γ_s⁺] = [C1]
    //         [√γ₃⁺  √γ₃⁻] [√γ_s⁻]   [C2]
    const a11 = Math.sqrt(liquid_water.Minus);
    const a12 = Math.sqrt(liquid_water.Plus);
    const a21 = Math.sqrt(liquid_form.Plus);
    const a22 = Math.sqrt(liquid_form.Minus);

    const det = a11 * a22 - a12 * a21;
    if (Math.abs(det) < 1e-10) {
      throw new Error('Ill-conditioned: test liquids too similar. Choose liquids with different acid-base character.');
    }

    const sqrt_gamma_plus = (C1 * a22 - C2 * a12) / det;
    const sqrt_gamma_minus = (a11 * C2 - a21 * C1) / det;

    const γ_plus = sqrt_gamma_plus * sqrt_gamma_plus;
    const γ_minus = sqrt_gamma_minus * sqrt_gamma_minus;
    const γ_ab = 2 * Math.sqrt(γ_plus * γ_minus);
    const γ_total = γ_lw + γ_ab;

    return { γ_lw, γ_plus, γ_minus, γ_ab, γ_total };
  };

  /**
   * Water dielectric constant as function of temperature
   * 
   * ε_r(T) = 87.740 - 0.40008ΔT + 9.398e-4ΔT² - 1.410e-6ΔT³
   * where ΔT = T(°C) = T(K) - 273.15
   * 
   * Valid range: 0-100°C. Error < 0.1% compared to experimental data.
   */
  window.XDLVOModel.waterDielectric = function(T_K) {
    const ΔT = T_K - 273.15;
    return 87.740 - 0.40008 * ΔT + 9.398e-4 * ΔT * ΔT - 1.410e-6 * ΔT * ΔT * ΔT;
  };

  /**
   * Inverse Debye length κ (nm⁻¹)
   * 
   * κ = √(2N_A·e²·I / (ε_0·ε_r·k_B·T))
   * 
   * I must be in mol/L (M) - converted to mol/m³ internally
   * Returns κ in nm⁻¹ for use with h in nm
   */
  window.XDLVOModel.debyeLength = function(I_M, T_K) {
    const { e, ε0, k, NA } = PHYS;
    const ε_r = window.XDLVOModel.waterDielectric(T_K);
    const I_SI = I_M * 1000;  // mol/L → mol/m³
    
    const κ_m = Math.sqrt(
      (2 * NA * e * e * I_SI) /
      (ε_r * ε0 * k * T_K)
    );
    
    return κ_m * 1e-9;  // m⁻¹ → nm⁻¹
  };

  // Generate distance array for energy profiles
  window.XDLVOModel.distanceArray = function() {
    const { hmin, hmax, dh } = PARAMS;
    const h = [];
    for (let d = hmin; d <= hmax; d += dh) h.push(d);
    return h;
  };

  /**
   * ΔG at minimum separation (h₀ = 0.158 nm)
   * 
   * Used to scale interaction energies U(h).
   * 
   * ΔG_LW = -2(√γ_m^LW - √γ_w^LW)(√γ_f^LW - √γ_w^LW)
   * 
   * ΔG_AB = 2√γ_w^-[(√γ_f^- + √γ_m^- - √γ_w^-) + (√γ_f^+ + √γ_m^+ - √γ_w^+)]
   *         - 2√(γ_f^-·γ_m^+) - 2√(γ_f^+·γ_m^-)
   * 
   * ΔG_EL = (κε₀ε_r/2)(ζ_m² + ζ_f²)[1 - coth(κh₀) + (2ζ_mζ_f)/(ζ_m² + ζ_f²)·csch(κh₀)]
   * 
   * Returns mJ/m² (energy per unit area)
   */
  window.XDLVOModel.deltaG = function(membrane, foulant) {
    const { γ_water_LW, γ_water_plus, γ_water_minus, h0 } = PARAMS;
    const { ε0 } = PHYS;
    
    const sqrt_gamma_w_lw = Math.sqrt(γ_water_LW);
    const sqrt_gamma_w_plus = Math.sqrt(γ_water_plus);
    const sqrt_gamma_w_minus = Math.sqrt(γ_water_minus);
    
    const sqrt_gamma_m_lw = Math.sqrt(membrane.γ_lw);
    const sqrt_gamma_f_lw = Math.sqrt(foulant.γ_lw);
    const sqrt_gamma_m_plus = Math.sqrt(membrane.γ_plus);
    const sqrt_gamma_f_plus = Math.sqrt(foulant.γ_plus);
    const sqrt_gamma_m_minus = Math.sqrt(membrane.γ_minus);
    const sqrt_gamma_f_minus = Math.sqrt(foulant.γ_minus);
    
    // LW component (always attractive)
    const ΔG_lw = -2 * (sqrt_gamma_m_lw - sqrt_gamma_w_lw) * (sqrt_gamma_f_lw - sqrt_gamma_w_lw);
    
    // AB component (can be repulsive if surfaces are hydrophilic)
    const ΔG_ab = 2 * sqrt_gamma_w_minus * (sqrt_gamma_f_minus + sqrt_gamma_m_minus - sqrt_gamma_w_minus) +
                  2 * sqrt_gamma_w_minus * (sqrt_gamma_f_plus + sqrt_gamma_m_plus - sqrt_gamma_w_minus) -
                  2 * Math.sqrt(foulant.γ_minus * membrane.γ_plus) -
                  2 * Math.sqrt(foulant.γ_plus * membrane.γ_minus);
    
    // EL component (DLVO)
    const κ = window.XDLVOModel.debyeLength(membrane.I, membrane.T);
    const ε_r = window.XDLVOModel.waterDielectric(membrane.T);
    const ζm = membrane.ζ_m;
    const ζf = foulant.ζ_f;
    const ζ_sum2 = ζm * ζm + ζf * ζf;
    
    const { coth, csch } = window.XDLVOModel.hyperbolics(κ * h0);
    const ΔG_el = (κ * ε0 * ε_r / 2) * ζ_sum2 * (1 - coth + 2 * ζf * ζm * csch / ζ_sum2) * 1e6;
    
    return {
      LW: ΔG_lw,
      AB: ΔG_ab,
      EL: ΔG_el,
      ADH: ΔG_lw + ΔG_ab,  // adhesion free energy (no EL)
      TOT: ΔG_lw + ΔG_ab + ΔG_el
    };
  };

  /**
   * Interaction energy U(h) between spherical foulant and flat membrane
   * 
   * U_LW(h) = (2π·ΔG_LW·h₀²·a / h) × 10⁻⁶  (in kT)
   * U_AB(h) = 2π·a·λ·ΔG_AB·exp((h₀-h)/λ) × 10⁻³
   * U_EL(h) = πε₀ε_r·a[ζ_mζ_f·ln((1+e^(-κh))/(1-e^(-κh))) + (ζ_m²+ζ_f²)/2·ln(1-e^(-2κh))] × 10⁴
   * 
   * where a = foulant radius (nm)
   * Returns energies in units of kT (Boltzmann constant × temperature)
   */
  window.XDLVOModel.interactionEnergy = function(sysParams, foulantProps, ΔG) {
    const h = window.XDLVOModel.distanceArray();
    const { h0, λ } = PARAMS;
    const { ε0 } = PHYS;
    
    const a = sysParams.a;  // foulant radius (nm)
    const κ = window.XDLVOModel.debyeLength(sysParams.I, sysParams.T);
    const ε_r = window.XDLVOModel.waterDielectric(sysParams.T);
    const ζm = sysParams.ζ_m;
    const ζf = sysParams.ζ_f;
    
    const ULW = [], UAB = [], UEL = [], UTOT = [];
    const h0_sq = h0 * h0;
    
    // Pre-calc for EL component
    const prefactor_EL = Math.PI * ε_r * ε0 * a;
    const ζ_prod = 2 * ζm * ζf;
    const ζ_sum_sq = ζm * ζm + ζf * ζf;
    
    h.forEach(d => {
      // LW: h⁻¹ dependence (Hamaker approach)
      const u_lw = 2 * Math.PI * ΔG.LW * h0_sq * a * 1e-6 / d;
      ULW.push(u_lw);
      
      // AB: exponential decay (short-range)
      const u_ab = 2 * Math.PI * a * λ * ΔG.AB * Math.exp((h0 - d) / λ) * 1e-3;
      UAB.push(u_ab);
      
      // EL: DLVO classical expression
      const exp_kh = Math.exp(-κ * d);
      const exp_2kh = Math.exp(-2 * κ * d);
      const denom = 1 - exp_kh;
      
      // Handle numerical issue at small distances
      if (Math.abs(denom) < 1e-10) {
        UEL.push(0);
        UTOT.push(u_lw + u_ab);
        return;
      }
      
      const term1 = Math.log((1 + exp_kh) / denom);
      const term2 = Math.log(1 - exp_2kh);
      const u_el = prefactor_EL * 0.5 * (ζ_prod * term1 + ζ_sum_sq * term2) * 1e4;
      
      UEL.push(u_el);
      UTOT.push(u_lw + u_ab + u_el);
    });
    
    return { h, ULW, UAB, UEL, UTOT };
  };

  // Find energy barrier (primary maximum) in U_TOT profile
  window.XDLVOModel.findBarrier = function(h, U) {
    let maxU = -Infinity, maxH = null;
    
    // Skip first and last points to avoid boundary issues
    for (let i = 1; i < U.length - 1; i++) {
      if (U[i] > U[i-1] && U[i] > U[i+1] && U[i] > maxU) {
        maxU = U[i];
        maxH = h[i];
      }
    }
    
    // 如果没有找到能垒（maxH仍为null），返回null表示不存在
    if (maxH === null) {
      return { energy: null, position: null };
    }
    
    return { energy: maxU, position: maxH };
  };

  // Find local minima in U_TOT profile
  // Returns array of {position, energy} objects sorted by position
  window.XDLVOModel.findMinima = function(h, U) {
    const minima = [];
    
    // Check first point - if it's lower than second point, it's a boundary minimum
    // This represents the primary minimum at h0 (contact)
    if (U[0] < U[1]) {
      minima.push({ position: h[0], energy: U[0], type: 'primary' });
    }
    
    // Find interior local minima
    for (let i = 1; i < U.length - 1; i++) {
      if (U[i] < U[i-1] && U[i] < U[i+1]) {
        minima.push({ position: h[i], energy: U[i], type: 'secondary' });
      }
    }
    
    // Sort by position (should already be sorted, but ensure)
    minima.sort((a, b) => a.position - b.position);
    
    // Label: first one is primary, rest are secondary
    if (minima.length > 0) {
      minima[0].type = 'primary';
      for (let i = 1; i < minima.length; i++) {
        minima[i].type = 'secondary';
      }
    }
    
    return minima;
  };

  // Calculate force at each distance point
  // F = -dU/dh (negative gradient of energy)
  window.XDLVOModel.calculateForce = function(h, U) {
    const F = [];
    const n = h.length;
    
    for (let i = 0; i < n; i++) {
      let dUdh;
      if (i === 0) {
        // Forward difference at first point
        dUdh = (U[1] - U[0]) / (h[1] - h[0]);
      } else if (i === n - 1) {
        // Backward difference at last point
        dUdh = (U[n-1] - U[n-2]) / (h[n-1] - h[n-2]);
      } else {
        // Central difference for interior points
        dUdh = (U[i+1] - U[i-1]) / (h[i+1] - h[i-1]);
      }
      // Force is negative gradient
      F.push(-dUdh);
    }
    
    return F;
  };

  // Find where U_TOT crosses zero (equilibrium distances) - kept for compatibility
  window.XDLVOModel.findZeroCrossings = function(h, U) {
    const zeros = [];
    
    for (let i = 0; i < U.length - 1; i++) {
      const u1 = U[i], u2 = U[i+1];
      const crosses = (window.XDLVOModel.almostLE(u1, 0) && window.XDLVOModel.almostGE(u2, 0)) ||
                      (window.XDLVOModel.almostGE(u1, 0) && window.XDLVOModel.almostLE(u2, 0));
      
      if (crosses) {
        const t = -u1 / (u2 - u1);
        zeros.push(h[i] + t * (h[i+1] - h[i]));
      }
    }
    
    return zeros;
  };

  window.XDLVOModel.analyzeProfile = function(energyData) {
    const { h, UTOT } = energyData;
    const barrier = window.XDLVOModel.findBarrier(h, UTOT);
    const minima = window.XDLVOModel.findMinima(h, UTOT);
    const force = window.XDLVOModel.calculateForce(h, UTOT);
    
    // Extract primary and secondary minima
    const primaryMin = minima.find(m => m.type === 'primary') || null;
    const secondaryMin = minima.find(m => m.type === 'secondary') || null;
    
    return {
      barrier: barrier.energy,
      barrierPosition: barrier.position,
      primaryMinimum: primaryMin,
      secondaryMinimum: secondaryMin,
      minima: minima,
      force: force
    };
  };

  // Get energy at specific distance (for plotting markers)
  window.XDLVOModel.energyAtDistance = function(h_arr, U_arr, target_h, tol = 0.05) {
    const idx = window.XDLVOModel.findClosestIndex(h_arr, target_h);
    return idx >= 0 && Math.abs(h_arr[idx] - target_h) < tol ? U_arr[idx] : 0;
  };
})();