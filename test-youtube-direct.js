// 直接测试 YouTube API
const YOUTUBE_API_KEY = "AIzaSyASB7ulvDF_9BqfqNESgtTeMMdgdI5aDP0";
const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3";

async function testYouTubeAPI() {
  try {
    const tags = ["AI"];
    const searchQuery = tags.join(" OR ");
    
    const searchUrl = new URL(`${YOUTUBE_API_BASE_URL}/search`);
    searchUrl.searchParams.append("part", "snippet");
    searchUrl.searchParams.append("q", searchQuery);
    searchUrl.searchParams.append("type", "video");
    searchUrl.searchParams.append("order", "viewCount");
    searchUrl.searchParams.append("maxResults", "3");
    searchUrl.searchParams.append("key", YOUTUBE_API_KEY);
    
    console.log("Calling:", searchUrl.toString());
    
    const response = await fetch(searchUrl.toString());
    console.log("Status:", response.status);
    
    const data = await response.json();
    console.log("Response:", JSON.stringify(data, null, 2));
    
    if (data.items) {
      console.log(`\nFound ${data.items.length} videos`);
      data.items.forEach((item, index) => {
        console.log(`${index + 1}. ${item.snippet.title}`);
      });
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

testYouTubeAPI();
