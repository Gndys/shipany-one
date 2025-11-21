import { respData } from "@/lib/resp";

export async function GET() {
  return respData({
    hasYoutubeKey: !!process.env.YOUTUBE_API_KEY,
    keyLength: process.env.YOUTUBE_API_KEY?.length || 0,
  });
}
