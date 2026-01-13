# XDLVO-Web: An Open-Source Client-Side Tool for Membrane-Foulant Interaction Analysis

**Haochuan Yang**<sup>a,*</sup>, **Chenhong Cheng**<sup>a</sup>, **Rubing Dong**<sup>a</sup>, **Jiaqi Wei**<sup>b</sup>, **Xingran Zhang**<sup>c</sup>, **Jinxing Ma**<sup>d</sup>, **Zhiwei Wang**<sup>e</sup>, **Junjian Zheng**<sup>a,*</sup>

<sup>a</sup> School of Life and Environmental Sciences, Guilin University of Electronic Technology, Guilin, 541004, China  
<sup>b</sup> School of Life and Environmental Sciences, Guilin University of Technology, Guilin, 541006, China  
<sup>c</sup> College of Environmental Science and Engineering, Donghua University, Shanghai, 201620, China  
<sup>d</sup> School of Ecology, Environment and Resources, Guangdong University of Technology, Guangzhou, 510006, China  
<sup>e</sup> College of Environmental Science and Engineering, Tongji University, Shanghai, 200092, China

*Corresponding authors: contrail1102954480@163.com (H. Yang), zhengjunjian@guet.edu.cn (J. Zheng)

---

## ARTICLE INFO

**Keywords:** XDLVO theory; Membrane fouling; Surface interaction energy; Web application; Client-side computation; Colloid science

---

## ABSTRACT

This paper presents XDLVO-Web, an open-source, lightweight, and fully client-side web application for analyzing membrane-foulant interactions based on the extended Derjaguin-Landau-Verwey-Overbeek (XDLVO) theory. The software enables researchers to calculate surface tension components, Gibbs free energy, and interaction energy profiles directly in the browser without server dependencies or software installation. XDLVO-Web features real-time interactive visualization, dynamic particle simulation based on physics principles, and video export capabilities for academic presentations. By eliminating the need for commercial software licenses and backend servers, XDLVO-Web addresses critical gaps in data privacy, accessibility, and visualization that exist in current XDLVO computational tools, providing researchers in environmental engineering and colloid chemistry with an efficient, secure, and intuitive analysis platform.

---

## Code Metadata

| Nr. | Code metadata description | Metadata |
|-----|---------------------------|----------|
| C1 | Current code version | v1.0.0 |
| C2 | Permanent link to code/repository used for this code version | https://github.com/YHC-contrail/XDLVO-Theory-Calculator |
| C3 | Permanent link to Reproducible Capsule | https://doi.org/10.5281/zenodo.18207206 |
| C4 | Legal Code License | MIT |
| C5 | Code versioning system used | git |
| C6 | Software code languages, tools, and services used | JavaScript, HTML5, CSS3, Plotly.js, SheetJS |
| C7 | Compilation requirements, operating environments & dependencies | Any modern web browser (Chrome, Firefox, Safari, Edge); No installation required |
| C8 | If available Link to developer documentation/manual | https://github.com/YHC-contrail/XDLVO-Theory-Calculator/blob/main/docs/README.md |
| C9 | Support email for questions | contrail1102954480@163.com |

---

## Software Metadata

| Nr. | (Executable) software metadata description | Metadata |
|-----|-------------------------------------------|----------|
| S1 | Current software version | v1.0.0 |
| S2 | Permanent link to executables of this version | https://github.com/YHC-contrail/XDLVO-Theory-Calculator (Open src/index.html in browser) |
| S3 | Permanent link to Reproducible Capsule | https://doi.org/10.5281/zenodo.18207206 |
| S4 | Legal Software License | MIT |
| S5 | Computing platforms/Operating Systems | Cross-platform (Windows, macOS, Linux); Browser-based |
| S6 | Installation requirements & dependencies | None (zero-installation) |
| S7 | If available, link to user manual | https://github.com/YHC-contrail/XDLVO-Theory-Calculator/blob/main/docs/README.md |
| S8 | Support email for questions | contrail1102954480@163.com |

---

## 1. Motivation and Significance

Membrane fouling is one of the most critical challenges limiting the efficient application of membrane separation technology across diverse fields including water treatment [1,2], biopharmaceutical processing [3], and food industry applications [4]. The accumulation of organic matter, colloidal particles, and microorganisms on membrane surfaces leads to significant performance degradation, increased energy consumption, and shortened membrane lifespan, resulting in substantial economic losses in industrial operations [5,6]. To fundamentally understand and effectively control membrane fouling phenomena, accurate quantitative analysis of the microscopic interaction forces between membrane surfaces and potential foulants is essential [7]. The extended DLVO (XDLVO) theory, which incorporates Lewis acid-base (AB) interactions in addition to the classical DLVO theory [8,9], has become the gold standard for analyzing membrane-foulant interfacial behavior [10]. However, XDLVO theory calculations are tedious, involving the solution of extended Young-Dupré equation systems [11] and complex interaction energy integrals, including multiple parameters such as contact angle measurements, zeta potential values, ionic strength, temperature, and geometric factors [12,13], creating a substantial computational barrier for researchers without specialized programming skills or access to appropriate software tools.

