---
title: 'XDLVO Theory Calculator: A Web-based Lightweight Analysis Tool for Membrane-Foulant Interactions'
tags:
  - JavaScript
  - XDLVO theory
  - membrane fouling
  - surface interaction
  - web application
  - colloid science
authors:
  - name: Haochuan Yang
    orcid: 0000-0000-0000-0000
    affiliation: 1
  - name: Collaborator Name
    orcid: 0000-0000-0000-0000
    affiliation: 2
    corresponding: true
affiliations:
  - name: School of Life and Environmental Sciences, Guilin University of Electronic Technology, China
    index: 1
  - name: Institution Name, Country
    index: 2
date: 17 December 2024
bibliography: paper.bib
---

# Summary

The extended Derjaguin-Landau-Verwey-Overbeek (XDLVO) theory is a fundamental physicochemical framework for analyzing microscopic interfacial interactions in membrane separation processes and predicting membrane fouling behavior[@vanOss1994]. To address the prevalent issues of commercial software dependency, data privacy risks, and lack of visualization capabilities in current computational tools, we developed XDLVO-Web—an open-source, lightweight, and fully client-side computational software. Utilizing standard web technologies (HTML5/JavaScript), the software directly solves nonlinear equation systems and integral formulas in the browser, completing the entire workflow from contact angle data input to surface energy components, Gibbs free energy, and total interaction energy calculations. By incorporating a physics engine and Canvas drawing technology, XDLVO-Web uniquely provides dynamic particle interaction simulation and experimental process recording capabilities. As a zero-installation, offline-capable tool with interactive visualization features, it offers researchers in environmental engineering and colloid chemistry an efficient, secure, and intuitive analysis platform.

# Statement of need

Membrane fouling is a critical bottleneck limiting the efficient application of membrane technology in water treatment, biopharmaceuticals, and food processing[@Shannon2008; @Guo2012]. To deeply understand and control membrane fouling, accurate analysis of microscopic interaction forces between membrane surfaces and colloidal particles or microorganisms is essential. The classical DLVO theory[@Derjaguin1941; @Verwey1948] only considers van der Waals forces (LW) and electrical double layer forces (EL), but in membrane separation systems with significant hydrophobicity/hydrophilicity, Lewis acid-base interaction forces (AB) often play a dominant role[@Hermansson1999]. Therefore, the extended XDLVO theory incorporating AB forces has become the gold standard in this field.

However, XDLVO theory calculations are tedious, involving the solution of extended Young-Dupré equation systems and complex interaction energy integrals, posing a high computational barrier for researchers. Despite the widespread application of XDLVO theory, the current computational tool ecosystem has significant gaps. Existing solutions fall into two main categories:

1. **Commercial software-based local programs**: Such as MATLAB-based Parti-Suite[@Granda2020], which are powerful but depend on expensive commercial licenses and bulky runtime environments, limiting their portability across different operating systems.

2. **Server-based web tools**: Such as the online calculator developed by Zorzan et al.[@Zorzan2025] and colloid science apps by Abbott[@Abbott2019]. While these tools require no installation, their computational logic depends on remote server support. This architecture not only requires constant network connectivity but also forces transmission of sensitive experimental data through servers, posing potential privacy leakage risks for research projects involving unpublished data or industrial secrets.

Furthermore, most of these tools only output static numerical values or energy-distance curves, lacking intuitive visualization of abstract physical concepts such as "energy barriers" and "force field equilibrium", which is unfavorable for beginners' understanding or teaching demonstrations.

Addressing these limitations, XDLVO-Web aims to fill the gap between lightweight design, privacy protection, and interactive visualization in existing tools. As a fully client-side software, it requires no backend server support, executing all computations directly in the user's browser, ensuring absolute data privacy and zero-latency response. Meanwhile, its built-in dynamic simulation module provides a new perspective for scientific verification and academic presentation.

