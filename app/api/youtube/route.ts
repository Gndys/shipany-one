import {
  CreditsAmount,
  CreditsTransType,
  decreaseCredits,
} from "@/services/credit";
import { respData, respErr } from "@/lib/resp";
import { getUserUuid } from "@/services/user";

export const runtime = "edge";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3";

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  channelName: string;
  channelId: string;
  views: string;
  likes: string;
  comments: string;
  publishedAt: string;
  tags: string[];
  url: string;
  description: string;
}

export async function POST(req: Request) {
  try {
    console.log("YouTube API called");
    const { tags, maxResults = 20 } = await req.json();
    console.log("Request params:", { tags, maxResults });

    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      console.log("Invalid params: tags is required");
      return respErr("invalid params: tags is required");
    }

    if (!YOUTUBE_API_KEY) {
      console.log("YouTube API key not configured");
      return respErr("YouTube API key not configured");
    }
    
    console.log("YouTube API key exists:", !!YOUTUBE_API_KEY);

    // 用户认证和积分扣除
    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      console.log("User not authenticated");
      return respErr("请先登录后再使用此功能");
    }

    // 扣除积分
    try {
      await decreaseCredits({
        user_uuid,
        trans_type: CreditsTransType.Ping,
        credits: CreditsAmount.PingCost,
      });
      console.log("Credits decreased for user:", user_uuid);
    } catch (e) {
      console.error("Failed to decrease credits:", e);
      // 继续执行,不阻止 API 调用
    }

    // 构建搜索查询
    const searchQuery = tags.join(" OR ");

    // 调用 YouTube Search API
    const searchUrl = new URL(`${YOUTUBE_API_BASE_URL}/search`);
    searchUrl.searchParams.append("part", "snippet");
    searchUrl.searchParams.append("q", searchQuery);
    searchUrl.searchParams.append("type", "video");
    searchUrl.searchParams.append("order", "viewCount"); // 按观看次数排序
    searchUrl.searchParams.append("maxResults", maxResults.toString());
    searchUrl.searchParams.append("key", YOUTUBE_API_KEY);
    searchUrl.searchParams.append("relevanceLanguage", "zh"); // 优先中文内容

    console.log("Calling YouTube Search API:", searchUrl.toString());
    const searchResponse = await fetch(searchUrl.toString());
    console.log("Search response status:", searchResponse.status);
    
    if (!searchResponse.ok) {
      const errorData = await searchResponse.json();
      console.error("YouTube API error:", errorData);
      return respErr(`YouTube API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const searchData = await searchResponse.json();
    console.log("Search results count:", searchData.items?.length || 0);

    if (!searchData.items || searchData.items.length === 0) {
      return respData({
        videos: [],
        totalResults: 0,
      });
    }

    // 获取视频详细信息(包括统计数据)
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(",");
    
    const videosUrl = new URL(`${YOUTUBE_API_BASE_URL}/videos`);
    videosUrl.searchParams.append("part", "snippet,statistics,contentDetails");
    videosUrl.searchParams.append("id", videoIds);
    videosUrl.searchParams.append("key", YOUTUBE_API_KEY);

    const videosResponse = await fetch(videosUrl.toString());
    
    if (!videosResponse.ok) {
      const errorData = await videosResponse.json();
      console.error("YouTube Videos API error:", errorData);
      return respErr(`YouTube Videos API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const videosData = await videosResponse.json();

    // 格式化视频数据
    const videos: YouTubeVideo[] = videosData.items.map((item: any) => {
      const snippet = item.snippet;
      const statistics = item.statistics;

      return {
        id: item.id,
        title: snippet.title,
        thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url,
        channelName: snippet.channelTitle,
        channelId: snippet.channelId,
        views: formatNumber(statistics.viewCount),
        likes: formatNumber(statistics.likeCount),
        comments: formatNumber(statistics.commentCount),
        publishedAt: formatDate(snippet.publishedAt),
        tags: snippet.tags || [],
        url: `https://www.youtube.com/watch?v=${item.id}`,
        description: snippet.description,
      };
    });

    return respData({
      videos,
      totalResults: searchData.pageInfo?.totalResults || 0,
    });
  } catch (e: any) {
    console.error("YouTube API call failed:", e);
    console.error("Error message:", e.message);
    console.error("Error stack:", e.stack);
    return respErr(`YouTube API call failed: ${e.message || 'Unknown error'}`);
  }
}

// 格式化数字
function formatNumber(num: string | number): string {
  if (!num) return "0";
  const n = typeof num === "string" ? parseInt(num) : num;
  
  if (n >= 1000000) {
    return (n / 1000000).toFixed(1) + "M";
  } else if (n >= 1000) {
    return (n / 1000).toFixed(1) + "K";
  }
  return n.toString();
}

// 格式化日期
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "今天";
  } else if (diffDays === 1) {
    return "昨天";
  } else if (diffDays < 7) {
    return `${diffDays}天前`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks}周前`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months}个月前`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years}年前`;
  }
}
