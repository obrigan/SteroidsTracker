
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { 
  Users, MessageCircle, Heart, Share2, Eye, 
  Trophy, Star, ThumbsUp, MessageSquare, UserPlus,
  Crown, Award, TrendingUp, Lock
} from "lucide-react";

interface Post {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  level: number;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  timestamp: string;
  isAnonymous: boolean;
  tags: string[];
}

interface Mentor {
  id: string;
  username: string;
  avatar: string;
  level: number;
  specialization: string[];
  rating: number;
  studentsCount: number;
  isVerified: boolean;
  price?: number;
}

export function SocialHub() {
  const [activeTab, setActiveTab] = useState('feed');
  
  const [posts] = useState<Post[]>([
    {
      id: '1',
      userId: 'user1',
      username: 'SteroidPro',
      avatar: '👨‍💼',
      level: 15,
      content: 'Завершил свой первый 12-недельный цикл тест энантата. Результаты превзошли ожидания! +8кг сухой массы при минимальных побочках. Ключ - правильная ПКТ и постоянный мониторинг.',
      imageUrl: '/progress-photo.jpg',
      likes: 24,
      comments: 8,
      isLiked: false,
      timestamp: '2 часа назад',
      isAnonymous: false,
      tags: ['testosterone', 'first_cycle', 'results']
    },
    {
      id: '2',
      userId: 'user2', 
      username: 'Анонимный пользователь',
      avatar: '🕶️',
      level: 8,
      content: 'Вопрос по дозировкам: начинаю первый цикл, посоветуйте оптимальную дозу тестостерона для новичка? Рост 180, вес 75кг, тренируюсь 3 года.',
      likes: 12,
      comments: 15,
      isLiked: true,
      timestamp: '4 часа назад',
      isAnonymous: true,
      tags: ['beginner', 'dosage', 'advice']
    }
  ]);

  const [mentors] = useState<Mentor[]>([
    {
      id: '1',
      username: 'DrSteroid',
      avatar: '👨‍⚕️',
      level: 25,
      specialization: ['Эндокринология', 'ПКТ', 'Побочные эффекты'],
      rating: 4.9,
      studentsCount: 156,
      isVerified: true,
      price: 50
    },
    {
      id: '2',
      username: 'ExperiencedLifter',
      avatar: '💪',
      level: 20,
      specialization: ['Массонабор', 'Сушка', 'Женские циклы'],
      rating: 4.7,
      studentsCount: 89,
      isVerified: true,
      price: 30
    }
  ]);

  const handleLike = (postId: string) => {
    // Лайк поста
    console.log('Liked post:', postId);
  };

  const handleComment = (postId: string) => {
    // Открыть комментарии
    console.log('Open comments for:', postId);
  };

  const handleShare = (postId: string) => {
    // Поделиться постом
    console.log('Share post:', postId);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="feed">Лента</TabsTrigger>
          <TabsTrigger value="groups">Группы</TabsTrigger>
          <TabsTrigger value="mentors">Менторы</TabsTrigger>
          <TabsTrigger value="market">Маркет</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-4">
          {/* Create Post Card */}
          <Card className="bg-card-surface border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback>👤</AvatarFallback>
                </Avatar>
                <Button 
                  variant="outline" 
                  className="flex-1 justify-start text-gray-400 bg-gray-800/50"
                >
                  Поделитесь своим опытом...
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">
                  📸 Фото
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  🔒 Анонимно
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Posts Feed */}
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-card-surface border-gray-800">
                <CardContent className="p-4">
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>{post.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-white">
                            {post.username}
                          </span>
                          <Badge className="text-xs bg-energy-orange text-white">
                            Lv.{post.level}
                          </Badge>
                          {post.isAnonymous && (
                            <Badge className="text-xs bg-gray-600">
                              Анонимно
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">{post.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-gray-300 mb-3">{post.content}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                    <div className="flex space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post.id)}
                        className={`text-gray-400 hover:text-medical-red ${
                          post.isLiked ? 'text-medical-red' : ''
                        }`}
                      >
                        <Heart className={`w-4 h-4 mr-1 ${
                          post.isLiked ? 'fill-current' : ''
                        }`} />
                        {post.likes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleComment(post.id)}
                        className="text-gray-400 hover:text-medical-blue"
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {post.comments}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare(post.id)}
                        className="text-gray-400 hover:text-health-green"
                      >
                        <Share2 className="w-4 h-4 mr-1" />
                        Поделиться
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          <Card className="bg-card-surface border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Приватные группы
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'Новички в стероидах', members: 1247, isPrivate: false },
                { name: 'Продвинутые пользователи', members: 456, isPrivate: true },
                { name: 'Женские циклы', members: 203, isPrivate: true },
                { name: 'ПКТ и восстановление', members: 892, isPrivate: false }
              ].map((group, index) => (
                <motion.div
                  key={group.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-medical-blue/20 rounded-full flex items-center justify-center">
                      {group.isPrivate ? (
                        <Lock className="w-5 h-5 text-medical-blue" />
                      ) : (
                        <Users className="w-5 h-5 text-health-green" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{group.name}</div>
                      <div className="text-xs text-gray-400">{group.members} участников</div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    {group.isPrivate ? 'Запросить' : 'Войти'}
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mentors" className="space-y-4">
          <Card className="bg-gradient-to-r from-energy-orange/10 to-medical-blue/10 border-energy-orange/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Crown className="w-5 h-5 mr-2 text-energy-orange" />
                Профессиональные менторы
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mentors.map((mentor, index) => (
                <motion.div
                  key={mentor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-card-surface border-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback>{mentor.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-white">{mentor.username}</h4>
                            {mentor.isVerified && (
                              <Badge className="text-xs bg-health-green">
                                ✓ Верифицирован
                              </Badge>
                            )}
                            <Badge className="text-xs bg-energy-orange">
                              Lv.{mentor.level}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center space-x-4 mb-2">
                            <div className="flex items-center text-yellow-400">
                              <Star className="w-4 h-4 mr-1 fill-current" />
                              <span className="text-sm">{mentor.rating}</span>
                            </div>
                            <span className="text-sm text-gray-400">
                              {mentor.studentsCount} учеников
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mb-3">
                            {mentor.specialization.map((spec) => (
                              <Badge key={spec} variant="outline" className="text-xs">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-energy-orange">
                              {mentor.price ? `$${mentor.price}/час` : 'Бесплатно'}
                            </span>
                            <Button size="sm" className="bg-medical-blue hover:bg-medical-blue/90">
                              Связаться
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market" className="space-y-4">
          <Card className="bg-card-surface border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">🛒 Маркетплейс</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🚧</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  В разработке
                </h3>
                <p className="text-gray-400 text-sm">
                  Безопасный маркетплейс для проверенных поставщиков
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
