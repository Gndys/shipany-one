# 🚀 快速开始指南

## 当前状态

✅ **已完成:**
- YouTube 爆款挖掘工具页面
- YouTube API 集成
- 用户登录系统
- 积分系统
- 响应式设计
- 暗黑模式支持

⚠️ **需要配置:**
- GitHub OAuth (必需)
- YouTube API Key (已配置,需要网络代理)

---

## 第一步: 配置 GitHub 登录

### 方式 1: 使用配置脚本 (推荐)

```bash
./setup-github-oauth.sh
```

按照提示输入 GitHub OAuth 信息即可。

### 方式 2: 手动配置

1. **创建 GitHub OAuth App**
   - 访问: https://github.com/settings/developers
   - 点击 "New OAuth App"
   - 填写信息:
     - Application name: `ShipAny YouTube Discovery`
     - Homepage URL: `http://localhost:3000`
     - Callback URL: `http://localhost:3000/api/auth/callback/github`
   - 创建后复制 Client ID 和 Client Secret

2. **更新 .env.local**
   ```bash
   AUTH_GITHUB_ID="你的 Client ID"
   AUTH_GITHUB_SECRET="你的 Client Secret"
   NEXT_PUBLIC_AUTH_GITHUB_ENABLED="true"
   ```

3. **重启服务器**
   ```bash
   # 停止当前服务器 (Ctrl+C)
   pnpm dev
   ```

---

## 第二步: 测试登录

1. 访问登录页面: http://localhost:3000/auth/signin
2. 点击 "Sign in with GitHub"
3. 授权后会自动登录并跳转

---

## 第三步: 使用 YouTube 工具

1. 访问: http://localhost:3000/quiz
2. 登录后,选择感兴趣的标签
3. 点击"搜索视频"按钮
4. 查看搜索结果

**注意:** 
- 未登录时会显示模拟数据
- 登录后会尝试调用真实 YouTube API
- 如果 API 不可用(网络限制),会自动降级到模拟数据

---

## 功能说明

### 1. YouTube 爆款挖掘工具
- **路径**: `/quiz`
- **功能**: 
  - 根据标签搜索热门视频
  - 显示视频统计数据(观看、点赞、评论)
  - 响应式卡片布局
  - 支持多标签筛选

### 2. 用户系统
- **登录**: GitHub OAuth
- **会话管理**: NextAuth.js
- **用户信息**: 自动保存到数据库
- **积分系统**: 每次搜索消耗 1 积分

### 3. API 端点
- `POST /api/youtube` - YouTube 视频搜索
  - 需要登录
  - 消耗积分
  - 返回视频列表

---

## 目录结构

```
.
├── app/
│   ├── api/
│   │   └── youtube/          # YouTube API 路由
│   ├── [locale]/
│   │   ├── (default)/
│   │   │   └── quiz/         # YouTube 工具页面
│   │   └── auth/
│   │       └── signin/       # 登录页面
├── auth/                     # NextAuth 配置
├── components/
│   └── sign/                 # 登录组件
├── services/                 # 业务逻辑
│   ├── user.ts              # 用户服务
│   └── credit.ts            # 积分服务
└── docs/
    ├── OAUTH_SETUP.md       # OAuth 详细配置
    ├── YOUTUBE_API_SETUP.md # YouTube API 配置
    └── YOUTUBE_API_TROUBLESHOOTING.md  # 故障排除
```

---

## 常见问题

### Q: 登录后还是显示"请登录"?
A: 刷新页面或清除浏览器缓存

### Q: YouTube API 调用失败?
A: 
1. 检查网络连接
2. 配置 HTTP 代理
3. 使用 VPN
4. 或者使用模拟数据模式(已自动降级)

### Q: 如何查看用户信息?
A: 登录后,右上角会显示用户头像和名称

### Q: 积分不足怎么办?
A: 
1. 查看 `services/credit.ts` 中的积分配置
2. 新用户默认有 10 积分
3. 可以通过支付系统购买(需要配置 Stripe)

### Q: 如何部署到生产环境?
A: 
1. 更新 GitHub OAuth 回调 URL 为生产域名
2. 在 Vercel/Netlify 配置环境变量
3. 推送代码自动部署

---

## 下一步

### 可选配置

1. **Google OAuth** (可选)
   - 参考 `OAUTH_SETUP.md`
   - 支持 Google One Tap 快速登录

2. **YouTube API 代理** (推荐)
   - 参考 `YOUTUBE_API_TROUBLESHOOTING.md`
   - 配置 HTTP 代理访问 YouTube API

3. **支付系统** (可选)
   - 配置 Stripe
   - 用户可以购买积分

4. **数据分析** (可选)
   - 配置 Google Analytics
   - 或使用 OpenPanel

### 功能扩展

1. **视频收藏功能**
   - 保存喜欢的视频
   - 创建视频列表

2. **趋势分析**
   - 分析视频趋势
   - 生成报告

3. **AI 推荐**
   - 基于用户偏好推荐视频
   - 智能标签建议

4. **社交分享**
   - 分享到社交媒体
   - 生成分享卡片

---

## 技术栈

- **框架**: Next.js 15
- **UI**: React 19 + TailwindCSS + shadcn/ui
- **动画**: Framer Motion
- **认证**: NextAuth.js
- **数据库**: Supabase (PostgreSQL)
- **API**: YouTube Data API v3
- **部署**: Vercel / Netlify

---

## 支持

- 📖 文档: 查看项目根目录的 `.md` 文件
- 🐛 问题: 提交 GitHub Issue
- 💬 社区: https://discord.gg/HQNnrzjZQS
- 🌐 官网: https://shipany.ai

---

## 许可证

查看 `LICENSE` 文件了解详情。
