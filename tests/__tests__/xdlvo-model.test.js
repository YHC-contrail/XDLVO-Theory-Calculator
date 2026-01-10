// XDLVO Model unit tests
const path = require('path');
require(path.resolve(__dirname, '../../src/xdlvo-model.js'));

const M = window.XDLVOModel;

describe('Constants', () => {
  test('physical constants', () => {
    expect(M.PHYS.e).toBe(1.602176634e-19);
    expect(M.PHYS.ε0).toBe(8.8541878128e-12);
    expect(M.PHYS.k).toBe(1.380649e-23);
    expect(M.PHYS.NA).toBe(6.02214076e23);
  });

  test('model parameters', () => {
    expect(M.PARAMS.γ_diiodo).toBe(50.8);
    expect(M.PARAMS.h0).toBe(0.158);
    expect(M.PARAMS.λ).toBe(0.6);
    expect(M.PARAMS.hmax).toBe(25);
  });
});

describe('Utilities', () => {
  describe('findClosestIndex', () => {
    test('finds closest value', () => {
      const arr = [1, 3, 5, 7, 9];
      expect(M.findClosestIndex(arr, 4)).toBe(1);
      expect(M.findClosestIndex(arr, 1)).toBe(0);
      expect(M.findClosestIndex(arr, 9)).toBe(4);
    });

    test('edge cases', () => {
      expect(M.findClosestIndex([], 5)).toBe(-1);
      expect(M.findClosestIndex([1], 5)).toBe(0);
      expect(M.findClosestIndex([1, 2, 3], 0)).toBe(0);
      expect(M.findClosestIndex([1, 2, 3], 10)).toBe(2);
    });
  });

  describe('hyperbolics', () => {
    test('normal values', () => {
      const { coth, csch } = M.hyperbolics(1);
      expect(typeof coth).toBe('number');
      expect(typeof csch).toBe('number');
    });

    test('small values - series expansion', () => {
      const { coth, csch } = M.hyperbolics(1e-12);
      expect(coth).toBeDefined();
      expect(csch).toBeDefined();
    });

    test('large values - asymptotic', () => {
      const { coth, csch } = M.hyperbolics(25);
      expect(coth).toBeCloseTo(1, 5);
      expect(csch).toBeCloseTo(0, 10);
    });
  });

  describe('floating point comparison', () => {
    test('almostEqual', () => {
      expect(M.almostEqual(1.0, 1.0 + 1e-11)).toBe(true);
      expect(M.almostEqual(1.0, 1.1)).toBe(false);
      expect(M.almostEqual(0, 1e-11)).toBe(true);
    });

    test('almostLE', () => {
      expect(M.almostLE(1.0, 2.0)).toBe(true);
      expect(M.almostLE(1.0, 1.0000000001)).toBe(true);
      expect(M.almostLE(2.0, 1.0)).toBe(false);
    });

    test('almostGE', () => {
      expect(M.almostGE(2.0, 1.0)).toBe(true);
      expect(M.almostGE(1.0, 1.0 + 1e-11)).toBe(true);
      expect(M.almostGE(1.0, 2.0)).toBe(false);
    });
  });

  describe('rad', () => {
    test('converts degrees to radians', () => {
      expect(M.rad(0)).toBe(0);
      expect(M.rad(180)).toBeCloseTo(Math.PI, 10);
      expect(M.rad(90)).toBeCloseTo(Math.PI / 2, 10);
      expect(M.rad(360)).toBeCloseTo(2 * Math.PI, 10);
    });
  });
});

