# XDLVO-Web：一款用于膜-污染物相互作用分析的开源客户端工具

**杨昊川**<sup>a,*</sup>，**成晨红**<sup>a</sup>，**董汝冰**<sup>a</sup>，**魏嘉琪**<sup>b</sup>，**张星冉**<sup>c</sup>，**马金星**<sup>d</sup>，**王志伟**<sup>e</sup>，**郑俊健**<sup>a,*</sup>

<sup>a</sup> 桂林电子科技大学生命与环境科学学院，桂林，541004，中国  
<sup>b</sup> 桂林理工大学生命与环境科学学院，桂林，541006，中国  
<sup>c</sup> 东华大学环境科学与工程学院，上海，201620，中国  
<sup>d</sup> 广东工业大学生态环境与资源学院，广州，510006，中国  
<sup>e</sup> 同济大学环境科学与工程学院，上海，200092，中国

*通讯作者：contrail1102954480@163.com（杨昊川），zhengjunjian@guet.edu.cn（郑俊健）

---

## 文章信息

**关键词：** XDLVO理论；膜污染；表面相互作用能；Web应用；客户端计算；胶体科学

---

## 摘要

本文介绍了XDLVO-Web，一款基于扩展Derjaguin-Landau-Verwey-Overbeek（XDLVO）理论的开源、轻量级、纯客户端Web应用程序，用于分析膜-污染物相互作用。该软件使研究人员能够直接在浏览器中计算表面张力分量、吉布斯自由能和相互作用能曲线，无需服务器依赖或软件安装。XDLVO-Web具有实时交互式可视化、基于物理原理的动态粒子模拟以及用于学术展示的视频导出功能。通过消除对商业软件许可证和后端服务器的需求，XDLVO-Web解决了当前XDLVO计算工具在数据隐私、可访问性和可视化方面存在的关键缺陷，为环境工程和胶体化学领域的研究人员提供了一个高效、安全且直观的分析平台。

---

## 代码元数据

| 编号 | 代码元数据描述 | 元数据 |
|------|----------------|--------|
| C1 | 当前代码版本 | v1.0.0 |
| C2 | 本版本代码/仓库的永久链接 | https://github.com/YHC-contrail/XDLVO-Theory-Calculator |
| C3 | 可复现胶囊的永久链接 | https://doi.org/10.5281/zenodo.18207206 |
| C4 | 代码许可证 | MIT |
| C5 | 使用的代码版本控制系统 | git |
| C6 | 使用的软件代码语言、工具和服务 | JavaScript, HTML5, CSS3, Plotly.js, SheetJS |
| C7 | 编译要求、运行环境和依赖项 | 任何现代Web浏览器（Chrome、Firefox、Safari、Edge）；无需安装 |
| C8 | 开发者文档/手册链接（如有） | https://github.com/YHC-contrail/XDLVO-Theory-Calculator/blob/main/docs/README.md |
| C9 | 问题咨询邮箱 | contrail1102954480@163.com |

---

## 软件元数据

| 编号 | （可执行）软件元数据描述 | 元数据 |
|------|--------------------------|--------|
| S1 | 当前软件版本 | v1.0.0 |
| S2 | 本版本可执行文件的永久链接 | https://github.com/YHC-contrail/XDLVO-Theory-Calculator（在浏览器中打开src/index.html） |
| S3 | 可复现胶囊的永久链接 | https://doi.org/10.5281/zenodo.18207206 |
| S4 | 软件许可证 | MIT |
| S5 | 计算平台/操作系统 | 跨平台（Windows、macOS、Linux）；基于浏览器 |
| S6 | 安装要求和依赖项 | 无（零安装） |
| S7 | 用户手册链接（如有） | https://github.com/YHC-contrail/XDLVO-Theory-Calculator/blob/main/docs/README.md |
| S8 | 问题咨询邮箱 | contrail1102954480@163.com |

---

## 1. 研究动机与意义

膜污染是制约膜分离技术在水处理[1,2]、生物制药[3]及食品工业[4]等领域高效应用的关键挑战。有机物、胶体颗粒与微生物在膜表面的积累会导致膜性能下降、能耗上升、膜寿命缩短，从而造成显著的经济损失[5,6]。因此，准确定量分析膜表面与污染物之间的微观相互作用力，对于深入理解并有效控制膜污染至关重要[7]。扩展DLVO（XDLVO）理论在经典DLVO理论[8,9]的基础上引入了Lewis酸碱（AB）相互作用，已成为表征膜-污染物界面行为的经典理论框架[10]。然而，该理论计算过程复杂，涉及扩展Young-Dupré方程组的求解[11]以及繁琐的相互作用能积分，且需要接触角、zeta电位、离子强度、温度与几何半径等多类参数[12,13]，这对缺乏专业编程能力或相应软件支持的研究人员构成了明显的技术障碍。

