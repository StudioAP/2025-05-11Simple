import React, { useEffect, useRef, useState } from "react";
import Button from "./Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { toast } from "./ui/use-toast";
import newsData from "../data/news.json";
import { createClient } from "contentful";

interface Announcement {
  title: string;
  date: string;
  description: string;
  imageUrl?: string;
}

// Contentfulクライアントの初期化（環境変数が設定されている場合のみ）
const contentfulClient = import.meta.env.VITE_CONTENTFUL_SPACE_ID && import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN
  ? createClient({
      space: import.meta.env.VITE_CONTENTFUL_SPACE_ID,
      accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN,
    })
  : null;

const News = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const fadeRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [adminOpen, setAdminOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  
  // ニュースアナウンスメントのstate
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [visibleAnnouncements, setVisibleAnnouncements] = useState<Announcement[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    date: "",
    description: "",
    imageUrl: ""
  });

  // コンテナの高さを計測して、表示可能なアナウンスメント数を決定
  useEffect(() => {
    const updateContainerHeight = () => {
      const container = document.getElementById('news-container');
      if (container) {
        setContainerHeight(container.clientHeight);
      }
    };

    updateContainerHeight();
    window.addEventListener('resize', updateContainerHeight);
    
    return () => {
      window.removeEventListener('resize', updateContainerHeight);
    };
  }, []);

  // 表示可能なアナウンスメントを計算（ビューポートからあふれる場合は古い記事から非表示）
  useEffect(() => {
    if (announcements.length && containerHeight > 0) {
      const calculateVisibleItems = () => {
        // ニュースアイテム1つの平均的な高さ（仮定）
        const averageItemHeight = 120; 
        // 2段組みの列数
        const columns = window.innerWidth >= 768 ? 2 : 1;
        // 表示可能なアイテム数を計算
        const maxVisibleItems = Math.floor((containerHeight / averageItemHeight) * columns);
        // 新しい順に表示（最新のmaxVisibleItems個）
        return announcements.slice(0, Math.max(maxVisibleItems, 1));
      };
      
      setVisibleAnnouncements(calculateVisibleItems());
      
      // リサイズ時にも再計算
      const handleResize = () => {
        setVisibleAnnouncements(calculateVisibleItems());
      };
      
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    } else {
      setVisibleAnnouncements(announcements);
    }
  }, [announcements, containerHeight]);

  // Contentfulからニュースデータを取得
  useEffect(() => {
    const fetchNewsFromContentful = async () => {
      try {
        setLoading(true);
        
        // 環境変数を直接確認（より確実な方法）
        const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
        const accessToken = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;
        
        if (!spaceId || !accessToken) {
          console.warn('Contentfulの環境変数が設定されていません。フォールバックデータを使用します。');
          // フォールバックデータを使用
          const savedNews = localStorage.getItem('newsItems');
          const newsItems = savedNews ? JSON.parse(savedNews) : newsData.newsItems;
          
          const fallbackNews = newsItems.map((item: any) => ({
            title: item.title,
            date: item.date,
            description: item.content,
            imageUrl: item.imageUrl || ""
          }));
          
          setAnnouncements(fallbackNews);
          setLoading(false);
          return;
        }
        
        // 確実にContentfulクライアントを初期化
        const client = createClient({
          space: spaceId,
          accessToken: accessToken,
        });
        
        // ContentfulからnewsEventsコンテンツタイプのエントリを取得
        try {
          console.log('Contentful APIを呼び出し中...');
          
          // JSONプレビューから確認した正確なコンテンツタイプIDを使用
          const contentTypeId = 'newsEvents'; // JSONプレビューの sys.id の値
          
          const response = await client.getEntries({
            content_type: contentTypeId,
            order: ['-fields.date'] // 日付フィールドで新しい順に並べ替え
          });
          
          // API呼び出しの詳細をログ出力
          console.log('コンテンツタイプ:', contentTypeId);
          
          console.log('Contentful応答:', response);
          
          if (response.items && response.items.length > 0) {
            // ContentfulのレスポンスをAnnouncementの形式に変換
            const contentfulNews = response.items.map((item: any) => {
              console.log('項目のフィールド:', item.fields);
              // JSONプレビューから確認したフィールド構造に合わせてマッピング
              // fields: title, date, body, image
              
              // title: タイトルフィールド
              const title = item.fields.title || '';
              
              // body: 本文フィールド
              const description = item.fields.body || '';
              
              // date: 日付フィールド
              let date = '';
              if (item.fields.date) {
                // ISO形式の日付文字列を日本語形式に変換
                const dateObj = new Date(item.fields.date);
                date = dateObj.toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });
              } else {
                date = new Date(item.sys.createdAt).toLocaleDateString('ja-JP');
              }
              
              // image: 画像フィールド
              const imageUrl = item.fields.image?.fields?.file?.url 
                ? `https:${item.fields.image.fields.file.url}` 
                : '';
              
              return {
                title,
                date,
                description,
                imageUrl
              };
            });
            
            console.log('整形後のニュースデータ:', contentfulNews);
            
            // 空のタイトルや説明があるアイテムを除外
            const validNews = contentfulNews.filter(item => item.title && item.description);
            console.log('有効なニュースデータ:', validNews);
            
            // Contentful APIからのデータはすでにソート済みなので、追加のソートは不要
            
            console.log('最終ニュースデータ:', validNews);
            setAnnouncements(validNews);
          } else {
            console.warn('Contentfulにデータがありません。フォールバックデータを使用します。');
            // Contentfulにデータがない場合はローカルストレージまたはデフォルトデータを使用
            const savedNews = localStorage.getItem('newsItems');
            const newsItems = savedNews ? JSON.parse(savedNews) : newsData.newsItems;
            
            const fallbackNews = newsItems.map((item: any) => ({
              title: item.title,
              date: item.date,
              description: item.content,
              imageUrl: item.imageUrl || ""
            }));
            
            setAnnouncements(fallbackNews);
          }
        } catch (err) {
          console.error('Contentful API呼び出しエラー:', err);
          throw err;
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Contentfulからのデータ取得エラー:', err);
        setError('ニュースデータの取得に失敗しました');
        
        // エラー時はフォールバックとしてローカルデータを使用
        const savedNews = localStorage.getItem('newsItems');
        const newsItems = savedNews ? JSON.parse(savedNews) : newsData.newsItems;
        
        const fallbackNews = newsItems.map((item: any) => ({
          title: item.title,
          date: item.date,
          description: item.content,
          imageUrl: item.imageUrl || ""
        }));
        
        setAnnouncements(fallbackNews);
        setLoading(false);
      }
    };
    
    fetchNewsFromContentful();
  }, []);

  // アニメーション効果のためのIntersection Observer
  useEffect(() => {
    console.log('アニメーションアップデート: ニュースアイテム数 =', visibleAnnouncements.length);
    
    // ニュースアイテムの読み込み後に実行されるように仮のタイマーを設定
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              console.log('要素が表示範囲内に入りました:', entry.target);
              // opacity-0クラスを削除し、フェードインアニメーションを追加
              entry.target.classList.remove("opacity-0");
              entry.target.classList.add("animate-fade-in-up");
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
      );
  
      // 現在の要素を停止してから新しい要素を観察
      fadeRefs.current.forEach((el) => {
        if (el) {
          console.log('観察要素を追加:', el);
          observer.observe(el);
        }
      });
  
      return () => {
        fadeRefs.current.forEach((el) => {
          if (el) observer.unobserve(el);
        });
      };
    }, 100); // 少しの遅延を持たせてDOMが確実に更新されていることを確認
    
    return () => {
      clearTimeout(timer);
    };
  }, [visibleAnnouncements]); // visibleAnnouncementsの変更を監視

  const handleAdminLogin = () => {
    // Simple password check - in a real app, use proper authentication
    if (password === "admin123") {
      setIsAdmin(true);
      toast({
        title: "管理者ログイン成功",
        description: "お知らせを編集できます"
      });
    } else {
      toast({
        title: "パスワードが正しくありません",
        variant: "destructive"
      });
    }
  };

  const handleAddAnnouncement = () => {
    if (newAnnouncement.title && newAnnouncement.description) {
      // 注意: このコードではローカルのUIに表示されるデータのみが更新されます
      // 本来はContentful APIを使ってデータを更新する必要があります
      const updatedAnnouncements = [newAnnouncement, ...announcements];
      
      // ローカルストレージに保存
      const newsItems = updatedAnnouncements.map(item => ({
        id: Date.now(), // ユニークIDを生成
        title: item.title,
        date: item.date,
        content: item.description,
        imageUrl: item.imageUrl || ""
      }));
      localStorage.setItem('newsItems', JSON.stringify(newsItems));
      
      setAnnouncements(updatedAnnouncements);
      setNewAnnouncement({ title: "", date: "", description: "", imageUrl: "" });
      toast({
        title: "お知らせを追加しました",
        description: "ローカルストレージに保存されました（注: Contentfulには保存されていません）"
      });
    }
  };

  // 表示するニュースが少ない場合のヘルパーメッセージ
  const renderOverflowMessage = () => {
    if (visibleAnnouncements.length < announcements.length) {
      const hiddenCount = announcements.length - visibleAnnouncements.length;
      return (
        <div className="text-center mt-4 text-xs text-kyoto-dark-green/70">
          <p>さらに{hiddenCount}件のニュースがあります（古い記事）</p>
        </div>
      );
    }
    return null;
  };

  return (
    <section id="news" className="py-8 bg-kyoto-beige japanese-pattern-light">
      <div className="section-container">
        <div className="text-center mb-6">
          <h2 
            ref={(el) => (fadeRefs.current[0] = el)} 
            className="section-title text-kyoto-dark-green opacity-0 mx-auto text-2xl md:text-3xl"
          >
            お知らせ
          </h2>
        </div>
        
        {/* 差別化したデザインのNewsセクション */}
        <div id="news-container" className="max-w-4xl mx-auto">
          <div className="bg-kyoto-gold/10 p-2 rounded-sm text-center mb-4 animate-pulse">
            <p className="text-xs font-bold text-kyoto-dark-green">＊ 随時更新 ＊</p>
          </div>
          
          {loading ? (
            <div className="bg-white p-3 rounded-sm shadow-lg text-center animate-pulse">
              <p className="text-sm text-kyoto-dark-green">読み込み中...</p>
            </div>
          ) : error ? (
            <div className="bg-white p-3 rounded-sm shadow-lg border-l-4 border-red-500">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          ) : visibleAnnouncements.length === 0 ? (
            <div className="bg-white p-3 rounded-sm shadow-lg text-center">
              <p className="text-sm text-kyoto-dark-green">現在ニュースはありません</p>
              <p className="text-xs text-gray-500 mt-2">データ取得状況: {JSON.stringify({total: announcements.length})}</p>
              <p className="text-xs text-gray-500 mt-2">最後のデータ取得: {new Date().toLocaleTimeString('ja-JP')}</p>
            </div>
          ) : (
            <>
              {/* 2段組みレイアウト */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {visibleAnnouncements.map((announcement, index) => (
                  <div 
                    key={index}
                    ref={(el) => {
                      fadeRefs.current[index + 1] = el;
                    }}
                    className="bg-white p-3 rounded-sm shadow-lg hover-lift opacity-0 border-l-4 border-kyoto-gold/80 transition-opacity duration-500"
                  >
                    <div className="pl-2">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-base font-bold text-kyoto-dark-green">{announcement.title}</h4>
                        {announcement.date && (
                          <span className="text-xs bg-kyoto-gold/20 px-2 py-0.5 rounded text-kyoto-dark-green">{announcement.date}</span>
                        )}
                      </div>
                      <p className="text-sm md:text-base text-gray-700">{announcement.description}</p>
                      {announcement.imageUrl && (
                        <div className="mt-2">
                          <img 
                            src={announcement.imageUrl} 
                            alt={announcement.title} 
                            className="w-full h-auto rounded-sm border border-gray-200" 
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 非表示のニュースがある場合のメッセージ */}
              {renderOverflowMessage()}
            </>
          )}
        </div>
      </div>

      {/* Admin Modal */}
      <Dialog open={adminOpen} onOpenChange={setAdminOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>お知らせ管理</DialogTitle>
            <DialogDescription>
              {isAdmin ? "新しいお知らせを追加" : "管理者ログインが必要です"}
            </DialogDescription>
          </DialogHeader>
          
          {isAdmin ? (
            <div className="space-y-4 pt-4">
              <div>
                <label htmlFor="announcement-title" className="block text-sm font-medium mb-1">
                  タイトル
                </label>
                <Input
                  id="announcement-title"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                />
              </div>
              
              <div>
                <label htmlFor="announcement-date" className="block text-sm font-medium mb-1">
                  日付
                </label>
                <Input
                  id="announcement-date"
                  value={newAnnouncement.date}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, date: e.target.value })}
                />
              </div>
              
              <div>
                <label htmlFor="announcement-content" className="block text-sm font-medium mb-1">
                  内容
                </label>
                <textarea
                  id="announcement-content"
                  value={newAnnouncement.description}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, description: e.target.value })}
                  className="w-full min-h-[100px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-kyoto-gold/50"
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="announcement-image" className="block text-sm font-medium mb-1">
                  画像URL（オプション）
                </label>
                <Input
                  id="announcement-image"
                  value={newAnnouncement.imageUrl}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="flex justify-end">
                <Button variant="primary" onClick={handleAddAnnouncement}>
                  追加する
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-4">
              <div>
                <label htmlFor="admin-password" className="block text-sm font-medium mb-1">
                  管理者パスワード
                </label>
                <Input id="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              
              <div className="flex justify-end">
                <Button variant="secondary" onClick={handleAdminLogin}>
                  ログイン
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 italic">
                注: デモ用パスワードは "admin123" です
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default News; 