# Mathematical Model and Technical Implementation

XDLVO-Web adopts a pure frontend technology stack, strictly following the core algorithms of interfacial chemical thermodynamics to solve surface tension (γ), Gibbs free energy (ΔG), and interaction energy (U).

## Surface Tension Calculation

The software first constructs a linear equation system using the extended Young-Dupré equation based on user-input contact angle data for three probe liquids (diiodomethane, formamide, deionized water):

$$\gamma_l(1+\cos\theta) = 2(\sqrt{\gamma_m^{LW}\gamma_l^{LW}} + \sqrt{\gamma_m^+\gamma_l^-} + \sqrt{\gamma_m^-\gamma_l^+})$$

where the Lewis acid-base component of surface tension is:

$$\gamma^{AB} = 2\sqrt{\gamma^+\gamma^-}$$

and the total surface tension is:

$$\gamma^{TOT} = \gamma^{LW} + \gamma^{AB}$$

To achieve high-precision solving without Python or MATLAB backends, the software includes a JavaScript-based linear algebra solving module, using Cramer's rule and Gaussian elimination to solve matrices locally in real-time.

## Gibbs Free Energy Calculation

After obtaining surface energy parameters, the system calculates unit area Gibbs free energy according to XDLVO theory:

$$\Delta G^{LW} = -2(\sqrt{\gamma_m^{LW}} - \sqrt{\gamma_w^{LW}})(\sqrt{\gamma_f^{LW}} - \sqrt{\gamma_w^{LW}})$$

$$\Delta G^{AB} = 2\sqrt{\gamma_w^-}[(\sqrt{\gamma_f^-} + \sqrt{\gamma_m^-} - \sqrt{\gamma_w^-}) + (\sqrt{\gamma_f^+} + \sqrt{\gamma_m^+} - \sqrt{\gamma_w^+})] - 2\sqrt{\gamma_f^-\gamma_m^+} - 2\sqrt{\gamma_f^+\gamma_m^-}$$

$$\Delta G^{EL} = \frac{\kappa\varepsilon_0\varepsilon_r}{2}(\zeta_m^2 + \zeta_f^2)[1 - \coth(\kappa h_0) + \frac{2\zeta_m\zeta_f}{\zeta_m^2 + \zeta_f^2}\text{csch}(\kappa h_0)]$$

$$\Delta G^{TOT} = \Delta G^{LW} + \Delta G^{AB} + \Delta G^{EL}$$

where h₀ is the minimum separation distance (0.158 nm), εᵣ is the relative permittivity of water, ε₀ is the vacuum permittivity, and ζ represents zeta potential.

## Interaction Energy Calculation

Interaction energy as a function of separation distance:

$$U^{LW}(h) = \frac{2\pi\Delta G^{LW}h_0^2\alpha}{h} \times 10^{-6}$$

$$U^{AB}(h) = 2\pi\alpha\lambda\Delta G^{AB}\exp\left(\frac{h_0-h}{\lambda}\right) \times 10^{-3}$$

$$U^{EL}(h) = \pi\varepsilon_0\varepsilon_r\alpha\left[\zeta_m\zeta_f\ln\left(\frac{1+e^{-\kappa h}}{1-e^{-\kappa h}}\right) + \frac{\zeta_m^2+\zeta_f^2}{2}\ln(1-e^{-2\kappa h})\right] \times 10^{4}$$

$$U^{TOT}(h) = U^{LW}(h) + U^{AB}(h) + U^{EL}(h)$$

where α is the apparent hydraulic radius of the foulant, and λ is the characteristic decay length of polar interactions (0.6 nm).

The inverse Debye length κ is dynamically calculated based on ionic strength and temperature:

$$\kappa = \sqrt{\frac{2N_Ae^2I}{\varepsilon_0\varepsilon_rkT}}$$

The relative permittivity of water εᵣ as a function of temperature T:

