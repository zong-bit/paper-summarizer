/**
 * 科研论文 Prompt 合集 — 50个即用型AI提示词
 * 覆盖论文全生命周期：摘要 / 改写 / 分析 / 写作辅助 / 效率
 */

export interface Prompt {
  id: string
  category: 'summary' | 'rewrite' | 'analysis' | 'writing' | 'productivity'
  title: string
  template: string
  description: string
}

export const prompts: Prompt[] = [
  // ===== 1. 论文摘要类 =====
  {
    id: '001',
    category: 'summary',
    title: '通用研究摘要',
    template: '我正在进行一项关于 [研究主题] 的研究，采用 [研究方法] 方法。请帮我撰写一段150-200字的学术摘要，包含研究背景、目的、方法、主要发现和结论。语言风格：正式、客观、精炼。',
    description: '根据研究主题和方法生成标准学术摘要',
  },
  {
    id: '002',
    category: 'summary',
    title: '计算机科学领域摘要',
    template: '你是一位计算机科学领域的学术编辑。请为我的研究 [论文标题] 撰写一段200字以内的英文摘要。我的研究主要解决了 [核心问题]，采用了 [方法/算法]，在 [数据集/基准] 上取得了 [关键结果]。请突出技术贡献和创新点。',
    description: 'CS领域英文摘要生成，突出技术贡献',
  },
  {
    id: '003',
    category: 'summary',
    title: '生物医学领域摘要',
    template: '请根据以下信息撰写一段250字的Abstract（英文）：研究背景：[背景]；研究目的：[目的]；方法：[实验方法，如样本量、分组、检测指标]；结果：[关键数据，包括统计显著性]；结论：[主要结论]。格式需符合 IMRaD 结构。',
    description: '生物医学IMRaD格式英文摘要',
  },
  {
    id: '004',
    category: 'summary',
    title: '社会科学领域摘要',
    template: '请为我的社会科学研究论文撰写一段精简摘要（约150字）。研究主题：[主题]；数据来源：[数据来源，如问卷/访谈/公开数据]；样本量：[样本量]；分析方法：[分析方法，如回归分析/主题分析]；主要发现：[核心发现]。摘要需包含理论意义和实践启示。',
    description: '社会科学研究论文精简摘要',
  },
  {
    id: '005',
    category: 'summary',
    title: '100字短摘要（期刊特供）',
    template: '请将以下论文核心内容压缩为 100字以内 的超短摘要，仅保留最核心的信息：研究问题、主要方法、关键结论。原文摘要如下：[粘贴你的摘要原文]',
    description: '将摘要压缩到100字以内，适合期刊投稿限制',
  },
  {
    id: '006',
    category: 'summary',
    title: '300字详细摘要',
    template: '请将以下论文内容扩展为一篇 300字左右 的详细摘要。要求：清晰呈现研究动机、与已有工作的区别、方法细节、实验结果及其意义。可适当包含1-2个关键数据点。原文信息如下：[填入你的研究内容]',
    description: '扩展为300字详细摘要，包含方法细节和意义',
  },
  {
    id: '007',
    category: 'summary',
    title: '500字综述类摘要',
    template: '请为我的综述论文撰写一段 400-500字 的综合摘要。研究领域：[领域]；涵盖时间范围：[时间]；纳入文献数量：[数量]；主要综述发现：[发现]。摘要需包含该领域的发展脉络、当前争议和未来方向。',
    description: '综述论文综合摘要，涵盖发展脉络和未来方向',
  },
  {
    id: '008',
    category: 'summary',
    title: '中文短摘要',
    template: '请为我的论文撰写一段 150字以内的中文摘要。请用简洁、规范的中文学术语体书写，避免长句。研究领域：[领域]；研究问题：[问题]；方法：[方法]；结论：[结论]。关键词3-5个。',
    description: '150字以内中文学术摘要 + 关键词',
  },
  {
    id: '009',
    category: 'summary',
    title: '英文长摘要（会议/扩展版）',
    template: 'Please write an extended abstract (400-500 words) for my conference paper on [your topic]. The abstract should follow this structure: (1) Problem statement and motivation; (2) Related work and research gap; (3) Proposed approach/methodology; (4) Experimental setup and results; (5) Conclusion and broader impact. Include quantitative results where applicable.',
    description: '会议用英文长摘要，含问题、方法、结果、影响',
  },
  {
    id: '010',
    category: 'summary',
    title: '图文摘要（Graphical Abstract）文案',
    template: '我需要为论文设计一个 图文摘要（Graphical Abstract） 。请根据以下论文内容，生成一段50字以内的配图说明文字，并要求配图设计的视觉方案（描述建议包含的图标、流程图结构和色彩风格）。论文内容：[填入你的研究]',
    description: '生成图文摘要文案 + 配图设计方案',
  },

  // ===== 2. 论文改写类 =====
  {
    id: '011',
    category: 'rewrite',
    title: '中译英 · 学术翻译',
    template: '请将以下中文论文段落翻译成地道的英文学术语言。要求：保持学术严谨性，术语使用准确，句式符合英文学术写作习惯。避免直译导致的中式英语。原文：「[粘贴中文段落]」',
    description: '中文论文段落翻译为地道英文学术语言',
  },
  {
    id: '012',
    category: 'rewrite',
    title: '英译中 · 学术翻译',
    template: '请将以下英文学术段落翻译为流畅的中文学术语言。要求：专业术语使用大陆学界通行译法，句式符合中文学术表达习惯，注意被动语态和长句的合理拆分。原文：「[paste English paragraph]」',
    description: '英文学术段落翻译为流畅中文学术语言',
  },
  {
    id: '013',
    category: 'rewrite',
    title: '学术风格强化 · 从口语到正式',
    template: '下面这段文字偏口语化，请将其改写成 正式学术风格 。要求：词汇更专业化，句式更严谨，逻辑层次更清晰。保持原意不变。（可根据需要添加过渡词和连接词）原文：「[粘贴你的原稿]」',
    description: '口语化文字改写为正式学术风格',
  },
  {
    id: '014',
    category: 'rewrite',
    title: '学术风格弱化 · 从学术到通俗',
    template: '我需要将这段学术内容用于 科普/基金申请书的背景部分/跨学科读者 。请将以下文字改写得更加通俗易懂，减少专业术语，增加类比和解释，让非本领域的科研人员也能理解。原文：「[粘贴学术段落]」',
    description: '学术内容改写为通俗易懂的科普风格',
  },
  {
    id: '015',
    category: 'rewrite',
    title: '降重改写 · 保持核心意思',
    template: '请对以下段落进行 降重改写（避免被查重系统标记），要求：\n1. 保持全部核心信息和学术观点不变\n2. 改变句式结构（主被动转换、语序调整、从句拆合）\n3. 替换同义词汇但不改变专业含义\n4. 保持同样的学术严谨性和字数（±10%）\n\n原文：「[粘贴需降重段落]」',
    description: '降重改写，保持核心信息不变',
  },
  {
    id: '016',
    category: 'rewrite',
    title: '降重改写 · 大段重构',
    template: '请对以下长段落进行 深度重构 。不满足于同义词替换，请重组论证逻辑链条，更换论述顺序，使用不同的例证方式，最终达到以下效果：查重率显著降低，但学术质量和原意完全保留。原文：「[粘贴长段落]」',
    description: '深度重构长段落，显著降低查重率',
  },
  {
    id: '017',
    category: 'rewrite',
    title: '被动语态 ↔ 主动语态转换',
    template: '请将以下段落所有 被动语态改为主动语态（或反之）。保持学术严谨性，注意不要改变重点信息的强调程度。如果转换后读起来不自然，可以适当调整句式。原文：「[粘贴段落]」',
    description: '被动/主动语态互相转换',
  },
  {
    id: '018',
    category: 'rewrite',
    title: '缩短篇幅 · 精炼表达',
    template: '以下段落需要 压缩至原来的一半长度（从 [字数A] 字压缩到 [字数A/2] 字左右）。要求：删除冗余修饰、合并相似论点、简化例句、保留所有核心信息。原文：「[粘贴段落]」',
    description: '压缩篇幅至一半，精炼表达',
  },
  {
    id: '019',
    category: 'rewrite',
    title: '拓展篇幅 · 丰富论证',
    template: '以下段落需要 扩展至原来两倍长度（从 [字数B] 字扩展到 [字数B*2] 字左右）。要求：增加背景铺垫、补充论证细节、加入相关文献引用建议、充实论点论据。不可添加与主题无关的内容。原文：「[粘贴段落]」',
    description: '扩展篇幅至两倍，丰富论证细节',
  },
  {
    id: '020',
    category: 'rewrite',
    title: '学术写作风格转换（APA/MLA/Chicago）',
    template: '请按照 [APA/MLA/Chicago] 格式的要求，对以下论文内容进行 格式和风格统一。包括但不限于：引用格式、标题层级、数字书写规范、参考文献格式等。原文：「[粘贴内容]」',
    description: '按APA/MLA/Chicago格式统一论文风格',
  },

  // ===== 3. 论文分析类 =====
  {
    id: '021',
    category: 'analysis',
    title: '研究问题批判性分析',
    template: '请以 审稿人视角 分析以下研究问题：\n「[填入研究问题]」\n分析维度：\n1. 该研究问题的创新性和价值（1-5分，说明理由）\n2. 研究问题是否清晰、可操作\n3. 潜在的方法论陷阱\n4. 建议如何改进/聚焦该研究问题',
    description: '审稿人视角批判性分析研究问题',
  },
  {
    id: '022',
    category: 'analysis',
    title: '方法论评估',
    template: '请评估以下研究方法部分的 合理性 和 潜在缺陷：\n「[粘贴方法部分]」\n\n请从以下角度分析：\n- 方法是否与研究问题匹配\n- 样本量/数据量是否充足\n- 控制变量是否充分\n- 统计方法是否恰当\n- 可重复性如何\n- 建议改进方案',
    description: '评估研究方法的合理性和潜在缺陷',
  },
  {
    id: '023',
    category: 'analysis',
    title: '实验结果解读与深化',
    template: '基于以下实验结果数据，请给出 深度解读：\n「[粘贴结果/图表描述]」\n\n请从以下维度分析：\n1. 直接结论（数据本身说明了什么）\n2. 隐含含义（数据背后的科学意义）\n3. 局限性（哪些因素可能影响结论的可靠性）\n4. 与已有文献的对比（如果有参考信息）\n5. 未来研究方向建议',
    description: '深度解读实验结果，分析隐含含义',
  },
  {
    id: '024',
    category: 'analysis',
    title: '论文整体弱点诊断',
    template: '请以 顶级期刊审稿人 的身份审阅以下论文（或论文摘要/框架）：\n「[粘贴内容]」\n\n输出格式（每个维度1-10分）：\n- 创新性 + 评价 + 改进建议\n- 方法论严谨性 + 评价 + 改进建议\n- 实验/论证充分性 + 评价 + 改进建议\n- 写作与结构 + 评价 + 改进建议\n- 参考文献质量 + 评价 + 改进建议\n- 总体评分\n- 是否建议接收',
    description: '顶级期刊审稿人视角全面诊断论文',
  },
  {
    id: '025',
    category: 'analysis',
    title: '被引文献分析',
    template: '请分析以下参考文献在论文中的 使用质量：\n「[粘贴参考文献列表]」\n\n请从以下角度分析：\n1. 文献的新旧程度分布是否合理\n2. 是否覆盖了该领域的核心经典文献\n3. 是否存在明显的文献缺口\n4. 文献来源期刊的权威性评价\n5. 建议补充的高被引/重要文献',
    description: '分析参考文献的使用质量和覆盖度',
  },
  {
    id: '026',
    category: 'analysis',
    title: '论证逻辑链分析',
    template: '请分析以下段落/章节的 论证逻辑：\n「[粘贴内容]」\n\n分析要求：\n1. 绘制逻辑论证链（前提 → 推理 → 结论）\n2. 识别论证中的逻辑谬误（如有）\n3. 指出证据不足以支持结论的地方\n4. 建议如何加强论证链条\n5. 评价整体说服力',
    description: '分析论证逻辑链，识别逻辑谬误',
  },
  {
    id: '027',
    category: 'analysis',
    title: '与最新文献的关联分析',
    template: '以下是近两年发表的与本课题相关的重要论文列表：\n「[粘贴最新文献列表]」\n\n请分析：\n1. 我的研究与该领域最新进展的关系\n2. 我的研究是否已被最新研究所超越或互补\n3. 哪些新文献应在Introduction或Discussion中引用\n4. 我的研究结论是否需要根据最新文献进行修正',
    description: '分析与最新文献的关系，建议补充引用',
  },
  {
    id: '028',
    category: 'analysis',
    title: '统计学方法检查',
    template: '请检查以下统计分析部分是否存在常见错误：\n「[粘贴统计方法描述与结果]」\n\n检查清单：\n- 正态性检验是否执行\n- 方差齐性是否满足\n- 多重比较校正（Bonferroni/FDR等）是否应用\n- 效应量（effect size）是否报告\n- 置信区间是否给出\n- 样本量是否足够（power analysis）\n- 有无p值滥用（p-hacking）的嫌疑\n- 缺失数据处理是否合理',
    description: '检查统计分析方法的常见错误',
  },
  {
    id: '029',
    category: 'analysis',
    title: '图表质量评估',
    template: '请评估以下论文图表的 学术质量：\n「[粘贴图表标题/描述/图注]」\n\n评估维度：\n1. 图表的自明性（不加正文能否理解）\n2. 视觉设计是否清晰、不误导\n3. 坐标轴、图例、标注是否完整正确\n4. 是否有更好的数据可视化方案\n5. 是否符合目标期刊的图表规范',
    description: '评估论文图表的学术质量和设计',
  },
  {
    id: '030',
    category: 'analysis',
    title: '局限性分析与未来方向',
    template: '基于以下论文内容，请系统性地列出 本研究的局限性 ，并针对每一条局限性提出 可行的未来研究方向：\n「[粘贴论文内容或核心发现]」\n\n格式：\n| 局限性 | 严重程度 | 对结论的影响 | 未来改进方向 |\n|--------|---------|-------------|-------------|\n\n至少列出5条局限性及对应的未来方向。',
    description: '系统分析研究局限性并提出未来方向',
  },

  // ===== 4. 写作辅助类 =====
  {
    id: '031',
    category: 'writing',
    title: '引言写作 · 漏斗式结构',
    template: '请为我撰写论文引言段落的初稿。采用 漏斗式结构（从宏观到微观）：\n1. 第一段（宽泛背景）：[填入大背景，如行业发展/社会需求]\n2. 第二段（聚焦问题）：现有研究在 [填入特定问题] 方面存在哪些不足\n3. 第三段（本文方案）：本文提出 [填入方法]，旨在解决 [填入目标]\n4. 第四段（贡献总结）：本文的三大贡献如下…\n\n字数：约500-800字。请为每段提供3个不同版本供选择。',
    description: '用漏斗式结构撰写论文引言初稿',
  },
  {
    id: '032',
    category: 'writing',
    title: '文献综述生成 · 主题聚类法',
    template: '请帮我生成一段关于 [填入研究主题] 的文献综述（400-600字）。请按 主题聚类 方式组织，而非逐篇罗列。我关注的几个细分方向是：\n- [子方向1]\n- [子方向2]\n- [子方向3]\n\n请在最后用一个表格总结各方向的代表性工作、方法和不足。',
    description: '按主题聚类方式生成文献综述',
  },
  {
    id: '033',
    category: 'writing',
    title: '文献综述 · 历史演进法',
    template: '请按 时间演进 脉络，为 [填入领域] 撰写一段文献综述。要求：\n- 分3-4个发展阶段\n- 每个阶段指出关键里程碑文献及其贡献\n- 指出各阶段的局限性和转折点\n- 最后总结当前的研究前沿和开放问题\n\n字数：约800字。我已有的参考资料：[可选：粘贴关键文献]',
    description: '按时间演进脉络撰写文献综述',
  },
  {
    id: '034',
    category: 'writing',
    title: '研究方法部分撰写',
    template: '请根据以下信息撰写论文的 Methods 部分（英文，约300-400字）：\n- 数据/样本来源：[填入来源]\n- 实验/数据采集流程：[填入流程]\n- 关键指标/变量：[填入指标]\n- 数据分析方法：[填入方法]\n- 统计工具：[填入工具，如SPSS/Python/R]\n\n语言要求：清晰、精确、可重复。使用过去时态。',
    description: '撰写英文Methods部分（300-400字）',
  },
  {
    id: '035',
    category: 'writing',
    title: '结果部分撰写',
    template: '请根据以下数据和要点撰写论文的 Results 部分（300-500字）：\n- 主要发现1：[填入发现及数据]\n- 主要发现2：[填入发现及数据]\n- 主要发现3：[填入发现及数据]\n- 辅助/负面发现：[如有]\n\n要求：客观陈述事实，不讨论含义，配合适当的过渡句和总结句。每段对应一个图表（请标注Figure X）。',
    description: '客观撰写Results部分，配合图表标注',
  },
  {
    id: '036',
    category: 'writing',
    title: 'Discussion 撰写',
    template: '请根据以下内容撰写论文的 Discussion 部分初稿（500-800字）：\n- 主要发现回顾：[填入核心发现]\n- 与已有文献的对比：[填入对比信息]\n- 意外发现及解释：[如有]\n- 局限性：[填入局限性]\n- 理论和实践意义：[填入意义]\n\n结构建议：\n1. 简要重述主要发现（1-2句）\n2. 与已有文献比较（展开论证）\n3. 局限性和替代解释\n4. 理论和实践意义\n5. 未来工作建议',
    description: '撰写Discussion部分，对比已有文献',
  },
  {
    id: '037',
    category: 'writing',
    title: '结论撰写',
    template: '请为我的论文撰写 Conclusion 部分（200-300字）。要求：\n1. 总结核心发现（1-2句）\n2. 突出理论/实践贡献（2-3句）\n3. 说明局限性（1-2句）\n4. 展望未来方向（2-3句）\n\n核心信息：[填入你的核心结论]',
    description: '撰写结论部分，总结发现与展望',
  },
  {
    id: '038',
    category: 'writing',
    title: '标题生成（A/B测试优化）',
    template: '请根据以下论文内容，生成 10个备选论文标题：\n- 5个学术风格（信息密度高、术语准确）\n- 3个影响力风格（吸引眼球、适合高水平期刊）\n- 2个对话风格（适合预印本/社交媒体传播）\n\n论文核心内容：[填入标题/摘要/关键发现]\n\n并为每个标题提供简短的优缺点分析。',
    description: '生成10个备选标题 + 优缺点分析',
  },
  {
    id: '039',
    category: 'writing',
    title: '关键词推荐',
    template: '请为我的论文推荐 6-8个关键词。要求：\n- 前2个是 领域核心术语（覆盖大类）\n- 中间3-4个是 具体技术/方法/概念\n- 最后1-2个是 新兴/热门前沿词汇\n\n论文信息：[填入标题+摘要]\n\n另请推荐3个替代关键词（如果前一组被占用的备选方案）。',
    description: '推荐6-8个关键词 + 3个备选',
  },
  {
    id: '040',
    category: 'writing',
    title: 'Cover Letter 撰写',
    template: '请帮我撰写一份投递期刊的 Cover Letter。目标期刊：[填入期刊名]。稿件标题：[填入标题]。请包含：\n1. 主编称谓（Dear Editor,）\n2. 投稿声明\n3. 本文创新点和与期刊范围契合度的说明（2-3段）\n4. 声明未重复发表、无利益冲突\n5. 推荐审稿人可选（如适用）\n6. 落款\n\n此外，请附上 3个推荐审稿人 及 3个回避审稿人 的推荐理由。',
    description: '撰写期刊投稿Cover Letter + 审稿人推荐',
  },

  // ===== 5. 效率类 =====
  {
    id: '041',
    category: 'productivity',
    title: '参考文献格式化',
    template: '请将以下参考文献信息转换为 [APA 7th / MLA 9th / Chicago / GB/T 7714] 格式：\n「[粘贴参考文献原始信息]」\n\n请批量处理至少5条，检查每条格式是否标准完整（期刊名是否斜体、作者名缩写是否正确、有无DOI等）。',
    description: '批量格式化参考文献为指定格式',
  },
  {
    id: '042',
    category: 'productivity',
    title: '论文结构规划 · 提纲生成',
    template: '我将撰写一篇关于 [填入主题] 的学术论文，目标期刊 [填入期刊]。请帮我设计一个详细的 论文大纲 ，包含每一节（section）和子节（subsection）以及每个子节的核心要点。类型：[research paper / review / short communication / case report]。字数目标：约 [填入字数]。图表数量：约 [填入数量] 个。',
    description: '生成详细论文大纲（含子节和要点）',
  },
  {
    id: '043',
    category: 'productivity',
    title: '审稿意见回复（Response to Reviewers）',
    template: '以下是审稿人的意见及修改要求。请帮我起草 逐条回复（point-by-point response）：\n\n**审稿人1意见：**\n- Comment 1：「[粘贴意见1]」\n- Comment 2：「[粘贴意见2]」\n\n**审稿人2意见：**\n- Comment 3：「[粘贴意见3]」\n\n回复模板要求：\n- 对每条意见先致谢，再说明做了哪些修改\n- "We thank the reviewer for this comment." 开头\n- 说明修改位置（Page X, Line Y-Z）\n- 如不同意审稿人意见，需礼貌解释理由并引用文献支持\n- 语言：正式、尊重、谦逊',
    description: '起草逐条审稿意见回复',
  },
  {
    id: '044',
    category: 'productivity',
    title: '论文查重后修改策略',
    template: '我的论文查重报告显示 重复率偏高（X%，超出期刊要求 Y%）。主要重复来源于以下段落：\n「[粘贴高重复段落]」\n\n请针对这些段落提供 定向降重策略：\n1. 如果是方法描述——尝试用自己的语言重写实验流程\n2. 如果是文献综述——尝试重新组织文献聚类方式\n3. 如果是引言——改变论述顺序和引入角度\n\n请逐个段落给出具体修改方案。',
    description: '针对高重复段落提供定向降重策略',
  },
  {
    id: '045',
    category: 'productivity',
    title: '基金申请书摘要撰写',
    template: '请为我的基金申请书撰写一段 300字以内的摘要。基金类型：[国自然面上/青年/地区/重点]。项目名称：[填入名称]。研究内容：[填入内容]。创新点：[填入创新点]。预期成果：[填入成果]\n\n要求：突出科学意义和创新性，语言精炼有力，让非本领域的评审专家也能理解其重要性。',
    description: '撰写基金申请书摘要（300字以内）',
  },
  {
    id: '046',
    category: 'productivity',
    title: '学术PPT/Demo内容提炼',
    template: '我需要为一场 15分钟的学术报告 制作PPT。请将以下论文内容提炼为 15页PPT的内容要点（含Title页和Thank页）：\n「[粘贴论文全文或关键内容]」\n\n每页格式：「Slide N - 标题 | 核心要点（bullet points 3-5条）| 建议配图类型」\n需标明哪些页需要重点多花时间讲解。',
    description: '提炼15页学术报告PPT内容要点',
  },
  {
    id: '047',
    category: 'productivity',
    title: '学术邮件撰写',
    template: '请帮我撰写一封学术邮件。\n\n**场景：** [投稿期刊咨询 / 索要论文全文 / 申请博后/博士位置 / 邀请合作 / 学术会议咨询]\n**收件人：** [教授/编辑/期刊办公室] 姓名：[填入姓名]\n**主题：** [填入主题]\n**正文要点：** [填入要点]\n\n要求语气：礼貌、专业、简洁。提供正式版和精简版两个版本。',
    description: '撰写正式版和精简版学术邮件',
  },
  {
    id: '048',
    category: 'productivity',
    title: 'LaTeX 模板与格式检查',
    template: '请检查以下 LaTeX 代码段，指出其中的格式问题及改进建议：\n「[粘贴 LaTeX 代码]」\n\n检查内容：\n- 参考文献格式是否正确\n- 图表引用是否有交叉引用\n- 数学公式编写是否规范\n- 是否有排版常见问题（缺少 \\, 过长的行等）\n- 是否有缺失的宏包或命令',
    description: '检查LaTeX代码格式问题并给出建议',
  },
  {
    id: '049',
    category: 'productivity',
    title: '学术争议辩论 · 两面论证生成',
    template: '我在论文中需要讨论一个有争议的观点：「[填入争议话题]」。\n\n请帮我生成：\n1. 正方论点（支持该观点的学术依据，3-4条）\n2. 反方论点（反对该观点的学术依据，3-4条）\n3. 中立/调和观点（如何整合正反两方，2-3条）\n4. 每一条论点对应的代表性参考文献（尽可能真实可用）\n\n每条论点请标注强弱度（强/中/弱）。',
    description: '生成正反两方论证 + 参考文献',
  },
  {
    id: '050',
    category: 'productivity',
    title: '论文投稿前自查清单',
    template: '请根据 [目标期刊名] 的要求，为我生成一份 投稿前最终检查清单 。我提供以下信息：论文主题：[填入主题]；格式要求：[如双栏/单栏/字数限制等]。请生成包含以下类别的清单（每个类别5-10项）：\n\n- 格式规范（字号、行距、页边距等）\n- 内容完整性（IMRaD结构、声明、致谢等）\n- 图表质量（分辨率、格式、图注）\n- 参考文献（格式、完整性、最新性）\n- 语言润色（语法、术语、一致性）\n- 伦理与版权（知情同意、引用许可等）\n\n每项请标注「必须」或「建议」。',
    description: '生成投稿前最终检查清单',
  },
]

export const categories = [
  { key: 'summary', label: '📋 摘要', labelEn: 'Summary' },
  { key: 'rewrite', label: '✏️ 改写', labelEn: 'Rewrite' },
  { key: 'analysis', label: '🔍 分析', labelEn: 'Analysis' },
  { key: 'writing', label: '📝 写作', labelEn: 'Writing' },
  { key: 'productivity', label: '⚡ 效率', labelEn: 'Productivity' },
] as const

export const categoryMap: Record<string, Prompt['category']> = {
  summary: 'summary',
  rewrite: 'rewrite',
  analysis: 'analysis',
  writing: 'writing',
  productivity: 'productivity',
}

export function getPromptsByCategory(category: string): Prompt[] {
  return prompts.filter(p => p.category === category)
}

export function getPromptById(id: string): Prompt | undefined {
  return prompts.find(p => p.id === id)
}