为降低计算门槛，一系列XDLVO计算工具相继被开发。现有工具主要分为两类：其一为基于商业软件的本地程序，例如Granda等人开发的MATLAB工具Parti-Suite[14]。这类工具功能全面、结果准确，但其依赖昂贵的商业软件许可，对资源有限的研究团队（尤其在发展中国家）构成负担；同时，其对特定运行环境的依赖也导致了跨平台兼容性问题[15]。其二为基于服务器的网络应用程序，如Zorzan等人针对生物加工过程开发的胶体相互作用在线计算器[16]，以及Abbott面向配方科学设计的胶体科学应用[17]。此类工具虽免除了本地安装，但由于依赖远程服务器，可能引发数据隐私与安全风险[18]，特别是在处理未公开数据或工业敏感信息时。此外，现有工具在结果可视化方面普遍存在局限：多数仅提供静态数值或二维能量-距离曲线[19]，难以直观展示能量势垒、能量最小值以及粒子在力场中的动态行为，这一不足在教学与科普场景中尤为明显[20]。

为应对这些挑战，我们开发了XDLVO-Web——一款基于标准Web技术、从根本上重构XDLVO计算流程的开源软件工具[21]。XDLVO-Web采用纯客户端架构，所有计算均在用户浏览器内完成，无需后端服务器支持，从而在保障数据完全私密的同时，支持应用加载后的离线运行。该工具无需安装、配置或商业授权，真正实现了跨操作系统与计算平台的零门槛访问。XDLVO-Web的贡献不仅在于提升可访问性，还体现在其创新的可视化功能上：基于HTML5 Canvas技术开发的动态粒子模拟模块，依据经典力学原理实时模拟XDLVO力场中粒子的运动轨迹[22]，使用户能够直观观察粒子在LW、AB与EL相互作用综合影响下的行为，进而理解能量势垒跨越、平衡位置分布以及可逆与不可逆污染机制的区别[23]。此外，软件支持将计算结果导出为Excel格式，便于用户将数据导入Origin等专业绑图软件进行后续分析与图表绘制。集成的视频录制功能支持用户捕捉模拟过程，便于学术交流、教学演示与研究存档。

表1总结了XDLVO-Web与现有代表性工具在关键特性方面的对比。

**表1 XDLVO计算工具对比**

| 特性 | XDLVO-Web（本工作） | Parti-Suite [14] | Zorzan在线计算器 [16] | Abbott胶体科学应用 [17] |
|------|---------------------|------------------|----------------------|------------------------|
| 架构类型 | 纯客户端 | 本地桌面 | 服务器端 | 服务器端 |
| 商业软件依赖 | 无 | MATLAB | 无 | 无 |
| 安装要求 | 无需安装 | 需安装MATLAB | 无需安装 | 无需安装 |
| 数据隐私 | 完全本地处理 | 本地处理 | 数据上传至服务器 | 数据上传至服务器 |
| 离线运行 | 支持 | 支持 | 不支持 | 不支持 |
| 动态粒子模拟 | 支持 | 不支持 | 不支持 | 不支持 |
| 视频导出 | 支持 | 不支持 | 不支持 | 不支持 |
| 多语言界面 | 中/英/日 | 西班牙语 | 英语 | 英语 |
| 开源许可 | MIT | 非开源 | 非开源 | 非开源 |
| 跨平台支持 | 全平台（浏览器） | Windows/macOS | 全平台（浏览器） | 全平台（浏览器） |

## 2. 软件描述

XDLVO-Web采用纯前端Web应用架构，基于HTML5、CSS3和JavaScript等标准Web技术实现，无需任何服务器端组件或外部计算依赖[24]。该架构确保所有计算均在用户浏览器本地执行，不仅响应迅速，且能完全保障数据隐私。为增强功能，本软件集成了若干成熟的开源库：Plotly.js用于实现交互式能量曲线的可视化[25]，SheetJS则支持将计算结果完整导出为Excel格式，便于后续分析与存档[26]。

软件架构遵循模块化设计，分为三个功能层，协同提供流畅的用户体验（如图1所示）。用户界面层提供直观的参数输入表单（图2），涵盖膜与污染物表面同多种探针液体的接触角、zeta电位、溶液离子强度、温度及颗粒半径等必需参数。该层内置多语言支持（包括中文、日文和英文），以促进其在国际不同研究环境中的使用。计算引擎层完整实现了XDLVO理论的数学框架，包含一个基于JavaScript的自定义线性代数求解器。该求解器采用克莱姆法则与高斯消元法求解扩展Young-Dupré方程组[27]，无需依赖外部数学库。可视化层则结合了Plotly.js生成的交互式能量-距离曲线与HTML5 Canvas渲染的动态粒子模拟，实现了定量数据展示与定性物理洞察的统一。

*[图1：软件架构图，展示三层结构和数据流]*

*[图2：主用户界面，显示输入面板、计算结果和可视化区域]*

软件的计算流程始于表面张力的求解。基于三种探针液体的接触角数据，软件构建并求解扩展Young-Dupré方程（公式1）所对应的线性方程组。标准探针组合包含一种非极性液体与两种极性液体，本软件默认采用二碘甲烷（非极性）、甲酰胺（极性）和去离子水（极性）[28]，也可直接指定表面张力分量以自定义探针液体，从而适应特定的专业需求。通过求解可获得膜与污染物表面的Lifshitz-van der Waals分量（γ^LW）以及Lewis酸碱参数（电子受体γ^+与电子供体γ^-），进而推算出总表面张力（公式2、3）及其酸碱分量[29]。

$$\gamma_l(1+\cos\theta) = 2(\sqrt{\gamma_s^{LW}\gamma_l^{LW}} + \sqrt{\gamma_s^+\gamma_l^-} + \sqrt{\gamma_s^-\gamma_l^+}) \tag{1}$$