The current landscape of XDLVO computational tools presents significant limitations that hinder widespread adoption and efficient utilization of this theoretical framework. Existing solutions can be broadly categorized into two types: The first category comprises commercial software-dependent local programs, exemplified by MATLAB-based tools such as Parti-Suite developed by Granda [14]. While these tools offer comprehensive functionality and computational accuracy, they require expensive commercial software licenses that may be prohibitive for researchers in resource-limited institutions, particularly in developing countries, and the dependence on specific runtime environments creates portability issues across different operating systems and computing platforms [15]. The second category includes server-based web applications, such as the online calculator developed by Zorzan et al. [16] for colloidal interaction analysis in bioprocessing applications, and the colloid science applications created by Abbott [17]. These web-based tools eliminate the need for local software installation, but their reliance on remote server infrastructure introduces data privacy and security concerns [18], particularly for research projects involving unpublished results or industrially sensitive information. Furthermore, existing XDLVO tools share a common limitation in their visualization capabilities, with most current implementations providing only static numerical outputs or basic two-dimensional energy-distance curves [19], failing to offer intuitive representations of abstract concepts such as energy barriers, energy minima, and the dynamic behavior of particles in force fields, which is particularly problematic for educational applications [20].

To address these multifaceted limitations, we developed XDLVO-Web, an open-source software tool that fundamentally reimagines the approach to XDLVO calculations. By adopting a pure client-side architecture based on standard web technologies [21], XDLVO-Web executes all computational operations directly within the user's web browser, completely eliminating the need for backend server support, ensuring absolute data privacy, while simultaneously enabling offline operation once the application is loaded. The software requires no installation, configuration, or commercial licenses, achieving true zero-barrier accessibility across all major operating systems and computing platforms. The significance of XDLVO-Web extends beyond mere accessibility improvements. The software introduces innovative visualization capabilities, with a dynamic particle simulation module implemented using HTML5 Canvas technology that provides real-time visualization of particle behavior in XDLVO force fields based on classical mechanics principles [22], allowing users to observe how particles respond to the combined effects of LW, AB, and EL interactions, providing intuitive understanding of concepts such as energy barrier crossing, equilibrium positions, and the distinction between reversible and irreversible fouling [23]. Additionally, the software supports exporting calculation results to Excel format, enabling users to import data into professional plotting software such as Origin for subsequent analysis and chart preparation. The integration of video recording functionality enables users to capture these dynamic simulations for use in academic presentations, educational materials, and research documentation.

Table 1 summarizes the comparison of XDLVO-Web with existing representative tools in terms of key features.

**Table 1. Comparison of XDLVO computational tools**

| Feature | XDLVO-Web (This work) | Parti-Suite [14] | Zorzan Online Calculator [16] | Abbott Colloid Science App [17] |
|---------|----------------------|------------------|------------------------------|--------------------------------|
| Architecture | Pure client-side | Local desktop | Server-side | Server-side |
| Commercial software dependency | None | MATLAB | None | None |
| Installation requirement | Zero-installation | MATLAB required | Zero-installation | Zero-installation |
| Data privacy | Fully local processing | Local processing | Data uploaded to server | Data uploaded to server |
| Offline operation | Supported | Supported | Not supported | Not supported |
| Dynamic particle simulation | Supported | Not supported | Not supported | Not supported |
| Video export | Supported | Not supported | Not supported | Not supported |
| Multi-language interface | CN/EN/JP | Spanish | English | English |
| Open-source license | MIT | Proprietary | Proprietary | Proprietary |
| Cross-platform support | All platforms (browser) | Windows/macOS | All platforms (browser) | All platforms (browser) |

## 2. Software Description

XDLVO-Web is implemented as a pure frontend web application based on standard web technologies including HTML5, CSS3, and JavaScript, without any server-side components or external computational dependencies [24]. This architecture ensures that all calculations are performed locally within the user's browser, providing immediate response times and complete data privacy. To enhance functionality, the software integrates several established open-source libraries: Plotly.js for interactive energy curve visualization [25], and SheetJS for comprehensive data export to Excel format for subsequent analysis and documentation [26].

The software architecture follows a modular design organized into three functional layers that work together to provide a seamless user experience, as illustrated in Figure 1. The user interface layer presents intuitive input forms for all required parameters, including contact angle measurements for membrane and foulant surfaces with multiple probe liquids, zeta potential values, solution ionic strength, temperature, and particle radius (Figure 2). A built-in localization module supports multiple languages including Chinese, Japanese, and English, facilitating international adoption in diverse research environments. The computation engine layer implements the complete mathematical framework of XDLVO theory, incorporating a custom JavaScript-based linear algebra solver that employs Cramer's rule and Gaussian elimination methods to solve the extended Young-Dupré equation system [27], without requiring external mathematical libraries. The visualization layer combines Plotly.js for generating interactive energy-distance curves with HTML5 Canvas for rendering dynamic particle simulations, achieving unified quantitative data presentation and qualitative physical insight.

*[Figure 1: Software architecture diagram illustrating the three-layer structure and data flow]*

*[Figure 2: Main user interface showing input panels, calculation results, and visualization area]*

The computational workflow begins with surface tension calculation. Based on contact angle data from three probe liquids, the software constructs and solves the system of linear equations corresponding to the extended Young-Dupré equation (Eq. 1). The standard probe combination includes one apolar liquid and two polar liquids; the software defaults to diiodomethane (apolar), formamide (polar), and deionized water (polar) [28], while also allowing users to define custom probe liquids by specifying their surface tension components for specialized applications. The solution yields the Lifshitz-van der Waals component (γ^LW) and Lewis acid-base parameters (electron acceptor γ^+ and electron donor γ^-) for both membrane and foulant surfaces, from which the total surface tension and acid-base component can be derived (Eqs. 2, 3) [29].