describe('Core calculations', () => {
  describe('surfaceEnergyFromContactAngles', () => {
    test('calculates surface energy components', () => {
      const liq_diiodo = { LW: 50.8, Plus: 0, Minus: 0 };
      const liq_water = { LW: 21.8, Plus: 25.5, Minus: 25.5 };
      const liq_form = { LW: 39, Plus: 2.28, Minus: 39.6 };
      
      const result = M.surfaceEnergyFromContactAngles(
        64.572, 60.966, 87.5268, liq_diiodo, liq_water, liq_form
      );

      expect(result.γ_lw).toBeGreaterThan(0);
      expect(result.γ_plus).toBeGreaterThanOrEqual(0);
      expect(result.γ_minus).toBeGreaterThanOrEqual(0);
      expect(result.γ_ab).toBeGreaterThanOrEqual(0);
      expect(result.γ_total).toBeGreaterThan(0);
    });

    test('detects ill-conditioned matrix', () => {
      const liq_diiodo = { LW: 50.8, Plus: 0, Minus: 0 };
      // Use truly identical liquids to force determinant near zero
      const liq_identical = { LW: 21.8, Plus: 25.5, Minus: 25.5 };
      
      expect(() => {
        M.surfaceEnergyFromContactAngles(
          64.572, 60.966, 60.966, liq_diiodo, liq_identical, liq_identical
        );
      }).toThrow(/ill-conditioned/i);
    });
  });

  describe('waterDielectric', () => {
    test('calculates dielectric constant', () => {
      const ε_r = M.waterDielectric(298);
      expect(ε_r).toBeGreaterThan(70);
      expect(ε_r).toBeLessThan(90);
    });

    test('decreases with temperature', () => {
      const ε_cold = M.waterDielectric(273.15);
      const ε_hot = M.waterDielectric(373.15);
      expect(ε_cold).toBeGreaterThan(ε_hot);
    });
  });

  describe('debyeLength', () => {
    test('calculates κ', () => {
      const κ = M.debyeLength(0.01, 298);
      expect(κ).toBeGreaterThan(0);
    });

    test('κ increases with ionic strength', () => {
      const κ1 = M.debyeLength(0.001, 298);
      const κ2 = M.debyeLength(0.01, 298);
      expect(κ2).toBeGreaterThan(κ1);
    });
  });

  describe('distanceArray', () => {
    test('generates distance array', () => {
      const h = M.distanceArray();
      expect(Array.isArray(h)).toBe(true);
      expect(h.length).toBeGreaterThan(0);
      expect(h[0]).toBeCloseTo(0.15, 2);
      expect(h[h.length - 1]).toBeGreaterThanOrEqual(24.9);
      expect(h[h.length - 1]).toBeLessThanOrEqual(25);
    });

    test('array is monotonic increasing', () => {
      const h = M.distanceArray();
      for (let i = 1; i < h.length; i++) {
        expect(h[i]).toBeGreaterThan(h[i - 1]);
      }
    });
  });

  describe('deltaG', () => {
    test('calculates Gibbs free energy', () => {
      const membrane = {
        γ_lw: 40, γ_plus: 0.5, γ_minus: 30,
        ζ_m: -32.4, I: 0.01, T: 298
      };
      const foulant = {
        γ_lw: 35, γ_plus: 1.0, γ_minus: 25,
        ζ_f: -7.5
      };

      const ΔG = M.deltaG(membrane, foulant);
      
      expect(typeof ΔG.LW).toBe('number');
      expect(typeof ΔG.AB).toBe('number');
      expect(typeof ΔG.EL).toBe('number');
      expect(typeof ΔG.ADH).toBe('number');
      expect(typeof ΔG.TOT).toBe('number');
    });

    test('ADH = LW + AB', () => {
      const membrane = {
        γ_lw: 40, γ_plus: 0.5, γ_minus: 30,
        ζ_m: -32.4, I: 0.01, T: 298
      };
      const foulant = {
        γ_lw: 35, γ_plus: 1.0, γ_minus: 25,
        ζ_f: -7.5
      };

      const ΔG = M.deltaG(membrane, foulant);
      expect(ΔG.ADH).toBeCloseTo(ΔG.LW + ΔG.AB, 10);
    });
  });

  describe('interactionEnergy', () => {
    test('calculates U(h) profiles', () => {
      const sys = {
        a: 322.9, ζ_m: -32.4, ζ_f: -7.5,
        I: 0.01, T: 298
      };
      const foulant = {
        γ_lw: 35, γ_plus: 1.0, γ_minus: 25
      };
      const membrane = {
        γ_lw: 40, γ_plus: 0.5, γ_minus: 30,
        ζ_m: -32.4, I: 0.01, T: 298
      };
      
      const ΔG = M.deltaG(membrane, foulant);
      const energy = M.interactionEnergy(sys, foulant, ΔG);

      expect(Array.isArray(energy.h)).toBe(true);
      expect(Array.isArray(energy.ULW)).toBe(true);
      expect(energy.h.length).toBe(energy.ULW.length);
      expect(energy.h.length).toBe(energy.UAB.length);
      expect(energy.h.length).toBe(energy.UEL.length);
      expect(energy.h.length).toBe(energy.UTOT.length);
    });
  });

  describe('findBarrier', () => {
    test('finds energy barrier', () => {
      const h = [1, 2, 3, 4, 5];
      const U = [0, 1, 2, 1, 0];
      const { energy, position } = M.findBarrier(h, U);
      
      expect(energy).toBe(2);
      expect(position).toBe(3);
    });

    test('returns null when no barrier', () => {
      const h = [1, 2, 3, 4, 5];
      const U = [0, -1, -2, -3, -4];
      const { position } = M.findBarrier(h, U);
      
      expect(position).toBe(null);
    });

    test('finds highest barrier when multiple peaks', () => {
      const h = [1, 2, 3, 4, 5, 6, 7];
      const U = [0, 1, 0.5, 3, 0.5, 1, 0];
      const { energy, position } = M.findBarrier(h, U);
      
      expect(energy).toBe(3);
      expect(position).toBe(4);
    });
  });

  describe('findMinima', () => {
    test('boundary min', () => {
      const h = [1, 2, 3, 4, 5];
      const U = [-2, -1, 0, 1, 2];
      const m = M.findMinima(h, U);
      
      expect(m.length).toBe(1);
      expect(m[0].type).toBe('primary');
      expect(m[0].position).toBe(1);
      expect(m[0].energy).toBe(-2);
    });

    test('interior min', () => {
      const h = [1, 2, 3, 4, 5];
      const U = [1, 2, -1, 2, 1];
      const m = M.findMinima(h, U);
      
      expect(m.length).toBe(2);
      expect(m[0].position).toBe(1);
      expect(m[1].position).toBe(3);
      expect(m[1].energy).toBe(-1);
    });

    test('primary + secondary', () => {
      const h = [1, 2, 3, 4, 5, 6, 7];
      const U = [-3, 1, 2, 1, -1, 1, 0];
      const m = M.findMinima(h, U);
      
      expect(m.length).toBe(2);
      expect(m[0].type).toBe('primary');
      expect(m[1].type).toBe('secondary');
    });

    test('first point lowest', () => {
      const h = [1, 2, 3, 4, 5];
      const U = [0, 1, 2, 3, 4];
      const m = M.findMinima(h, U);
      
      expect(m.length).toBe(1);
      expect(m[0].position).toBe(1);
    });

    test('interior only', () => {
      const h = [1, 2, 3, 4, 5];
      const U = [2, 1, 2, 3, 4];
      const m = M.findMinima(h, U);
      
      expect(m.length).toBe(1);
      expect(m[0].position).toBe(2);
    });
  });

  describe('calculateForce', () => {
    test('gradient', () => {
      const h = [1, 2, 3, 4, 5];
      const U = [0, 1, 2, 3, 4];
      const F = M.calculateForce(h, U);
      
      expect(F.length).toBe(h.length);
      expect(F[2]).toBeCloseTo(-1, 5);
    });

    test('repulsion', () => {
      const h = [1, 2, 3, 4, 5];
      const U = [4, 3, 2, 1, 0];
      const F = M.calculateForce(h, U);
      
      expect(F[2]).toBeCloseTo(1, 5);
    });

    test('equilibrium', () => {
      const h = [1, 2, 3, 4, 5];
      const U = [2, 1, 0, 1, 2];
      const F = M.calculateForce(h, U);
      
      expect(F[2]).toBeCloseTo(0, 5);
    });

    test('boundary', () => {
      const h = [1, 2, 3];
      const U = [0, 1, 2];
      const F = M.calculateForce(h, U);
      
      expect(F.length).toBe(3);
      expect(typeof F[0]).toBe('number');
      expect(typeof F[2]).toBe('number');
    });
  });

  describe('findZeroCrossings', () => {
    test('finds equilibrium distances', () => {
      const h = [1, 2, 3, 4, 5];
      const U = [1, 0.5, -0.5, -1, -2];
      const zeros = M.findZeroCrossings(h, U);
      
      expect(Array.isArray(zeros)).toBe(true);
      expect(zeros.length).toBeGreaterThan(0);
    });

    test('returns empty when no crossings', () => {
      const h = [1, 2, 3, 4, 5];
      const U = [1, 2, 3, 4, 5];
      const zeros = M.findZeroCrossings(h, U);
      
      expect(zeros.length).toBe(0);
    });
  });

  describe('analyzeProfile', () => {
    test('analyzes energy profile with barrier', () => {
      const energyData = {
        h: [1, 2, 3, 4, 5],
        UTOT: [0, 1, 2, 1, 0]
      };
      const analysis = M.analyzeProfile(energyData);
      
      expect(analysis.barrier).toBe(2);
      expect(analysis.barrierPosition).toBe(3);
      expect(Array.isArray(analysis.minima)).toBe(true);
      expect(Array.isArray(analysis.force)).toBe(true);
      expect(analysis.force.length).toBe(5);
    });

    test('returns primary and secondary minima', () => {
      const energyData = {
        h: [1, 2, 3, 4, 5, 6, 7],
        UTOT: [-3, 1, 2, 1, -1, 1, 0]
      };
      const analysis = M.analyzeProfile(energyData);
      
      expect(analysis.primaryMinimum).not.toBeNull();
      expect(analysis.primaryMinimum.type).toBe('primary');
      expect(analysis.secondaryMinimum).not.toBeNull();
      expect(analysis.secondaryMinimum.type).toBe('secondary');
    });

    test('handles profile without barrier', () => {
      const energyData = {
        h: [1, 2, 3, 4, 5],
        UTOT: [-4, -3, -2, -1, 0]
      };
      const analysis = M.analyzeProfile(energyData);
      
      expect(analysis.barrier).toBeNull();
      expect(analysis.barrierPosition).toBeNull();
    });

    test('handles profile without secondary minimum', () => {
      const energyData = {
        h: [1, 2, 3, 4, 5],
        UTOT: [-2, 0, 1, 2, 3]
      };
      const analysis = M.analyzeProfile(energyData);
      
      expect(analysis.primaryMinimum).not.toBeNull();
      expect(analysis.secondaryMinimum).toBeNull();
    });
  });

  describe('energyAtDistance', () => {
    test('finds energy at specific distance', () => {
      const h = [1, 2, 3, 4, 5];
      const U = [0, 1, 2, 1, 0];
      const energy = M.energyAtDistance(h, U, 3);
      
      expect(energy).toBe(2);
    });

    test('returns 0 when out of tolerance', () => {
      const h = [1, 2, 3, 4, 5];
      const U = [0, 1, 2, 1, 0];
      const energy = M.energyAtDistance(h, U, 10, 0.05);
      
      expect(energy).toBe(0);
    });
  });
});

