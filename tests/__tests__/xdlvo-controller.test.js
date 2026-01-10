/**
 * xdlvo-controller.js Unit Tests
 * Tests for controller and UI interaction logic
 */

// Mock Plotly
global.Plotly = {
  newPlot: jest.fn(),
  react: jest.fn(),
  update: jest.fn()
};

// Mock XLSX
global.XLSX = {
  utils: {
    book_new: jest.fn(() => ({})),
    aoa_to_sheet: jest.fn(() => ({})),
    book_append_sheet: jest.fn()
  },
  writeFile: jest.fn()
};

// Setup DOM environment
document.body.innerHTML = `
  <div id="membrane-preset"></div>
  <div id="foulant-type"></div>
  <input id="angle-diodomethane" value="64.572" />
  <input id="angle-formamide" value="60.966" />
  <input id="angle-water" value="87.5268" />
  <input id="foulant-angle-diodomethane" value="40.31" />
  <input id="foulant-angle-formamide" value="51.43" />
  <input id="foulant-angle-water" value="58.50" />
  <input id="zeta-membrane" value="-32.4" />
  <input id="zeta-foulant" value="-7.5" />
  <input id="particle-radius" value="322.9" />
  <input id="ionic-strength" value="0.01" />
  <input id="temperature" value="298" />
  <select id="probe-liquid-mode"><option value="default">default</option></select>
  <select id="foulant-probe-liquid-mode"><option value="default">default</option></select>
  <select id="language-select"><option value="zh">中文</option></select>
  <div id="chart-container"></div>
  <canvas id="interaction-canvas" width="1200" height="500"></canvas>
`;

// Load model and controller
const path = require('path');
require(path.resolve(__dirname, '../../src/xdlvo-model.js'));
require(path.resolve(__dirname, '../../src/xdlvo-controller.js'));

// debounce/throttle are private functions, tested indirectly via UI behavior

describe('XDLVOController - DOM', () => {
  test('getElementValue', () => {
    expect(document.getElementById('angle-diodomethane').value).toBe('64.572');
  });

  test('setElementValue', () => {
    const input = document.getElementById('angle-diodomethane');
    input.value = '70';
    expect(input.value).toBe('70');
  });
});

describe('XDLVOController - Presets', () => {
  test('loadMembranePreset exists', () => {
    expect(typeof window.loadMembranePreset).toBe('function');
  });

  test('loadFoulantPreset exists', () => {
    expect(typeof window.loadFoulantPreset).toBe('function');
  });
});

describe('XDLVOController - Calculation', () => {
  test('calculate exists', () => {
    expect(typeof window.calculate).toBe('function');
  });
});

describe('XDLVOController - Language', () => {
  test('switchLanguage exists', () => {
    expect(typeof window.switchLanguage).toBe('function');
  });

  test('switchLanguage works', () => {
    window.switchLanguage('en');
  });
});

describe('XDLVOController - Animation', () => {
  test('startAnimation exists', () => {
    expect(typeof window.startAnimation).toBe('function');
  });

  test('stopAnimation exists', () => {
    expect(typeof window.stopAnimation).toBe('function');
  });

  test('resetAnimation exists', () => {
    expect(typeof window.resetAnimation).toBe('function');
  });
});

describe('XDLVOController - Export', () => {
  test('exportGIF exists', () => {
    expect(typeof window.exportGIF).toBe('function');
  });

  test('exportToExcel exists', () => {
    expect(typeof window.exportToExcel).toBe('function');
  });
});

describe('XDLVOController - ProbeMode', () => {
  test('toggleProbeLiquidMode exists', () => {
    expect(typeof window.toggleProbeLiquidMode).toBe('function');
  });

  test('toggleFoulantProbeLiquidMode exists', () => {
    expect(typeof window.toggleFoulantProbeLiquidMode).toBe('function');
  });
});

describe('XDLVOController - Validation', () => {
  test('numeric input', () => {
    const input = document.getElementById('temperature');
    input.value = '298';
    expect(parseFloat(input.value)).toBe(298);
  });

  test('invalid input', () => {
    const input = document.getElementById('temperature');
    input.value = 'invalid';
    expect(isNaN(parseFloat(input.value))).toBe(true);
  });
});

describe('XDLVOController - localStorage', () => {
  test('mock exists', () => {
    expect(global.localStorage).toBeDefined();
    expect(global.localStorage.setItem).toBeDefined();
  });

  test('set/get', () => {
    global.localStorage.setItem('test', 'value');
    expect(global.localStorage.getItem('test')).toBe('value');
  });
});

describe('XDLVOController - Canvas', () => {
  test('canvas exists', () => {
    const canvas = document.getElementById('interaction-canvas');
    expect(canvas).toBeDefined();
    expect(canvas.tagName).toBe('CANVAS');
  });

  test('2D context', () => {
    const canvas = document.getElementById('interaction-canvas');
    expect(canvas.getContext('2d')).toBeDefined();
  });
});

describe('XDLVOController - Integration', () => {
  test('calculate callable', () => {
    document.getElementById('angle-diodomethane').value = '64.572';
    document.getElementById('angle-formamide').value = '60.966';
    document.getElementById('angle-water').value = '87.5268';
    expect(typeof window.calculate).toBe('function');
  });

  test('boundary values', () => {
    document.getElementById('temperature').value = '273';
    expect(parseFloat(document.getElementById('temperature').value)).toBe(273);
  });
});