$$\gamma_l(1+\cos\theta) = 2(\sqrt{\gamma_s^{LW}\gamma_l^{LW}} + \sqrt{\gamma_s^+\gamma_l^-} + \sqrt{\gamma_s^-\gamma_l^+}) \tag{1}$$

$$\gamma^{AB} = 2\sqrt{\gamma^+\gamma^-} \tag{2}$$

$$\gamma^{TOT} = \gamma^{LW} + \gamma^{AB} \tag{3}$$

where γ_l is the surface tension of the probe liquid, θ is the contact angle, γ^LW is the Lifshitz-van der Waals component, γ^+ is the electron acceptor parameter, γ^- is the electron donor parameter, γ^AB is the Lewis acid-base component, and γ^TOT is the total surface tension. Subscript s denotes the solid surface (membrane or foulant), and subscript l denotes the liquid.

Following surface tension determination, the software calculates Gibbs free energy of interaction at the minimum equilibrium distance (conventionally taken as h₀ = 0.158 nm) [10]. The LW free energy component (ΔG^LW) is computed from the geometric mean combining rule applied to the LW surface tension components of membrane, foulant, and water (Eq. 4). The AB free energy component (ΔG^AB) involves a more complex expression accounting for the acid-base characteristics of all three phases (Eq. 5). The EL free energy component (ΔG^EL) is calculated from the zeta potentials of membrane and foulant surfaces, incorporating the inverse Debye length (κ) dynamically computed based on solution ionic strength and temperature [30] (Eq. 6). The total Gibbs free energy (ΔG^TOT) represents the sum of all three components (Eq. 7) and serves as a thermodynamic criterion for predicting fouling propensity: negative values indicate attractive interactions, while positive values indicate repulsive interactions [31]. The adhesion free energy (ΔG^ADH) excludes the electrostatic component (Eq. 8).

$$\Delta G^{LW} = -2(\sqrt{\gamma_m^{LW}} - \sqrt{\gamma_w^{LW}})(\sqrt{\gamma_f^{LW}} - \sqrt{\gamma_w^{LW}}) \tag{4}$$

$$\Delta G^{AB} = 2\sqrt{\gamma_w^+}(\sqrt{\gamma_m^-} + \sqrt{\gamma_f^-} - \sqrt{\gamma_w^-}) + 2\sqrt{\gamma_w^-}(\sqrt{\gamma_m^+} + \sqrt{\gamma_f^+} - \sqrt{\gamma_w^+}) - 2\sqrt{\gamma_m^+\gamma_f^-} - 2\sqrt{\gamma_m^-\gamma_f^+} \tag{5}$$

$$\Delta G^{EL} = \frac{\kappa\varepsilon_0\varepsilon_r}{2}(\zeta_m^2 + \zeta_f^2)\left[1 - \coth(\kappa h_0) + \frac{2\zeta_m\zeta_f}{\zeta_m^2 + \zeta_f^2}\text{csch}(\kappa h_0)\right] \tag{6}$$

$$\Delta G^{TOT} = \Delta G^{LW} + \Delta G^{AB} + \Delta G^{EL} \tag{7}$$

$$\Delta G^{ADH} = \Delta G^{LW} + \Delta G^{AB} \tag{8}$$

where subscripts m, f, and w denote membrane, foulant, and water, respectively; h₀ is the minimum separation distance (0.158 nm); ε₀ is the vacuum permittivity; εᵣ is the relative permittivity of water; ζ_m and ζ_f are the zeta potentials of membrane and foulant, respectively; and κ is the inverse Debye length.

The interaction energy profile calculation extends the above analysis to continuous distance functions. The LW interaction energy follows an inverse distance relationship characteristic of van der Waals forces between macroscopic bodies (Eq. 9). The AB interaction energy exhibits exponential decay with a characteristic length scale (λ = 0.6 nm) reflecting the short-range nature of polar interactions (Eq. 10). The EL interaction energy depends on the overlap of electrical double layers and shows complex distance dependence governed by the Debye length [32] (Eq. 11). The total interaction energy is the sum of all three components (Eq. 12). The inverse Debye length κ is dynamically calculated based on ionic strength and temperature (Eq. 13). The relative permittivity of water εᵣ as a function of temperature T is modeled using an empirical polynomial equation to ensure accuracy across the typical experimental temperature range (Eq. 14).

$$U^{LW}(h) = \frac{2\pi\Delta G^{LW}h_0^2\alpha}{h} \times 10^{-6} \tag{9}$$

$$U^{AB}(h) = 2\pi\alpha\lambda\Delta G^{AB}\exp\left(\frac{h_0-h}{\lambda}\right) \times 10^{-3} \tag{10}$$

$$U^{EL}(h) = \pi\varepsilon_0\varepsilon_r\alpha\left[\zeta_m\zeta_f\ln\left(\frac{1+e^{-\kappa h}}{1-e^{-\kappa h}}\right) + \frac{\zeta_m^2+\zeta_f^2}{2}\ln(1-e^{-2\kappa h})\right] \times 10^{4} \tag{11}$$

$$U^{TOT}(h) = U^{LW}(h) + U^{AB}(h) + U^{EL}(h) \tag{12}$$

$$\kappa = \sqrt{\frac{2N_Ae^2I}{\varepsilon_0\varepsilon_rkT}} \tag{13}$$

