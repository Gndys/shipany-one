# Cloudflare Pages 部署配置修复指南

## 问题原因

当前 Cloudflare Pages 的构建配置使用了错误的命令:
- 使用了 `npx wrangler deploy` 但没有指定入口点
- 没有运行 `@cloudflare/next-on-pages` 来生成 Cloudflare Pages 兼容的构建输出

## 解决方案

### 步骤 1: 登录 Cloudflare Dashboard

访问 [Cloudflare Dashboard](https://dash.cloudflare.com/) 并进入你的 Pages 项目

### 步骤 2: 修改构建设置

进入项目的 **Settings** > **Builds & deployments** 页面,修改以下配置:

#### 推荐配置 (Cloudflare Pages 自动部署)

```
Framework preset: Next.js
Build command: pnpm run cf:build
Build output directory: .vercel/output/static
```

**删除或清空 "Deploy command" 字段** - Cloudflare Pages 会自动处理部署

#### 备选配置 (手动指定部署命令)

```
Framework preset: Next.js
Build command: pnpm run build && pnpm run cf:build
Build output directory: .vercel/output/static
Deploy command: wrangler pages deploy .vercel/output/static
```

### 步骤 3: 环境变量

确保在 Cloudflare Pages 项目设置中配置了所有必要的环境变量:

- `NEXT_PUBLIC_*` 开头的公共环境变量
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `AUTH_SECRET`
- 其他必要的 API 密钥

### 步骤 4: 重新部署

1. 保存构建设置
2. 触发新的部署 (可以通过 Git push 或在 Dashboard 中手动触发)
3. 查看构建日志确认是否成功

## 本地测试 Cloudflare Pages 构建

在推送到 Cloudflare 之前,可以在本地测试:

```bash
# 构建 Cloudflare Pages 版本
pnpm run cf:build

# 本地预览
pnpm run cf:preview
```

## 常见问题

### Q: 为什么需要 `@cloudflare/next-on-pages`?

A: Next.js 默认构建的是 Node.js 应用,而 Cloudflare Pages 使用的是 Workers 运行时。`@cloudflare/next-on-pages` 会将 Next.js 应用转换为 Cloudflare Workers 兼容的格式。

### Q: 构建输出目录为什么是 `.vercel/output/static`?

A: `@cloudflare/next-on-pages` 会将转换后的文件输出到这个目录,这是 Cloudflare Pages 能够识别和部署的格式。

### Q: 如果还是报错怎么办?

A: 检查以下几点:
1. 确保 `package.json` 中有 `@cloudflare/next-on-pages` 依赖
2. 确保 Node.js 版本兼容 (推荐 18.x 或 20.x)
3. 检查构建日志中的具体错误信息
4. 确保所有环境变量都已正确配置

## 参考资料

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [@cloudflare/next-on-pages 文档](https://github.com/cloudflare/next-on-pages)
