'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSession, signIn, signOut } from 'next-auth/react';
import { 
  Search, 
  TrendingUp, 
  Eye, 
  ThumbsUp, 
  MessageSquare, 
  Calendar,
  ExternalLink,
  Sparkles,
  Filter,
  Youtube,
  LogIn,
  LogOut,
  User
} from 'lucide-react';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  channelName: string;
  views: string;
  likes: string;
  comments: string;
  publishedAt: string;
  tags: string[];
  url: string;
}

// 模拟热门视频数据
const mockVideos: Video[] = [
  {
    id: '1',
    title: 'AI 工具革命：2024年最值得关注的10个AI工具',
    thumbnail: 'https://picsum.photos/seed/ai1/400/225',
    channelName: 'TechVision',
    views: '1.2M',
    likes: '85K',
    comments: '3.2K',
    publishedAt: '2天前',
    tags: ['AI', '科技', '工具', '教程'],
    url: 'https://youtube.com'
  },
  {
    id: '2',
    title: '从零开始学习 Next.js 15 - 完整教程',
    thumbnail: 'https://picsum.photos/seed/nextjs/400/225',
    channelName: 'CodeMaster',
    views: '856K',
    likes: '42K',
    comments: '1.8K',
    publishedAt: '5天前',
    tags: ['编程', 'Next.js', 'React', '教程'],
    url: 'https://youtube.com'
  },
  {
    id: '3',
    title: '2024年最赚钱的5个副业项目分享',
    thumbnail: 'https://picsum.photos/seed/money/400/225',
    channelName: '财富自由之路',
    views: '2.3M',
    likes: '125K',
    comments: '8.5K',
    publishedAt: '1周前',
    tags: ['副业', '赚钱', '创业', '理财'],
    url: 'https://youtube.com'
  },
  {
    id: '4',
    title: 'ChatGPT 高级使用技巧：10倍提升工作效率',
    thumbnail: 'https://picsum.photos/seed/chatgpt/400/225',
    channelName: 'AI探索者',
    views: '1.8M',
    likes: '95K',
    comments: '4.2K',
    publishedAt: '3天前',
    tags: ['AI', 'ChatGPT', '效率', '教程'],
    url: 'https://youtube.com'
  },
  {
    id: '5',
    title: 'Midjourney V6 完全指南：创作惊艳的AI艺术',
    thumbnail: 'https://picsum.photos/seed/midjourney/400/225',
    channelName: 'AI艺术家',
    views: '945K',
    likes: '58K',
    comments: '2.1K',
    publishedAt: '4天前',
    tags: ['AI', 'Midjourney', '设计', '艺术'],
    url: 'https://youtube.com'
  },
  {
    id: '6',
    title: 'YouTube 算法揭秘：如何让你的视频爆火',
    thumbnail: 'https://picsum.photos/seed/youtube/400/225',
    channelName: 'YouTube大师',
    views: '1.5M',
    likes: '78K',
    comments: '5.6K',
    publishedAt: '1周前',
    tags: ['YouTube', '营销', '流量', '教程'],
    url: 'https://youtube.com'
  }
];

const popularTags = [
  'AI', '科技', '编程', '教程', '赚钱', '副业', 
  'ChatGPT', 'Next.js', 'React', 'YouTube', 
  '设计', '创业', '理财', '效率'
];

