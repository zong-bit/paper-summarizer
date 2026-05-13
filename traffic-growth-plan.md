# Traffic Growth Execution Plan — Paper Summarizer

> 创建日期：2026-05-13
> 目标域名：https://www.summarizeai.app
> 项目状态：Next.js 部署在 Vercel，已有 sitemap.xml 和 robots.txt

---

## 一、Google Search Console 提交

### 优先级：🔴 P0（最高）
### 预计时间：30 分钟 + DNS 等待

#### 前置条件
- 域名已通过 Vercel 管理 DNS（确认 DNS 托管在 Vercel）
- 域名已添加到 Vercel 项目

#### 具体步骤

1. **登录 Google Search Console**
   - 访问 https://search.google.com/search-console
   - 使用 Google 账号登录

2. **添加属性**
   - 点击"添加属性" → 选择"网址前缀"
   - 输入 `https://www.summarizeai.app`
   - 点击"继续"

3. **验证域名所有权（TXT 记录方式）**
   - Google 会生成一个 TXT 记录值，格式为：`google-site-verification=xxxxxxxx`
   - 打开 Vercel Dashboard → 项目 Settings → Domains
   - 点击域名 → DNS Records → Add Record
   - 填写：
     | 字段 | 值 |
     |------|------|
     | Type | TXT |
     | Name | `@` |
     | Value | `google-site-verification=xxxxx`（Google 提供的值） |
     | TTL | 3600（默认） |
   - 点击 Add

4. **验证**
   - 回到 Google Search Console 点击"验证"
   - 如果失败，等待 5–15 分钟让 DNS 传播，重试
   - 验证通过后显示 ✅ "Ownership verified"

5. **提交 sitemap**
   - 在 Search Console 左侧菜单 → Sitemaps
   - 输入 `sitemap.xml` → 提交
   - sitemap.xml 已存在于 `/public/sitemap.xml`，包含 36 个 URL

6. **（可选）域名验证方式**
   - 如果选择"DNS 管理"方式而非"网址前缀"，需添加 `_dmarc` TXT 记录
   - 对大多数用户，URL 前缀方式更简单，推荐此方式

#### 验证后操作清单
- [ ] 检查 Coverage 报告，确保所有页面被索引
- [ ] 检查 Performance 报告，关注关键词表现
- [ ] 连接 Google Analytics 4（推荐 Plausible 作为隐私友好的替代）
- [ ] 优化 Core Web Vitals（Next.js 通常表现良好）
- [ ] 定期检查 Mobile Usability

---

## 二、社交媒体推广渠道评估

### 优先级排序（按投入产出比）

#### 🟢 P1 — 立即执行（本周）

