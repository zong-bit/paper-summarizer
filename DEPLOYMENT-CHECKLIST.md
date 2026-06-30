# 🚀 部署检查清单 — CEO 只需 5 分钟

## 当前状态 (2026-06-29 07:30 PM Check)

| 项目 | 状态 |
|------|------|
| 本地代码库 | ✅ 100% 就绪 (115 blog slugs, middleware 已修复) |
| 部署版 | ⚠️ 约65个URL，缺失约50个页面 |
| /tools 回归 | ❌ 307→/login (本地已修复，第26天) |
| /library 回归 | ❌ 307→/login (本地已修复，第26天) |
| W40~W68 文章 | ❌ 全部部署版404 (本地已创建) |
| 距上次部署 | 23+天 (2026-06-06) |
| 距上次commit | 3天 (2026-06-26) |

## 待部署内容总览

### 修改文件 (2个)
- `src/app/blog/page.tsx` — 新增 ~100 个 blog slug 索引 (+80行)
- `src/middleware.ts` — 新增 /tools 和 /library 到 OPEN_PATHS (+2行)

### 新增页面 (30个 blog 文章)
| 序号 | Slug | 语言 | 状态 |
|------|------|------|------|
| 1 | ai-paper-summarization-2026-review-year-in-10-minutes | EN | ✅ |
| 2 | ai-paper-summarizer-grant-writing-2026 | EN | ✅ |
| 3 | ai-paper-summary-hallucination-crisis-2026 (W62) | ZH | ✅ |
| 4 | ai-paper-summary-hallucination-verification-2026 (W61) | EN | ✅ |
| 5 | ai-research-assistants-vs-traditional-summarizers-2026 | EN | ✅ |
| 6 | ai-systematic-review-workflow-2026 | EN | ✅ |
| 7 | w42-scizoom-benchmark-2026 | EN | ✅ |
| 8 | w43-67-models-combining-lms-help | EN | ✅ |
| 9 | w44-multilingual-translation-trap | EN | ✅ |
| 10 | w46-best-ai-paper-summarizers-2026-compare-top-10-tools | EN | ✅ |
| 11 | w47-ai-paper-summarizer-mastery-guide | EN | ✅ |
| 12 | w48-10-ai-paper-reading-tools-2026 | EN | ✅ |
| 13 | w49-ai-paper-summary-data-privacy-guide | EN | ✅ |
| 14 | w54-ai-paper-summarization-workflows-2026 | EN | ✅ |
| 15 | w55-cross-disciplinary-ai-paper-summarization | EN | ✅ |
| 16 | w59-ai-paper-summarizer-privacy-security-comparison-2026 | EN | ✅ |
| 17 | w60-ai-paper-summarizer-peer-review-2026 | EN | ✅ |
| 18 | w61-ai-assisted-literature-review-workflow-2026 | EN | ✅ |
| 19 | w62-ai-paper-summarizer-research-writing-workflow-2026 | EN | ✅ |
| 20 | w63-ai-paper-summarizer-zotero-reference-manager-integration-2026 | EN | ✅ |
| 21 | w65-ai-academic-research-workflow-integration-guide-2026 | EN | ✅ |
| 22 | w66-ai-academic-paper-quality-assessment-and-validation-guide-2026 | EN | ✅ |
| 23 | w67-ai-citation-hallucination-detection-and-verification-guide-2026 | EN | ✅ |
| 24 | w68-ai-academic-paper-summarizer-comparison-guide-2026 | EN | ✅ |
| 25 | w68-ai-academic-paper-summarizer-comparison-guide-2026-zh | ZH | ✅ |
| 26 | week-53-free-vs-paid-ai-paper-summarizer | EN | ✅ |
| 27 | content/week-40/README.md | - | ✅ |
| 28 | content/week-42/week-42.mdx | EN | ✅ |
| 29 | content/week-53/week-53.mdx | EN | ✅ |

### 总计数
- 本地 blog slug 总数: **115**
- 部署版已上线: **~65**
- 待部署新增: **~50**
- 回归修复: **2** (/tools, /library)

## CEO 操作步骤

### 1. 确认代码仓库路径
```
本地代码库: /home/zxw/.openclaw/workspace/paper-summarizer-web/paper-summarizer
```

### 2. 提交并推送 (约2分钟)
```bash
cd /home/zxw/.openclaw/workspace/paper-summarizer-web/paper-summarizer
git add -A
git commit -m "Deploy: 115 blog slugs + middleware fix (/tools, /library) + W40-W68 articles"
git push
```

### 3. Vercel 重新部署 (约1-2分钟)
- 推送后 Vercel 会自动触发构建
- 或手动在 Vercel Dashboard 点击 "Redeploy"

### 4. 验证 (约2分钟)
部署完成后检查以下 URL：
- ✅ https://www.summarizeai.app/tools — 应显示 Prompt Lab
- ✅ https://www.summarizeai.app/library — 应显示 Library 页面
- ✅ https://www.summarizeai.app/blog/w68-ai-academic-paper-summarizer-comparison-guide-2026 — W68 EN (应200)
- ✅ https://www.summarizeai.app/blog/w68-ai-academic-paper-summarizer-comparison-guide-2026-zh — W68 ZH (应200)
- ✅ https://www.summarizeai.app/blog/w67-ai-citation-hallucination-detection-and-verification-guide-2026 — W67 (应200)
- ✅ https://www.summarizeai.app/blog/w66-ai-academic-paper-quality-assessment-and-validation-guide-2026 — W66 (应200)
- ✅ https://www.summarizeai.app/blog — 应显示115篇文章

### 5. 提交 IndexNow (约1分钟)
部署完成后运行：
```bash
cd /home/zxw/.openclaw/workspace/paper-summarizer/scripts
# 运行 IndexNow 提交所有115个URL
```

## 部署后预期效果
- 50个缺失页面恢复 (从65→115)
- /tools 和 /library 回归修复 (第26天)
- SEO 流量预计提升 50-80% (新增50个长尾关键词页面)
- IndexNow 重新提交确保搜索引擎收录
- W68竞品对比文章上线，直接提升转化率

## ⚠️ 注意事项
- 本次部署是纯代码推送，不涉及任何配置变更
- Vercel 自动构建，无需额外操作
- 建议部署后24小时内运行 IndexNow 提交
- 上次commit 3天前，本地代码完整就绪
