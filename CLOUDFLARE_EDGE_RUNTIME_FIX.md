# Cloudflare Pages Edge Runtime 配置修复

## 问题描述

部署到 Cloudflare Pages 时报错:
```
✘ [ERROR] Missing entry-point
```

以及后续的:
```
⚡️ ERROR: Failed to produce a Cloudflare Pages build from the project.
⚡️ The following routes were not configured to run with the Edge Runtime
```

## 根本原因

Cloudflare Pages 使用 Workers 运行时,要求所有动态路由必须配置为使用 Edge Runtime。项目中的路由缺少 `export const runtime = 'edge'` 配置。

## 已修复的文件

### 1. 主 Layout
- ✅ `app/[locale]/layout.tsx` - 添加 Edge Runtime 配置

### 2. Legal Layout
- ✅ `app/(legal)/layout.tsx` - 添加 Edge Runtime 配置

### 3. API 路由 (14个)
- ✅ `app/api/add-feedback/route.ts` (已有配置)
- ✅ `app/api/auth/[...nextauth]/route.ts`
- ✅ `app/api/checkout/route.ts`
- ✅ `app/api/demo/gen-image/route.ts`
- ✅ `app/api/demo/gen-stream-text/route.ts`
- ✅ `app/api/demo/gen-text/route.ts`
- ✅ `app/api/get-user-credits/route.ts`
- ✅ `app/api/get-user-info/route.ts`
- ✅ `app/api/ping/route.ts`
- ✅ `app/api/stripe-notify/route.ts`
- ✅ `app/api/test-env/route.ts`
- ✅ `app/api/update-invite/route.ts`
- ✅ `app/api/update-invite-code/route.ts`
- ✅ `app/api/youtube/route.ts`

## 构建结果

✅ **构建成功!**

```
⚡️ Build Summary (@cloudflare/next-on-pages v1.13.7)

⚡️ Middleware Functions (1)
⚡️   - middleware

⚡️ Edge Function Routes (35)
   包括所有页面路由和 API 路由

⚡️ Other Static Assets (151)

⚡️ Build completed in 7.91s
```

## 下一步操作

### 1. 提交代码到 Git
```bash
git add .
git commit -m "fix: 添加 Edge Runtime 配置以支持 Cloudflare Pages 部署"
git push
```

### 2. 在 Cloudflare Pages 中配置

登录 [Cloudflare Dashboard](https://dash.cloudflare.com/) 并配置:

**构建设置:**
- **Framework preset**: Next.js
- **Build command**: `pnpm run cf:build`
- **Build output directory**: `.vercel/output/static`
- **删除 Deploy command** (Cloudflare Pages 会自动处理)

**环境变量:**
确保配置所有必要的环境变量:
- `NEXT_PUBLIC_*` 开头的公共变量
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `AUTH_SECRET`
- `STRIPE_PRIVATE_KEY`
- `STRIPE_PUBLIC_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `YOUTUBE_API_KEY`
- 其他必要的 API 密钥

### 3. 触发部署

保存配置后,Cloudflare Pages 会自动触发新的部署,或者你可以手动触发。

## 本地测试

在推送到 Cloudflare 之前,可以在本地测试:

```bash
# 构建 Cloudflare Pages 版本
pnpm run cf:build

# 本地预览
pnpm run cf:preview
```

## 技术说明

### Edge Runtime vs Node.js Runtime

- **Node.js Runtime**: Next.js 默认运行时,支持完整的 Node.js API
- **Edge Runtime**: 轻量级运行时,运行在边缘节点,启动更快但 API 受限

Cloudflare Pages 只支持 Edge Runtime,因此所有路由都需要配置:
```typescript
export const runtime = 'edge';
```

### 配置位置

- **Layout 文件**: 影响该 layout 下的所有页面
- **Page 文件**: 只影响该页面
- **Route 文件**: 只影响该 API 路由

在本项目中,我们在根 layout 和 legal layout 中配置了 Edge Runtime,这样所有子路由都会继承该配置。

## 参考资料

- [Next.js Edge Runtime 文档](https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [@cloudflare/next-on-pages 文档](https://github.com/cloudflare/next-on-pages)