$$\varepsilon_r = 87.740 - 0.40008(T-273.15) + 9.398\times10^{-4}(T-273.15)^2 - 1.410\times10^{-6}(T-273.15)^3$$

## Visualization and Interaction

For efficient interactive experience and visualization, the software integrates the Plotly.js charting library and HTML5 Canvas drawing technology. The Canvas module introduces a simplified physics engine concept, calculating particle acceleration and trajectories in real-time based on the gradient of total interaction energy (i.e., force) at the current distance, achieving smooth animation rendering through requestAnimationFrame. Additionally, the software integrates the MediaRecorder API, supporting direct recording of dynamic simulation processes as WebM format videos.

# Application Scenarios and Features

XDLVO-Web is designed to serve a wide range of membrane technology research and teaching scenarios. In research applications, researchers can use its multi-parameter configuration panel to quickly input contact angle data and zeta potentials for different modified membrane materials. The software responds instantly and redraws energy curves, assisting in rapid screening of membrane materials with excellent anti-fouling performance. By adjusting ionic strength and temperature parameters, users can simulate dynamic changes in membrane fouling trends under different water quality environments.

The software provides comprehensive data export functionality. Generated Excel reports contain all input parameters, intermediate calculation results (surface tension, Gibbs free energy), and complete energy distribution data with precision retained to six decimal places, meeting the needs of high-precision scientific data post-processing.

In teaching demonstration scenarios, XDLVO-Web's interactive visualization module has unique advantages. Teachers can drag sliders to change distances, intuitively demonstrating to students how "energy barriers" prevent foulant deposition. The accompanying video recording function allows users to record these dynamic processes in "duration mode," "distance mode," or "static mode," transforming abstract colloid chemistry principles into visualized multimedia materials.

# Limitations and Future Development

Although XDLVO-Web has significant advantages in lightweight design, privacy protection, and interactive experience, as an early version of an open-source project, the software still has limitations. We have hosted the project source code on GitHub and sincerely invite community developers to participate in improvements:

1. **Probe Liquid Database Extension**: The current version has added a "custom liquid" interface, but the built-in preset library only includes the classic "three-liquid method" combination. We look forward to community contributors helping expand the built-in liquid database.

2. **Geometric Model Optimization**: The current computational kernel is based on the classical "plate-sphere" geometric assumption. Cutting-edge research shows that membrane surface roughness and foulant irregular shapes significantly affect XDLVO interaction energy[@Hoek2006]. We expect developers with relevant algorithmic backgrounds to assist in integrating complex geometric correction models based on surface morphology scanning data (such as AFM data).

3. **Data Persistence Improvement**: Given that this software adopts a "no-backend" pure client-side architecture, user calculation configurations only reside in browser temporary memory. We welcome the community to explore local storage optimization solutions based on IndexedDB or PWA technology.

# Conclusion

XDLVO-Web is an analysis tool integrating rigorous mathematical kernels, convenient interactive design, and powerful visualization capabilities. By adopting a pure client-side architecture, it successfully overcomes existing tools' dependence on runtime environments and data privacy concerns, achieving truly zero-barrier, zero-risk computation. Its unique dynamic physics simulation functionality provides a new dimension for analyzing membrane fouling mechanisms. Although the current version still has room for expansion in probe liquid libraries and geometric models, its open-source nature lays the foundation for continuous optimization. XDLVO-Web will rely on open-source community collaboration to continuously provide strong support for researchers in environmental engineering, materials science, and colloid chemistry, promoting the application and development of related theories in practical engineering.

# Acknowledgements

This research was supported by [Specific Fund Project Name and Number]. The development of XDLVO-Web benefited from the support of the following open-source projects: [Plotly.js](https://plotly.com/javascript/) for generating interactive scientific charts, and [SheetJS](https://sheetjs.com/) (xlsx) for implementing Excel data parsing and export. We express our sincere gratitude to the maintainers of these open-source tools.

# References