describe('Integration', () => {
  test('full workflow', () => {
    // Surface energy from contact angles
    const liq_diiodo = { LW: 50.8, Plus: 0, Minus: 0 };
    const liq_water = { LW: 21.8, Plus: 25.5, Minus: 25.5 };
    const liq_form = { LW: 39, Plus: 2.28, Minus: 39.6 };
    
    const surf = M.surfaceEnergyFromContactAngles(
      64.572, 60.966, 87.5268, liq_diiodo, liq_water, liq_form
    );

    // System parameters
    const membrane = {
      γ_lw: surf.γ_lw,
      γ_plus: surf.γ_plus,
      γ_minus: surf.γ_minus,
      ζ_m: -32.4,
      I: 0.01,
      T: 298
    };

    const foulant = {
      γ_lw: 35,
      γ_plus: 1.0,
      γ_minus: 25,
      ζ_f: -7.5
    };

    const sys = {
      a: 322.9,
      ζ_m: -32.4,
      ζ_f: -7.5,
      I: 0.01,
      T: 298
    };

    // Calculate ΔG
    const ΔG = M.deltaG(membrane, foulant);
    expect(ΔG).toBeDefined();

    // Calculate U(h)
    const energy = M.interactionEnergy(sys, foulant, ΔG);
    expect(energy.h.length).toBeGreaterThan(0);

    // Analyze profile
    const analysis = M.analyzeProfile(energy);
    expect(typeof analysis.barrier === 'number' || analysis.barrier === null).toBe(true);
    expect(Array.isArray(analysis.minima)).toBe(true);
    expect(Array.isArray(analysis.force)).toBe(true);
    expect(analysis.force.length).toBe(energy.h.length);
  });
});
