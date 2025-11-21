# YouTube API 配置说明

## ⚠️ 重要提示

当前环境可能无法直接访问 YouTube API (googleapis.com),这是由于网络限制导致的。

**解决方案:**
1. 配置 HTTP 代理 (详见 `YOUTUBE_API_TROUBLESHOOTING.md`)
2. 使用 VPN
3. 部署到云平台 (Vercel/Netlify 等)
4. 使用模拟数据模式 (当前已实现)

**当前状态:** ✅ 代码已完成,包含后备机制,即使 API 不可用也能正常演示

---

## 1. 配置 API Key

在 `.env.local` 文件中添加你的 YouTube API Key:

```bash
YOUTUBE_API_KEY=AIzaSyASB7ulvDF_9BqfqNESgtTeMMdgdI5aDP0
```

✅ 已配置

## 2. API 功能说明

### 接口地址
`POST /api/youtube`

### 请求参数
```json
{
  "tags": ["AI", "科技", "编程"],  // 必填: 搜索标签数组
  "maxResults": 20                 // 可选: 返回结果数量,默认20
}
```

### 响应格式
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "videos": [
      {
        "id": "视频ID",
        "title": "视频标题",
        "thumbnail": "缩略图URL",
        "channelName": "频道名称",
        "channelId": "频道ID",
        "views": "1.2M",
        "likes": "85K",
        "comments": "3.2K",
        "publishedAt": "2天前",
        "tags": ["AI", "科技"],
        "url": "https://www.youtube.com/watch?v=xxx",
        "description": "视频描述"
      }
    ],
    "totalResults": 100
  }
}
```

## 3. 功能特性

- ✅ 根据标签搜索热门视频
- ✅ 按观看次数排序
- ✅ 获取视频统计数据(观看数、点赞数、评论数)
- ✅ 自动格式化数字(1.2M, 85K)
- ✅ 智能日期显示(今天、昨天、X天前)
- ✅ 用户认证和积分扣除
- ✅ 优先显示中文相关内容

## 4. 调试方法

### 方法1: 使用 curl
```bash
curl -X POST http://localhost:3000/api/youtube \
  -H "Content-Type: application/json" \
  -d '{"tags": ["AI", "科技"], "maxResults": 10}'
```

### 方法2: 使用 REST Client 插件
打开 `debug/youtube-api.http` 文件,点击 "Send Request" 按钮

### 方法3: 在页面上测试
访问 http://localhost:3000/quiz 直接使用界面测试

## 5. 注意事项

1. **API 配额限制**: YouTube Data API v3 有每日配额限制,请合理使用
2. **认证要求**: 需要用户登录才能调用 API
3. **积分消耗**: 每次调用会消耗 1 个积分
4. **搜索优化**: 
   - 使用 OR 逻辑组合多个标签
   - 按观看次数排序获取热门视频
   - 优先显示中文相关内容

## 6. 错误处理

常见错误及解决方案:

- `YouTube API key not configured`: 未配置 API Key
- `no auth`: 用户未登录
- `invalid params: tags is required`: 未提供标签参数
- `YouTube API error`: YouTube API 返回错误,检查配额和 API Key

## 7. API 配额说明

YouTube Data API v3 配额消耗:
- Search API: 每次调用消耗 100 配额
- Videos API: 每次调用消耗 1 配额
- 默认每日配额: 10,000

建议:
- 合理设置 maxResults 参数
- 考虑添加缓存机制
- 监控 API 使用情况