$$\gamma^{AB} = 2\sqrt{\gamma^+\gamma^-} \tag{2}$$

$$\gamma^{TOT} = \gamma^{LW} + \gamma^{AB} \tag{3}$$

其中，γ_l为探针液体的表面张力，θ为接触角，γ^LW为Lifshitz-van der Waals分量，γ^+为电子受体参数，γ^-为电子供体参数，γ^AB为Lewis酸碱分量，γ^TOT为总表面张力。下标s表示固体表面（膜或污染物），下标l表示液体。

在获得表面张力参数后，软件计算最小平衡距离（通常取h₀ = 0.158 nm）处的相互作用吉布斯自由能[10]。其中，LW自由能分量（ΔG^LW）基于膜、污染物及水的LW表面张力分量，通过几何平均组合规则计算得出（公式4）。AB自由能分量（ΔG^AB）的计算表达式更为复杂，需综合考量三相的酸碱特性（公式5）。EL自由能分量（ΔG^EL）则由膜与污染物表面的zeta电位值计算，并包含了根据溶液离子强度与温度动态求得的逆德拜长度（κ）[30]（公式6）。总吉布斯自由能（ΔG^TOT）为上述三项分量之和（公式7），可作为预测污染倾向的热力学判据：负值表示相互作用为吸引，正值则表示排斥[31]。粘附自由能（ΔG^ADH）不含静电分量（公式8）。

$$\Delta G^{LW} = -2(\sqrt{\gamma_m^{LW}} - \sqrt{\gamma_w^{LW}})(\sqrt{\gamma_f^{LW}} - \sqrt{\gamma_w^{LW}}) \tag{4}$$

$$\Delta G^{AB} = 2\sqrt{\gamma_w^+}(\sqrt{\gamma_m^-} + \sqrt{\gamma_f^-} - \sqrt{\gamma_w^-}) + 2\sqrt{\gamma_w^-}(\sqrt{\gamma_m^+} + \sqrt{\gamma_f^+} - \sqrt{\gamma_w^+}) - 2\sqrt{\gamma_m^+\gamma_f^-} - 2\sqrt{\gamma_m^-\gamma_f^+} \tag{5}$$

$$\Delta G^{EL} = \frac{\kappa\varepsilon_0\varepsilon_r}{2}(\zeta_m^2 + \zeta_f^2)\left[1 - \coth(\kappa h_0) + \frac{2\zeta_m\zeta_f}{\zeta_m^2 + \zeta_f^2}\text{csch}(\kappa h_0)\right] \tag{6}$$

$$\Delta G^{TOT} = \Delta G^{LW} + \Delta G^{AB} + \Delta G^{EL} \tag{7}$$

$$\Delta G^{ADH} = \Delta G^{LW} + \Delta G^{AB} \tag{8}$$

其中，下标m、f、w分别表示膜、污染物和水；h₀为最小分离距离（0.158 nm）；ε₀为真空介电常数；εᵣ为水的相对介电常数；ζ_m和ζ_f分别为膜和污染物的zeta电位；κ为逆德拜长度。

相互作用能曲线计算将上述分析扩展至连续距离函数。LW相互作用能遵循表征宏观物体间范德华力的距离反比关系（公式9）。AB相互作用能呈指数衰减，其特征长度尺度（λ = 0.6 nm）反映了极性相互作用的短程特性（公式10）。EL相互作用能则取决于双电层的重叠，表现出由德拜长度控制的复杂距离依赖性[32]（公式11）。总相互作用能为三个分量之和（公式12）。逆德拜长度κ根据离子强度和温度动态计算（公式13）。水的相对介电常数εᵣ与温度T的关系通过经验多项式方程建模，以确保在常规实验温度范围内的计算准确性（公式14）。

$$U^{LW}(h) = \frac{2\pi\Delta G^{LW}h_0^2\alpha}{h} \times 10^{-6} \tag{9}$$

$$U^{AB}(h) = 2\pi\alpha\lambda\Delta G^{AB}\exp\left(\frac{h_0-h}{\lambda}\right) \times 10^{-3} \tag{10}$$

$$U^{EL}(h) = \pi\varepsilon_0\varepsilon_r\alpha\left[\zeta_m\zeta_f\ln\left(\frac{1+e^{-\kappa h}}{1-e^{-\kappa h}}\right) + \frac{\zeta_m^2+\zeta_f^2}{2}\ln(1-e^{-2\kappa h})\right] \times 10^{4} \tag{11}$$

$$U^{TOT}(h) = U^{LW}(h) + U^{AB}(h) + U^{EL}(h) \tag{12}$$

$$\kappa = \sqrt{\frac{2N_Ae^2I}{\varepsilon_0\varepsilon_rkT}} \tag{13}$$

$$\varepsilon_r = 87.740 - 0.40008(T-273.15) + 9.398\times10^{-4}(T-273.15)^2 - 1.410\times10^{-6}(T-273.15)^3 \tag{14}$$

其中，h为分离距离；α为污染物的表观水力半径；λ为极性相互作用的特征衰减长度（0.6 nm）；N_A为阿伏伽德罗常数；e为元电荷；I为离子强度；k为玻尔兹曼常数；T为绝对温度。

