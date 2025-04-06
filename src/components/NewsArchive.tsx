import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { createClient } from "contentful";
import newsData from "../data/news.json";

interface Announcement {
  title: string;
  date: string;
  description: string;
  imageUrl?: string;
}

const NewsArchive = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsFromContentful = async () => {
      try {
        setLoading(true);
        
        // 環境変数を直接確認
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
        
        // Contentfulクライアントを初期化
        const client = createClient({
          space: spaceId,
          accessToken: accessToken,
        });
        
        try {
          // コンテンツタイプID
          const contentTypeId = 'newsEvents';
          
          const response = await client.getEntries({
            content_type: contentTypeId,
            order: ['-fields.date'] // 日付フィールドで新しい順に並べ替え
          });
          
          if (response.items && response.items.length > 0) {
            // ContentfulのレスポンスをAnnouncementの形式に変換
            const contentfulNews = response.items.map((item: any) => {
              // タイトル
              const title = item.fields.title || '';
              
              // 本文
              const description = item.fields.body || '';
              
              // 日付
              let date = '';
              if (item.fields.date) {
                const dateObj = new Date(item.fields.date);
                date = dateObj.toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });
              } else {
                date = new Date(item.sys.createdAt).toLocaleDateString('ja-JP');
              }
              
              // 画像
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
            
            // 空のタイトルや説明があるアイテムを除外
            const validNews = contentfulNews.filter(item => item.title && item.description);
            
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

  // 年月ごとにニュースを分類
  const groupByYearMonth = (news: Announcement[]) => {
    const groups: { [key: string]: Announcement[] } = {};
    
    news.forEach(item => {
      let groupKey = '不明な日付';
      
      if (item.date) {
        try {
          // 日本語形式の日付から年月を抽出
          const match = item.date.match(/(\d+)年(\d+)月/);
          if (match) {
            const year = match[1];
            const month = match[2].padStart(2, '0');
            groupKey = `${year}年${month}月`;
          }
        } catch (e) {
          console.error('日付のパース中にエラーが発生しました:', e);
        }
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      
      groups[groupKey].push(item);
    });
    
    // キー（年月）でソート（降順）
    return Object.keys(groups)
      .sort()
      .reverse()
      .reduce((result, key) => {
        result[key] = groups[key];
        return result;
      }, {} as { [key: string]: Announcement[] });
  };

  const newsGroups = groupByYearMonth(announcements);

  return (
    <section className="bg-kyoto-beige min-h-screen py-10">
      <div className="section-container py-4">
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-kyoto-dark-green hover:text-kyoto-gold transition-colors mb-4"
          >
            <ChevronLeft size={20} />
            <span>トップページに戻る</span>
          </Link>
          
          <h1 className="text-2xl md:text-3xl font-bold text-kyoto-dark-green mb-2">
            お知らせ一覧
          </h1>
          <div className="w-20 h-1 bg-kyoto-gold mb-4"></div>
        </div>
        
        {loading ? (
          <div className="bg-white p-4 rounded-sm shadow-lg text-center animate-pulse">
            <p className="text-base text-kyoto-dark-green">読み込み中...</p>
          </div>
        ) : error ? (
          <div className="bg-white p-4 rounded-sm shadow-lg border-l-4 border-red-500">
            <p className="text-base text-red-500">{error}</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="bg-white p-4 rounded-sm shadow-lg text-center">
            <p className="text-base text-kyoto-dark-green">現在ニュースはありません</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(newsGroups).map(([yearMonth, items]) => (
              <div key={yearMonth} className="animate-fade-in-up">
                <h2 className="text-xl font-bold text-kyoto-dark-green mb-4 bg-kyoto-gold/10 p-2 rounded-sm">
                  {yearMonth}
                </h2>
                
                <div className="space-y-4">
                  {items.map((announcement, index) => (
                    <div 
                      key={index}
                      className="bg-white p-4 rounded-sm shadow-lg hover-lift border-l-4 border-kyoto-gold/80 transition-all duration-300"
                    >
                      {/* 左右二段組みレイアウト */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        {/* 左側: 日付、タイトル、本文 */}
                        <div className="md:col-span-7 pl-2">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-bold text-kyoto-dark-green">{announcement.title}</h3>
                            {announcement.date && (
                              <span className="text-sm bg-kyoto-gold/20 px-2 py-0.5 rounded text-kyoto-dark-green">{announcement.date}</span>
                            )}
                          </div>
                          <p className="text-base text-gray-700">{announcement.description}</p>
                        </div>
                        
                        {/* 右側: 画像 */}
                        <div className="md:col-span-5">
                          {announcement.imageUrl ? (
                            <div className="h-full flex items-center justify-center">
                              <img 
                                src={announcement.imageUrl} 
                                alt={announcement.title} 
                                className="w-full h-auto rounded-sm border border-gray-200 shadow-sm" 
                                style={{ maxHeight: "180px", objectFit: "cover" }}
                              />
                            </div>
                          ) : (
                            <div className="h-full flex items-center justify-center bg-kyoto-gold/5 rounded-sm p-4 border border-dashed border-kyoto-gold/30">
                              <p className="text-kyoto-dark-green/60 text-center text-sm">画像はありません</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsArchive; 