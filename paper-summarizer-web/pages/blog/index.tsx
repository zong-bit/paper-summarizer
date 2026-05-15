import Link from 'next/link'
import fs from 'fs'
import path from 'path'

const posts = [
  { slug: 'week26-mian-fei-e-du-dui-bi-2026', title: '2026年AI论文摘要工具免费额度大对比：哪款最划算？', desc: '实测5款主流AI论文摘要工具的免费额度：Paper Summarizer、ChatPDF、Scispace、Elicit、Kimi。从免费次数、字数限制到跨语言能力的全面对比，帮你找到最适合的免费AI论文摘要工具。' },
  { slug: 'rag-vs-long-context-2026', title: 'RAG vs 长上下文：LLM 到底该选谁？2026 年最新研究告诉你答案', desc: 'RAG（检索增强生成）和扩展长上下文窗口是当前 LLM 落地的两大主流方案。2026 年 5 月最新研究提出让 LLM 自己判断该走哪条路，帮你理清思路找到最适合的方案。' },
  { slug: '2026-ai-paper-summarization-trends', title: '2026 AI论文摘要新趋势：大模型如何改变科研阅读方式', desc: '多模态理解、推理增强、领域专用模型、实时协作与可解释性——五大趋势解析AI如何重塑科研阅读。' },
  { slug: 'ai-sheng-cheng-nei-rong-jian-ce-2026', title: 'AI生成内容检测技术2026：学术论文中的AI写作识别与应对指南', desc: '2026年AI生成内容检测技术最新进展。了解AI写作检测工具如何识别AI辅助的学术论文，研究者如何应对AI检测，以及如何合规使用AI论文摘要工具。' },
  { slug: 'context-contamination-llm-agent', title: '为什么重试让 LLM Agent 越修越糟？上下文污染问题深度解析', desc: 'arXiv最新论文揭示：Agent重试失败后，失败痕迹会"污染"下次尝试，使失败率提高7倍。首个数学模型CCRM给出最优重试策略。' },
  { slug: 'glguard-efficient-llm-guardrail', title: 'GLiGuard解读：0.3B参数实现27B级AI安全护栏，16倍加速的突破', desc: '2026年5月最新论文GLiGuard提出了一种革命性的LLM安全护栏方案：仅用0.3B参数（比传统方案小90倍）实现与7B-27B模型相当的检测精度，推理速度提升16倍。' },
  { slug: 'matryoshkalora-lora-dynamic-rank-2026', title: 'MatryoshkaLoRA解读：套娃式LoRA实现动态rank选择，微调效率再升级', desc: '2026年5月最新论文MatryoshkaLoRA提出了一种革命性的LoRA微调框架：通过"套娃"式层次化低秩表示，实现动态rank选择，无需网格搜索即可在不同计算预算下获得最优微调效果。' },
  { slug: 'how-value-induction-reshapes-llm-behavior-2026', title: '给AI"灌鸡汤"反而有害？价值诱导的连锁反应解读', desc: '2026年5月最新论文揭示：给AI"灌输"某种价值观会产生意想不到的连锁反应——所有价值诱导都会让模型变得更"讨好型人格"。深度解读这一发现对AI论文摘要工具的启示。' },
  { slug: 'beyond-pairs-preference-graph-dpo-2026', title: '大模型的"秘密偏好图"：Beyond Pairs论文解读——你的AI正在优化一个你看不见的关系网', desc: '2026年5月最新论文Beyond Pairs揭示：大模型在DPO训练时隐式优化一个偏好图。GraphDPO将这一结构显式化，在多个基准上显著优于DPO。深度解读技术原理及其对AI论文摘要工具的深远影响。' },
  { slug: '深度学习自然语言处理最新突破-2026', title: '深度学习在自然语言处理中的最新突破：2026年NLP技术全景解读', desc: '系统梳理2025-2026年NLP六大核心突破：推理能力飞跃、多模态融合、高效微调、长上下文处理、AI代理、推理加速，以及它们对AI论文摘要工具的深远影响。' },
  { slug: 'tool-calling-reasoning-2026', title: 'AI Agent"思考"如何用工具？2026年工具调用推理研究全景解读', desc: '系统梳理2025-2026年工具调用推理领域的核心论文、技术进展，以及这些突破如何直接影响AI论文摘要工具（如Paper Summarizer）的能力边界。' },
  { slug: 'agentic-ai-scientific-research-2026', title: 'AI Agent重塑科研范式：从文献检索到论文撰写的自动化革命', desc: '深度解读Stanford Agent Laboratory、Google DeepMind ChemCrow、Meta AutoResearch三大里程碑，详解AI Agent在科研全流程中的六大应用场景及未来趋势。' },
  { slug: 'ai-citation-management-academic-research-2026', title: '2026年AI学术引用管理完全指南：让参考文献管理效率提升10倍', desc: '深入探讨AI在学术引用管理中的应用：智能文献推荐、自动引用格式生成、知识图谱构建、引用上下文理解。含前沿论文解读、工具对比和实操指南。' },
  { slug: 'long-context-ai-paper-reading-2026', title: '长上下文AI如何改变论文阅读？2026年百万Token上下文革命解读', desc: '深度解析长上下文技术如何重塑AI论文摘要——从RoPE位置编码到FlashAttention，含模型对比、实战指南和SEO优化。' },
  { slug: 'paper-reading-efficiency-guide-2026', title: '论文阅读效率提升指南：用AI工具每天高效阅读10篇论文', desc: '系统性论文阅读工作流：从文献筛选到深度精读，用AI论文摘要工具将阅读效率提升10倍。含具体方法、工具推荐和实操步骤。' },
  { slug: 'ai-lun-wen-zhai-yao-gong-ju-zen-me-xuan', title: 'AI论文摘要工具怎么选？AI摘要与人工摘要的深度对比', desc: 'AI摘要与人工摘要的深度对比：速度、规模、深度、批判性思维、跨领域理解等10个维度全面评测，帮你找到最适合的摘要方式。' },
  { slug: 'ai-lun-wen-zhai-yao-gong-ju-shi-yong-zhi-nan-2026', title: 'AI论文摘要工具使用指南2026：从入门到精通', desc: '手把手教你使用AI论文摘要工具，从安装配置到高级技巧，让你的论文阅读效率翻倍。' },
  { slug: 'ai-paper-summary-chinese-support-review-2026', title: 'AI论文摘要工具中文支持深度测评：中文论文摘要到底靠不靠谱？', desc: '中文论文用AI摘要靠谱吗？实测6款主流AI论文摘要工具的中文支持能力，从摘要准确率、术语翻译、学术规范到中文文献理解深度，全面对比分析。' },
  { slug: 'ai-paper-summary-hallucination-2026', title: 'AI论文摘要的"幻觉"真相：2026年研究者必须知道的6种陷阱与应对指南', desc: '2026年AI幻觉问题引发学术信任危机。详解AI论文摘要中最常见的6种幻觉类型、真实数据案例，以及如何用科学方法识别和防范，确保你的研究不被AI误导。' },
  { slug: 'future-trends-ai-paper-summarizer', title: 'AI论文摘要工具的未来趋势：2026-2027年展望', desc: '深度解析AI论文摘要工具的四大未来趋势：多模态理解、推理增强、个性化摘要和AI Agent科研助手。为学术研究人员提供前瞻性展望和选择建议。' },
  { slug: 'how-to-verify-ai-paper-summaries-accuracy', title: '如何验证AI论文摘要的准确性：研究者必读的核实指南', desc: 'AI论文摘要真的准确吗？本文提供7个实用的验证方法，帮助研究者快速判断AI摘要质量，避免被AI幻觉误导。含具体案例和检查清单。' },
  { slug: 'ru-he-yong-ai-kuai-su-yue-du-ying-wen-wen-xian', title: '如何用AI快速阅读英文文献：非英语母语研究者的终极指南', desc: '非英语母语研究者如何用AI工具快速阅读英文文献？从AI论文摘要、中英双语对照到文献管理，一文教你提升10倍学术阅读效率。' },
  { slug: 'ai-research-productivity-guide-2026', title: '2026研究生科研效率革命：AI论文工具全攻略，从文献阅读到论文发表', desc: '2026年研究生必备科研效率提升指南：从文献检索、AI论文摘要、文献综述撰写到论文发表，全覆盖8大AI工具与实操工作流。附完整时间表：如何用AI将论文写作周期从3个月压缩到3周。' },
  { slug: 'ai-wen-xian-zong-shu-gong-ju-2026', title: 'AI文献综述工具推荐：2026年用AI写文献综述的正确姿势（附实操教程）', desc: '精选5款AI文献综述工具深度测评，从摘要生成到参考文献管理全覆盖。附完整新手实操教程：如何用AI在3天内完成一篇高质量的文献综述初稿。' },
  { slug: '5款免费论文摘要工具对比', title: '5款免费论文摘要工具横向对比（2025实测）', desc: '实测5款主流论文摘要工具，从免费额度、中文支持到AI摘要质量，一篇帮你选对。' },
  { slug: '摘要质量真实测试', title: 'paper-summarizer 摘要质量怎么样？真实测试', desc: '选取3篇不同领域论文做真实测试，分享摘要准确性评估结果和使用建议。' },
  { slug: 'paper-summarizer-faq', title: 'paper-summarizer FAQ — 常见问题解答', desc: '关于 paper-summarizer 的常见问题：免费额度、中文支持、数据安全、升级Pro等。' },
  { slug: '论文润色降重工具推荐-2026', title: '2026年论文润色与降重工具推荐及使用技巧全攻略', desc: '精选8款论文润色与降重工具（Grammarly、QuillBot、Turnitin等），对比功能与价格，分享降重实操技巧，帮你高效通过查重。' },
  { slug: 'ai-vs-human-summary', title: 'AI论文摘要工具 vs 手动摘要：哪个更适合你的科研需求？', desc: '从速度、准确性、多语言支持等维度深度对比AI摘要与人工摘要，告诉你如何结合两者优势提升科研效率。' },
  { slug: 'ai-paper-summarizer-tools-comparison-2026', title: 'AI论文摘要工具大对比：2026年最佳论文总结工具测评与选择指南', desc: '深度测评6款主流AI论文摘要工具（Paper Summarizer、ChatPDF、Scispace、Elicit、Consensus、ChatDOC），从摘要准确率、中文支持、批量处理、价格等12个维度客观对比。' },
  { slug: 'latent-planning-in-llms-2026', title: 'AI模型会"提前计划"吗？2026年最新研究揭示大模型的"思维路线图"', desc: '解读arXiv最新论文"Where\'s the Plan?"，揭示Gemma-3如何在内部"提前计划"未来输出，以及这对AI论文摘要工具的深远影响。' },
  { slug: 'ai-literature-review-workflow-2026', title: 'AI文献综述工作流2026：从文献检索到综述撰写的全流程指南', desc: '手把手教你用AI工具完成一篇完整的文献综述，从文献检索、筛选、阅读、笔记到撰写，全程AI辅助，效率提升10倍。' },
  { slug: 'ai-paper-summary-tool-comparison-2026', title: 'AI论文摘要工具对比2026：哪款最适合你的研究？', desc: '对比市面上主流AI论文摘要工具的核心功能、价格、中文支持等，帮你做出最明智的选择。' },
  { slug: 'the-future-of-academic-reading-with-ai', title: 'The Future of Academic Reading: How AI Is Changing Research', desc: 'How AI summarization tools are transforming the way researchers consume literature.' },
  { slug: 'ai-vs-manual-summarizing-which-is-better', title: 'AI vs Manual Summarizing: Which Is Better for Researchers?', desc: 'A honest comparison of AI summarization vs reading papers yourself.' },
  { slug: 'how-to-write-a-literature-review-faster', title: 'How to Write a Literature Review Faster Using AI Summarizers', desc: 'Speed up your literature review process with AI-powered paper summarization.' },
  { slug: 'how-to-summarize-a-research-paper-in-5-minutes', title: 'How to Summarize a Research Paper in 5 Minutes with AI', desc: 'Learn how to quickly extract key findings from any academic paper using our free AI summarizer.' },
  { slug: 'best-ai-tools-for-academic-paper-summary', title: 'Best AI Tools for Academic Paper Summary in 2025', desc: 'Compare the top AI paper summarizers and find out which one saves you the most time.' },
  { slug: 'how-to-extract-key-findings-from-pdf-papers', title: 'How to Extract Key Findings from PDF Papers Instantly', desc: 'Stop reading entire papers. Learn to extract methodology, results, and conclusions in seconds.' },
  { slug: 'common-mistakes-when-summarizing-academic-papers', title: 'Common Mistakes When Summarizing Academic Papers (And How to Avoid Them)', desc: 'Avoid these pitfalls when summarizing research papers for better accuracy.' },
  { slug: 'why-every-graduate-student-needs-an-ai-summarizer', title: 'Why Every Graduate Student Needs an AI Paper Summarizer', desc: 'Save dozens of hours per semester with AI-assisted paper reading.' },
  { slug: 'how-to-summarize-multiple-papers-at-once', title: 'How to Summarize Multiple Papers at Once: A Practical Guide', desc: 'Batch process your reading list with AI summarization techniques.' },
  { slug: 'ai-for-academic-writing', title: '研究生必备：5个提高论文写作效率的AI工具', desc: '研究生写论文的痛苦，只有经历过的人才懂。本文推荐5个研究生必备的AI工具，让你的论文写作效率翻倍。' },
  { slug: 'ai-side-hustle-100', title: '零基础用AI做副业：3个日赚100的方法', desc: '2025年，AI不再是程序员和科技公司的专属。零基础普通人也能用AI做副业赚钱。不是画大饼，不是割韭菜，而是真实可行的3个日赚100元的方法。' },
  { slug: 'ai-academic-writing-assistance-2026', title: 'AI学术写作辅助工具2026：从文献综述到论文发表的全流程指南', desc: '2026年AI学术写作辅助工具全景测评，从文献检索、摘要生成到论文润色，全流程AI赋能。' },
  { slug: 'free-ai-tools-2025', title: '2025年免费AI工具推荐：学生党必备的5个神器', desc: '2025年了，AI已经不再是科技圈的特权。推荐5款真正好用、完全免费的AI神器，亲测有效。' },
  { slug: 'chinese-ai-comparison', title: '2025年中国AI工具大对比：从ChatGPT到国产大模型，哪款最适合你？', desc: '深度对比ChatGPT、通义千问、文心一言、Kimi等主流AI工具，帮你找到最适合的AI助手。' },
  { slug: 'paper-summarizer-comparison', title: 'Paper Summarizer vs 其他AI论文摘要工具对比', desc: 'Paper Summarizer与ChatPDF、Scispace、Elicit等主流工具的全面对比，看看谁更胜一筹。' },
  { slug: 'paper-reading-workflow-2025', title: '2025年论文阅读工作流：从文献检索到深度精读的全流程', desc: '系统性论文阅读方法，结合AI工具提升阅读效率，从粗读到精读，一站式解决。' },
  { slug: '2026-05-11-xlstm-paper-interpretation', title: '【论文解读】xLSTM：让LSTM在Transformer时代重新杀回擂台！', desc: '解读SAP研究院最新论文xLSTM，看它如何用创新机制在多项任务上超越Transformer。' },
  { slug: '2026-05-11-ai-paper-summarizer-comparison', title: '2026年AI论文摘要工具对比：哪款最适合中国用户？', desc: '全面对比国内外主流AI论文摘要工具，从摘要质量、中文支持、价格等维度评测。' },
  { slug: '2026-05-12-lora-peft-efficient-fine-tuning', title: 'LoRA/PEFT高效微调技术详解：用小预算获得大模型能力', desc: '详解LoRA、LoRA+、QLoRA等高效微调技术，用极少的显存和算力实现大模型定制。' },
  { slug: '2026-05-12-autotts-test-time-scaling', title: 'Test-Time Scaling（TTS）技术解读：推理时动态调整算力', desc: '解读2026年最新研究Test-Time Scaling，让AI模型在推理时动态分配计算资源，提升效率。' },
  { slug: '2026-05-12-rag-academic-research-guide', title: 'RAG在学术研究中的应用指南：从原理到实践', desc: '手把手教你用RAG技术构建学术研究知识库，从文献检索到智能问答，全面提升研究效率。' },
  { slug: '2026-05-12-ai-lun-wen-zhai-yao-gong-ju-tui-jian', title: '2026年AI论文摘要工具推荐：从入门到进阶', desc: '精选多款AI论文摘要工具，从免费到付费，从入门到进阶，帮你找到最适合的那一款。' },
  { slug: '2026-05-12-ai-paper-reading-workflow-2026', title: '2026年AI论文阅读工作流：用AI工具每天高效阅读10篇论文', desc: '系统性论文阅读工作流，结合AI论文摘要、文献管理、笔记整理等工具，全面提升阅读效率。' },
  { slug: '2026-05-13-ai-wen-xian-zong-shu-gong-ju-tui-jian', title: 'AI文献综述工具推荐：2026年用AI写文献综述的正确姿势', desc: '精选5款AI文献综述工具深度测评，从摘要生成到参考文献管理全覆盖。' },
  { slug: '2026-05-13-ai-lun-wen-zhai-yao-dui-bi', title: 'AI论文摘要工具对比：2026年最新版', desc: '2026年最新AI论文摘要工具横向对比，从摘要质量、中文支持、价格等维度评测。' },
  { slug: '2026-05-13-LLM-context-contamination-jie-xi', title: '为什么重试让 LLM Agent 越修越糟？上下文污染问题深度解析', desc: 'arXiv最新论文揭示：Agent重试失败后，失败痕迹会"污染"下次尝试，使失败率提高7倍。' },
  { slug: '2026-05-14-ai-lun-wen-zhai-yao-dui-bi', title: '2026年5月AI论文摘要工具最新对比', desc: '最新评测：6款主流AI论文摘要工具在中文支持、摘要质量、价格等方面的对比。' },
  { slug: '2026-05-14-rag-vs-long-context', title: 'RAG vs 长上下文：LLM 到底该选谁？2026 年最新研究告诉你答案', desc: 'RAG（检索增强生成）和扩展长上下文窗口是当前 LLM 落地的两大主流方案。2026 年 5 月最新研究提出让 LLM 自己判断该走哪条路。' },
  { slug: '2026-05-14-bo-shi-sheng-he-yong-AI-ti-gao-ke-yan-xiao-lv', title: '博士生如何用AI提高科研效率：从文献阅读到论文发表', desc: '博士生科研效率提升指南：从文献检索、AI论文摘要、文献综述到论文发表，全覆盖8大AI工具与实操工作流。' },
  { slug: '2026-05-15-ai-lun-wen-zhai-yao-gong-ju-dui-bi', title: '2026年5月AI论文摘要工具终极对比', desc: '终极对比：6款主流AI论文摘要工具在中文支持、摘要质量、价格、功能等方面的全面评测。' },
  { slug: 'week19-yong-ai-kuai-su-shai-xuan-lun-wen', title: '如何用AI在5分钟内判断一篇论文是否值得精读：科研效率的降维打击', desc: '面对海量论文，你最大的时间杀手不是"读不懂"，而是"读了发现不值得读"。用AI快速筛选，把时间花在真正值得精读的论文上。' },
  { slug: 'week20-fu-xian-lun-wen-shi-yan-jie-guo', title: '如何用AI工具快速复现一篇论文的实验结果：科研人员的完整指南', desc: '论文读完了，结论很有意思，但你想验证一下——AI能帮你把复现时间从两周缩短到两天。' },
  { slug: 'week21-yong-AI-shi-xian-lun-wen-san-ceng-yue-du-fa', title: '用AI实现论文"三层阅读法"：让每篇论文的阅读效率提升5倍', desc: '2026年的科研工作者每年要面对超过1000篇新论文。用传统方法精读每一篇是不可能的——但用AI辅助的"三层阅读法"，你只需要精读其中20%，就能掌握一个领域80%的核心知识。' },
  { slug: 'week22-xue-shu-fa-xian-gong-ju-dui-bi', title: 'Connected Papers vs ResearchRabbit vs Elicit：2026年学术发现工具横评', desc: '三大学术发现工具深度对比：Connected Papers的可视化图谱、ResearchRabbit的推荐算法、Elicit的AI问答，哪个更适合你？' },
  { slug: 'week23-yong-ai-gong-ju-bi-jiao-xuan-ze-zhi-nan', title: '2026年AI论文摘要工具全对比：哪款最适合你？', desc: '本文原创于 Paper Summarizer，发布于 2026年5月15日。免费使用，无需注册。' },
  { slug: 'week24-yong-AI-zheng-he-duo-yuan-wen-xian-yue-du', title: '用AI整合多源文献阅读：博士生必读的文献管理新范式', desc: '做学术研究，最头疼的不是写论文，而是读论文。多源文献管理、整合、对比阅读——用AI工具构建你的个人文献知识库，让阅读效率提升10倍。' },
  { slug: 'week25-yong-AI-sheng-cheng-lun-wen-da-geng-gong-ju-pu-cha', title: '2026年AI论文大纲生成工具全攻略：从选题到框架一键搞定', desc: '深度评测ChatGPT、Kimi、通义千问等5款主流工具的论文大纲生成能力，附实操指南和最佳实践，帮你从选题到三级框架一键搞定。' },
]