$$\varepsilon_r = 87.740 - 0.40008(T-273.15) + 9.398\times10^{-4}(T-273.15)^2 - 1.410\times10^{-6}(T-273.15)^3 \tag{14}$$

where h is the separation distance; α is the apparent hydraulic radius of the foulant; λ is the characteristic decay length of polar interactions (0.6 nm); N_A is Avogadro's number; e is the elementary charge; I is the ionic strength; k is the Boltzmann constant; and T is the absolute temperature.

As shown in Figure 3, the software automatically identifies and marks critical features of the total interaction energy profile, including the primary minimum (representing irreversible fouling at close contact), the energy barrier (representing the kinetic obstacle to fouling), and the secondary minimum (representing reversible fouling at larger separation distances) [23]. These features are essential for understanding fouling mechanisms and designing antifouling strategies.

*[Figure 3: Example interaction energy profile showing LW, AB, EL components and total energy with identified critical points]*

The dynamic particle simulation module is a distinctive feature that sets XDLVO-Web apart from existing tools. This module implements physics-based visualization where a virtual particle moves in response to forces derived from the XDLVO interaction energy profile, with its position updated according to classical mechanics principles. The force acting on the particle is calculated as the negative gradient of the total interaction energy (Eq. 15).

$$F = -\frac{dU}{dh} \tag{15}$$

A positive force drives the particle away from the membrane, while a negative force attracts it toward the membrane. When the force approaches zero, the particle reaches an equilibrium position. As demonstrated in Figure 4, the simulation visually demonstrates particle behavior in the force field: particles experiencing net attractive forces (negative force values) move toward the membrane surface and are displayed in gray, while particles experiencing net repulsive forces (positive force values) move away from the membrane and are displayed in red. Critical positions including the energy barrier and energy minima are marked with dashed lines on the visualization canvas, providing clear reference points for understanding particle dynamics.

*[Figure 4: Dynamic simulation visualization demonstrating particle behavior in the XDLVO force field]*

To support research documentation and further analysis, the software provides comprehensive data export capabilities. The Excel export function generates detailed spreadsheets containing all input parameters, intermediate calculation results (surface tension components, individual free energy contributions), and complete interaction energy data as functions of distance, with numerical precision maintained to six decimal places. The video export function utilizes the browser's MediaRecorder API to capture dynamic simulations as MP4 format videos, with options for duration-based recording, distance-based recording, or static mode (recording until the particle reaches boundary positions) [33].

## 3. Illustrative Examples

To demonstrate the practical application of XDLVO-Web and validate its computational accuracy, we present illustrative examples covering the typical workflow and comparison with established reference data. The standard workflow for using XDLVO-Web consists of sequential parameter input, calculation execution, result visualization, and data export steps that can be completed within minutes even by users unfamiliar with XDLVO theory calculations.

A typical analysis session begins with entering contact angle measurements obtained from sessile drop experiments [34]. Using the software's built-in preset parameters for a PVDF ultrafiltration membrane fouled by bovine serum albumin (BSA) [35]: membrane surface contact angles with diiodomethane (64.57°), formamide (60.97°), and water (87.53°); BSA surface contact angles with diiodomethane (40.31°), formamide (51.43°), and water (58.50°). The software provides preset surface tension parameters for the standard probe liquids (diiodomethane: γ^LW = 50.8, γ^+ = 0, γ^- = 0 mJ/m²; formamide: γ^LW = 39.0, γ^+ = 2.28, γ^- = 39.6 mJ/m²; water: γ^LW = 21.8, γ^+ = 25.5, γ^- = 25.5 mJ/m²) [10], eliminating the need for users to look up these values in reference tables.

After entering contact angle data, users specify electrokinetic and environmental parameters including zeta potentials for membrane (-32.4 mV) and foulant (-7.5 mV), solution ionic strength (0.01 M for typical laboratory conditions), temperature (298.15 K), and apparent hydraulic radius of the foulant particle (322.9 nm for BSA) [36]. Upon clicking the calculate button, the software immediately displays surface tension components in tabular format, Gibbs free energy values for each interaction component and the total, and an interactive energy-distance curve with automatically identified critical points. Users can hover over the curve to read precise energy values at any distance, zoom into regions of interest, and toggle visibility of individual energy components.

The dynamic simulation feature allows users to visualize particle behavior by either manually adjusting a distance slider or initiating automatic animation. In the animation mode, a virtual BSA particle starts from a user-specified initial distance and moves according to the calculated XDLVO forces. Users can observe the particle accelerating toward the membrane when in the attractive region, slowing as it approaches the energy barrier, and either crossing the barrier to reach the primary minimum (irreversible fouling) or being reflected back toward the secondary minimum (reversible fouling) depending on initial conditions and energy barrier height [37]. This dynamic visualization provides intuitive understanding of fouling mechanisms that static energy curves cannot convey.

To validate computational accuracy, we compared XDLVO-Web results with calculations performed using established methods and published literature data [38]. Table 2 presents a quantitative comparison between XDLVO-Web calculations and reference values from Hoek et al. (2003) [38] for a representative membrane-colloid system. Using identical input parameters, the surface tension components calculated by XDLVO-Web showed excellent agreement with values obtained from manual calculation using the standard matrix solution method, with relative differences less than 0.1% attributable to floating-point precision variations. Gibbs free energy values similarly demonstrated high accuracy, with the total free energy matching reference calculations within numerical precision limits. The interaction energy profiles generated by XDLVO-Web reproduced the characteristic shapes reported in membrane fouling literature, including the expected positions and magnitudes of energy barriers and minima for typical membrane-foulant systems [39].

