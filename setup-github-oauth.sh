#!/bin/bash

echo "🚀 GitHub OAuth 配置助手"
echo "========================"
echo ""
echo "请按照以下步骤操作:"
echo ""
echo "1. 访问 https://github.com/settings/developers"
echo "2. 点击 'New OAuth App'"
echo "3. 填写以下信息:"
echo "   - Application name: ShipAny YouTube Discovery"
echo "   - Homepage URL: http://localhost:3000"
echo "   - Callback URL: http://localhost:3000/api/auth/callback/github"
echo "4. 创建后,复制 Client ID 和 Client Secret"
echo ""
echo "========================"
echo ""

read -p "请输入 GitHub Client ID: " CLIENT_ID
read -p "请输入 GitHub Client Secret: " CLIENT_SECRET

if [ -z "$CLIENT_ID" ] || [ -z "$CLIENT_SECRET" ]; then
    echo "❌ Client ID 和 Client Secret 不能为空"
    exit 1
fi

echo ""
echo "正在配置..."

# 更新 .env.local
if grep -q "AUTH_GITHUB_ID" .env.local; then
    # 更新现有配置
    sed -i '' "s|AUTH_GITHUB_ID = \".*\"|AUTH_GITHUB_ID = \"$CLIENT_ID\"|" .env.local
    sed -i '' "s|AUTH_GITHUB_SECRET = \".*\"|AUTH_GITHUB_SECRET = \"$CLIENT_SECRET\"|" .env.local
    sed -i '' 's|NEXT_PUBLIC_AUTH_GITHUB_ENABLED = "false"|NEXT_PUBLIC_AUTH_GITHUB_ENABLED = "true"|' .env.local
else
    # 添加新配置
    echo "" >> .env.local
    echo "# GitHub OAuth" >> .env.local
    echo "AUTH_GITHUB_ID = \"$CLIENT_ID\"" >> .env.local
    echo "AUTH_GITHUB_SECRET = \"$CLIENT_SECRET\"" >> .env.local
    echo "NEXT_PUBLIC_AUTH_GITHUB_ENABLED = \"true\"" >> .env.local
fi

echo ""
echo "✅ 配置完成!"
echo ""
echo "请重启开发服务器:"
echo "  1. 按 Ctrl+C 停止当前服务器"
echo "  2. 运行: pnpm dev"
echo ""
echo "然后访问: http://localhost:3000/auth/signin"
echo ""
