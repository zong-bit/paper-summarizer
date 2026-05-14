/**
 * RapidAPI Wrapper — Paper Summarizer
 * =====================================
 *
 * 用作 RapidAPI 后端入口。RapidAPI 会将用户的请求代理到这个端点，
 * 并处理认证、限流、账单。
 *
 * 部署方式：独立 Express 服务（推荐 Railway / Render / Fly.io 部署）
 *
 * 启动：
 *    node pages/api/rapidapi.js
 *
 * 环境变量：
 *   - DEEPSEEK_API_KEY      DeepSeek API Key（必填）
 *   - RAPIDAPI_PROXY_SECRET RapidAPI 配置的 Proxy Secret（选填，不设则跳过验证）
 *   - PORT                  监听端口（默认 3001）
 *
 * 典型部署架构：
 *   RapidAPI Hub (api.rapidapi.com)
 *        │
 *        ▼  (反向代理，附带 X-RapidAPI-* 头)
 *   本服务 (pages/api/rapidapi.js)
 *        │
 *        ▼  (调用 DeepSeek API)
 *   api.deepseek.com
 */

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3001;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

if (!DEEPSEEK_API_KEY) {
  console.error('FATAL: DEEPSEEK_API_KEY environment variable is required');
  process.exit(1);
}

// --- 中间件 ---

// 解析 JSON 请求体
app.use(express.json({ limit: '1mb' }));

// RapidAPI Proxy Secret 验证（可选安全层）
app.use((req, res, next) => {
  if (process.env.RAPIDAPI_PROXY_SECRET) {
    const proxySecret = req.headers['x-rapidapi-proxy-secret'];
    if (proxySecret !== process.env.RAPIDAPI_PROXY_SECRET) {
      return res.status(403).json({
        error: 'Invalid or missing X-RapidAPI-Proxy-Secret header',
        code: 'FORBIDDEN',
      });
    }
  }
  next();
});

// CORS 头（RapidAPI 代理不需要，但方便本地调试）
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-RapidAPI-Proxy-Secret');
  if (req.method === 'OPTIONS') return res.status(204).end();
  next();
});

// --- 路由 ---

/**
 * GET /health — 健康检查
 * RapidAPI 可以配置此端点进行可用性监控。
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'paper-summarizer-rapidapi', timestamp: new Date().toISOString() });
});

/**
 * POST /summarize — 论文摘要
 *
 * RapidAPI 上定义：POST /summarize
 *
 * 请求体 (JSON):
 *   {
 *     "text": "论文全文（最长 15000 字符）",
 *     "style": "standard"  // 可选: "standard" | "simple" | "detailed"
 *   }
 *
 * 响应 (JSON):
 *   {
 *     "oneSentence": "一句话摘要",
 *     "keyFindings": ["发现1", "发现2", "发现3", "发现4", "发现5"],
 *     "methodology": "方法论简述",
 *     "conclusion": "主要结论",
 *     "_meta": { "textLength": 1234, "model": "deepseek-chat" }
 *   }
 *
 * 错误响应:
 *   { "error": "描述信息", "code": "ERROR_CODE" }
 */
app.post('/summarize', async (req, res) => {
  try {
    const { text, style = 'standard' } = req.body;

    // 参数验证
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({
        error: 'Missing required field: text',
        code: 'MISSING_PARAM',
      });
    }

    if (text.length > 50000) {
      return res.status(400).json({
        error: 'Text too long. Maximum 50000 characters.',
        code: 'TEXT_TOO_LONG',
      });
    }

    // 根据 style 选择不同 prompt
    const stylePrompts = {
      simple: `你是论文摘要助手。用极简单的方式总结以下论文。只返回 JSON（不要 markdown，不要代码块）：
{
  "oneSentence": "一句话（中学生也能看懂）",
  "keyFindings": ["发现1", "发现2", "发现3"],
  "methodology": "简单说明用了什么方法",
  "conclusion": "核心结论"
}`,
      detailed: `你是学术论文摘要专家。详细总结以下论文。只返回 JSON（不要 markdown，不要代码块）：
{
  "oneSentence": "一句话精炼总结",
  "keyFindings": ["发现1", "发现2", "发现3", "发现4", "发现5", "发现6"],
  "methodology": "详细描述研究方法和实验设计",
  "conclusion": "详细结论和未来研究方向",
  "limitations": ["局限性1", "局限性2", "局限性3"]
}`,
      standard: `你是论文摘要专家。总结以下论文内容。只返回 JSON（不要 markdown，不要代码块）：
{
  "oneSentence": "一句话总结",
  "keyFindings": ["发现1", "发现2", "发现3", "发现4", "发现5"],
  "methodology": "方法论简述",
  "conclusion": "主要结论"
}`,
    };

    const systemPrompt = stylePrompts[style] || stylePrompts.standard;

    // 限制文本长度防止滥用（DeepSeek 上下文窗口充足，但为防止消耗过大做限制）
    const maxChars = 15000;
    const truncatedText = text.slice(0, maxChars);

    // 调用 DeepSeek API
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: truncatedText },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('DeepSeek API error:', response.status, errorData);
      return res.status(response.status).json({
        error: errorData.error?.message || 'DeepSeek API returned an error',
        code: 'AI_SERVICE_ERROR',
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(502).json({
        error: 'No response content from AI service',
        code: 'AI_EMPTY_RESPONSE',
      });
    }

    // 解析 JSON（处理可能的 markdown 代码块包裹）
    let result;
    try {
      result = JSON.parse(content);
    } catch {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        try {
          result = JSON.parse(jsonMatch[1]);
        } catch {
          return res.status(502).json({
            error: 'Failed to parse AI response as JSON',
            code: 'PARSE_ERROR',
            debug: content.slice(0, 500),
          });
        }
      } else {
        return res.status(502).json({
          error: 'AI response was not valid JSON',
          code: 'PARSE_ERROR',
          debug: content.slice(0, 500),
        });
      }
    }

    // 添加元数据
    result._meta = {
      textLength: text.length,
      truncated: text.length > maxChars,
      model: 'deepseek-chat',
      style,
      timestamp: new Date().toISOString(),
    };

    res.json(result);
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    });
  }
});

/**
 * POST /summarize/pdf — PDF 论文摘要（如有 PDF 文本提取能力）
 * 占位端点，未来可接入 pdf-parse 库。
 */
app.post('/summarize/pdf', (req, res) => {
  res.status(501).json({
    error: 'PDF summarization not yet implemented',
    code: 'NOT_IMPLEMENTED',
  });
});

// 404 兜底
app.use((req, res) => {
  res.status(404).json({
    error: `Route not found: ${req.method} ${req.path}`,
    code: 'NOT_FOUND',
  });
});

// --- 启动 ---
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Paper Summarizer RapidAPI wrapper running on port ${PORT}`);
    console.log(`   Health:    http://localhost:${PORT}/health`);
    console.log(`   Summarize: POST http://localhost:${PORT}/summarize`);
    console.log(`   Style support: standard / simple / detailed`);
  });
}

// 导出用于测试
module.exports = app;