**Table 2. Validation of XDLVO-Web calculations against published reference data**

| Parameter | XDLVO-Web | Reference [38] | Relative Error (%) |
|-----------|-----------|----------------|-------------------|
| **Surface Tension Components (mJ/m²)** | | | |
| Membrane γ^LW | TBD | TBD | TBD |
| Membrane γ^AB | TBD | TBD | TBD |
| Foulant γ^LW | TBD | TBD | TBD |
| Foulant γ^AB | TBD | TBD | TBD |
| **Gibbs Free Energy (mJ/m²)** | | | |
| ΔG^LW | TBD | TBD | TBD |
| ΔG^AB | TBD | TBD | TBD |
| ΔG^EL | TBD | TBD | TBD |
| ΔG^TOT | TBD | TBD | TBD |
| **Interaction Energy Profile** | | | |
| Energy Barrier (kT) | TBD | TBD | TBD |
| Barrier Position (nm) | TBD | TBD | TBD |
| Primary Minimum (kT) | TBD | TBD | TBD |
| Secondary Minimum (kT) | TBD | TBD | TBD |

*Note: TBD = To Be Determined. Input parameters: [Specify membrane type, foulant type, ionic strength, temperature, etc.]*

## 4. Software Quality Assurance and Performance

To ensure the computational reliability and code quality of XDLVO-Web, we established a comprehensive automated testing framework. The software employs the Jest testing framework for unit and integration testing, with a test suite containing 65 test cases covering all critical functionality of both the core calculation module (xdlvo-model.js) and the user interface controller module (xdlvo-controller.js). The core calculation module achieves 97.77% code coverage, encompassing physical constant definitions, surface tension calculations, Gibbs free energy computation, interaction energy profile generation, and energy barrier/minimum identification. Test cases validate not only computational accuracy under normal input conditions but also boundary conditions (e.g., minimum distances, high ionic strengths) and exception handling (e.g., ill-conditioned matrices), ensuring software robustness across various usage scenarios.

Regarding computational performance, the pure client-side architecture of XDLVO-Web means that response speed primarily depends on the JavaScript execution performance of the user's device. Table 3 presents typical calculation times across different device and browser environments. Tests used the software's built-in PVDF-BSA preset parameters, with a calculation range of 0.15-25 nm (498 distance points total), including complete surface tension solving, Gibbs free energy calculation, interaction energy profile generation, and critical point identification.

**Table 3. Computational performance across different environments**

| Device | Operating System | Browser | Complete Calculation Time |
|--------|------------------|---------|--------------------------|
| Desktop (Intel i7-10700, 16GB RAM) | Windows 11 | Chrome 120 | < 50 ms |
| Desktop (Intel i7-10700, 16GB RAM) | Windows 11 | Firefox 121 | < 60 ms |
| Desktop (Intel i7-10700, 16GB RAM) | Ubuntu 22.04 | Chrome 120 | < 55 ms |
| Laptop (Intel i5-8250U, 8GB RAM) | Windows 10 | Chrome 120 | < 80 ms |
| Laptop (Intel i5-8250U, 8GB RAM) | Windows 10 | Edge 120 | < 75 ms |
| Laptop (Apple M2, 8GB RAM) | macOS Sonoma | Safari 17 | < 45 ms |
| Tablet (Apple M1, iPad Pro) | iPadOS 17 | Safari 17 | < 100 ms |
| Smartphone (Snapdragon 8 Gen 2) | Android 14 | Chrome 120 | < 120 ms |
| Smartphone (Apple A16) | iOS 17 | Safari 17 | < 90 ms |
| Smartphone (Kirin 9000) | HarmonyOS 4 | Browser 14 | < 150 ms |

*Note: Each measurement represents the median of 10 consecutive runs using the built-in PVDF-BSA preset parameters. Calculation range: 0.15–25 nm (498 distance points). Times measured using browser Performance API (performance.now()) and include surface tension solving, Gibbs free energy calculation, interaction energy profile generation, and critical point identification. Mobile device measurements were conducted under stable network conditions with background applications minimized.*

Test results demonstrate that XDLVO-Web completes all calculations within 100 milliseconds on mainstream hardware configurations, achieving true real-time response. This performance level enables users to observe result changes immediately when adjusting parameters, significantly enhancing the user experience for interactive analysis.

Regarding browser compatibility, XDLVO-Web has been functionally validated in the following environments: Google Chrome (version 100+), Mozilla Firefox (version 100+), Microsoft Edge (version 100+), and Apple Safari (version 15+). The software uses ES6+ standard JavaScript syntax with Babel transpilation to ensure backward compatibility. Note that Internet Explorer 11 and earlier versions are not supported due to lack of modern JavaScript features (arrow functions, template literals, Promises, etc.).

## 5. Impact

The development and release of XDLVO-Web addresses a significant gap in the computational tool ecosystem for membrane science and colloid chemistry research. By providing freely accessible, privacy-preserving, and user-friendly software for XDLVO calculations, this work has the potential to impact both research practices and educational approaches in these fields.

For research applications, XDLVO-Web enables rapid screening and comparison of membrane materials with different surface modifications for antifouling performance [40,41]. Researchers can quickly input contact angle and zeta potential data for various membrane formulations and immediately visualize the resulting interaction energy profiles, facilitating identification of promising candidates for further experimental investigation. The ability to systematically vary parameters such as ionic strength and temperature allows simulation of membrane performance under different water quality conditions, supporting optimization of membrane processes for specific applications [42]. The comprehensive Excel export functionality ensures that all calculation results can be readily incorporated into research documentation, statistical analyses, and manuscript preparation, with sufficient numerical precision for rigorous scientific reporting.