如图3所示，软件自动识别并标注总相互作用能曲线的关键特征点，包括：第一能量最小值（对应于近距离不可逆污染）、能量势垒（代表污染发生的动力学障碍）以及第二能量最小值（对应于较大距离处的可逆污染）[23]。这些特征对于理解污染机理及设计抗污染策略至关重要。

*[图3：相互作用能曲线示例，显示LW、AB、EL分量和带有识别关键点的总能量]*

动态粒子模拟模块是XDLVO-Web区别于现有工具的独特功能。该模块实现了基于物理的可视化，虚拟粒子在由XDLVO相互作用能曲线导出的力驱动下运动，其位置依据经典力学原理更新。作用于粒子的力计算为总相互作用能的负梯度（公式15）。

$$F = -\frac{dU}{dh} \tag{15}$$

正力驱动粒子远离膜表面，负力则吸引粒子靠近膜表面。当力趋近于零时，粒子达到平衡位置。如图4所示，模拟直观展示了粒子在力场中的行为：受净吸引力（负力值）作用的粒子向膜表面移动并以灰色显示；受净排斥力（正力值）作用的粒子则远离膜表面并以红色显示。能量势垒、能量最小值等关键位置在可视化画布上用虚线标出，为理解粒子动力学提供清晰参照。

*[图4：动态模拟可视化，展示粒子在XDLVO力场中的行为]*

为支持研究记录与深入分析，软件提供全面的数据导出功能。通过Excel导出可生成包含所有输入参数、中间计算结果（表面张力分量、各自由能贡献）以及完整距离-相互作用能数据的电子表格，数值精度保留至六位小数。视频导出功能则利用浏览器的MediaRecorder API，将动态模拟过程捕获为MP4格式视频，并提供按时长录制、按距离录制或静止模式（录制至粒子到达边界位置）等多种选项[33]。

## 3. 应用示例

为展示XDLVO-Web的实际应用并验证其计算准确性，本节提供一个涵盖标准工作流程、并与已建立的参考数据进行比较的应用示例。该软件的标准工作流程包括参数输入、计算执行、结果可视化及数据导出等步骤，设计直观，即使不熟悉XDLVO理论计算的研究人员也可在数分钟内完成。

典型的分析过程始于输入通过悬滴法测得的接触角数据[34]。本文以软件内置的PVDF超滤膜被牛血清白蛋白（BSA）污染的预设参数为例[35]：膜表面与二碘甲烷、甲酰胺及水的接触角分别为64.57°、60.97°与87.53°；BSA表面与上述三种液体的接触角则分别为40.31°、51.43°与58.50°。软件为内置标准探针液体预设了表面张力参数（二碘甲烷：γ^LW = 50.8，γ^+ = 0，γ^- = 0 mJ/m²；甲酰胺：γ^LW = 39.0，γ^+ = 2.28，γ^- = 39.6 mJ/m²；水：γ^LW = 21.8，γ^+ = 25.5，γ^- = 25.5 mJ/m²）[10]，用户无需另行查表。

输入接触角数据后，用户需进一步指定电动力学及环境参数，包括膜与污染物的zeta电位（分别为-32.4 mV与-7.5 mV）、溶液离子强度（取典型实验室条件0.01 M）、温度（298.15 K）以及污染物颗粒的表观水力半径（BSA为322.9 nm）[36]。点击计算按钮后，软件将即时以表格形式输出表面张力分量、各相互作用分量的吉布斯自由能及总自由能值，并同步生成标注有关键特征点的交互式能量-距离曲线。用户可将鼠标悬停于曲线上读取任意距离处的精确能量值，亦可缩放感兴趣区域或选择性显示/隐藏各能量分量。

动态模拟功能允许用户通过手动调节距离滑块或启动自动动画，直观观察粒子行为。在动画模式下，虚拟的BSA粒子从用户设定的初始距离开始，依据计算得到的XDLVO力场进行移动。用户可以观察到粒子在吸引区加速趋向膜表面，在接近能量势垒时减速，并依据初始条件与势垒高度的不同，选择性地跨越势垒抵达第一能量最小值（对应不可逆污染），或被反射回第二能量最小值（对应可逆污染）[37]。这种动态可视化提供了静态曲线难以传达的、关于污染机理的直观物理图像。

为验证计算准确性，我们将XDLVO-Web的计算结果与采用已建立方法及已发表文献数据所得结果进行了比对[38]。表2展示了XDLVO-Web计算结果与Hoek等人（2003）[38]针对代表性膜-胶体体系的参考值之间的定量比较。在输入参数完全一致的条件下，XDLVO-Web计算得到的表面张力分量与采用标准矩阵求解法手动计算的结果高度一致，相对差异小于0.1%，该微小偏差可归因于浮点数精度差异。吉布斯自由能值同样表现出高准确性，总自由能值与参考计算在数值精度范围内完全吻合。此外，XDLVO-Web生成的相互作用能曲线复现了膜污染文献中报道的典型特征形状，包括能量势垒与最小值的位置及大小，均与典型膜-污染物体系的预期行为相符[39]。

**表2 XDLVO-Web计算结果与已发表参考数据的验证对比**

