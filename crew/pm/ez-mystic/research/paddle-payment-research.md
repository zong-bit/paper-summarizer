# Paddle 收款调研结果

## 调研日期
2026-05-14

## 结论
**Paddle 支持中国创作者收款，但不支持 PayPal 提现。**

## 详细分析

### 1. 中国卖家资格
- ✅ Paddle 的 unsupported 国家名单中**没有中国**
- ✅ 支持个体/sole trader 注册（不需要商业注册文件）
- ✅ 已服务 6,000+ SaaS/AI/App 公司

### 2. 结算货币
- ✅ 支持 **CNY（人民币）** 直接结算
- 也支持 USD, EUR, GBP, AUD, CAD, JPY 等 14+ 种货币

### 3. Payout 方式（重要限制）
- ✅ **Wire Transfer（电汇）** — 可收到中国银行
- ✅ **Payoneer** — 可提现到中国银行卡
- ❌ **不支持 PayPal 提现**
- 每月 2-15 号发放，最低门槛 $100
- 部分国家 $15 SWIFT 费

### 4. 费率
- **5% + $0.50/笔**（无月费）
- 货币转换费：1-1.5%（非本币结算时）
- Payoneer 提现费：1-4%（USD→CNY）

### 5. 收款路径（中国创作者）
```
Paddle → Payoneer → 中国银行 = 可行
Paddle → Wire Transfer → 中国银行 = 可行（可能有 SWIFT 费）
Paddle → PayPal → ❌ 不支持
```

### 6. 替代方案对比

| 方案 | 中国卖家 | PayPal提现 | 费率 | MoR |
|------|---------|-----------|------|-----|
| Paddle | ✅ | ❌ | 5%+50c | ✅ |
| Lemon Squeezy (Stripe) | ✅ | ❌ | 5%+50c | ✅ |
| Fungies.io | ✅ | ❌ | 5%+50c | ✅ |
| Dodo Payments | ✅ | ❌ | 4%+40c | ✅ |
| Stripe | ⚠️ 需海外实体 | ❌ | 2.9%+30c | ❌ |
| Gumroad | ⚠️ 需海外实体 | ❌ | 15% | ❌ |

### 7. 建议
1. **首选方案**：Paddle 或 Dodo Payments（更低费率 4%）→ Payoneer → 中国银行
2. **备选方案**：注册香港公司 → Stripe → 香港银行账户
3. **PayPal 不是可行路径**（Paddle 不支持 PayPal 提现，Stripe 中国不能收款）
4. 早期 MVP 阶段建议先用 Dodo Payments（费率更低，审批更宽松）

## 竞品定价更新 (2026-05-15)
### FateTell (AURAAI LIMITED) — 直接竞品
- **Weekly Pro**: $4.99/周
- **Annual Pro**: $59.99/年 (7天免费试用)
- **Annual Master**: $99.99/年
- 功能：八字排盘 + AI解读 + Pocket Book of Fate(30年八字智慧)
- 20,000+ 用户，Apple Featured
- 媒体曝光：Channel 4, MIT Technology Review, 香港经济日报, 新华社
- **关键洞察**：他们的"Pocket Book of Fate"功能与我们的命书PDF功能直接对标
- 定价策略：低周费门槛 + 高年费价值感

### 市场趋势 (2026)
- Taroscoper 等新竞品开始整合西方占星+中国生肖+AI
- FateTell 是东方命理赛道的头部App
- 2026是火马年，命理类App有季节性热点