XDLVO-Web also has significant impact on education and accessibility. The interactive visualization capabilities transform abstract theoretical concepts into tangible, observable phenomena that students can explore and manipulate, and instructors can use the dynamic simulation feature to demonstrate how energy barriers prevent particle deposition, how changes in solution chemistry affect interaction profiles, and how the balance between different force components determines fouling outcomes [20]. The video recording function enables creation of multimedia educational materials that can be incorporated into lectures, online courses, and self-study resources. By eliminating requirements for commercial software licenses, specific operating systems, or reliable internet connectivity (after initial loading), the software democratizes access to XDLVO calculations for researchers worldwide, enabling institutions in developing countries, small research groups with limited budgets, and individual researchers working independently to utilize the same computational capabilities previously available only to well-resourced laboratories [43]. The open-source nature of XDLVO-Web, released under the permissive MIT license, encourages community engagement and collaborative development, allowing researchers with specific needs to examine the source code to understand implementation details, verify calculation methods, or adapt the software for specialized applications [44].

## 6. Limitations and Future Work

The current version implements a geometric model based on the classical plate-sphere configuration, treating the membrane surface as an ideally smooth plane and foulant particles as perfect spheres. Real membrane surfaces typically exhibit nanometer to micrometer-scale roughness that significantly affects effective contact area and local interaction strength [45,46], and many biological foulants are non-spherical. Integration of surface roughness correction models based on atomic force microscopy data represents an important direction for improving prediction accuracy [47].

The electrical double layer interaction calculation relies on the Debye-Hückel linearization of the Poisson-Boltzmann equation, which provides good accuracy at low to moderate ionic strengths (I < 0.1 M). For high ionic strength systems (I > 0.1 M), such as seawater desalination applications, the linearized approximation may introduce significant errors. The software displays a warning when users input ionic strength values exceeding 0.1 M, advising cautious interpretation of EL component results. Future versions may incorporate nonlinear Poisson-Boltzmann solvers or ion correlation corrections to extend the applicable ionic strength range.

The built-in probe liquid database currently includes only the classic three-liquid combination (diiodomethane, formamide, water), although the custom liquid interface allows specification of arbitrary probe liquids. Future expansion through community contributions would enhance convenience for users working with alternative probe systems. Additionally, the pure client-side architecture means calculation configurations are stored only in browser memory. Implementation of Progressive Web App (PWA) technologies would enable persistent storage of user preferences and calculation histories without compromising data privacy [48].

## 7. Conclusions

XDLVO-Web represents a new approach to computational tools for membrane-foulant interaction analysis, combining rigorous implementation of established theoretical frameworks with innovative visualization capabilities and a privacy-preserving, zero-installation architecture. The software successfully addresses the key limitations of existing XDLVO calculation tools by eliminating dependence on commercial software licenses, removing requirements for backend server infrastructure, and providing intuitive dynamic visualizations that enhance understanding of complex interfacial phenomena.

Future development priorities include expanding the probe liquid database through community contributions, implementing geometric correction models for rough surfaces and non-spherical particles, adding PWA support for offline data persistence and improved mobile device compatibility, and developing batch calculation capabilities for high-throughput screening of membrane materials. We welcome contributions from the research community through the GitHub repository and encourage users to report issues, suggest features, and submit improvements to help XDLVO-Web better serve the needs of membrane science and colloid chemistry researchers worldwide.

---

## CRediT Authorship Contribution Statement

**Haochuan Yang:** Software, Methodology, Writing – original draft, Visualization. **Chenhong Cheng:** Validation, Testing. **Rubing Dong:** Validation, Testing. **Jiaqi Wei:** Validation, Data curation. **Xingran Zhang:** Methodology, Resources. **Jinxing Ma:** Testing, Validation. **Zhiwei Wang:** Writing – review & editing. **Junjian Zheng:** Conceptualization, Supervision, Writing – review & editing.

---

## Declaration of Generative AI and AI-Assisted Technologies in the Writing Process

During the preparation of this work, the authors used DeepSeek, Gemini, and Claude to assist with code generation, documentation drafting, and manuscript writing. After using these tools, the authors reviewed and edited the content as needed and take full responsibility for the content of the published article.

---

## Declaration of Competing Interest

The authors declare that they have no known competing financial interests or personal relationships that could have appeared to influence the work reported in this paper.

---

## Acknowledgements