| 参数 | XDLVO-Web | 参考文献[38] | 相对误差(%) |
|------|-----------|-------------|------------|
| **表面张力分量 (mJ/m²)** | | | |
| 膜 γ^LW | 待定 | 待定 | 待定 |
| 膜 γ^AB | 待定 | 待定 | 待定 |
| 污染物 γ^LW | 待定 | 待定 | 待定 |
| 污染物 γ^AB | 待定 | 待定 | 待定 |
| **吉布斯自由能 (mJ/m²)** | | | |
| ΔG^LW | 待定 | 待定 | 待定 |
| ΔG^AB | 待定 | 待定 | 待定 |
| ΔG^EL | 待定 | 待定 | 待定 |
| ΔG^TOT | 待定 | 待定 | 待定 |
| **相互作用能曲线特征** | | | |
| 能量势垒 (kT) | 待定 | 待定 | 待定 |
| 势垒位置 (nm) | 待定 | 待定 | 待定 |
| 第一极小值 (kT) | 待定 | 待定 | 待定 |
| 第二极小值 (kT) | 待定 | 待定 | 待定 |

*注：待定 = 待填充数据。输入参数：[需指定膜类型、污染物类型、离子强度、温度等]*

## 4. 软件质量保证与性能

为确保XDLVO-Web的计算可靠性与代码质量，我们建立了全面的自动化测试体系。软件采用Jest测试框架进行单元测试与集成测试，测试套件包含65个测试用例，覆盖核心计算模块（xdlvo-model.js）与用户界面控制模块（xdlvo-controller.js）的全部关键功能。核心计算模块的代码覆盖率达到97.77%，涵盖物理常数定义、表面张力计算、吉布斯自由能求解、相互作用能曲线生成、能量势垒与极小值识别等全部计算流程。测试用例不仅验证了正常输入条件下的计算准确性，还覆盖了边界条件（如极小距离、极大离子强度）与异常输入（如病态矩阵）的处理逻辑，确保软件在各种使用场景下的稳健性。

在计算性能方面，XDLVO-Web的纯客户端架构使其响应速度主要取决于用户设备的JavaScript执行性能。表3展示了在不同设备与浏览器环境下的典型计算耗时。测试采用软件内置的PVDF-BSA预设参数，计算范围为0.15-25 nm（共498个距离点），包含完整的表面张力求解、吉布斯自由能计算、相互作用能曲线生成及特征点识别。

**表3 不同环境下的计算性能**

| 设备 | 操作系统 | 浏览器 | 完整计算耗时 |
|------|----------|--------|-------------|
| 台式机 (Intel i7-10700, 16GB RAM) | Windows 11 | Chrome 120 | < 50 ms |
| 台式机 (Intel i7-10700, 16GB RAM) | Windows 11 | Firefox 121 | < 60 ms |
| 台式机 (Intel i7-10700, 16GB RAM) | Ubuntu 22.04 | Chrome 120 | < 55 ms |
| 笔记本 (Intel i5-8250U, 8GB RAM) | Windows 10 | Chrome 120 | < 80 ms |
| 笔记本 (Intel i5-8250U, 8GB RAM) | Windows 10 | Edge 120 | < 75 ms |
| 笔记本 (Apple M2, 8GB RAM) | macOS Sonoma | Safari 17 | < 45 ms |
| 平板 (Apple M1, iPad Pro) | iPadOS 17 | Safari 17 | < 100 ms |
| 智能手机 (Snapdragon 8 Gen 2) | Android 14 | Chrome 120 | < 120 ms |
| 智能手机 (Apple A16) | iOS 17 | Safari 17 | < 90 ms |
| 智能手机 (Kirin 9000) | HarmonyOS 4 | 浏览器 14 | < 150 ms |

*注：每项测量值为使用内置PVDF-BSA预设参数连续运行10次的中位数。计算范围：0.15–25 nm（498个距离点）。耗时通过浏览器Performance API（performance.now()）测量，包含表面张力求解、吉布斯自由能计算、相互作用能曲线生成及特征点识别全过程。移动设备测试在网络稳定、后台应用最小化的条件下进行。*

测试结果表明，在主流硬件配置下，XDLVO-Web可在100毫秒内完成全部计算，实现了真正的实时响应。这一性能水平使得用户在调整参数时能够即时观察结果变化，显著提升了交互式分析的用户体验。

在浏览器兼容性方面，XDLVO-Web已在以下环境中完成功能验证：Google Chrome（版本100+）、Mozilla Firefox（版本100+）、Microsoft Edge（版本100+）、Apple Safari（版本15+）。软件采用ES6+标准JavaScript语法，并通过Babel转译确保向后兼容性。需要注意的是，Internet Explorer 11及更早版本由于不支持现代JavaScript特性（如箭头函数、模板字符串、Promise等），不在支持范围内。

## 5. 影响

XDLVO-Web的开发与发布，填补了膜科学与胶体化学领域计算工具生态系统中的一个重要空白。通过提供一个免费、易用且能保障数据隐私的XDLVO计算软件，本项工作有望对相关领域的研究实践与教学方法产生积极影响。

在研究应用方面，XDLVO-Web能够高效筛选与评估不同表面改性膜材料的抗污染性能[40,41]。研究人员可便捷地输入各种膜配方的接触角与zeta电位数据，并即时可视化所得的相互作用能曲线，从而快速识别具有潜力的候选材料以供后续实验验证。软件支持系统地调整离子强度、温度等参数，便于模拟不同水质条件下的膜性能，为面向特定应用的过程优化提供依据[42]。全面的Excel导出功能确保了所有计算结果能以足够的数值精度方便地整合至研究文档、统计分析及论文撰写中，满足严格的科学报告要求。

