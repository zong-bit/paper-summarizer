# ez-mystic 部署清单

> 生成日期：2026-05-15  
> 状态：待 CEO 操作

---

## CEO 需完成的操作（按顺序）

### 1. Git 初始化 + 推送
```bash
cd /home/zxw/.openclaw/workspace/ez-mystic
git add -A
git commit -m "feat: ez-mystic MVP — 八字排盘 + AI解读 + 命书PDF

- 八字引擎：真太阳时校正 + lunar-javascript + 十神/藏干/大运
- AI解读：DeepSeek路由 + mock fallback
- 命书PDF：jsPDF + NotoSans SC 字体
- 页面：首页/排盘页/命书页/支付页/博客页
- API：/api/bazi, /api/interpret, /api/pdf
- 构建：10路由全部正常，无类型错误"
git remote add origin <YOUR_REPO_URL>
git push -u origin master
```

### 2. 注册域名 fatewise.app
- 注册商推荐：Cloudflare Registrar（成本价 $9.85/年）或 Namecheap
- 注册后配置 DNS 指向 Vercel
- 同步注册 fatewise.ai 和 fatewise.co（品牌保护）

### 3. 配置环境变量
在 `.env` / Vercel 环境变量中设置：
```
DEEPSEEK_API_KEY=sk-xxx
DEEPSEEK_API_URL=https://api.deepseek.com/v1
DEEPSEEK_MODEL=deepseek-chat
NEXT_PUBLIC_APP_NAME=FateWise
NEXT_PUBLIC_APP_URL=https://fatewise.app
```

### 4. 部署到 Vercel
```bash
# 安装 vercel CLI
npm i -g vercel

# 首次部署（需登录 Vercel）
vercel

# 后续部署
vercel --prod
```

或手动操作：
1. 登录 vercel.com → Import Git Repository
2. 选择 ez-mystic 仓库
3. 添加环境变量
4. Deploy

### 5. 注册收款账户
**首选：Dodo Payments**（费率 4%+40c，支持中国）
- 注册：https://www.dodopayments.com
- 关联 Payoneer 收款
- 生成支付链接嵌入 /payment 页面

**备选：Paddle**（费率 5%+50c，支持中国）
- 注册：https://www.paddle.com
- 关联 Payoneer 或 Wire Transfer

### 6. 验证
- [ ] 域名解析生效
- [ ] HTTPS 正常
- [ ] 八字排盘功能正常
- [ ] AI 解读正常
- [ ] 命书PDF下载正常
- [ ] 支付流程正常

---

## 技术细节

### 构建产物
- 总大小：87.1kB shared chunks
- 10个静态页面 + 3个API路由
- 无类型错误，无编译警告

### 关键文件
- `src/bazi/engine.ts` — 八字排盘核心引擎
- `src/bazi/ganzhi.ts` — 干支计算
- `src/bazi/ai-prompt.ts` — AI解读Prompt
- `app/api/bazi/route.ts` — 排盘API
- `app/api/interpret/route.ts` — AI解读API
- `app/api/pdf/route.ts` — 命书PDF生成API
- `app/bazi/page.tsx` — 排盘页面
- `app/payment/page.tsx` — 支付页面
- `public/fonts/NotoSansSC-Bold.ttf` — 命书字体
- `public/fonts/NotoSansSC-Regular.ttf` — 命书字体

### 已完成的竞品调研
- FateTell: $4.99/周 → $99.99/年，2万+用户，Apple Featured
- 定价建议：$9.99/次解读 或 $19.99/月 或 $49.99/年