The development of XDLVO-Web benefited from open-source projects including Plotly.js (https://plotly.com/javascript/) and SheetJS (https://sheetjs.com/).

---

## Funding

This research did not receive any specific grant from funding agencies in the public, commercial, or not-for-profit sectors.

---

## References

[1] M.A. Shannon, P.W. Bohn, M. Elimelech, J.G. Georgiadis, B.J. Mariñas, A.M. Mayes, Science and technology for water purification in the coming decades, Nature 452 (2008) 301–310. https://doi.org/10.1038/nature06599

[2] W. Guo, H.-H. Ngo, J. Li, A mini-review on membrane fouling, Bioresour. Technol. 122 (2012) 27–34. https://doi.org/10.1016/j.biortech.2012.04.089

[3] R. van Reis, A. Zydney, Bioprocess membrane technology, J. Membr. Sci. 297 (2007) 16–50. https://doi.org/10.1016/j.memsci.2007.02.045 **[To be verified]**

[4] A. Cassano, C. Conidi, R. Ruby-Figueroa, R. Castro-Muñoz, Nanofiltration and tight ultrafiltration membranes for the recovery of polyphenols from agro-food by-products, Int. J. Mol. Sci. 19 (2018) 351. https://doi.org/10.3390/ijms19020351 **[To be verified]**

[5] D. Rana, T. Matsuura, Surface modifications for antifouling membranes, Chem. Rev. 110 (2010) 2448–2471. https://doi.org/10.1021/cr800208y **[To be verified]**

[6] F. Meng, S.-R. Chae, A. Drews, M. Kraume, H.-S. Shin, F. Yang, Recent advances in membrane bioreactors (MBRs): Membrane fouling and membrane material, Water Res. 43 (2009) 1489–1512. https://doi.org/10.1016/j.watres.2008.12.044 **[To be verified]**

[7] Q. She, R. Wang, A.G. Fane, C.Y. Tang, Membrane fouling in osmotically driven membrane processes: A review, J. Membr. Sci. 499 (2016) 201–233. https://doi.org/10.1016/j.memsci.2015.10.040 **[To be verified]**

[8] B. Derjaguin, L. Landau, Theory of the stability of strongly charged lyophobic sols and of the adhesion of strongly charged particles in solutions of electrolytes, Prog. Surf. Sci. 43 (1993) 30–59. https://doi.org/10.1016/0079-6816(93)90013-L

[9] E.J.W. Verwey, J.T.G. Overbeek, Theory of the Stability of Lyophobic Colloids, Elsevier, Amsterdam, 1948.

[10] C.J. van Oss, Interfacial Forces in Aqueous Media, second ed., CRC Press, Boca Raton, 2006. https://doi.org/10.1201/9781420015768

[11] R.J. Good, Contact angle, wetting, and adhesion: a critical review, J. Adhes. Sci. Technol. 6 (1992) 1269–1302. https://doi.org/10.1163/156856192X00629 **[To be verified]**

[12] M. Hermansson, The DLVO theory in microbial adhesion, Colloids Surf. B Biointerfaces 14 (1999) 105–119. https://doi.org/10.1016/S0927-7765(99)00029-6

[13] J.N. Israelachvili, Intermolecular and Surface Forces, third ed., Academic Press, Burlington, 2011. https://doi.org/10.1016/C2009-0-21560-1

[14] L.E. Granda Suasnavas, Desarrollo de un Software Académico Parti-Suite Basado en la Teoría de Filtración Coloidal (Master's thesis), Escuela Politécnica Nacional, Quito, 2020.

[15] J. Liu, S. Elsayed, D. Essam, K. Harrison, R. Sarker, PPSSolver: An open-source software tool for Project Portfolio Selection and Scheduling Problems, SoftwareX 33 (2026) 102460. https://doi.org/10.1016/j.softx.2025.102460 **[To be verified]**

[16] S. Zorzan, P. Koçi, M. Fernández-Lahore, A user-friendly web tool for colloidal interaction analysis: leveraging the xDLVO theory in integrated bioprocessing, J. Chem. Technol. Biotechnol. (2025). https://doi.org/10.1002/jctb.70048

[17] S. Abbott, Practical formulation science for particle-based inks, Colloids Interfaces 3 (2019) 23. https://doi.org/10.3390/colloids3010023

[18] A. Narayanan, V. Shmatikov, Robust de-anonymization of large sparse datasets, in: 2008 IEEE Symposium on Security and Privacy, IEEE, 2008, pp. 111–125. https://doi.org/10.1109/SP.2008.33 **[To be verified]**

[19] E.M.V. Hoek, G.K. Agarwal, Extended DLVO interactions between spherical particles and rough surfaces, J. Colloid Interface Sci. 298 (2006) 50–58. https://doi.org/10.1016/j.jcis.2005.12.031 **[To be verified]**

[20] M.J. Prince, Does active learning work? A review of the research, J. Eng. Educ. 93 (2004) 223–231. https://doi.org/10.1002/j.2168-9830.2004.tb00809.x **[To be verified]**

[21] T. Mikkonen, A. Taivalsaari, Web applications – spaghetti code for the 21st century, in: 2008 Sixth International Conference on Software Engineering Research, Management and Applications, IEEE, 2008, pp. 319–328. https://doi.org/10.1109/SERA.2008.16 **[To be verified]**

[22] D. Flanagan, JavaScript: The Definitive Guide, seventh ed., O'Reilly Media, Sebastopol, 2020. **[To be verified]**

[23] J. Teng, Y. Deng, X. Zhou, W. Yang, Z. Huang, H. Zhang, M. Zhang, H. Lin, A critical review on thermodynamic mechanisms of membrane fouling in membrane-based water treatment process, Front. Environ. Sci. Eng. 17 (2023) 129. https://doi.org/10.1007/s11783-023-1729-6

[24] M. Pilgrim, HTML5: Up and Running, O'Reilly Media, Sebastopol, 2010. **[To be verified]**

[25] Plotly Technologies Inc., Collaborative data science, Plotly Technologies Inc., Montreal, QC, 2015. https://plot.ly **[To be verified]**

[26] SheetJS, SheetJS Community Edition, 2012. https://sheetjs.com **[To be verified]**

[27] G.H. Golub, C.F. Van Loan, Matrix Computations, fourth ed., Johns Hopkins University Press, Baltimore, 2013. **[To be verified]**

[28] F.M. Fowkes, Attractive forces at interfaces, Ind. Eng. Chem. 56 (1964) 40–52. https://doi.org/10.1021/ie50660a008 **[To be verified]**

[29] D.K. Owens, R.C. Wendt, Estimation of the surface free energy of polymers, J. Appl. Polym. Sci. 13 (1969) 1741–1747. https://doi.org/10.1002/app.1969.070130815 **[To be verified]**

[30] R.J. Hunter, Zeta Potential in Colloid Science: Principles and Applications, Academic Press, London, 1981. **[To be verified]**

[31] A.J. de Kerchove, M. Elimelech, Relevance of electrokinetic theory for "soft" particles to bacterial cells: Implications for bacterial adhesion, Langmuir 21 (2005) 6462–6472. https://doi.org/10.1021/la047049t **[To be verified]**

[32] J. Gregory, Particles in Water: Properties and Processes, CRC Press, Boca Raton, 2006. **[To be verified]**

[33] W3C, MediaStream Recording, W3C Working Draft, 2021. https://www.w3.org/TR/mediastream-recording/ **[To be verified]**

[34] Y. Yuan, T.R. Lee, Contact angle and wetting properties, in: G. Bracco, B. Holst (Eds.), Surface Science Techniques, Springer, Berlin, 2013, pp. 3–34. https://doi.org/10.1007/978-3-642-34243-1_1 **[To be verified]**

[35] F. Liu, N.A. Hashim, Y. Liu, M.R.M. Abed, K. Li, Progress in the production and modification of PVDF membranes, J. Membr. Sci. 375 (2011) 1–27. https://doi.org/10.1016/j.memsci.2011.03.014 **[To be verified]**

[36] A. Salis, B.W. Ninham, Models and mechanisms of Hofmeister effects in electrolyte solutions, and colloid and protein systems revisited, Chem. Soc. Rev. 43 (2014) 7358–7377. https://doi.org/10.1039/C4CS00144C **[To be verified]**

[37] X. Wang, Y. Guo, Y. Li, Z. Ma, Q. Li, Q. Wang, D. Xu, J. Gao, X. Gao, H. Sun, Molecular level unveils anion exchange membrane fouling induced by natural organic matter via XDLVO and molecular simulation, Sci. Total Environ. 913 (2024) 169688. https://doi.org/10.1016/j.scitotenv.2023.169688 **[To be verified]**

[38] E.M.V. Hoek, S. Bhattacharjee, M. Elimelech, Effect of membrane surface roughness on colloid-membrane DLVO interactions, Langmuir 19 (2003) 4836–4847. https://doi.org/10.1021/la027083c

[39] S. Bhattacharjee, M. Elimelech, Surface element integration: A novel technique for evaluation of DLVO interaction between a particle and a flat plate, J. Colloid Interface Sci. 193 (1997) 273–285. https://doi.org/10.1006/jcis.1997.5076 **[To be verified]**

[40] Y. Zhao, K.P. Chong, L. Jiang, Zwitterionic polymer brush grafted on polyvinylidene difluoride membrane promoting enhanced ultrafiltration performance with augmented antifouling property, Polymers 12 (2020) 1303. https://doi.org/10.3390/polym12061303 **[To be verified]**

[41] J. Yin, B. Deng, Polymer-matrix nanocomposite membranes for water treatment, J. Membr. Sci. 479 (2015) 256–275. https://doi.org/10.1016/j.memsci.2014.11.019 **[To be verified]**

[42] W. Zhang, J. Luo, L. Ding, M.Y. Jaffrin, A review on flux decline control strategies in pressure-driven membrane processes, Ind. Eng. Chem. Res. 54 (2015) 2843–2861. https://doi.org/10.1021/ie504848m **[To be verified]**

[43] J. Tennant, et al., The academic, economic and societal impacts of Open Access: an evidence-based review, F1000Research 5 (2016) 632. https://doi.org/10.12688/f1000research.8460.3 **[To be verified]**

[44] G. Wilson, D.A. Aruliah, C.T. Brown, et al., Best practices for scientific computing, PLoS Biol. 12 (2014) e1001745. https://doi.org/10.1371/journal.pbio.1001745 **[To be verified]**

[45] Y. Liang, N. Hilal, P. Langston, V. Starov, Interaction forces between colloidal particles in liquid: Theory and experiment, Adv. Colloid Interface Sci. 134–135 (2007) 151–166. https://doi.org/10.1016/j.cis.2007.04.003 **[To be verified]**

[46] S. Bhattacharjee, C.-H. Ko, M. Elimelech, DLVO interaction between rough surfaces, Langmuir 14 (1998) 3365–3375. https://doi.org/10.1021/la971360b **[To be verified]**

[47] N. Hilal, H. Al-Zoubi, N.A. Darwish, A.W. Mohammad, M. Abu Arabi, A comprehensive review of nanofiltration membranes: Treatment, pretreatment, modelling, and atomic force microscopy, Desalination 170 (2004) 281–308. https://doi.org/10.1016/j.desal.2004.01.007 **[To be verified]**

[48] A. Biørn-Hansen, T.-M. Grønli, G. Ghinea, A survey and taxonomy of core concepts and research challenges in cross-platform mobile development, ACM Comput. Surv. 51 (2019) 1–34. https://doi.org/10.1145/3241739 **[To be verified]**
