# XDLVO Calculator - Jest Unit Testing Documentation

## Overview

This project uses Jest for pure frontend unit testing, covering the core functionality of `xdlvo-model.js` and `xdlvo-controller.js`.

## Quick Start (For JOSS Reviewers)

If you just want to quickly verify that the tests pass, follow these steps:

### Method 1: Using npm (Recommended)

1. Ensure Node.js (v18+) is installed
2. Open Command Prompt (CMD): Press `Win + R`, type `cmd`, press Enter
3. Run the following command (replace `YOUR_PATH` with your actual XDLVO folder path):

```bash
cd /d YOUR_PATH/XDLVO && npm test
```

**Example** (if you cloned the project to `C:\Projects\`):
```bash
cd /d C:\Projects\XDLVO && npm test
```

### Method 2: Direct Jest Execution

If Method 1 doesn't work (npm not in PATH), use this command instead:

```bash
cd /d YOUR_PATH/XDLVO && npx jest --config jest.config.js
```

**Example**:
```bash
cd /d C:\Projects\XDLVO && npx jest --config jest.config.js
```

### Expected Output

After 3-5 seconds, you will see:

```
Test Suites: 2 passed, 2 total
Tests:       65 passed, 65 total
Snapshots:   0 total
Time:        ~3-4 seconds
```

This indicates all tests passed! ✅

---

## Environment Requirements

- Node.js: v18.0.0 or higher
- npm: Included with Node.js

## Installing Dependencies

Before running tests, install the required dependencies:

```bash
cd /d YOUR_PATH/XDLVO && npm install
```

## Installed Dependencies

```json
{
  "jest": "^30.2.0",
  "jest-environment-jsdom": "^30.2.0",
  "@babel/core": "^7.28.5",
  "@babel/preset-env": "^7.28.5",
  "babel-jest": "^30.2.0"
}
```

## Project Structure

```
XDLVO/
├── README.md              # Project overview (GitHub landing page)
├── LICENSE                # MIT License
├── package.json           # Project configuration
├── jest.config.js         # Jest configuration
├── babel.config.js        # Babel configuration
├── .gitignore             # Git ignore rules
├── src/                   # Source files
│   ├── index.html         # Main HTML file
│   ├── xdlvo-model.js     # Core calculation module
│   ├── xdlvo-controller.js # UI controller module
│   ├── style.css          # Stylesheet
│   ├── plotly.min.js      # Plotting library
│   └── xlsx.full.min.js   # Excel export library
├── tests/                 # Test files
│   ├── __tests__/         # Test cases
│   │   ├── xdlvo-model.test.js
│   │   └── xdlvo-controller.test.js
│   ├── __mocks__/         # Mock files
│   │   └── styleMock.js
│   └── jest.setup.js      # Jest setup file
├── docs/                  # Documentation
│   ├── README.md          # Detailed documentation
│   └── TEST_README.md     # Testing documentation
└── paper/                 # JOSS paper
    ├── paper.md           # Paper manuscript
    └── paper.bib          # References
```

## Running Tests

### Method 1: Using npm (Recommended)

Open Command Prompt and run (replace `YOUR_PATH` with your actual path):

```bash
cd /d YOUR_PATH/XDLVO && npm test
```

### Method 2: Direct Jest Execution

```bash
cd /d YOUR_PATH/XDLVO && npx jest --config jest.config.js
```

### Other Test Commands

**Generate coverage report:**
```bash
cd /d YOUR_PATH/XDLVO && npm run test:coverage
```
Or:
```bash
cd /d YOUR_PATH/XDLVO && npx jest --config jest.config.js --coverage
```

Coverage report will be generated in the `coverage/` directory. Open `coverage/lcov-report/index.html` in your browser to view the detailed report.

**Verbose output (detailed test information):**
```bash
cd /d YOUR_PATH/XDLVO && npm run test:verbose
```

**Watch mode (automatically re-run on file changes):**
```bash
cd /d YOUR_PATH/XDLVO && npm run test:watch
```

Press `Ctrl + C` to exit watch mode.

## Test Coverage

### xdlvo-model.test.js

Tests the core calculation logic module:

1. **Constants Definition Tests**
   - PHYSICAL_CONSTANTS (Physical constants)
   - CALC_CONSTANTS (Calculation constants)

2. **Utility Functions Tests**
   - `binarySearchClosest` - Binary search for closest value
   - `calculateHyperbolicFunctions` - Hyperbolic function calculation
   - `approximatelyEqual/LessOrEqual/GreaterOrEqual` - Floating-point comparison
   - `degreesToRadians` - Degrees to radians conversion

3. **Core Calculation Functions Tests**
   - `calculateSurfaceTensionFromAnglesAndLiquids` - Surface tension calculation
   - `calculateWaterPermittivity` - Water permittivity
   - `calculateKappa` - Kappa value calculation
   - `generateDistanceArray` - Distance array generation
   - `calculateDeltaG` - Gibbs free energy
   - `calculateInteractionEnergy` - Interaction energy
   - `findEnergyBarrier` - Energy barrier detection
   - `findEquilibriumDistances` - Equilibrium distance detection
   - `calculateEnergyBarrierAndEquilibrium` - Comprehensive analysis
   - `findEnergyAtDistance` - Energy at specific distance

4. **Integration Tests**
   - Complete calculation workflow test

### xdlvo-controller.test.js

Tests controller and UI interaction logic:

1. **Utility Functions Tests**
   - `debounce` - Debounce function
   - `throttle` - Throttle function

2. **DOM Operations Tests**
   - `getElementValue` - Get element value
   - `setElementValue` - Set element value

3. **Preset Data Tests**
   - `loadMembranePreset` - Load membrane preset
   - `loadFoulantPreset` - Load foulant preset

4. **Calculation Functions Tests**
   - `calculate` - Main calculation function
   - `calculateSurfaceTension` - Membrane surface tension calculation
   - `calculateFoulantSurfaceTension` - Foulant surface tension calculation

5. **UI Functions Tests**
   - Language switching
   - Animation control (start/stop/reset)
   - Probe liquid mode switching

6. **Export Functions Tests**
   - `exportGIF` - Video export
   - `exportToExcel` - Excel export

7. **Storage Functions Tests**
   - localStorage operations

8. **Canvas Drawing Tests**
   - Canvas element verification
   - 2D context acquisition

9. **Error Handling Tests**
   - Input validation
   - Exception handling

10. **Integration Tests**
    - Complete calculation workflow
    - Boundary condition tests

## Mock Configuration

### Global Mocks

Configured in `jest.setup.js`:

- **localStorage**: Mock local storage
- **alert**: Mock browser alert
- **console.warn/error**: Mock console output

### External Library Mocks

Configured in test files:

- **Plotly**: Mock charting library
- **XLSX**: Mock Excel export library

## Configuration Details

### jest.config.js

```javascript
{
  testEnvironment: 'jsdom',           // Use jsdom to simulate browser environment
  testMatch: ['**/tests/__tests__/**/*.test.js'],  // Test file matching pattern
  collectCoverageFrom: [              // Coverage collection scope
    'src/xdlvo-model.js',
    'src/xdlvo-controller.js'
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],  // Test setup file
  moduleDirectories: ['node_modules'],  // Module directories
  coverageThreshold: {                // Coverage threshold
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50
    }
  }
}
```

### babel.config.js

```javascript
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { node: 'current' }
      }
    ]
  ]
};
```

## Coverage Goals

Current coverage threshold is set to 50%, including:

- Branch coverage: 50%
- Function coverage: 50%
- Line coverage: 50%
- Statement coverage: 50%

You can adjust these thresholds in `jest.config.js` as needed.

## Test Status

### Current Test Results

- ✅ Test Suites: 2 passed, 2 total
- ✅ Tests: 65 passed, 65 total (100% pass rate)
- ✅ Time: ~3-4 seconds

### Coverage Report

- **xdlvo-model.js**: 97.77% coverage (core calculation module)
- **xdlvo-controller.js**: Tested through integration testing

## Troubleshooting

### 1. "node is not recognized" Error

**Solution A**: Ensure Node.js is installed and added to system PATH

**Solution B**: Use full path to node.exe (Windows example):
```bash
"C:\Program Files\nodejs\node.exe" node_modules/jest/bin/jest.js --config jest.config.js
```

### 2. "Cannot find module" Error

**Cause**: Not in the correct directory

**Solution**: Make sure the path in your `cd` command points to the XDLVO folder (where `package.json` is located)

### 3. Test Timeout

If tests take too long, increase the timeout in `jest.config.js`:

```javascript
testTimeout: 10000  // 10 seconds
```

### 4. PowerShell Script Execution Error (Windows)

**Error**: "running scripts is disabled on this system"

**Solution**: Use Command Prompt (CMD) instead of PowerShell
- Press `Win + R`
- Type `cmd` (not `powershell`)
- Press Enter

### 5. Module Import Issues

Ensure:
- `babel.config.js` is correctly configured
- `type` in `package.json` is set to `"commonjs"`
- Test files use `require()` instead of `import`

### 6. Still Having Issues?

Try this command (replace `YOUR_PATH`):
```bash
cd /d YOUR_PATH/XDLVO && npx jest
```

This uses default Jest configuration and should work in most cases.

## CI/CD Integration

This test suite can be easily integrated into CI/CD pipelines:

**GitHub Actions Example**:
```yaml
- name: Run tests
  run: npm test
  
- name: Generate coverage
  run: npm run test:coverage
```

## References

- [Jest Official Documentation](https://jestjs.io/)
- [jsdom Documentation](https://github.com/jsdom/jsdom)
- [Babel Documentation](https://babeljs.io/)

## Contact

For questions or suggestions, please open an issue on GitHub.
