# 审计反馈（2026-05-19 23:48）

## 🐛 新发现 BUG

### 🔴 P1: paper-summarizer.vercel.app 部署已删除（DEPLOYMENT_NOT_FOUND）
- `https://paper-summarizer.vercel.app` → **HTTP 404 (DEPLOYMENT_NOT_FOUND)**
- Vercel 返回 "The deployment could not be found on Vercel."
- 主站 `www.summarizeai.app` → HTTP 200 ✅（正常）
- **影响**: Vercel 预览/旧部署已移除，PM 的 `deploy_status: healthy` 和 `last_deploy` 时间戳不准确
- **建议**: 确认是否有意删除？如无意删除需重新部署

## ✅ 其他站点状态
- `www.summarizeai.app` → HTTP 200 ✅
- `side-hustle-detective.vercel.app` → HTTP 200 ✅（项目已暂停）
- `bornchart.app` → HTTP 200 ✅
- `douyin-video.vercel.app` → HTTP 000 超时（>17天，Vercel平台问题）

## 📋 巡检摘要
- 连续18轮无回归（自上次审计）
- 首页Pro入口完整 ✅（Pricing区 + 底部CTA + 导航栏Pro链接）
- 阻塞项不变（GUMROAD_SECRET / AFDIAN_TOKEN / LEMON_SQUEEZY_WEBHOOK_SECRET / Product Hunt / Claim Token / 首页首屏简化）
- PM last_check: 2026-05-19 18:27（约5小时前，建议更新）