export default function YouTubeDiscoveryPage() {
  const { data: session, status } = useSession();
  const [searchTag, setSearchTag] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [videos, setVideos] = useState<Video[]>(mockVideos);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string>('');

  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSearch = async () => {
    if (selectedTags.length === 0) {
      setError('请至少选择一个标签');
      return;
    }

    setIsSearching(true);
    setError('');
    
    try {
      const response = await fetch('/api/youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tags: selectedTags,
          maxResults: 20,
        }),
      });

      const result = await response.json();

      if (result.code === 0 && result.data) {
        setVideos(result.data.videos || []);
        if (result.data.videos.length === 0) {
          setError('没有找到相关视频');
        }
      } else {
        // API 调用失败,使用模拟数据作为后备
        console.warn('YouTube API failed, using mock data:', result.message);
        setError(`YouTube API 暂时不可用(${result.message}),显示模拟数据`);
        
        // 根据标签筛选模拟数据
        const filtered = mockVideos.filter(video =>
          video.tags.some(tag => selectedTags.includes(tag))
        );
        setVideos(filtered.length > 0 ? filtered : mockVideos);
      }
    } catch (e) {
      console.error('Search failed:', e);
      setError('网络错误,显示模拟数据');
      
      // 使用模拟数据作为后备
      const filtered = mockVideos.filter(video =>
        video.tags.some(tag => selectedTags.includes(tag))
      );
      setVideos(filtered.length > 0 ? filtered : mockVideos);
    } finally {
      setIsSearching(false);
    }
  };

  const handleReset = () => {
    setSelectedTags([]);
    setSearchTag('');
    setVideos(mockVideos);
    setError('');
  };

  const formatNumber = (num: string) => {
    return num;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-red-950 dark:to-orange-950">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* User Info Bar */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-end mb-4"
        >
          {status === "loading" ? (
            <div className="text-sm text-muted-foreground">加载中...</div>
          ) : session ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {session.user?.image ? (
                  <img 
                    src={session.user.image} 
                    alt={session.user.name || ''} 
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <User className="w-8 h-8 p-1.5 rounded-full bg-muted" />
                )}
                <span className="text-sm font-medium">{session.user?.name || session.user?.email}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => signOut()}
              >
                <LogOut className="w-4 h-4 mr-1" />
                退出
              </Button>
            </div>
          ) : (
            <Button 
              variant="default" 
              size="sm"
              onClick={() => signIn()}
            >
              <LogIn className="w-4 h-4 mr-1" />
              登录
            </Button>
          )}
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Youtube className="w-12 h-12 text-red-600" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              YouTube 爆款挖掘工具
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            通过标签发现热门视频，找到下一个爆款灵感
          </p>
          {!session && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4"
            >
              <Card className="max-w-md mx-auto bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                <CardContent className="pt-4 pb-4">
                  <p className="text-sm text-blue-900 dark:text-blue-100 mb-2">
                    💡 登录后可以使用真实的 YouTube API 搜索热门视频
                  </p>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="w-full"
                    onClick={() => signIn()}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    立即登录
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" />
                <CardTitle>标签筛选</CardTitle>
              </div>
              <CardDescription>
                选择感兴趣的标签，发现相关的热门视频
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Popular Tags */}
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  热门标签
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                      className="cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => handleTagSelect(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Selected Tags */}
              {selectedTags.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                >
                  <h3 className="text-sm font-medium mb-2">
                    已选择 ({selectedTags.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="default"
                        className="cursor-pointer"
                        onClick={() => handleTagSelect(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  onClick={handleSearch} 
                  className="flex-1"
                  disabled={isSearching}
                >
                  <Search className="w-4 h-4 mr-2" />
                  {isSearching ? '搜索中...' : '搜索视频'}
                </Button>
                <Button 
                  onClick={handleReset} 
                  variant="outline"
                >
                  重置
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-6"
        >
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-red-600" />
            热门视频
            <span className="text-sm font-normal text-muted-foreground">
              ({videos.length} 个结果)
            </span>
          </h2>
        </motion.div>

        {/* Video Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTags.join(',')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  {/* Thumbnail */}
                  <div className="relative overflow-hidden aspect-video">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  <CardContent className="p-4">
                    {/* Title */}
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                      {video.title}
                    </h3>

                    {/* Channel */}
                    <p className="text-sm text-muted-foreground mb-3">
                      {video.channelName}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Eye className="w-3 h-3" />
                        <span>{video.views}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{video.likes}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MessageSquare className="w-3 h-3" />
                        <span>{video.comments}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {video.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Published Date */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{video.publishedAt}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {videos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Youtube className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">没有找到相关视频</h3>
            <p className="text-muted-foreground mb-4">
              尝试选择其他标签或重置筛选条件
            </p>
            <Button onClick={handleReset} variant="outline">
              重置筛选
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
