(function() {
  'use strict';

  // Bridge between XDLVO physics model and DOM - handles user interaction, Canvas animation, state persistence
  const Model = window.XDLVOModel || {};
  
  // Physical constants & calculation boundaries - from Model, fallback for standalone debugging
  const PARAMS = Model.PARAMS || Object.freeze({
    γ_diiodo: 50.8,
    γ_form_LW: 39,
    γ_form_plus: 2.28,
    γ_form_minus: 39.6,
    γ_water_LW: 21.8,
    γ_water_plus: 25.5,
    γ_water_minus: 25.5,
    h0: 0.158,
    λ: 0.6,
    dh: 0.05,
    hmax: 25,
    hmin: 0.15
  });

  // Canvas magic numbers - adjusting these affects animation visual effects
  const VIS = Object.freeze({
    CANVAS_WIDTH: 1200,
    CANVAS_HEIGHT: 500,
    MEMBRANE_X: 150,
    PARTICLE_RADIUS: 40,
    CANVAS_PADDING: 300,
    ARROW_HEAD_LENGTH: 15,
    ARROW_LINE_WIDTH: 4,
    ENERGY_THRESHOLD: 0.01,      // Below this value treated as equilibrium (kT)
    DISTANCE_TOLERANCE: 0.05,    // Distance tolerance for energy interpolation (nm)
    DEFAULT_ANIMATION_DISTANCE: 5.0,
    ANIMATION_SPEED_FACTOR: 0.002,
    VIDEO_FPS: 30,
    VIDEO_BITRATE: 2500000,
    MAX_EXPORT_DURATION: 60000
  });

  // Attraction=blue, repulsion=red, following DLVO literature convention
  const COLORS = Object.freeze({
    ATTRACTION: '#2980b9',
    REPULSION: '#e74c3c',
    EQUILIBRIUM: '#808080',
    MEMBRANE: 'rgba(128, 128, 128, 0.8)',
    BARRIER_LINE: 'rgba(231, 76, 60, 0.7)'
  });

  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  const getInputVal = (id, def = 0) => {
    const el = document.getElementById(id);
    if (!el) { console.warn(`Missing input: ${id}`); return def; }
    const v = parseFloat(el.value);
    return isNaN(v) ? def : v;
  };

  const setInputVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  };

  // i18n lookup - returns key as-is if not found (helpful for debugging)
  const t = key => translations[currentLang]?.[key] || key;

  // localStorage wrapper - silently handles quota/privacy mode exceptions
  const Storage = {
    PREFIX: 'xdlvo_',
    save(key, val) {
      try { localStorage.setItem(this.PREFIX + key, JSON.stringify(val)); } catch {}
    },
    load(key, def = null) {
      try {
        const raw = localStorage.getItem(this.PREFIX + key);
        return raw ? JSON.parse(raw) : def;
      } catch { return def; }
    },
    saveState() {
      this.save('state', {
        membranePreset: getInputVal('membrane-preset'),
        foulantType: getInputVal('foulant-type'),
        angleDiiodo: getInputVal('angle-diodomethane'),
        angleForm: getInputVal('angle-formamide'),
        angleWater: getInputVal('angle-water'),
        foulantAngleDiiodo: getInputVal('foulant-angle-diodomethane'),
        foulantAngleForm: getInputVal('foulant-angle-formamide'),
        foulantAngleWater: getInputVal('foulant-angle-water'),
        ζ_membrane: getInputVal('zeta-membrane'),
        ζ_foulant: getInputVal('zeta-foulant'),
        radius: getInputVal('particle-radius'),
        I: getInputVal('ionic-strength'),
        T: getInputVal('temperature'),
        lang: currentLang
      });
    },
    loadState() {
      const s = this.load('state');
      if (!s) return false;
      Object.entries(s).forEach(([k, v]) => v !== null && setInputVal(k, v));
      if (s.lang) currentLang = s.lang;
      return true;
    }
  };

  const validateInput = (val, min = -Infinity, max = Infinity) =>
    typeof val === 'number' && !isNaN(val) && val >= min && val <= max;

  // Membrane material presets - literature measured values, ζ in mV
  const MEMBRANE_PRESETS = {
    PVDF: { angleDiiodo: 64.572, angleForm: 60.966, angleWater: 87.5268, ζ: -32.4 },
    'MXene/PVDF': { angleDiiodo: 40.272, angleForm: 47.228, angleWater: 58.613, ζ: -49.3 }
  };

  // Foulant presets - radius in nm
  const FOULANT_PRESETS = {
    bsa: { angleDiiodo: 40.31, angleForm: 51.43, angleWater: 58.50, ζ: -7.5, radius: 322.9 },
    ecoli: { angleDiiodo: 42.75, angleForm: 52.27, angleWater: 57.63, ζ: -3.5, radius: 231 },
    staph: { angleDiiodo: 43.51, angleForm: 53.19, angleWater: 59.03, ζ: -4.6, radius: 245 },
    humic: { angleDiiodo: 36.76, angleForm: 49.94, angleWater: 58.96, ζ: -9.3, radius: 432 }
  };

  // Multilingual text
  const translations = {
    zh: {
      title: "XDLVO 理论计算器",
      subtitle: "膜污染相互作用的扩展 DLVO 理论",
      paramConfig: "参数配置",
      calcResults: "计算结果",
      presetConfig: "预设配置",
      membranePreset: "膜预设",
      selectMembrane: "请选择膜预设",
      foulantPreset: "污染物预设",
      selectFoulant: "请选择污染物",
      noPreset: "无预设",
      bsa: "BSA (牛血清白蛋白)",
      ecoli: "E. coli (大肠杆菌)",
      staph: "S. aureus (金黄色葡萄球菌)",
      humic: "Humic Acid (腐殖酸)",
      contactAngle: "膜接触角参数 (°)",
      foulantContactAngle: "污染物接触角参数 (°)",
      foulantProbeLiquidMode: "探测液体模式",
      foulantDiodomethane: "二碘甲烷接触角",
      foulantFormamide: "甲酰胺接触角",
      foulantWater: "去离子水接触角",
      probeLiquidMode: "探测液体模式",
      defaultLiquids: "默认液体 (二碘甲烷/甲酰胺/水)",
      customLiquids: "自定义液体",
      diodomethane: "二碘甲烷接触角",
      formamide: "甲酰胺接触角",
      water: "去离子水接触角",
      liquid1NonPolar: "液体1 (非极性液体)",
      liquid1ContactAngle: "接触角 (°)",
      liquid1LW: "LW 分量 (mJ/m²)",
      liquid1Plus: "γ⁺ 分量 (mJ/m²)",
      liquid1Minus: "γ⁻ 分量 (mJ/m²)",
      nonPolarNote: "非极性液体，γ⁺ = 0",
      nonPolarNote2: "非极性液体，γ⁻ = 0",
      liquid2Polar: "液体2 (极性液体)",
      liquid2ContactAngle: "接触角 (°)",
      liquid2LW: "LW 分量 (mJ/m²)",
      liquid2Plus: "γ⁺ 分量 (mJ/m²)",
      liquid2Minus: "γ⁻ 分量 (mJ/m²)",
      liquid3Polar: "液体3 (极性液体)",
      liquid3ContactAngle: "接触角 (°)",
      liquid3LW: "LW 分量 (mJ/m²)",
      liquid3Plus: "γ⁺ 分量 (mJ/m²)",
      liquid3Minus: "γ⁻ 分量 (mJ/m²)",
      electricalParams: "电学参数 (mV)",
      zetaMembrane: "膜 Zeta电位",
      zetaFoulant: "污染物 Zeta电位",
      systemParams: "系统参数",
      particleRadius: "污染物表观水力半径 (nm)",
      ionicStrength: "水体离子强度 (M)",
      temperature: "温度 (K)",
      calculate: "计算并绘图",
      membraneSurfaceTension: "表面张力（膜）(mJ/m²)",
      foulantSurfaceTension: "表面张力（污染物）(mJ/m²)",
      gibbsEnergy: "吉布斯自由能（膜-污染物）(mJ/m²)",
      totalInteraction: "相互作用能曲线（膜-污染物）",
      calculating: "计算中...",
      energyBarrier: "能垒 (kT)",
      barrierPosition: "能垒位置 (nm)",
      primaryMinPosition: "第一极小值位置 (nm)",
      primaryMinEnergy: "第一极小值能量 (kT)",
      secondaryMinPosition: "第二极小值位置 (nm)",
      secondaryMinEnergy: "第二极小值能量 (kT)",
      exportExcel: "导出至 Excel",
      interactiveViz: "交互式可视化",
      animationControl: "动画控制",
      attraction: "吸引",
      repulsion: "排斥",
      equilibrium: "平衡",
      primaryMin: "第一极小值",
      secondaryMin: "第二极小值",
      startAnimation: "开始动画",
      stopAnimation: "停止动画",
      resetAnimation: "重置",
      exportGIF: "导出视频",
      animationSpeed: "运动倍速",
      recordControl: "动画录制",
      recordMode: "录制模式",
      durationMode: "时长模式",
      distanceMode: "距离模式",
      staticMode: "静止模式",
      recordDuration: "录制时长 (秒)",
      recordDistance: "运动距离 (nm)",
      maxDistanceHint: "最大可用距离",
      abortExport: "中止导出",
      distance: "距离",
      interactionEnergy: "相互作用能",
      barrier: "能垒",
      membrane: "膜",
      foulant: "污染物",
      notExist: "不存在"
    },
    ja: {
      title: "XDLVO理論計算機",
      subtitle: "膜ファウリング相互作用のための拡張DLVO理論",
      paramConfig: "パラメータ設定",
      calcResults: "計算結果",
      presetConfig: "プリセット設定",
      membranePreset: "膜プリセット",
      selectMembrane: "膜プリセットを選択",
      foulantPreset: "汚染物質プリセット",
      selectFoulant: "汚染物質を選択",
      noPreset: "プリセットなし",
      bsa: "BSA (ウシ血清アルブミン)",
      ecoli: "E. coli (大腸菌)",
      staph: "S. aureus (黄色ブドウ球菌)",
      humic: "Humic Acid (腐植酸)",
      contactAngle: "膜接触角パラメータ (°)",
      foulantContactAngle: "汚染物質接触角パラメータ (°)",
      foulantProbeLiquidMode: "プローブ液体モード",
      foulantDiodomethane: "ジヨードメタン接触角",
      foulantFormamide: "ホルムアミド接触角",
      foulantWater: "脱イオン水接触角",
      probeLiquidMode: "プローブ液体モード",
      defaultLiquids: "デフォルト液体 (ジヨードメタン/ホルムアミド/水)",
      customLiquids: "カスタム液体",
      diodomethane: "ジヨードメタン接触角",
      formamide: "ホルムアミド接触角",
      water: "脱イオン水接触角",
      liquid1NonPolar: "液体1 (非極性液体)",
      liquid1ContactAngle: "接触角 (°)",
      liquid1LW: "LW成分 (mJ/m²)",
      liquid1Plus: "γ⁺成分 (mJ/m²)",
      liquid1Minus: "γ⁻成分 (mJ/m²)",
      nonPolarNote: "非極性液体、γ⁺ = 0",
      nonPolarNote2: "非極性液体、γ⁻ = 0",
      liquid2Polar: "液体2 (極性液体)",
      liquid2ContactAngle: "接触角 (°)",
      liquid2LW: "LW成分 (mJ/m²)",
      liquid2Plus: "γ⁺成分 (mJ/m²)",
      liquid2Minus: "γ⁻成分 (mJ/m²)",
      liquid3Polar: "液体3 (極性液体)",
      liquid3ContactAngle: "接触角 (°)",
      liquid3LW: "LW成分 (mJ/m²)",
      liquid3Plus: "γ⁺成分 (mJ/m²)",
      liquid3Minus: "γ⁻成分 (mJ/m²)",
      electricalParams: "電気パラメータ (mV)",
      zetaMembrane: "膜ゼータ電位",
      zetaFoulant: "汚染物質ゼータ電位",
      systemParams: "システムパラメータ",
      particleRadius: "汚染物質見かけ水力半径 (nm)",
      ionicStrength: "水体イオン強度 (M)",
      temperature: "温度 (K)",
      calculate: "計算と作図",
      membraneSurfaceTension: "表面張力（膜）(mJ/m²)",
      foulantSurfaceTension: "表面張力（汚染物質）(mJ/m²)",
      gibbsEnergy: "ギブス自由エネルギー（膜-汚染物質）(mJ/m²)",
      totalInteraction: "相互作用エネルギー曲線（膜-汚染物質）",
      calculating: "計算中...",
      energyBarrier: "エネルギー障壁 (kT)",
      barrierPosition: "障壁位置 (nm)",
      primaryMinPosition: "第一極小値位置 (nm)",
      primaryMinEnergy: "第一極小値エネルギー (kT)",
      secondaryMinPosition: "第二極小値位置 (nm)",
      secondaryMinEnergy: "第二極小値エネルギー (kT)",
      exportExcel: "Excelにエクスポート",
      interactiveViz: "インタラクティブ可視化",
      animationControl: "アニメーション制御",
      attraction: "引力",
      repulsion: "斥力",
      equilibrium: "平衡",
      primaryMin: "第一極小値",
      secondaryMin: "第二極小値",
      startAnimation: "アニメーション開始",
      stopAnimation: "アニメーション停止",
      resetAnimation: "リセット",
      exportGIF: "ビデオエクスポート",
      animationSpeed: "移動速度",
      recordControl: "アニメーション録画",
      recordMode: "録画モード",
      durationMode: "時間モード",
      distanceMode: "距離モード",
      staticMode: "静止モード",
      recordDuration: "録画時間 (秒)",
      recordDistance: "移動距離 (nm)",
      maxDistanceHint: "最大利用可能距離",
      abortExport: "エクスポート中止",
      distance: "距離",
      interactionEnergy: "相互作用エネルギー",
      barrier: "エネルギー障壁",
      membrane: "膜",
      foulant: "汚染物質",
      notExist: "存在しない"
    },
    en: {
      title: "XDLVO Theory Calculator",
      subtitle: "Extended DLVO Theory for Membrane-Foulant Interactions",
      paramConfig: "Parameter Configuration",
      calcResults: "Calculation Results",
      presetConfig: "Preset Configuration",
      membranePreset: "Membrane Preset",
      selectMembrane: "Select Membrane Preset",
      foulantPreset: "Foulant Preset",
      selectFoulant: "Select Foulant",
      noPreset: "No Preset",
      bsa: "BSA (Bovine Serum Albumin)",
      ecoli: "E. coli (Escherichia coli)",
      staph: "S. aureus (Staphylococcus aureus)",
      humic: "Humic Acid",
      contactAngle: "Membrane Contact Angle Parameters (°)",
      foulantContactAngle: "Foulant Contact Angle Parameters (°)",
      foulantProbeLiquidMode: "Probe Liquid Mode",
      foulantDiodomethane: "Diiodomethane Contact Angle",
      foulantFormamide: "Formamide Contact Angle",
      foulantWater: "Deionized Water Contact Angle",
      probeLiquidMode: "Probe Liquid Mode",
      defaultLiquids: "Default Liquids (Diiodomethane/Formamide/Water)",
      customLiquids: "Custom Liquids",
      diodomethane: "Diiodomethane Contact Angle",
      formamide: "Formamide Contact Angle",
      water: "Deionized Water Contact Angle",
      liquid1NonPolar: "Liquid 1 (Non-polar Liquid)",
      liquid1ContactAngle: "Contact Angle (°)",
      liquid1LW: "LW Component (mJ/m²)",
      liquid1Plus: "γ⁺ Component (mJ/m²)",
      liquid1Minus: "γ⁻ Component (mJ/m²)",
      nonPolarNote: "Non-polar liquid, γ⁺ = 0",
      nonPolarNote2: "Non-polar liquid, γ⁻ = 0",
      liquid2Polar: "Liquid 2 (Polar Liquid)",
      liquid2ContactAngle: "Contact Angle (°)",
      liquid2LW: "LW Component (mJ/m²)",
      liquid2Plus: "γ⁺ Component (mJ/m²)",
      liquid2Minus: "γ⁻ Component (mJ/m²)",
      liquid3Polar: "Liquid 3 (Polar Liquid)",
      liquid3ContactAngle: "Contact Angle (°)",
      liquid3LW: "LW Component (mJ/m²)",
      liquid3Plus: "γ⁺ Component (mJ/m²)",
      liquid3Minus: "γ⁻ Component (mJ/m²)",
      electricalParams: "Electrical Parameters (mV)",
      zetaMembrane: "Membrane Zeta Potential",
      zetaFoulant: "Foulant Zeta Potential",
      systemParams: "System Parameters",
      particleRadius: "Foulant Apparent Hydraulic Radius (nm)",
      ionicStrength: "Ionic Strength (M)",
      temperature: "Temperature (K)",
      calculate: "Calculate and Plot",
      membraneSurfaceTension: "Surface Tension (Membrane) (mJ/m²)",
      foulantSurfaceTension: "Surface Tension (Foulant) (mJ/m²)",
      gibbsEnergy: "Gibbs Free Energy (Membrane-Foulant) (mJ/m²)",
      totalInteraction: "Interaction Energy Curves (Membrane-Foulant)",
      calculating: "Calculating...",
      energyBarrier: "Energy Barrier (kT)",
      barrierPosition: "Barrier Position (nm)",
      primaryMinPosition: "Primary Minimum Position (nm)",
      primaryMinEnergy: "Primary Minimum Energy (kT)",
      secondaryMinPosition: "Secondary Minimum Position (nm)",
      secondaryMinEnergy: "Secondary Minimum Energy (kT)",
      exportExcel: "Export to Excel",
      interactiveViz: "Interactive Visualization",
      animationControl: "Animation Control",
      attraction: "Attraction",
      repulsion: "Repulsion",
      equilibrium: "Equilibrium",
      primaryMin: "Primary Min",
      secondaryMin: "Secondary Min",
      startAnimation: "Start Animation",
      stopAnimation: "Stop Animation",
      resetAnimation: "Reset",
      exportGIF: "Export Video",
      animationSpeed: "Animation Speed",
      recordControl: "Animation Recording",
      recordMode: "Record Mode",
      durationMode: "Duration Mode",
      distanceMode: "Distance Mode",
      staticMode: "Static Mode",
      recordDuration: "Record Duration (s)",
      recordDistance: "Distance (nm)",
      maxDistanceHint: "Max Available Distance",
      abortExport: "Abort Export",
      distance: "Distance",
      interactionEnergy: "Interaction Energy",
      barrier: "Barrier",
      membrane: "Membrane",
      foulant: "Foulant",
      notExist: "N/A"
    }
  };

  let currentLang = 'en';
  let calcResults = {};
  let currentDist = VIS.DEFAULT_ANIMATION_DISTANCE;
  let isAnimating = false;
  let animationId = null;
  let isDragging = false;
  let dragStartX = 0;
  let mediaRecorder = null;
  let recordedChunks = [];
  let isExporting = false;
  let exportAnimationId = null;

  function toggleProbeMode() {
    const mode = document.getElementById('probe-liquid-mode').value;
    document.getElementById('default-angles-section').classList.toggle('hidden', mode === 'custom');
    document.getElementById('custom-liquids-section').classList.toggle('hidden', mode !== 'custom');
  }

  function toggleFoulantProbeMode() {
    const mode = document.getElementById('foulant-probe-liquid-mode').value;
    document.getElementById('foulant-default-angles-section').classList.toggle('hidden', mode === 'custom');
    document.getElementById('foulant-custom-liquids-section').classList.toggle('hidden', mode !== 'custom');
  }

  function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.setAttribute('lang', lang);
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const txt = translations[lang]?.[el.getAttribute('data-i18n')];
      if (txt) el.tagName === 'INPUT' && el.type !== 'button' ? el.value = txt : el.textContent = txt;
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const title = translations[lang]?.[el.getAttribute('data-i18n-title')];
      if (title) el.title = title;
    });
    document.getElementById('language-select').value = lang;
    
    // Refresh chart when results exist (legend & axis labels need translation)
    if (Object.keys(calcResults).length) {
      plotResults(calcResults);
      updateVisualization(currentDist);
    }
  }

  function loadMembranePreset() {
    const presetId = document.getElementById('membrane-preset').value;
    
    if (presetId === 'none') {
      // Clear membrane parameters
      document.getElementById('angle-diodomethane').value = '';
      document.getElementById('angle-formamide').value = '';
      document.getElementById('angle-water').value = '';
      document.getElementById('zeta-membrane').value = '';
      Storage.saveState();
      return;
    }
    
    const preset = MEMBRANE_PRESETS[presetId];
    if (!preset) return;
    
    document.getElementById('angle-diodomethane').value = preset.angleDiiodo;
    document.getElementById('angle-formamide').value = preset.angleForm;
    document.getElementById('angle-water').value = preset.angleWater;
    document.getElementById('zeta-membrane').value = preset.ζ;
    
    calcMembraneGamma();  // Only update surface tension display, don't trigger full calculation
    Storage.saveState();
  }

  function loadFoulantPreset() {
    const foulantId = document.getElementById('foulant-type').value;
    
    if (foulantId === 'none') {
      // Clear foulant parameters
      document.getElementById('foulant-angle-diodomethane').value = '';
      document.getElementById('foulant-angle-formamide').value = '';
      document.getElementById('foulant-angle-water').value = '';
      document.getElementById('zeta-foulant').value = '';
      document.getElementById('particle-radius').value = '';
      Storage.saveState();
      return;
    }
    
    const foulant = FOULANT_PRESETS[foulantId];
    if (!foulant) return;
    
    document.getElementById('foulant-angle-diodomethane').value = foulant.angleDiiodo;
    document.getElementById('foulant-angle-formamide').value = foulant.angleForm;
    document.getElementById('foulant-angle-water').value = foulant.angleWater;
    document.getElementById('zeta-foulant').value = foulant.ζ;
    document.getElementById('particle-radius').value = foulant.radius;
    
    calcFoulantGamma();
    Storage.saveState();
  }

  // van Oss-Chaudhury-Good equation for surface energy components
  // Three-liquid method: non-polar liquid determines γ^LW, two polar liquids solve for γ⁺/γ⁻
  function calcMembraneGamma() {
    const mode = document.getElementById('probe-liquid-mode')?.value || 'default';
    let G, H, I;
    let liquid1, liquid2, liquid3;
    
    if (mode === 'custom') {
      // Custom liquid mode
      G = parseFloat(document.getElementById('custom-angle-1').value);
      H = parseFloat(document.getElementById('custom-angle-2').value);
      I = parseFloat(document.getElementById('custom-angle-3').value);
      liquid1 = { LW: parseFloat(document.getElementById('custom-lw-1').value), Plus: 0, Minus: 0 };
      liquid2 = {
        LW: parseFloat(document.getElementById('custom-lw-2').value),
        Plus: parseFloat(document.getElementById('custom-plus-2').value),
        Minus: parseFloat(document.getElementById('custom-minus-2').value)
      };
      liquid3 = {
        LW: parseFloat(document.getElementById('custom-lw-3').value),
        Plus: parseFloat(document.getElementById('custom-plus-3').value),
        Minus: parseFloat(document.getElementById('custom-minus-3').value)
      };
    } else {
      // Default liquid mode
      G = parseFloat(document.getElementById('angle-diodomethane').value);
      H = parseFloat(document.getElementById('angle-formamide').value);
      I = parseFloat(document.getElementById('angle-water').value);
      liquid1 = { LW: PARAMS.γ_diiodo, Plus: 0, Minus: 0 };
      liquid2 = { LW: PARAMS.γ_form_LW, Plus: PARAMS.γ_form_plus, Minus: PARAMS.γ_form_minus };
      liquid3 = { LW: PARAMS.γ_water_LW, Plus: PARAMS.γ_water_plus, Minus: PARAMS.γ_water_minus };
    }
    
    return Model.surfaceEnergyFromContactAngles(G, H, I, liquid1, liquid2, liquid3);
  }

  function calcFoulantGamma() {
    const mode = document.getElementById('foulant-probe-liquid-mode')?.value || 'default';
    let G, H, I;
    let liquid1, liquid2, liquid3;
    
    if (mode === 'custom') {
      G = parseFloat(document.getElementById('foulant-custom-angle-1').value);
      H = parseFloat(document.getElementById('foulant-custom-angle-2').value);
      I = parseFloat(document.getElementById('foulant-custom-angle-3').value);
      liquid1 = { LW: parseFloat(document.getElementById('foulant-custom-lw-1').value), Plus: 0, Minus: 0 };
      liquid2 = {
        LW: parseFloat(document.getElementById('foulant-custom-lw-2').value),
        Plus: parseFloat(document.getElementById('foulant-custom-plus-2').value),
        Minus: parseFloat(document.getElementById('foulant-custom-minus-2').value)
      };
      liquid3 = {
        LW: parseFloat(document.getElementById('foulant-custom-lw-3').value),
        Plus: parseFloat(document.getElementById('foulant-custom-plus-3').value),
        Minus: parseFloat(document.getElementById('foulant-custom-minus-3').value)
      };
    } else {
      G = parseFloat(document.getElementById('foulant-angle-diodomethane').value);
      H = parseFloat(document.getElementById('foulant-angle-formamide').value);
      I = parseFloat(document.getElementById('foulant-angle-water').value);
      liquid1 = { LW: PARAMS.γ_diiodo, Plus: 0, Minus: 0 };
      liquid2 = { LW: PARAMS.γ_form_LW, Plus: PARAMS.γ_form_plus, Minus: PARAMS.γ_form_minus };
      liquid3 = { LW: PARAMS.γ_water_LW, Plus: PARAMS.γ_water_plus, Minus: PARAMS.γ_water_minus };
    }
    
    return Model.surfaceEnergyFromContactAngles(G, H, I, liquid1, liquid2, liquid3);
  }

  // Main calculation entry - collect UI params, call Model to compute XDLVO energy curves
  function calculate() {
    const errors = [];
    
    // Validate contact angles (0-180°)
    const angles = [
      getInputVal('angle-diodomethane'), getInputVal('angle-formamide'), getInputVal('angle-water'),
      getInputVal('foulant-angle-diodomethane'), getInputVal('foulant-angle-formamide'), getInputVal('foulant-angle-water')
    ];
    if (angles.some(a => !validateInput(a, 0, 180))) {
      errors.push(t('contactAngle') + (currentLang === 'zh' ? ' 必须在0-180°之间' : ' must be between 0-180°'));
    }
    
    // Validate zeta potentials (-200 to 200 mV)
    const zetaM = getInputVal('zeta-membrane');
    const zetaF = getInputVal('zeta-foulant');
    if (!validateInput(zetaM, -200, 200)) {
      errors.push(t('zetaMembrane') + (currentLang === 'zh' ? ' 必须在-200到200之间' : ' must be between -200 and 200'));
    }
    if (!validateInput(zetaF, -200, 200)) {
      errors.push(t('zetaFoulant') + (currentLang === 'zh' ? ' 必须在-200到200之间' : ' must be between -200 and 200'));
    }
    
    // Validate ionic strength (0.0001-10 M)
    const ionicStrength = getInputVal('ionic-strength');
    if (!validateInput(ionicStrength, 0.0001, 10)) {
      errors.push(t('ionicStrength') + (currentLang === 'zh' ? ' 不能小于0.0001或大于10' : ' cannot be less than 0.0001 or greater than 10'));
    }
    
    // Validate temperature (273-373 K)
    const temperature = getInputVal('temperature');
    if (!validateInput(temperature, 273, 373)) {
      errors.push(t('temperature') + (currentLang === 'zh' ? ' 不能小于273或大于373' : ' cannot be less than 273 or greater than 373'));
    }
    
    if (errors.length > 0) {
      const errorMsg = (currentLang === 'zh' ? '输入参数有误：\n' : 'Invalid input parameters:\n') + errors.join('\n');
      alert(errorMsg);
      return;
    }
    
    Storage.saveState();
    document.getElementById('loading').classList.remove('hidden');
    
    // Async to avoid blocking UI (noticeable when computation is heavy)
    setTimeout(() => {
      try {
        const membraneGamma = calcMembraneGamma();
        const foulantGamma = calcFoulantGamma();
        
        // Assemble parameter structure required by Model
        const params = {
          γ_lw: membraneGamma.γ_lw,
          γ_plus: membraneGamma.γ_plus,
          γ_minus: membraneGamma.γ_minus,
          ζ_m: getInputVal('zeta-membrane'),
          ζ_f: getInputVal('zeta-foulant'),
          a: getInputVal('particle-radius'),
          I: getInputVal('ionic-strength'),
          T: getInputVal('temperature')
        };
        
        const foulant = {
          γ_lw: foulantGamma.γ_lw,
          γ_plus: foulantGamma.γ_plus,
          γ_minus: foulantGamma.γ_minus,
          ζ_f: getInputVal('zeta-foulant'),
          radius: getInputVal('particle-radius')
        };
        
        // ΔG is free energy change at contact, energyData is distance-energy curve
        const ΔG = Model.deltaG(params, foulant);
        const energyData = Model.interactionEnergy(params, foulant, ΔG);
        const analysis = Model.analyzeProfile(energyData);
        
        calcResults = { ΔG, energyData, params, membraneGamma, foulantGamma, analysis };
        updateUI(calcResults);
      } catch (err) {
        console.error('Calculation error:', err);
        alert((currentLang === 'zh' ? '计算失败: ' : 'Calculation failed: ') + err.message);
      } finally {
        document.getElementById('loading').classList.add('hidden');
      }
    }, 50);
  }

  function updateUI({ ΔG, membraneGamma, foulantGamma, analysis }) {
    // Membrane surface tension
    document.getElementById('gamma-lw-result').textContent = membraneGamma.γ_lw.toFixed(4);
    document.getElementById('gamma-plus-result').textContent = membraneGamma.γ_plus.toFixed(4);
    document.getElementById('gamma-minus-result').textContent = membraneGamma.γ_minus.toFixed(4);
    document.getElementById('gamma-ab-result').textContent = membraneGamma.γ_ab.toFixed(4);
    document.getElementById('gamma-tot-result').textContent = membraneGamma.γ_total.toFixed(4);
    
    // Foulant surface tension
    document.getElementById('foulant-gamma-lw-result').textContent = foulantGamma.γ_lw.toFixed(4);
    document.getElementById('foulant-gamma-plus-result').textContent = foulantGamma.γ_plus.toFixed(4);
    document.getElementById('foulant-gamma-minus-result').textContent = foulantGamma.γ_minus.toFixed(4);
    document.getElementById('foulant-gamma-ab-result').textContent = foulantGamma.γ_ab.toFixed(4);
    document.getElementById('foulant-gamma-tot-result').textContent = foulantGamma.γ_total.toFixed(4);
    
    // ΔG - Gibbs free energy change at contact
    document.getElementById('delta-g-lw').textContent = ΔG.LW.toFixed(4);
    document.getElementById('delta-g-ab').textContent = ΔG.AB.toFixed(4);
    document.getElementById('delta-g-el').textContent = ΔG.EL.toFixed(4);
    document.getElementById('delta-g-adh').textContent = ΔG.ADH.toFixed(4);
    document.getElementById('delta-g-tot').textContent = ΔG.TOT.toFixed(4);
    
    // Energy barrier
    if (analysis.barrierPosition !== null) {
      document.getElementById('energy-barrier').textContent = analysis.barrier.toFixed(4);
      document.getElementById('barrier-position').textContent = analysis.barrierPosition.toFixed(4);
    } else {
      document.getElementById('energy-barrier').textContent = t('notExist') || '-';
      document.getElementById('barrier-position').textContent = '-';
    }
    
    // Primary minimum (first minimum - at contact)
    if (analysis.primaryMinimum) {
      document.getElementById('primary-min-position').textContent = analysis.primaryMinimum.position.toFixed(4);
      document.getElementById('primary-min-energy').textContent = analysis.primaryMinimum.energy.toFixed(4);
    } else {
      document.getElementById('primary-min-position').textContent = t('notExist') || '-';
      document.getElementById('primary-min-energy').textContent = '-';
    }
    
    // Secondary minimum (second minimum - further from membrane)
    if (analysis.secondaryMinimum) {
      document.getElementById('secondary-min-position').textContent = analysis.secondaryMinimum.position.toFixed(4);
      document.getElementById('secondary-min-energy').textContent = analysis.secondaryMinimum.energy.toFixed(4);
    } else {
      document.getElementById('secondary-min-position').textContent = t('notExist') || '-';
      document.getElementById('secondary-min-energy').textContent = '-';
    }
    
    plotResults(calcResults);
    updateVisualization(currentDist);
  }

  // Plotly binding - four curves: total energy + LW/AB/EL components
  function plotResults({ energyData }) {
    const legendNames = {
      zh: { total: '总能量', lw: 'LW能', ab: 'AB能', el: 'EL能' },
      en: { total: 'Total Energy', lw: 'LW', ab: 'AB', el: 'EL' },
      ja: { total: '総エネルギー', lw: 'LW', ab: 'AB', el: 'EL' }
    };
    
    const names = legendNames[currentLang] || legendNames.en;
    
    const traces = [
      {
        x: energyData.h,
        y: energyData.UTOT,
        type: 'scatter',
        mode: 'lines',
        name: names.total,
        line: { color: '#1a6fc4', width: 3 }
      },
      {
        x: energyData.h,
        y: energyData.ULW,
        type: 'scatter',
        mode: 'lines',
        name: names.lw,
        line: { color: '#e74c3c', width: 2, dash: 'dash' }
      },
      {
        x: energyData.h,
        y: energyData.UAB,
        type: 'scatter',
        mode: 'lines',
        name: names.ab,
        line: { color: '#2ecc71', width: 2, dash: 'dash' }
      },
      {
        x: energyData.h,
        y: energyData.UEL,
        type: 'scatter',
        mode: 'lines',
        name: names.el,
        line: { color: '#f39c12', width: 2, dash: 'dash' }
      }
    ];
    
    const titles = {
      zh: { title: 'XDLVO 相互作用能曲线', x: '分离距离 (nm)', y: '相互作用能 (kT)' },
      en: { title: 'XDLVO Interaction Energy Profile', x: 'Separation Distance (nm)', y: 'Interaction Energy (kT)' },
      ja: { title: 'XDLVO 相互作用エネルギープロファイル', x: '分離距離 (nm)', y: '相互作用エネルギー (kT)' }
    };
    
    const layout = {
      title: {
        text: titles[currentLang].title,
        font: { color: '#333333', size: 20 }
      },
      xaxis: {
        title: titles[currentLang].x,
        gridcolor: 'rgba(0, 0, 0, 0.1)',
        tickcolor: '#333333',
        tickfont: { color: '#333333' },
        titlefont: { color: '#333333' }
      },
      yaxis: {
        title: titles[currentLang].y,
        gridcolor: 'rgba(0, 0, 0, 0.1)',
        tickcolor: '#333333',
        tickfont: { color: '#333333' },
        titlefont: { color: '#333333' },
        range: [-4, 4]
      },
      paper_bgcolor: 'rgba(255, 255, 255, 0)',
      plot_bgcolor: 'rgba(255, 255, 255, 0.8)',
      showlegend: true,
      legend: {
        font: { color: '#333333' },
        bgcolor: 'rgba(255, 255, 255, 0.8)'
      }
    };
    
    Plotly.newPlot('chart-container', traces, layout, {
      responsive: true,
      displayModeBar: true,
      modeBarButtonsToAdd: ['downloadSVG', 'downloadPNG'],
      displaylogo: false
    });
  }

  // Canvas interaction initialization - particle dragging, hover tooltips
  function initVisualization() {
    const canvas = document.getElementById('interaction-canvas');
    const tooltip = document.getElementById('hover-tooltip');
    if (!canvas) return;
    
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', () => tooltip?.classList.add('hidden'));
    document.addEventListener('mouseup', () => isDragging = false);
    
    // Coordinate conversion needed after CSS scaling
    function getCanvasCoords(e) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
        scale: (canvas.width - VIS.CANVAS_PADDING) / PARAMS.hmax
      };
    }
    
    function handleMouseDown(e) {
      const { x, y, scale } = getCanvasCoords(e);
      const particleX = VIS.MEMBRANE_X + currentDist * scale;
      const centerY = canvas.height / 2;
      
      // Only start dragging if particle is clicked
      if (Math.sqrt((x - particleX) ** 2 + (y - centerY) ** 2) <= VIS.PARTICLE_RADIUS) {
        isDragging = true;
        dragStartX = x;
        stopAnimation();
      }
    }
    
    function handleMouseMove(e) {
      const { x, y, scale } = getCanvasCoords(e);
      
      if (isDragging) {
        const deltaDist = (x - dragStartX) / scale;
        currentDist = Math.max(PARAMS.hmin, Math.min(PARAMS.hmax, currentDist + deltaDist));
        dragStartX = x;
        updateVisualization(currentDist);
        showTooltip(currentDist, getEnergyAt(currentDist), e.clientX, e.clientY);
        return;
      }
      showHoverInfo(x, y, e.clientX, e.clientY);
    }
  }

  // Interpolate energy from curve
  function getEnergyAt(dist) {
    if (!calcResults.energyData) return 0;
    const { h, UTOT } = calcResults.energyData;
    if (!h || !UTOT || h.length === 0) return 0;
    
    if (dist <= h[0]) return UTOT[0];
    if (dist >= h[h.length - 1]) return UTOT[h.length - 1];
    
    // binary search
    let lo = 0, hi = h.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      h[mid] <= dist ? lo = mid : hi = mid;
    }
    
    // lerp
    const t = (dist - h[lo]) / (h[hi] - h[lo]);
    return UTOT[lo] + t * (UTOT[hi] - UTOT[lo]);
  }

  // F = -dU/dh at distance, positive = repulsion (right), negative = attraction (left)
  function getForceAt(dist) {
    if (!calcResults.analysis?.force || !calcResults.energyData) return 0;
    const { h } = calcResults.energyData;
    const { force } = calcResults.analysis;
    if (!h || !force || h.length === 0) return 0;
    
    if (dist <= h[0]) return force[0];
    if (dist >= h[h.length - 1]) return force[h.length - 1];
    
    let lo = 0, hi = h.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      h[mid] <= dist ? lo = mid : hi = mid;
    }
    
    const t = (dist - h[lo]) / (h[hi] - h[lo]);
    return force[lo] + t * (force[hi] - force[lo]);
  }

  // SI prefix formatter (matches Plotly hover style)
  const SI_PREFIXES = [
    [1e24, 'Y'], [1e21, 'Z'], [1e18, 'E'], [1e15, 'P'], [1e12, 'T'],
    [1e9, 'G'], [1e6, 'M'], [1e3, 'k'], [1, ''],
    [1e-3, 'm'], [1e-6, 'μ'], [1e-9, 'n'], [1e-12, 'p'],
    [1e-15, 'f'], [1e-18, 'a'], [1e-21, 'z'], [1e-24, 'y']
  ];

  function fmtSI(val) {
    if (val === 0) return '0';
    const abs = Math.abs(val), sign = val < 0 ? '-' : '';
    
    for (const [th, sym] of SI_PREFIXES) {
      if (abs >= th) {
        return sign + parseFloat((abs / th).toPrecision(4)) + sym;
      }
    }
    return val.toExponential(3);
  }

  function showTooltip(dist, energy, clientX, clientY) {
    const tooltip = document.getElementById('hover-tooltip');
    const canvas = document.getElementById('interaction-canvas');
    if (!tooltip || !canvas) return;
    
    const wrapperRect = canvas.parentElement.getBoundingClientRect();
    tooltip.innerHTML = `${t('distance')}: ${dist.toFixed(2)} nm<br>${t('interactionEnergy')}: ${fmtSI(energy)} kT`;
    tooltip.classList.remove('hidden');
    tooltip.style.left = (clientX - wrapperRect.left + 15) + 'px';
    tooltip.style.top = (clientY - wrapperRect.top + 15) + 'px';
  }

  function showHoverInfo(canvasX, canvasY, clientX, clientY) {
    const tooltip = document.getElementById('hover-tooltip');
    const canvas = document.getElementById('interaction-canvas');
    if (!tooltip || !canvas || !calcResults.analysis) return;
    
    const wrapperRect = canvas.parentElement.getBoundingClientRect();
    const scale = (VIS.CANVAS_WIDTH - VIS.CANVAS_PADDING) / PARAMS.hmax;
    let html = '';
    
    // Energy barrier line
    if (calcResults.analysis.barrierPosition) {
      const barrierX = VIS.MEMBRANE_X + calcResults.analysis.barrierPosition * scale;
      if (Math.abs(canvasX - barrierX) < 10) {
        const energy = getEnergyAt(calcResults.analysis.barrierPosition);
        html = `${t('barrier')}<br>${t('distance')}: ${calcResults.analysis.barrierPosition.toFixed(2)} nm<br>${t('interactionEnergy')}: ${fmtSI(energy)} kT`;
      }
    }
    
    // Primary minimum line
    if (!html && calcResults.analysis.primaryMinimum) {
      const primX = VIS.MEMBRANE_X + calcResults.analysis.primaryMinimum.position * scale;
      if (Math.abs(canvasX - primX) < 10) {
        html = `${t('primaryMin')}<br>${t('distance')}: ${calcResults.analysis.primaryMinimum.position.toFixed(2)} nm<br>${t('interactionEnergy')}: ${fmtSI(calcResults.analysis.primaryMinimum.energy)} kT`;
      }
    }
    
    // Secondary minimum line
    if (!html && calcResults.analysis.secondaryMinimum) {
      const secX = VIS.MEMBRANE_X + calcResults.analysis.secondaryMinimum.position * scale;
      if (Math.abs(canvasX - secX) < 10) {
        html = `${t('secondaryMin')}<br>${t('distance')}: ${calcResults.analysis.secondaryMinimum.position.toFixed(2)} nm<br>${t('interactionEnergy')}: ${fmtSI(calcResults.analysis.secondaryMinimum.energy)} kT`;
      }
    }
    
    // Foulant particle
    if (!html) {
      const particleX = VIS.MEMBRANE_X + currentDist * scale;
      if (Math.sqrt((canvasX - particleX) ** 2 + (canvasY - VIS.CANVAS_HEIGHT / 2) ** 2) <= VIS.PARTICLE_RADIUS) {
        html = `${t('foulant')}<br>${t('distance')}: ${currentDist.toFixed(2)} nm<br>${t('interactionEnergy')}: ${fmtSI(getEnergyAt(currentDist))} kT`;
      }
    }
    
    if (html) {
      tooltip.innerHTML = html;
      tooltip.classList.remove('hidden');
      tooltip.style.left = (clientX - wrapperRect.left + 15) + 'px';
      tooltip.style.top = (clientY - wrapperRect.top + 15) + 'px';
    } else {
      tooltip.classList.add('hidden');
    }
  }

  function startAnimation() {
    if (!calcResults.energyData) { alert(t('calculating')); return; }
    isAnimating = true;
    animate();
  }
  
  function stopAnimation() {
    isAnimating = false;
    animationId && cancelAnimationFrame(animationId);
    animationId = null;
  }
  
  function resetAnimation() {
    stopAnimation();
    currentDist = VIS.DEFAULT_ANIMATION_DISTANCE;
    updateVisualization(currentDist);
  }
  
  // Physics-driven animation using force F = -dU/dh
  // Positive force = particle moves right (away from membrane)
  // Negative force = particle moves left (toward membrane)
  function animate() {
    if (!isAnimating || !calcResults.energyData) return;
    
    const force = getForceAt(currentDist);
    const speed = document.getElementById('animation-speed')?.value || 1;
    currentDist += force * VIS.ANIMATION_SPEED_FACTOR * speed;
    
    if (currentDist < PARAMS.hmin || currentDist > PARAMS.hmax) {
      stopAnimation();
      currentDist = Math.max(PARAMS.hmin, Math.min(PARAMS.hmax, currentDist));
    }
    
    updateVisualization(currentDist);
    animationId = requestAnimationFrame(animate);
  }

  // Canvas rendering - membrane, particle, force arrows, barrier/equilibrium markers
  function updateVisualization(dist) {
    const canvas = document.getElementById('interaction-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx || !calcResults.energyData) return;
    if (!isFinite(dist) || dist < 0) return;
    
    const { width: W, height: H } = canvas;
    if (W === 0 || H === 0) return;
    
    ctx.clearRect(0, 0, W, H);
    
    // white bg for video export
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);
    
    const { MEMBRANE_X, PARTICLE_RADIUS, CANVAS_PADDING } = VIS;
    const scale = (W - CANVAS_PADDING) / PARAMS.hmax;
    const centerY = H / 2;
    const particleX = MEMBRANE_X + dist * scale;
    
    // force from energy gradient: F = -dU/dh
    const delta = 0.01;
    const ePlus = getEnergyAt(dist + delta);
    const eMinus = getEnergyAt(dist - delta);
    const force = -(ePlus - eMinus) / (2 * delta);
    
    // positive = repulsion (red, right), negative = attraction (gray, left)
    const isAttraction = force < 0;
    const isRepulsion = force > 0;
    
    // Membrane (left bar - outline with diagonal hatching)
    const membraneLeft = MEMBRANE_X - 30;
    const membraneWidth = 30;
    
    // Draw diagonal hatching lines
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 1;
    ctx.beginPath();
    const hatchSpacing = 8;
    for (let y = -H; y < H + membraneWidth; y += hatchSpacing) {
      ctx.moveTo(membraneLeft, y);
      ctx.lineTo(membraneLeft + membraneWidth, y + membraneWidth);
    }
    ctx.stroke();
    
    // Clip hatching to membrane area
    ctx.save();
    ctx.beginPath();
    ctx.rect(membraneLeft, 0, membraneWidth, H);
    ctx.clip();
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let y = -membraneWidth; y < H + membraneWidth; y += hatchSpacing) {
      ctx.moveTo(membraneLeft, y);
      ctx.lineTo(membraneLeft + membraneWidth, y + membraneWidth);
    }
    ctx.stroke();
    ctx.restore();
    
    // Draw membrane outline
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.strokeRect(membraneLeft, 0, membraneWidth, H);
    
    ctx.fillStyle = '#666';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(t('membrane'), MEMBRANE_X - 35, centerY);
    
    // Foulant particle - color based on force direction (movement)
    // Gray for attraction (moving toward membrane), Red for repulsion (moving away)
    const grad = ctx.createRadialGradient(particleX, centerY, 0, particleX, centerY, PARTICLE_RADIUS);
    const baseColor = isRepulsion ? '231, 76, 60' : '128, 128, 128';
    grad.addColorStop(0, `rgba(${baseColor}, 0.8)`);
    grad.addColorStop(1, `rgba(${baseColor}, 0.3)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(particleX, centerY, PARTICLE_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = isRepulsion ? COLORS.REPULSION : '#666';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.fillStyle = isRepulsion ? '#e74c3c' : '#666';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(t('foulant'), particleX, centerY + PARTICLE_RADIUS + 25);
    
    // Distance dashed line - color based on force direction
    const lineColor = isRepulsion ? 'rgba(231, 76, 60, 0.5)' : 'rgba(128, 128, 128, 0.5)';
    const textColor = isRepulsion ? '#e74c3c' : '#666';
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(MEMBRANE_X, centerY);
    ctx.lineTo(particleX, centerY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.fillStyle = textColor;
    ctx.font = 'bold 18px Arial';
    ctx.fillText(dist.toFixed(2) + ' nm', (MEMBRANE_X + particleX) / 2, centerY - 15);
    
    // Force arrows - based on actual force (F = -dU/dh)
    if (isAttraction) {
      // Negative force = attraction toward membrane (left arrow)
      drawArrow(ctx, particleX - PARTICLE_RADIUS - 15, centerY, particleX - PARTICLE_RADIUS - 70, centerY, '#666');
    } else if (isRepulsion) {
      // Positive force = repulsion away from membrane (right arrow)
      drawArrow(ctx, particleX + PARTICLE_RADIUS + 15, centerY, particleX + PARTICLE_RADIUS + 70, centerY, '#e74c3c');
    }
    
    // Energy barrier marker line (unstable equilibrium)
    if (calcResults.analysis?.barrierPosition) {
      const barrierX = MEMBRANE_X + calcResults.analysis.barrierPosition * scale;
      ctx.strokeStyle = COLORS.BARRIER_LINE;
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(barrierX, 30);
      ctx.lineTo(barrierX, H - 30);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#e74c3c';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(t('barrier'), barrierX, 20);
    }
    
    // Primary minimum marker line (stable equilibrium at contact) - Gray
    if (calcResults.analysis?.primaryMinimum) {
      const primX = MEMBRANE_X + calcResults.analysis.primaryMinimum.position * scale;
      ctx.strokeStyle = 'rgba(128, 128, 128, 0.7)';  // Gray for primary minimum
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(primX, 30);
      ctx.lineTo(primX, H - 30);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#666';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(t('primaryMin'), primX, H - 15);
    }
    
    // Secondary minimum marker line (stable equilibrium further from membrane) - Gray
    if (calcResults.analysis?.secondaryMinimum) {
      const secX = MEMBRANE_X + calcResults.analysis.secondaryMinimum.position * scale;
      ctx.strokeStyle = 'rgba(128, 128, 128, 0.7)';  // Gray for secondary minimum
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(secX, 30);
      ctx.lineTo(secX, H - 30);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#666';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(t('secondaryMin'), secX, H - 15);
    }
  }

  function drawArrow(ctx, x1, y1, x2, y2, color) {
    const headLen = VIS.ARROW_HEAD_LENGTH;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    
    ctx.strokeStyle = ctx.fillStyle = color;
    ctx.lineWidth = VIS.ARROW_LINE_WIDTH;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
  }

  function setupRecordModeListeners() {
    const modeSelect = document.getElementById('record-mode');
    const durationGroup = document.getElementById('duration-input-group');
    const distanceGroup = document.getElementById('distance-input-group');
    const maxDistanceDisplay = document.getElementById('max-distance-display');
    const recordDistanceInput = document.getElementById('record-distance');
    
    modeSelect?.addEventListener('change', function() {
      const mode = this.value;
      // Use classList instead of style.display for cleaner code
      durationGroup?.classList.toggle('hidden', mode !== 'duration');
      distanceGroup?.classList.toggle('hidden', mode !== 'distance');
      maxDistanceDisplay?.classList.toggle('hidden', mode !== 'distance');
      if (mode === 'distance') updateMaxDistanceHint();
    });
    
    recordDistanceInput?.addEventListener('change', function() {
      const inputVal = parseFloat(this.value);
      const maxHint = document.getElementById('max-distance-hint');
      if (!maxHint) return;
      
      const maxDist = parseFloat(maxHint.textContent);
      if (inputVal > maxDist) {
        const msg = currentLang === 'zh' ? `输入距离 ${inputVal.toFixed(2)} nm 超出最大可用距离 ${maxDist.toFixed(2)} nm！` :
                    currentLang === 'ja' ? `入力距離 ${inputVal.toFixed(2)} nm が最大利用可能距離 ${maxDist.toFixed(2)} nm を超えています！` :
                    `Input distance ${inputVal.toFixed(2)} nm exceeds max available distance ${maxDist.toFixed(2)} nm!`;
        alert(msg);
        this.value = maxDist.toFixed(2);
      }
    });
  }

  function updateMaxDistanceHint() {
    if (!calcResults.energyData) return;
    
    const currentForce = getForceAt(currentDist);
    const maxAvail = currentForce > 0 ? PARAMS.hmax - currentDist : currentDist - PARAMS.hmin;
    
    const hint = document.getElementById('max-distance-hint');
    if (hint) hint.textContent = Math.max(0, maxAvail).toFixed(2);
  }

  function init() {
    if (!Storage.loadState()) {
      document.getElementById('membrane-preset').value = 'MD1';
      document.getElementById('foulant-type').value = 'bsa';
      loadFoulantPreset();
      currentLang = 'en';
      document.getElementById('language-select').value = 'en';
    }
    
    setLanguage(currentLang);
    initVisualization();
    setupRecordModeListeners();
    
    // HTML already has onclick, only bind language switching here
    document.getElementById('language-select').addEventListener('change', e => setLanguage(e.target.value));
    
    // Auto-save on input change
    const saveOnChange = debounce(() => Storage.saveState(), 500);
    document.querySelectorAll('input, select').forEach(el => el.addEventListener('change', saveOnChange));
    
    calculate();
  }

  function abortExport() {
    mediaRecorder?.state !== 'inactive' && mediaRecorder.stop();
    exportAnimationId && cancelAnimationFrame(exportAnimationId);
    exportAnimationId = null;
    isExporting = false;
    
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
      exportBtn.textContent = t('exportGIF');
      exportBtn.onclick = exportGIF;
    }
    
    document.getElementById('progress-container')?.classList.add('hidden');
    const calcBtn = document.getElementById('calculate-btn');
    const excelBtn = document.getElementById('export-excel-btn');
    if (calcBtn) calcBtn.disabled = false;
    if (excelBtn) excelBtn.disabled = false;
    
    resetAnimation();
  }

  async function exportGIF() {
    if (isExporting) { abortExport(); return; }
    
    if (!calcResults.energyData) {
      alert(currentLang === 'zh' ? '请先计算数据！' : currentLang === 'ja' ? 'まずデータを計算してください！' : 'Please calculate data first!');
      return;
    }
    
    const mode = document.getElementById('record-mode')?.value || 'duration';
    const currentForce = getForceAt(currentDist);
    const FORCE_THRESHOLD = 0.01;
    
    if (Math.abs(currentForce) < FORCE_THRESHOLD && mode !== 'static') {
      alert(currentLang === 'zh' ? '当前处于平衡状态，无法录制运动！' : currentLang === 'ja' ? '現在平衡状態で、録画できません！' : 'Currently in equilibrium, cannot record motion!');
      return;
    }
    
    try {
      const canvas = document.getElementById('interaction-canvas');
      if (!canvas) {
        alert('Canvas not found!');
        return;
      }
      
      const stream = canvas.captureStream(VIS.VIDEO_FPS);
      
      recordedChunks = [];
      
      // Try to use mp4 format if supported, fallback to webm
      let mimeType = 'video/mp4';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp9';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'video/webm';
        }
      }
      const fileExtension = mimeType.startsWith('video/mp4') ? 'mp4' : 'webm';
      
      mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType,
        videoBitsPerSecond: VIS.VIDEO_BITRATE
      });
      
      mediaRecorder.ondataavailable = function(event) {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = function() {
        const blob = new Blob(recordedChunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        a.download = `XDLVO_Animation_${timestamp}.${fileExtension}`;
        a.click();
        URL.revokeObjectURL(url);
        
        alert(currentLang === 'zh' ? '视频导出成功！' : 
              currentLang === 'ja' ? 'ビデオエクスポート成功！' : 
              'Video exported successfully!');
      };
      
      isExporting = true;
      const exportBtn = document.getElementById('export-btn');
      if (exportBtn) {
        exportBtn.textContent = t('abortExport');
        exportBtn.onclick = abortExport;
      }
      
      const calcBtn = document.getElementById('calculate-btn');
      const excelBtn = document.getElementById('export-excel-btn');
      if (calcBtn) calcBtn.disabled = true;
      if (excelBtn) excelBtn.disabled = true;
      
      const progressContainer = document.getElementById('progress-container');
      const progressBar = document.getElementById('progress-bar');
      
      // Debug: ensure elements exist
      if (!progressContainer) {
        console.error('Progress container not found!');
      }
      if (!progressBar) {
        console.error('Progress bar not found!');
      }
      
      progressContainer?.classList.remove('hidden');
      if (progressBar) {
        progressBar.style.width = '0%';
        progressBar.textContent = '0%';
      }
      
      mediaRecorder.start();
      
      const originalDistance = currentDist;
      const startTime = Date.now();
      const animationSpeed = getInputVal('animation-speed', 1);
      const speedFactor = VIS.ANIMATION_SPEED_FACTOR * animationSpeed;
      const { hmin, hmax } = PARAMS;
      const { MAX_EXPORT_DURATION } = VIS;
      
      let targetDistance = 0;
      let maxDuration = 0;
      let totalDistance = 0;
      let initialForce = currentForce;
      let staticStartDistance = 0;
      
      if (mode === 'duration') {
        maxDuration = getInputVal('record-duration', 6) * 1000;
      } else if (mode === 'distance') {
        const recordDistance = getInputVal('record-distance', 5);
        totalDistance = recordDistance;
        targetDistance = currentForce > 0 ? 
          currentDist + recordDistance : 
          currentDist - recordDistance;
        maxDuration = MAX_EXPORT_DURATION;
      } else if (mode === 'static') {
        staticStartDistance = currentDist;
        maxDuration = MAX_EXPORT_DURATION;
      }
      
      function animateForExport() {
        if (!isExporting) return;
        
        const elapsed = Date.now() - startTime;
        const force = getForceAt(currentDist);
        const deltaDistance = force * speedFactor;
        
        currentDist += deltaDistance;
        
        if (currentDist < hmin) currentDist = hmin;
        if (currentDist > hmax) currentDist = hmax;
        
        updateVisualization(currentDist);
        
        let progress = 0;
        if (mode === 'duration') {
          progress = (elapsed / maxDuration) * 100;
        } else if (mode === 'distance') {
          const movedDistance = Math.abs(currentDist - originalDistance);
          progress = (movedDistance / totalDistance) * 100;
        } else if (mode === 'static') {
          const movedDistance = Math.abs(currentDist - staticStartDistance);
          let maxPossibleDistance = 0;
          if (initialForce > 0) {
            maxPossibleDistance = hmax - staticStartDistance;
          } else {
            maxPossibleDistance = staticStartDistance - hmin;
          }
          if (maxPossibleDistance > 0) {
            progress = (movedDistance / maxPossibleDistance) * 100;
          } else {
            progress = 0;
          }
        }
        
        progress = Math.min(progress, 100);
        if (progressBar) {
          progressBar.style.width = progress.toFixed(1) + '%';
          progressBar.textContent = progress.toFixed(1) + '%';
        }
        
        let shouldStop = false;
        
        if (mode === 'duration') {
          shouldStop = elapsed >= maxDuration;
        } else if (mode === 'distance') {
          if (initialForce > 0) {
            shouldStop = currentDist >= targetDistance || currentDist >= hmax;
          } else {
            shouldStop = currentDist <= targetDistance || currentDist <= hmin;
          }
        } else if (mode === 'static') {
          shouldStop = currentDist <= hmin || currentDist >= hmax;
        }
        
        if (elapsed >= maxDuration) shouldStop = true;
        
        if (shouldStop) {
          isExporting = false;
          if (progressBar) {
            progressBar.style.width = '100%';
            progressBar.textContent = '100%';
          }
          
          setTimeout(() => {
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
              mediaRecorder.stop();
            }
            if (exportBtn) {
              exportBtn.textContent = t('exportGIF');
              exportBtn.onclick = exportGIF;
            }
            progressContainer?.classList.add('hidden');
            if (calcBtn) calcBtn.disabled = false;
            if (excelBtn) excelBtn.disabled = false;
          }, 100);
        } else {
          exportAnimationId = requestAnimationFrame(animateForExport);
        }
      }
      
      animateForExport();
      
    } catch (error) {
      console.error('视频导出错误:', error);
      alert(currentLang === 'zh' ? '导出失败: ' + error.message : 
            currentLang === 'ja' ? 'エクスポート失敗: ' + error.message : 
            'Export failed: ' + error.message);
      isExporting = false;
    }
  }

  // Export to Excel
  function exportToExcel() {
    if (!calcResults.energyData) {
      alert(currentLang === 'zh' ? '请先进行计算' : currentLang === 'ja' ? 'まず計算を行ってください' : 'Please calculate first');
      return;
    }
    
    try {
      const { energyData, ΔG, membraneGamma, analysis } = calcResults;
      const wb = XLSX.utils.book_new();
      
      // Helper to get input values
      const getVal = (id) => {
        const el = document.getElementById(id);
        return el ? (el.value ?? el.textContent ?? '') : '';
      };
      
      // Sheet 1: Input Parameters
      const inputLabels = {
        zh: {
          title: '输入参数', value: '值', language: '语言', membranePreset: '膜预设', foulantType: '污染物类型',
          probeLiquidMode: '探针液模式(膜)', foulantProbeLiquidMode: '探针液模式(污染物)',
          angleDiiodo: '二碘甲烷接触角(膜)', angleForm: '甲酰胺接触角(膜)', angleWater: '水接触角(膜)',
          foulantAngleDiiodo: '二碘甲烷接触角(污染物)', foulantAngleForm: '甲酰胺接触角(污染物)', foulantAngleWater: '水接触角(污染物)',
          zetaMembrane: '膜Zeta电位 (mV)', zetaFoulant: '污染物Zeta电位 (mV)', particleRadius: '粒子半径 (nm)',
          ionicStrength: '离子强度 (mol/L)', temperature: '温度 (K)', animationSpeed: '动画速度',
          recordMode: '录制模式', recordDuration: '录制时长 (s)', recordDistance: '录制距离 (nm)'
        },
        en: {
          title: 'Input Parameters', value: 'Value', language: 'Language', membranePreset: 'Membrane Preset', foulantType: 'Foulant Type',
          probeLiquidMode: 'Probe Liquid Mode (Membrane)', foulantProbeLiquidMode: 'Probe Liquid Mode (Foulant)',
          angleDiiodo: 'Diodomethane Angle (Membrane)', angleForm: 'Formamide Angle (Membrane)', angleWater: 'Water Angle (Membrane)',
          foulantAngleDiiodo: 'Diodomethane Angle (Foulant)', foulantAngleForm: 'Formamide Angle (Foulant)', foulantAngleWater: 'Water Angle (Foulant)',
          zetaMembrane: 'Membrane Zeta Potential (mV)', zetaFoulant: 'Foulant Zeta Potential (mV)', particleRadius: 'Particle Radius (nm)',
          ionicStrength: 'Ionic Strength (mol/L)', temperature: 'Temperature (K)', animationSpeed: 'Animation Speed',
          recordMode: 'Record Mode', recordDuration: 'Record Duration (s)', recordDistance: 'Record Distance (nm)'
        },
        ja: {
          title: '入力パラメータ', value: '値', language: '言語', membranePreset: '膜プリセット', foulantType: '汚染物質タイプ',
          probeLiquidMode: 'プローブ液モード(膜)', foulantProbeLiquidMode: 'プローブ液モード(汚染物質)',
          angleDiiodo: 'ジヨードメタン接触角(膜)', angleForm: 'ホルムアミド接触角(膜)', angleWater: '水接触角(膜)',
          foulantAngleDiiodo: 'ジヨードメタン接触角(汚染物質)', foulantAngleForm: 'ホルムアミド接触角(汚染物質)', foulantAngleWater: '水接触角(汚染物質)',
          zetaMembrane: '膜ゼータ電位 (mV)', zetaFoulant: '汚染物質ゼータ電位 (mV)', particleRadius: '粒子半径 (nm)',
          ionicStrength: 'イオン強度 (mol/L)', temperature: '温度 (K)', animationSpeed: 'アニメーション速度',
          recordMode: '録画モード', recordDuration: '録画時間 (s)', recordDistance: '録画距離 (nm)'
        }
      }[currentLang] || inputLabels.en;
      
      const inputsData = [
        [inputLabels.title, inputLabels.value],
        ['', ''],
        [inputLabels.language, getVal('language-select')],
        ['', ''],
        [inputLabels.membranePreset, getVal('membrane-preset')],
        [inputLabels.foulantType, getVal('foulant-type')],
        ['', ''],
        [inputLabels.probeLiquidMode, getVal('probe-liquid-mode')],
        [inputLabels.angleDiiodo, getVal('angle-diodomethane')],
        [inputLabels.angleForm, getVal('angle-formamide')],
        [inputLabels.angleWater, getVal('angle-water')],
        ['', ''],
        [inputLabels.foulantProbeLiquidMode, getVal('foulant-probe-liquid-mode')],
        [inputLabels.foulantAngleDiiodo, getVal('foulant-angle-diodomethane')],
        [inputLabels.foulantAngleForm, getVal('foulant-angle-formamide')],
        [inputLabels.foulantAngleWater, getVal('foulant-angle-water')],
        ['', ''],
        [inputLabels.zetaMembrane, getVal('zeta-membrane')],
        [inputLabels.zetaFoulant, getVal('zeta-foulant')],
        ['', ''],
        [inputLabels.particleRadius, getVal('particle-radius')],
        [inputLabels.ionicStrength, getVal('ionic-strength')],
        [inputLabels.temperature, getVal('temperature')],
        ['', ''],
        [inputLabels.animationSpeed, getVal('animation-speed')],
        [inputLabels.recordMode, getVal('record-mode')],
        [inputLabels.recordDuration, getVal('record-duration')],
        [inputLabels.recordDistance, getVal('record-distance')],
        ['', ''],
        [currentLang === 'zh' ? '※ 计算结果数据请查看第2个工作表' : currentLang === 'ja' ? '※ 計算結果は2番目のシートをご覧ください' : '※ Calculation results are in the second sheet', '']
      ];
      const wsInputs = XLSX.utils.aoa_to_sheet(inputsData);
      wsInputs['!cols'] = [{ wch: 30 }, { wch: 20 }];
      XLSX.utils.book_append_sheet(wb, wsInputs, currentLang === 'zh' ? '输入参数' : currentLang === 'ja' ? '入力パラメータ' : 'Input Parameters');
      
      // Sheet 2: Calculation Results
      const labels = {
        zh: { title: 'XDLVO 计算结果', membraneST: '表面张力 (膜) (mJ/m²)', gibbs: '吉布斯自由能 (mJ/m²)', energyAnalysis: '能量分析', barrier: '能垒 (kT)', barrierPos: '能垒位置 (nm)', primaryMinPos: '第一极小值位置 (nm)', primaryMinEnergy: '第一极小值能量 (kT)', secondaryMinPos: '第二极小值位置 (nm)', secondaryMinEnergy: '第二极小值能量 (kT)', distance: '距离 (nm)', interaction: '交互作用能 (kT)', sheetName: '计算结果', success: '导出成功！', notExist: '不存在' },
        en: { title: 'XDLVO Calculation Results', membraneST: 'Surface Tension (Membrane) (mJ/m²)', gibbs: 'Gibbs Free Energy (mJ/m²)', energyAnalysis: 'Energy Analysis', barrier: 'Energy Barrier (kT)', barrierPos: 'Barrier Position (nm)', primaryMinPos: 'Primary Minimum Position (nm)', primaryMinEnergy: 'Primary Minimum Energy (kT)', secondaryMinPos: 'Secondary Minimum Position (nm)', secondaryMinEnergy: 'Secondary Minimum Energy (kT)', distance: 'Distance (nm)', interaction: 'Interaction Energy (kT)', sheetName: 'Results', success: 'Export successful!', notExist: 'N/A' },
        ja: { title: 'XDLVO 計算結果', membraneST: '表面張力 (膜) (mJ/m²)', gibbs: 'ギブス自由エネルギー (mJ/m²)', energyAnalysis: 'エネルギー分析', barrier: 'エネルギー障壁 (kT)', barrierPos: '障壁位置 (nm)', primaryMinPos: '第一極小値位置 (nm)', primaryMinEnergy: '第一極小値エネルギー (kT)', secondaryMinPos: '第二極小値位置 (nm)', secondaryMinEnergy: '第二極小値エネルギー (kT)', distance: '距離 (nm)', interaction: '相互作用エネルギー (kT)', sheetName: '計算結果', success: 'エクスポート成功！', notExist: '存在しない' }
      }[currentLang] || labels.en;
      
      const data = [
        [labels.membraneST, ''],
        ['γ^LW', membraneGamma.γ_lw.toFixed(6)],
        ['γ⁺', membraneGamma.γ_plus.toFixed(6)],
        ['γ⁻', membraneGamma.γ_minus.toFixed(6)],
        ['γ^AB', membraneGamma.γ_ab.toFixed(6)],
        ['γ^TOT', membraneGamma.γ_total.toFixed(6)],
        ['', ''],
        [labels.gibbs, ''],
        ['ΔG^LW', ΔG.LW.toFixed(6)],
        ['ΔG^AB', ΔG.AB.toFixed(6)],
        ['ΔG^EL', ΔG.EL.toFixed(6)],
        ['ΔG^TOT', ΔG.TOT.toFixed(6)],
        ['', ''],
        [labels.energyAnalysis, ''],
        [labels.barrier, analysis.barrier !== null ? analysis.barrier.toFixed(6) : labels.notExist],
        [labels.barrierPos, analysis.barrierPosition !== null ? analysis.barrierPosition.toFixed(6) : '-'],
        [labels.primaryMinPos, analysis.primaryMinimum ? analysis.primaryMinimum.position.toFixed(6) : labels.notExist],
        [labels.primaryMinEnergy, analysis.primaryMinimum ? analysis.primaryMinimum.energy.toFixed(6) : '-'],
        [labels.secondaryMinPos, analysis.secondaryMinimum ? analysis.secondaryMinimum.position.toFixed(6) : labels.notExist],
        [labels.secondaryMinEnergy, analysis.secondaryMinimum ? analysis.secondaryMinimum.energy.toFixed(6) : '-'],
        ['', ''],
        [labels.interaction, ''],
        [labels.distance, 'U^LW', 'U^AB', 'U^EL', 'U^TOT']
      ];
      
      energyData.h.forEach((h, i) => data.push([
        h.toFixed(6),
        energyData.ULW[i].toFixed(6),
        energyData.UAB[i].toFixed(6),
        energyData.UEL[i].toFixed(6),
        energyData.UTOT[i].toFixed(6)
      ]));
      
      const ws = XLSX.utils.aoa_to_sheet(data);
      ws['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, ws, labels.sheetName);
      
      XLSX.writeFile(wb, `XDLVO_Results_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.xlsx`);
      
      alert(labels.success);
    } catch (err) {
      console.error('Export failed:', err);
      alert((currentLang === 'zh' ? '导出失败: ' : currentLang === 'ja' ? 'エクスポート失敗: ' : 'Export failed: ') + err.message);
    }
  }

  // Expose to HTML onclick
  window.setLanguage = setLanguage;
  window.switchLanguage = setLanguage;
  window.toggleProbeLiquidMode = toggleProbeMode;
  window.toggleFoulantProbeLiquidMode = toggleFoulantProbeMode;
  window.loadMembranePreset = loadMembranePreset;
  window.loadFoulantPreset = loadFoulantPreset;
  window.calculate = calculate;
  window.startAnimation = startAnimation;
  window.stopAnimation = stopAnimation;
  window.resetAnimation = resetAnimation;
  window.exportToExcel = exportToExcel;
  window.exportGIF = exportGIF;

  window.addEventListener('DOMContentLoaded', init);
})();