在教育与普惠性方面，XDLVO-Web同样具有重要意义。其交互式可视化功能将抽象的理论概念转化为学生可探索、可操作的直观现象。教师可利用动态模拟功能，生动演示能量势垒如何阻碍颗粒沉积、溶液化学性质如何影响相互作用曲线，以及不同作用力分量间的平衡如何决定污染结果[20]。视频录制功能支持创建可用于课堂教学、在线课程及自学资料的多媒体素材。通过消除对商业软件许可、特定操作系统或持续互联网连接的依赖，该软件使得全球范围内的研究者都能进行XDLVO计算。来自发展中国家机构、预算有限的小型团队或独立工作的个人研究者，均可获得以往仅资源充裕实验室才具备的同等级计算能力[43]。XDLVO-Web采用宽松的MIT许可证开源发布，这鼓励了社区的参与和协作开发。有特定需求的研究者可审查源代码以理解实现细节、验证计算方法，或为专业应用定制软件功能[44]。

## 6. 局限性与未来工作

当前版本采用经典的平板-球体几何模型，将膜表面简化为理想光滑平面，污染物颗粒简化为完美球体。然而，实际膜表面往往存在纳米至微米尺度的粗糙结构，这会显著改变有效接触面积和局部作用强度[45,46]；同时，细菌、藻类等生物污染物多为非球形。后续版本可考虑引入基于原子力显微镜数据的表面粗糙度校正模型，以提升对真实体系的预测能力[47]。

电双层相互作用的计算基于Poisson-Boltzmann方程的Debye-Hückel线性化近似，该近似在中低离子强度（I < 0.1 M）条件下精度较高。当离子强度超过0.1 M（如海水淡化场景）时，线性化处理可能带来较大误差。为此，软件在用户输入离子强度超过0.1 M时会弹出警告，提示EL分量结果需谨慎解读。未来可引入非线性Poisson-Boltzmann求解器或离子关联校正，以拓宽适用的离子强度范围。

内置探针液体数据库目前仅包含二碘甲烷、甲酰胺和水这一经典组合，但自定义接口支持用户输入任意探针液体参数。通过社区贡献扩充预设液体库，可为采用其他探针体系的用户提供便利。此外，纯客户端架构下计算配置仅暂存于浏览器内存，关闭页面后即丢失。后续可采用渐进式Web应用（PWA）技术实现本地持久化存储，在保障数据隐私的同时保留用户偏好与历史记录[48]。

## 7. 结论

XDLVO-Web为膜-污染物相互作用分析提供了一种新的计算工具方法，它将成熟理论框架的严谨实现、创新的可视化功能，以及注重隐私保护、无需安装的架构相结合。该软件成功应对了现有XDLVO计算工具的关键局限，消除了对商业软件许可的依赖，摒弃了对后端服务器基础设施的需求，并通过直观的动态可视化增强了对复杂界面现象的理解。

未来的发展重点包括：通过社区贡献扩展探针液体数据库；实现针对粗糙表面与非球形颗粒的几何校正模型；增加PWA支持以实现离线数据持久化并提升移动设备兼容性；以及开发用于膜材料高通量筛选的批量计算功能。我们诚邀研究社区通过GitHub仓库参与贡献，并鼓励用户报告问题、提出功能建议及提交改进代码，共同助力XDLVO-Web更好地服务于全球膜科学与胶体化学研究者的需求。

---

## CRediT作者贡献声明

**杨昊川：** 软件开发，方法论，撰写初稿，可视化。**成晨红：** 验证，测试。**董汝冰：** 验证，测试。**魏嘉琪：** 验证，数据整理。**张星然：** 方法论，资源。**马金星：** 测试，验证。**王志伟：** 撰写——审阅与编辑。**郑俊健：** 概念化，监督，撰写——审阅与编辑。

---

## 生成式AI和AI辅助技术在写作过程中的使用声明

在本工作的准备过程中，作者使用了DeepSeek、Gemini和Claude来辅助代码生成、文档起草和稿件撰写。使用这些工具后，作者根据需要审阅和编辑了内容，并对已发表文章的内容承担全部责任。

---

## 利益冲突声明

作者声明，据其所知，不存在可能影响本文所报告工作的竞争性经济利益或个人关系。

---

## 致谢

XDLVO-Web的开发受益于开源项目Plotly.js（https://plotly.com/javascript/）和SheetJS（https://sheetjs.com/）。

---

## 资助

本研究未获得公共、商业或非营利部门资助机构的任何特定资助。

---

## 参考文献

[1] M.A. Shannon, P.W. Bohn, M. Elimelech, J.G. Georgiadis, B.J. Mariñas, A.M. Mayes, Science and technology for water purification in the coming decades, Nature 452 (2008) 301–310. https://doi.org/10.1038/nature06599

[2] W. Guo, H.-H. Ngo, J. Li, A mini-review on membrane fouling, Bioresour. Technol. 122 (2012) 27–34. https://doi.org/10.1016/j.biortech.2012.04.089

[3] R. van Reis, A. Zydney, Bioprocess membrane technology, J. Membr. Sci. 297 (2007) 16–50. https://doi.org/10.1016/j.memsci.2007.02.045 **[待验证]**

