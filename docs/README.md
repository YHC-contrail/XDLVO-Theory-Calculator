# XDLVO Theory Calculator

Extended DLVO Theory Calculator for Membrane-Foulant Interactions Analysis

## Description

This is a web-based calculator for analyzing membrane-foulant interactions using Extended DLVO (XDLVO) theory. The calculator computes surface tension components, Gibbs free energy, and interaction energy profiles between membrane surfaces and foulant particles.

## Features

- Surface tension calculation from contact angle measurements
- XDLVO interaction energy computation (LW, AB, EL components)
- Interactive visualization with real-time animation
- Multiple language support (Chinese, Japanese, English)
- Data export to Excel format
- Video export of interaction animations

## Installation

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Node.js (for running tests)

### Quick Start

1. Clone or download this repository
2. Open `src/index.html` in your web browser
3. The calculator will run directly in your browser

No server or installation required for basic usage.

## Usage

1. **Select Presets**: Choose membrane and foulant presets from dropdown menus
2. **Input Parameters**: 
   - Contact angles for membrane and foulant
   - Zeta potentials
   - Particle radius
   - Ionic strength
   - Temperature
3. **Calculate**: Click "Calculate and Plot" button
4. **View Results**: 
   - Surface tension components
   - Gibbs free energy
   - Interaction energy curves
   - Energy barrier and equilibrium distances
5. **Export**: Export results to Excel or animation to video

## Testing

This project includes comprehensive unit tests for the core calculation module.

### Running Tests

Open Command Prompt and run (replace `YOUR_PATH` with your actual path):

```bash
cd /d YOUR_PATH/XDLVO && npm test
```

Or use npx for direct Jest execution:

```bash
cd /d YOUR_PATH/XDLVO && npx jest --config jest.config.js
```

### Test Results

- **Test Suites**: 2 passed, 2 total
- **Tests**: 65 passed, 65 total (100% pass rate)
- **Coverage**: 
  - xdlvo-model.js: 97.77% (core calculation module)
  - xdlvo-controller.js: Tested through integration testing

For detailed testing documentation, see [TEST_README.md](TEST_README.md).

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

## Core Modules

### xdlvo-model.js

Core calculation module containing:
- Physical and calculation constants
- Surface tension calculation from contact angles
- XDLVO interaction energy computation
- Energy barrier and equilibrium distance analysis

### xdlvo-controller.js

UI controller module handling:
- User input and validation
- Preset data loading
- Visualization and animation
- Data export functionality
- Multi-language support

## Dependencies

- **Plotly.js**: Interactive plotting library
- **XLSX.js**: Excel file generation
- **Jest**: Testing framework (dev dependency)
- **Babel**: JavaScript transpiler (dev dependency)

## Browser Compatibility

- Chrome/Edge: ✅ Fully supported
- Firefox: ✅ Fully supported
- Safari: ✅ Fully supported
- IE11: ❌ Not supported

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## Citation

If you use this software in your research, please cite:

Yang, H., Cheng, C., Dong, R., Wei, J., Zhang, X., Ma, J., Wang, Z., & Zheng, J. (2025). XDLVO Theory Calculator: A Web-based Lightweight Analysis Tool for Membrane-Foulant Interactions. *Journal of Open Source Software*.

BibTeX format:
```bibtex
@article{Yang2025XDLVO,
  title = {XDLVO Theory Calculator: A Web-based Lightweight Analysis Tool for Membrane-Foulant Interactions},
  author = {Yang, Haochuan and Cheng, Chenhong and Dong, Rubing and Wei, Jiaqi and Zhang, Xingran and Ma, Jinxing and Wang, Zhiwei and Zheng, Junjian},
  journal = {Journal of Open Source Software},
  year = {2025},
  note = {Submitted for publication}
}
```

## Contributing

Contributions are welcome! We encourage community participation to improve XDLVO-Web:

- **Bug Reports**: Open an issue on GitHub
- **Feature Requests**: Suggest new features or improvements
- **Code Contributions**: Submit a Pull Request
- **Documentation**: Help improve documentation and examples

Please feel free to submit a Pull Request or open an issue for discussion.

## Contact

- **Corresponding Author**: Prof. Junjian Zheng
- **Institution**: School of Life and Environmental Sciences, Guilin University of Electronic Technology
- **GitHub**: [Project Repository](https://github.com/YHC-contrail/XDLVO-Theory-Calculator)

For questions, suggestions, or collaboration inquiries, please open an issue on GitHub.

## Acknowledgments

The development of XDLVO-Web benefited from the contributions of multiple researchers and open-source projects:

- **Open-source Libraries**: [Plotly.js](https://plotly.com/javascript/) for interactive visualization and [SheetJS](https://sheetjs.com/) for Excel export functionality
- **Testing Framework**: Jest and related testing tools for ensuring code quality
- **Community Support**: Thanks to all users who provided feedback and suggestions during development