##### 1. Twitter/X
- **目标受众**：AI/ML 研究者、开发者、学术圈
- **投入产出比**：⭐⭐⭐⭐⭐（高）
- **为什么重要**：AI 工具类产品的核心传播阵地，学术圈活跃度高
- **执行步骤**：
  1. 创建/完善 [@summarizeai](https://x.com/summarizeai) 账号
  2. 编写 Bio：`AI-powered paper summarizer for researchers. Read papers 10x faster. Free to start → summarizeai.app`
  3. 设置 Banner：展示产品截图 + 核心卖点
  4. 内容策略（每周 3-5 条）：
     - 论文摘要前后对比截图（视觉冲击力强）
     - "AI 如何改变学术阅读"类观点帖
     - 研究效率 tips（带产品链接）
     - 用户 testimonial / 案例分享
     - 与 AI/学术领域 KOL 互动（回复热门推文）
  5. 使用相关 hashtag：`#AcademicTwitter` `#AI` `#Research` `#PaperReading` `#PhDLife`
  6. 加入 Academic Twitter 社区互动（关注 @AcademicTwitter 相关话题）
- **预计时间**：2 小时（设置）+ 每周 1 小时维护
- **预期效果**：首月 100-500 访客来源

##### 2. Product Hunt
- **目标受众**：早期采用者、开发者、创业者
- **投入产出比**：⭐⭐⭐⭐⭐（极高，一次 launch 可带来数千访问）
- **执行步骤**：
  1. 准备 launch 材料：
     - 产品截图（首图 1200×628，详情图 1920×1080）
     - 产品描述（第一句必须吸引人）
     - 团队介绍
     - 分类：选择 "Productivity" + "Artificial Intelligence"
  2. 寻找 Hunter（Product Hunt 上的推广达人）合作
  3. 提前 2 周开始预热（在 PH 上关注、评论其他产品）
  4. Launch 当天：
     - 前 30 分钟最关键，准备好核心支持者
     - 每小时回答评论
     - 分享 launch 链接到所有社交平台
  5. 选择 launch 日期：周二/周三/周四最佳（避开周末）
- **预计时间**：3-5 小时（准备 + launch 当天）
- **预期效果**：首周 1000-5000 访客，可能获得 #1 Product of the Day

##### 3. Reddit
- **目标受众**：学术研究者、学生、AI 爱好者
- **投入产出比**：⭐⭐⭐⭐（高，但需谨慎避免被当作 spam）
- **目标子版块**：
  | 子版块 | 受众 | 策略 |
  |--------|------|------|
  | r/LocalLLaMA | AI 爱好者 | 分享技术细节 + 产品链接 |
  | r/artificial | AI 通用 | 发布产品更新/功能 |
  | r/academicpublishing | 学术出版 | 工具推荐帖 |
  | r/GradSchool | 研究生 | "拯救论文阅读"角度 |
  | r/PhD | 博士生 | 效率工具分享 |
  | r/research | 研究者 | 学术工具讨论 |
  | r/science | 科学爱好者 | 间接推广 |
  | r/ArtificialInteligence | AI 社区 | 产品展示 |
  | r/MachineLearning | ML 社区 | 技术向内容 |
- **执行步骤**：
  1. 注册 Reddit 账号，积累 karma（先参与社区讨论）
  2. 发布价值导向内容（非硬广）：
     - "I built an AI paper summarizer — here's what I learned"（个人故事角度）
     - "How I cut my paper reading time by 80%"（效率分享）
     - 参与 r/LocalLLaMA 的 "What are you working on?" 帖
  3. 回复他人相关帖子时自然提及产品
  4. **关键**：在 r/selfpromote 适度推广（每周最多 1 次）
  5. 避免直接发广告帖（会被删 + 封禁）
- **预计时间**：1 小时（设置）+ 每周 30 分钟
- **预期效果**：持续引流，月 200-1000 访客

#### 🟡 P2 — 两周内执行

##### 4. 知乎（中文市场）
- **目标受众**：中国研究生、科研人员
- **投入产出比**：⭐⭐⭐⭐（高，中文市场潜力大）
- **执行步骤**：
  1. 创建专业账号，认证/简介突出"AI 学术工具"
  2. 回答相关问题（搜索"论文摘要""AI 工具""文献阅读"）：
     - "有哪些好用的论文摘要工具？"
     - "如何用 AI 提高文献阅读效率？"
     - "研究生必备工具推荐"
  3. 撰写专栏文章：
     - "AI 论文摘要工具横评：SummarizeAI vs 其他工具"
     - "研究生如何用 AI 工具每天节省 3 小时"
     - "2026 年最佳 AI 学术工具推荐"
  4. 使用知乎 Live / 直播进行产品演示
  5. 加入学术/AI 相关圈子
- **预计时间**：3 小时（设置 + 首批内容）+ 每周 1 小时
- **预期效果**：中文用户增长显著，月 500-2000 访客（含间接）

##### 5. 小红书（中文市场）
- **目标受众**：中国年轻研究生、留学生
- **投入产出比**：⭐⭐⭐（中等，但用户活跃度高）
- **执行步骤**：
  1. 创建账号，定位"学术效率"方向
  2. 制作图文笔记：
     - "论文读不完？这个 AI 工具帮大忙了"
     - "研究生必备 AI 工具清单"
     - 论文阅读效率对比图（Before/After）
  3. 使用热门标签：`#论文` `#AI工具` `#研究生` `#科研` `#文献阅读`
  4. 制作短视频（产品演示 + 效果展示）
  5. 与学术类博主互推/合作
- **预计时间**：2 小时（设置 + 首批内容）+ 每周 1 小时
- **预期效果**：中文用户增长，月 200-800 访客

#### 🟠 P3 — 一个月内执行

##### 6. Hacker News
- **目标受众**：开发者、技术创业者
- **投入产出比**：⭐⭐⭐⭐（高流量，但社区严格）
- **执行步骤**：
  1. 使用 `Show HN:` 前缀提交（遵循 HN 规则）
  2. 标题建议：`Show HN: I built an AI paper summarizer that reads papers in seconds`
  3. 在评论区积极回应反馈
  4. 避免频繁提交（HN 规则：不要主要用作推广）
  5. 配合技术博客文章提交（如 "How I built a paper summarizer with Next.js"）
- **预计时间**：1 小时
- **预期效果**：单次 500-3000 访客（取决于内容质量）

##### 7. LinkedIn
- **目标受众**：学术专业人士、企业用户
- **投入产出比**：⭐⭐⭐（中等，适合 B2B 方向）
- **执行步骤**：
  1. 创建公司 Page
  2. 创始人个人账号持续发布
  3. 内容方向：AI 在学术研究中的应用、效率提升案例
  4. 加入相关群组（Academic Technology、AI Research 等）
- **预计时间**：1 小时（设置）+ 每周 30 分钟
- **预期效果**：月 100-500 访客，高质量用户

---

## 三、学术社区分发

### 优先级：🟡 P1（高）

#### 1. ResearchGate
- **机会**：
  - 创建 Profile，关联项目
  - 在"Questions"板块回答与 AI/论文摘要相关的问题
  - 发布"项目"页面展示 SummarizeAI
  - 关注学术圈 AI 工具相关讨论
- **执行**：
  1. 创建个人/公司 Profile
  2. 发布项目页面：https://www.researchgate.net/project
  3. 在相关 Q&A 中提供价值并自然提及工具
- **预计时间**：1 小时
- **预期效果**：长期学术曝光

#### 2. Academia.edu
- **机会**：
  - 创建 Profile
  - 发布关于"AI in Academic Research"的论文/报告
  - 关注 AI 工具相关研究动态
- **执行**：
  1. 创建 Profile
  2. 撰写一篇综述性文章发布（如 "The State of AI-Powered Paper Summarization in 2026"）
  3. 在 Profile 中链接到产品
- **预计时间**：2 小时（撰写文章）
- **预期效果**：学术圈曝光 + SEO 外链

#### 3. arXiv
- **机会**：
  - arXiv 是预印本平台，不适合直接推广工具
  - **替代方案**：撰写技术文章提交到 `cs.CL` 或 `cs.AI` 类别
  - 文章主题建议：
    - "SummarizeAI: An Open-Approach to AI-Powered Academic Paper Summarization"
    - 对比研究：AI 论文摘要工具的质量评估
  - 论文中的致谢/引用部分可自然提及产品
- **执行**：
  1. 撰写技术文章（2-4 周）
  2. 提交到 arXiv
  3. 在 Twitter/Reddit 分享论文
- **预计时间**：2-4 周（撰写 + 提交）
- **预期效果**：学术权威性 + 长期 SEO 价值

#### 4. 其他学术平台
| 平台 | 策略 | 优先级 |
|------|------|--------|
| Semantic Scholar | 注册开发者账号，探索 API 集成机会 | 🟡 P2 |
| Zotero | 开发插件或集成，进入 Zotero 插件市场 | 🟠 P3 |
| Overleaf | 探索与 LaTeX 模板集成的可能性 | 🟠 P3 |
| Notion | 制作 Notion 模板 + 产品链接 | 🟡 P2 |
| 微信公众号 | 中文学术圈内容分发 | 🟡 P2 |

---

## 四、SEO 内容优化（配合 GSC）

### 优先级：🟡 P1（高）

项目已有 36+ 篇博客文章，基础很好。进一步优化：

1. **URL 规范化**：
   - 部分中文 URL 使用中文路径（如 `/blog/5款免费论文摘要工具对比/`），建议改为英文 slug 或 URL 编码
   - 确保 canonical 标签正确设置

2. **元数据优化**：
   - 确保每篇博客有 unique title tag 和 meta description
   - Open Graph 标签完善（社交分享预览）

3. **内部链接优化**：
   - 在博客文章中交叉链接相关产品页面（premium/、buy/）
   - 确保 sitemap 包含所有重要页面

4. **持续内容策略**：
   - 每月 2-4 篇高质量博客
   - 覆盖长尾关键词：`best AI paper summarizer`、`free paper summary tool`、`AI literature review tool` 等

---

## 五、执行时间表

| 周次 | 任务 | 预计时间 | 状态 |
|------|------|----------|------|
| **Week 1** | | | |
| Day 1 | Google Search Console 验证 + sitemap 提交 | 30 min | ⬜ |
| Day 1 | Twitter/X 账号设置 + 首批 5 条推文 | 2 h | ⬜ |
| Day 2 | Product Hunt 准备（截图、描述、联系 Hunter） | 3 h | ⬜ |
| Day 2 | Reddit 账号注册 + 积累 karma | 1 h | ⬜ |
| Day 3 | Product Hunt Launch（选周二/三/四） | 2 h | ⬜ |
| Day 3 | HN Show HN 提交 | 30 min | ⬜ |
| Day 4 | 知乎账号 + 首批 3 篇回答/文章 | 2 h | ⬜ |
| Day 5 | 小红书账号 + 首批 3 篇笔记 | 2 h | ⬜ |
| **Week 2** | | | |
| Day 1-2 | LinkedIn 公司 Page + 个人账号运营 | 1 h | ⬜ |
| Day 3 | ResearchGate Profile + 项目页面 | 1 h | ⬜ |
| Day 4 | Academia.edu Profile + 综述文章撰写 | 2 h | ⬜ |
| Day 5 | SEO 检查 + URL 规范化 | 1 h | ⬜ |
| **Week 3** | 持续内容产出 + 社交互动 | 2 h/天 | ⬜ |
| **Week 4** | 数据复盘 + 策略调整 | 1 h | ⬜ |

---

## 六、KPI 追踪

| 指标 | 目标（首月） | 工具 |
|------|-------------|------|
| GSC 索引页面数 | 30+ | Google Search Console |
| Google 搜索流量 | 500+ 访客 | Google Analytics / GSC |
| Twitter 粉丝 | 200+ | Twitter Analytics |
| Product Hunt | #1 或 Top 5 | Product Hunt Dashboard |
| Reddit 总曝光 | 5000+ | Reddit 后台 |
| 知乎文章阅读 | 2000+ | 知乎后台 |
| 小红书笔记曝光 | 3000+ | 小红书后台 |
| 付费用户 | 1+ | 支付后台 |

---

## 七、注意事项

1. **Reddit 规则**：严格避免硬广。先贡献价值再推广。self-promotion 比例建议 1:10（1 条推广 : 10 条有价值互动）
2. **HN 规则**：不要主要用作推广。`Show HN:` 帖子要真诚，准备好回应技术质疑
3. **Product Hunt**：只有一次 launch 机会，准备充分再 launch。提前建立支持者社区
4. **中文平台**：内容需本地化，不要简单翻译英文内容
5. **GSC 验证**：越早验证越好，DNS 传播可能需要几小时到一天

---

> **总结**：最高优先级的三件事是 **GSC 验证**（SEO 基础）、**Product Hunt Launch**（爆发式流量）、**Twitter/X 运营**（持续流量）。这三项可在第一周内完成，预计带来最大 ROI。
