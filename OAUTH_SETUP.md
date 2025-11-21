# OAuth 登录配置指南

## 快速开始 - GitHub OAuth (推荐)

### 1. 创建 GitHub OAuth App

1. 访问 https://github.com/settings/developers
2. 点击 "New OAuth App"
3. 填写信息:
   - **Application name**: ShipAny YouTube Discovery
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. 点击 "Register application"
5. 复制 **Client ID**
6. 点击 "Generate a new client secret" 并复制 **Client Secret**

### 2. 配置环境变量

在 `.env.local` 文件中添加:

```bash
# GitHub Auth
AUTH_GITHUB_ID="你的 GitHub Client ID"
AUTH_GITHUB_SECRET="你的 GitHub Client Secret"
NEXT_PUBLIC_AUTH_GITHUB_ENABLED="true"
```

### 3. 重启开发服务器

```bash
# 停止当前服务器 (Ctrl+C)
# 重新启动
pnpm dev
```

### 4. 测试登录

1. 访问 http://localhost:3000/auth/signin
2. 点击 "Sign in with GitHub" 按钮
3. 授权后会自动登录

---

## Google OAuth 配置 (可选)

### 1. 创建 Google OAuth 凭据

1. 访问 https://console.cloud.google.com/apis/credentials
2. 创建项目或选择现有项目
3. 点击 "创建凭据" > "OAuth 客户端 ID"
4. 应用类型选择 "Web 应用"
5. 添加授权重定向 URI:
   - `http://localhost:3000/api/auth/callback/google`
6. 复制 **客户端 ID** 和 **客户端密钥**

### 2. 配置环境变量

```bash
# Google Auth
AUTH_GOOGLE_ID="你的 Google Client ID"
AUTH_GOOGLE_SECRET="你的 Google Client Secret"
NEXT_PUBLIC_AUTH_GOOGLE_ID="你的 Google Client ID"
NEXT_PUBLIC_AUTH_GOOGLE_ENABLED="true"
```

### 3. Google One Tap (可选)

启用 Google One Tap 快速登录:

```bash
NEXT_PUBLIC_AUTH_GOOGLE_ONE_TAP_ENABLED="true"
```

---

## 生产环境配置

部署到生产环境时,需要更新回调 URL:

### GitHub
- Homepage URL: `https://yourdomain.com`
- Callback URL: `https://yourdomain.com/api/auth/callback/github`

### Google
- 授权重定向 URI: `https://yourdomain.com/api/auth/callback/google`

### 环境变量
在 Vercel/Netlify 等平台的环境变量中配置相同的值。

---

## 登录功能说明

### 登录页面
- 路径: `/auth/signin`
- 支持 GitHub 和 Google OAuth
- 自动保存用户信息到数据库

### 用户信息
登录后会保存:
- UUID (唯一标识)
- Email
- 昵称
- 头像
- 登录方式
- 创建时间
- IP 地址

### 会话管理
- 使用 NextAuth.js
- 会话持久化
- 自动刷新 token

---

## 在页面中使用登录

### 服务器端

```typescript
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  
  if (!session) {
    // 未登录
    return <div>Please sign in</div>;
  }
  
  // 已登录
  return <div>Welcome {session.user.name}</div>;
}
```

### 客户端

```typescript
"use client";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";

export default function Component() {
  const { data: session, status } = useSession();
  
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  
  if (!session) {
    return <button onClick={() => signIn()}>Sign in</button>;
  }
  
  return (
    <div>
      <p>Welcome {session.user.name}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
```

---

## API 路由中验证登录

```typescript
import { auth } from "@/auth";
import { getUserUuid } from "@/services/user";

export async function POST(req: Request) {
  // 检查登录状态
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // 获取用户 UUID
  const user_uuid = await getUserUuid();
  if (!user_uuid) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }
  
  // 继续处理...
}
```

---

## 故障排除

### 问题: 回调 URL 不匹配
**解决**: 确保 OAuth 应用中的回调 URL 与实际 URL 完全匹配

### 问题: 环境变量未生效
**解决**: 重启开发服务器

### 问题: 数据库连接失败
**解决**: 检查 `DATABASE_URL` 配置

### 问题: Session 为 null
**解决**: 
1. 检查 `AUTH_SECRET` 是否配置
2. 清除浏览器 cookies
3. 重新登录

---

## 安全建议

1. **生产环境**:
   - 使用 HTTPS
   - 设置强密码的 `AUTH_SECRET`
   - 限制 OAuth 回调域名

2. **密钥管理**:
   - 不要将密钥提交到 Git
   - 使用环境变量管理
   - 定期轮换密钥

3. **用户数据**:
   - 遵守 GDPR 等隐私法规
   - 提供数据删除功能
   - 加密敏感信息

---

## 相关文档

- NextAuth.js: https://authjs.dev
- GitHub OAuth: https://docs.github.com/en/apps/oauth-apps
- Google OAuth: https://developers.google.com/identity/protocols/oauth2