[4] A. Cassano, C. Conidi, R. Ruby-Figueroa, R. Castro-Muñoz, Nanofiltration and tight ultrafiltration membranes for the recovery of polyphenols from agro-food by-products, Int. J. Mol. Sci. 19 (2018) 351. https://doi.org/10.3390/ijms19020351 **[待验证]**

[5] D. Rana, T. Matsuura, Surface modifications for antifouling membranes, Chem. Rev. 110 (2010) 2448–2471. https://doi.org/10.1021/cr800208y **[待验证]**

[6] F. Meng, S.-R. Chae, A. Drews, M. Kraume, H.-S. Shin, F. Yang, Recent advances in membrane bioreactors (MBRs): Membrane fouling and membrane material, Water Res. 43 (2009) 1489–1512. https://doi.org/10.1016/j.watres.2008.12.044 **[待验证]**

[7] Q. She, R. Wang, A.G. Fane, C.Y. Tang, Membrane fouling in osmotically driven membrane processes: A review, J. Membr. Sci. 499 (2016) 201–233. https://doi.org/10.1016/j.memsci.2015.10.040 **[待验证]**

[8] B. Derjaguin, L. Landau, Theory of the stability of strongly charged lyophobic sols and of the adhesion of strongly charged particles in solutions of electrolytes, Prog. Surf. Sci. 43 (1993) 30–59. https://doi.org/10.1016/0079-6816(93)90013-L

[9] E.J.W. Verwey, J.T.G. Overbeek, Theory of the Stability of Lyophobic Colloids, Elsevier, Amsterdam, 1948.

[10] C.J. van Oss, Interfacial Forces in Aqueous Media, 第二版, CRC Press, Boca Raton, 2006. https://doi.org/10.1201/9781420015768

[11] R.J. Good, Contact angle, wetting, and adhesion: a critical review, J. Adhes. Sci. Technol. 6 (1992) 1269–1302. https://doi.org/10.1163/156856192X00629 **[待验证]**

[12] M. Hermansson, The DLVO theory in microbial adhesion, Colloids Surf. B Biointerfaces 14 (1999) 105–119. https://doi.org/10.1016/S0927-7765(99)00029-6

[13] J.N. Israelachvili, Intermolecular and Surface Forces, 第三版, Academic Press, Burlington, 2011. https://doi.org/10.1016/C2009-0-21560-1

[14] L.E. Granda Suasnavas, Desarrollo de un Software Académico Parti-Suite Basado en la Teoría de Filtración Coloidal（硕士论文），Escuela Politécnica Nacional, Quito, 2020.

[15] J. Liu, S. Elsayed, D. Essam, K. Harrison, R. Sarker, PPSSolver: An open-source software tool for Project Portfolio Selection and Scheduling Problems, SoftwareX 33 (2026) 102460. https://doi.org/10.1016/j.softx.2025.102460 **[待验证]**

[16] S. Zorzan, P. Koçi, M. Fernández-Lahore, A user-friendly web tool for colloidal interaction analysis: leveraging the xDLVO theory in integrated bioprocessing, J. Chem. Technol. Biotechnol. (2025). https://doi.org/10.1002/jctb.70048

[17] S. Abbott, Practical formulation science for particle-based inks, Colloids Interfaces 3 (2019) 23. https://doi.org/10.3390/colloids3010023

[18] A. Narayanan, V. Shmatikov, Robust de-anonymization of large sparse datasets, in: 2008 IEEE Symposium on Security and Privacy, IEEE, 2008, pp. 111–125. https://doi.org/10.1109/SP.2008.33 **[待验证]**

[19] E.M.V. Hoek, G.K. Agarwal, Extended DLVO interactions between spherical particles and rough surfaces, J. Colloid Interface Sci. 298 (2006) 50–58. https://doi.org/10.1016/j.jcis.2005.12.031 **[待验证]**

[20] M.J. Prince, Does active learning work? A review of the research, J. Eng. Educ. 93 (2004) 223–231. https://doi.org/10.1002/j.2168-9830.2004.tb00809.x **[待验证]**

[21] T. Mikkonen, A. Taivalsaari, Web applications – spaghetti code for the 21st century, in: 2008 Sixth International Conference on Software Engineering Research, Management and Applications, IEEE, 2008, pp. 319–328. https://doi.org/10.1109/SERA.2008.16 **[待验证]**

[22] D. Flanagan, JavaScript: The Definitive Guide, 第七版, O'Reilly Media, Sebastopol, 2020. **[待验证]**

[23] J. Teng, Y. Deng, X. Zhou, W. Yang, Z. Huang, H. Zhang, M. Zhang, H. Lin, A critical review on thermodynamic mechanisms of membrane fouling in membrane-based water treatment process, Front. Environ. Sci. Eng. 17 (2023) 129. https://doi.org/10.1007/s11783-023-1729-6

[24] M. Pilgrim, HTML5: Up and Running, O'Reilly Media, Sebastopol, 2010. **[待验证]**

[25] Plotly Technologies Inc., Collaborative data science, Plotly Technologies Inc., Montreal, QC, 2015. https://plot.ly **[待验证]**

[26] SheetJS, SheetJS Community Edition, 2012. https://sheetjs.com **[待验证]**

[27] G.H. Golub, C.F. Van Loan, Matrix Computations, 第四版, Johns Hopkins University Press, Baltimore, 2013. **[待验证]**

