# YouTube API 故障排除

## 问题: 网络连接超时

### 症状
- API 调用返回错误: `YouTube API call failed`
- 控制台显示: `Connect Timeout Error`
- 无法访问 `googleapis.com`

### 原因
YouTube API (googleapis.com) 在某些网络环境下可能无法直接访问,需要配置代理。

## 解决方案

### 方案 1: 使用代理 (推荐用于开发环境)

在项目中配置 HTTP 代理:

```bash
# 安装代理包
pnpm add https-proxy-agent

# 或
npm install https-proxy-agent
```

然后修改 `app/api/youtube/route.ts`:

```typescript
import { HttpsProxyAgent } from 'https-proxy-agent';

// 配置代理
const proxyUrl = process.env.HTTP_PROXY || process.env.HTTPS_PROXY;
const agent = proxyUrl ? new HttpsProxyAgent(proxyUrl) : undefined;

// 在 fetch 调用中使用代理
const searchResponse = await fetch(searchUrl.toString(), {
  agent: agent as any
});
```

在 `.env.local` 中添加代理配置:

```bash
HTTP_PROXY=http://your-proxy-server:port
HTTPS_PROXY=http://your-proxy-server:port
```

### 方案 2: 使用 VPN

如果你有 VPN 服务,启用 VPN 后重启开发服务器。

### 方案 3: 使用后备数据 (当前实现)

当前代码已实现后备机制:
- ✅ 尝试调用真实 YouTube API
- ✅ 如果失败,自动使用模拟数据
- ✅ 显示友好的错误提示

这样即使 API 不可用,应用仍然可以正常演示功能。

### 方案 4: 使用服务器端代理

部署到 Vercel 或其他云平台时,通常可以正常访问 YouTube API。

## 测试 API 连接

### 测试 1: 检查网络连接

```bash
# 测试是否能访问 Google API
curl -I https://www.googleapis.com

# 如果超时,说明需要配置代理
```

### 测试 2: 使用代理测试

```bash
# 通过代理测试
curl -x http://your-proxy:port https://www.googleapis.com/youtube/v3/search?part=snippet&q=test&key=YOUR_API_KEY
```

### 测试 3: 验证 API Key

访问: https://console.cloud.google.com/apis/credentials

确认:
- API Key 是否有效
- YouTube Data API v3 是否已启用
- 配额是否充足

## 当前状态

✅ **已实现功能:**
- YouTube API 集成代码
- 完整的错误处理
- 模拟数据后备机制
- 友好的用户提示

⚠️ **需要解决:**
- 网络访问限制 (需要代理或 VPN)

## 生产环境建议

1. **使用云平台部署**: Vercel、Netlify 等通常可以正常访问 YouTube API
2. **配置服务器端代理**: 在服务器环境配置代理
3. **监控 API 配额**: 设置配额告警
4. **实现缓存机制**: 减少 API 调用次数
5. **添加重试逻辑**: 处理临时网络故障

## 替代方案

如果无法解决网络问题,可以考虑:

1. **使用 YouTube RSS Feed**: 不需要 API Key,但功能有限
2. **使用第三方 API 服务**: 如 RapidAPI 上的 YouTube 数据服务
3. **爬虫方案**: 使用 Puppeteer 等工具(需注意合规性)
4. **仅使用模拟数据**: 用于演示和开发

## 联系支持

如需进一步帮助:
- YouTube API 文档: https://developers.google.com/youtube/v3
- Google Cloud 支持: https://cloud.google.com/support
- ShipAny 社区: https://discord.gg/HQNnrzjZQS