export const metadata = {
  title: 'Blog - Paper Summarizer | AI Research Tips',
  description: 'Learn how to summarize academic papers efficiently with AI. Tips, guides, and best practices for researchers and students.',
  keywords: 'AI paper summarizer, research paper summary, AI literature review, academic paper tools, paper reading tips',
  alternates: {
    canonical: 'https://www.summarizeai.app/blog/',
  },
  openGraph: {
    title: 'Blog - Paper Summarizer | AI Research Tips',
    description: 'Learn how to summarize academic papers efficiently with AI. Tips, guides, and best practices for researchers and students.',
    type: 'website',
    url: 'https://www.summarizeai.app/blog/',
    siteName: 'Paper Summarizer',
    images: [
      {
        url: 'https://www.summarizeai.app/og-blog.png',
        width: 1200,
        height: 630,
        alt: 'Paper Summarizer Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Paper Summarizer | AI Research Tips',
    description: 'Learn how to summarize academic papers efficiently with AI.',
    images: ['https://www.summarizeai.app/og-blog.png'],
  },
}

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-bg-card/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2 2V5a2 2 0 012 2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-text">Paper Summarizer</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-text-secondary hover:text-text transition-colors text-sm">Home</Link>
            <Link href="/blog" className="text-primary font-medium text-sm">Blog</Link>
            <Link href="/tools" className="text-text-secondary hover:text-text transition-colors text-sm">Prompt Lab</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-text mb-2">Paper Summarizer Blog</h1>
        <p className="text-text-secondary mb-8">Tips and guides for summarizing academic papers with AI. 论文阅读、文献综述、AI摘要工具推荐。</p>
        
        <div className="grid gap-6">
          {posts.map(post => (
            <Link key={post.slug} href={"/blog/" + post.slug} className="block bg-bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors">
              <h2 className="text-xl font-semibold text-text mb-2">{post.title}</h2>
              <p className="text-text-secondary">{post.desc}</p>
            </Link>
          ))}
        </div>
        <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 border border-primary/20 rounded-2xl text-center">
          <p className="text-text font-semibold mb-3">Try It Yourself ✨</p>
          <p className="text-text-secondary text-sm mb-4">Upload a PDF or paste any academic paper to get an AI-powered summary with key findings, methodology, and conclusions — in seconds.</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2 2V5a2 2 0 012 2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Try Free AI Summarizer
          </a>
        </div>
      </main>

      <footer className="border-t border-border bg-bg-card/50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Link href="/" className="text-primary hover:text-primary-dark transition-colors">← Back to Summarizer</Link>
        </div>
      </footer>
    </div>
  )
}