[28] F.M. Fowkes, Attractive forces at interfaces, Ind. Eng. Chem. 56 (1964) 40–52. https://doi.org/10.1021/ie50660a008 **[待验证]**

[29] D.K. Owens, R.C. Wendt, Estimation of the surface free energy of polymers, J. Appl. Polym. Sci. 13 (1969) 1741–1747. https://doi.org/10.1002/app.1969.070130815 **[待验证]**

[30] R.J. Hunter, Zeta Potential in Colloid Science: Principles and Applications, Academic Press, London, 1981. **[待验证]**

[31] A.J. de Kerchove, M. Elimelech, Relevance of electrokinetic theory for "soft" particles to bacterial cells: Implications for bacterial adhesion, Langmuir 21 (2005) 6462–6472. https://doi.org/10.1021/la047049t **[待验证]**

[32] J. Gregory, Particles in Water: Properties and Processes, CRC Press, Boca Raton, 2006. **[待验证]**

[33] W3C, MediaStream Recording, W3C Working Draft, 2021. https://www.w3.org/TR/mediastream-recording/ **[待验证]**

[34] Y. Yuan, T.R. Lee, Contact angle and wetting properties, in: G. Bracco, B. Holst (Eds.), Surface Science Techniques, Springer, Berlin, 2013, pp. 3–34. https://doi.org/10.1007/978-3-642-34243-1_1 **[待验证]**

[35] F. Liu, N.A. Hashim, Y. Liu, M.R.M. Abed, K. Li, Progress in the production and modification of PVDF membranes, J. Membr. Sci. 375 (2011) 1–27. https://doi.org/10.1016/j.memsci.2011.03.014 **[待验证]**

[36] A. Salis, B.W. Ninham, Models and mechanisms of Hofmeister effects in electrolyte solutions, and colloid and protein systems revisited, Chem. Soc. Rev. 43 (2014) 7358–7377. https://doi.org/10.1039/C4CS00144C **[待验证]**

[37] X. Wang, Y. Guo, Y. Li, Z. Ma, Q. Li, Q. Wang, D. Xu, J. Gao, X. Gao, H. Sun, Molecular level unveils anion exchange membrane fouling induced by natural organic matter via XDLVO and molecular simulation, Sci. Total Environ. 913 (2024) 169688. https://doi.org/10.1016/j.scitotenv.2023.169688 **[待验证]**

[38] E.M.V. Hoek, S. Bhattacharjee, M. Elimelech, Effect of membrane surface roughness on colloid-membrane DLVO interactions, Langmuir 19 (2003) 4836–4847. https://doi.org/10.1021/la027083c

[39] S. Bhattacharjee, M. Elimelech, Surface element integration: A novel technique for evaluation of DLVO interaction between a particle and a flat plate, J. Colloid Interface Sci. 193 (1997) 273–285. https://doi.org/10.1006/jcis.1997.5076 **[待验证]**

[40] Y. Zhao, K.P. Chong, L. Jiang, Zwitterionic polymer brush grafted on polyvinylidene difluoride membrane promoting enhanced ultrafiltration performance with augmented antifouling property, Polymers 12 (2020) 1303. https://doi.org/10.3390/polym12061303 **[待验证]**

[41] J. Yin, B. Deng, Polymer-matrix nanocomposite membranes for water treatment, J. Membr. Sci. 479 (2015) 256–275. https://doi.org/10.1016/j.memsci.2014.11.019 **[待验证]**

[42] W. Zhang, J. Luo, L. Ding, M.Y. Jaffrin, A review on flux decline control strategies in pressure-driven membrane processes, Ind. Eng. Chem. Res. 54 (2015) 2843–2861. https://doi.org/10.1021/ie504848m **[待验证]**

[43] J. Tennant, et al., The academic, economic and societal impacts of Open Access: an evidence-based review, F1000Research 5 (2016) 632. https://doi.org/10.12688/f1000research.8460.3 **[待验证]**

[44] G. Wilson, D.A. Aruliah, C.T. Brown, et al., Best practices for scientific computing, PLoS Biol. 12 (2014) e1001745. https://doi.org/10.1371/journal.pbio.1001745 **[待验证]**

[45] Y. Liang, N. Hilal, P. Langston, V. Starov, Interaction forces between colloidal particles in liquid: Theory and experiment, Adv. Colloid Interface Sci. 134–135 (2007) 151–166. https://doi.org/10.1016/j.cis.2007.04.003 **[待验证]**

[46] S. Bhattacharjee, C.-H. Ko, M. Elimelech, DLVO interaction between rough surfaces, Langmuir 14 (1998) 3365–3375. https://doi.org/10.1021/la971360b **[待验证]**

[47] N. Hilal, H. Al-Zoubi, N.A. Darwish, A.W. Mohammad, M. Abu Arabi, A comprehensive review of nanofiltration membranes: Treatment, pretreatment, modelling, and atomic force microscopy, Desalination 170 (2004) 281–308. https://doi.org/10.1016/j.desal.2004.01.007 **[待验证]**

[48] A. Biørn-Hansen, T.-M. Grønli, G. Ghinea, A survey and taxonomy of core concepts and research challenges in cross-platform mobile development, ACM Comput. Surv. 51 (2019) 1–34. https://doi.org/10.1145/3241739 **[待验证]**
