# Google Analytics 设置指南

## ✅ 已完成的工作

1. **Google Analytics 4 代码已添加**
   - 位置：`src/layouts/Layout.astro`
   - 状态：✅ 已集成，等待您的测量 ID

2. **SEO Meta 标签已优化**
   - ✅ 首页：包含"Greenland 51st state"等关键词
   - ✅ Services：重点推广 ID Generator 和 Asset Calculator
   - ✅ Resources：强调自然资源和Arctic资产
   - ✅ Intel：地缘政治分析和情报简报
   - ✅ About：使命、FAQ 和时间线
   - ✅ Privacy Policy：数据保护和用户权利

## 🎯 下一步操作

### 第 1 步：创建 Google Analytics 账号

1. 访问 [Google Analytics](https://analytics.google.com/)
2. 点击 **"开始测量"**
3. 创建账号名称（例如："Project 51"）
4. 创建媒体资源名称（例如："Project 51 Website"）
5. 选择行业类别：**政治** 或 **娱乐**
6. 选择时区：**中国（北京时间）** 或您的本地时区
7. **重要**：选择 **Web** 作为平台

### 第 2 步：获取测量 ID

完成设置后，Google 会提供一个测量 ID，格式如下：
```
G-XXXXXXXXXX
```

### 第 3 步：替换占位符

打开 `src/layouts/Layout.astro` 文件，找到这两行：

```javascript
gtag('config', 'G-XXXXXXXXXX'); // 第 61 行
```

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script> // 第 63 行
```

将 `G-XXXXXXXXXX` 替换为您的实际测量 ID。

**示例**：
```javascript
gtag('config', 'G-ABC123DEF4');
```

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC123DEF4"></script>
```

### 第 4 步：重新部署

1. 运行 `npm run build`
2. 提交代码：`git add -A && git commit -m "chore: add Google Analytics measurement ID"`
3. 推送：`git push`
4. Cloudflare Pages 会自动部署

### 第 5 步：验证安装

1. 访问您的网站
2. 打开 Google Analytics 后台
3. 点击 **"实时"** 报告
4. 您应该能看到自己的访问

---

## 📊 关键 SEO 优化

### 已优化的关键词

| 页面 | 主要关键词 | 次要关键词 |
|------|-----------|-----------|
| 首页 | Greenland 51st state, satirical geopolitical analysis | Arctic sovereignty, thought experiment |
| Services | ID generator, asset calculator | Greenland citizenship, digital tools |
| Resources | Greenland natural resources, Arctic assets | rare earth minerals, oil reserves |
| Intel | geopolitical analysis, intelligence briefings | strategic assessments, policy updates |
| About | Project 51 mission, statehood initiative | FAQ, timeline, core values |

### Meta 描述长度

所有页面的 meta 描述都在 **150-160 字符** 之间，符合 Google 最佳实践。

---

## 🚀 推广建议

### 立即执行（本周）

1. **提交到搜索引擎**
   - Google Search Console: https://search.google.com/search-console
   - Bing Webmaster Tools: https://www.bing.com/webmasters

2. **社交媒体分享**
   - Reddit（r/geopolitics, r/greenland）
   - Twitter/X（使用 #Project51 #Greenland）
   - LinkedIn（专业角度）

3. **内容创作**
   - 每周发布 2-3 篇 Intel 文章
   - 关注热门话题（Arctic politics, climate change）

### 中期目标（本月）

1. **Hacker News**
   - 提交到 Show HN
   - 最佳时间：周一至周四上午

2. **Product Hunt**
   - 准备产品页面
   - 强调工具（ID Generator, Calculator）

3. **联系媒体**
   - 科技博客（The Verge, TechCrunch）
   - 政治评论网站

---

## ✅ 检查清单

- [x] Google Analytics 代码已添加
- [x] SEO meta 标签已优化
- [x] 构建成功
- [ ] 获取 GA 测量 ID
- [ ] 替换占位符
- [ ] 重新部署
- [ ] 提交到 Google Search Console
- [ ] 开始社交媒体推广

---

## 📞 需要帮助？

如果遇到任何问题：
1. 检查 Google Analytics 后台的"实时"报告
2. 使用浏览器开发者工具查看网络请求
3. 确保测量 ID 格式正确（G-XXXXXXXXXX）

祝您的网站流量暴涨！🚀
