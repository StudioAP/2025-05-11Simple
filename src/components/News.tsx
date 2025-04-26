import React, { useEffect, useRef, useState } from "react";
import Button from "./Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { toast } from "./ui/use-toast";
import newsData from "../data/news.json";
import { createClient } from "contentful";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
// ↓↓↓ Rich Text レンダリング用に追加 ↓↓↓
import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS, Document } from '@contentful/rich-text-types';
// ↑↑↑ Rich Text レンダリング用に追加 ↑↑↑
import type { EntryFieldTypes, Entry } from 'contentful';

// ★ Contentful Entry の型定義を追加
interface NewsEntrySkeleton {
  contentTypeId: 'kyotolawntennisclubNews' // コンテンツタイプID
  fields: {
    title: EntryFieldTypes.Symbol;
    date: EntryFieldTypes.Date;
    body: EntryFieldTypes.RichText;
    image?: EntryFieldTypes.AssetLink; // オプションのAsset Link
  }
}

interface Announcement {
  title: string;
  date: string;
  description: Document | string; // RichText Document またはフォールバック文字列
  imageUrl?: string;
}

// Contentfulクライアントの初期化（環境変数が設定されている場合のみ）
const contentfulClient = import.meta.env.VITE_CONTENTFUL_SPACE_ID && import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN
  ? createClient({
      space: import.meta.env.VITE_CONTENTFUL_SPACE_ID,
      accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN,
    })
  : null;

// ↓↓↓ このログを追加 ↓↓↓
console.log("--- Environment Variables Check ---");
console.log("VITE_CONTENTFUL_SPACE_ID:", import.meta.env.VITE_CONTENTFUL_SPACE_ID);
console.log("VITE_CONTENTFUL_ACCESS_TOKEN:", import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN ? '*** Exists ***' : undefined); // トークン自体は表示しない
console.log("VITE_CONTENTFUL_CONTENT_TYPE_ID:", import.meta.env.VITE_CONTENTFUL_CONTENT_TYPE_ID);
console.log("----------------------------------");
// ↑↑↑ ここまで追加 ↑↑↑

const News = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const fadeRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [adminOpen, setAdminOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // ニュースアナウンスメントのstate
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  // 最新のお知らせのみ表示するための状態
  const [latestAnnouncement, setLatestAnnouncement] = useState<Announcement | null>(null);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    date: "",
    description: "",
    imageUrl: ""
  });

  // --- ▼ Rich Text レンダリングオプション ▼ ---
  const richTextOptions: Options = {
    renderMark: {
      [MARKS.BOLD]: (text) => <strong className="font-bold">{text}</strong>,
      [MARKS.ITALIC]: (text) => <em className="italic">{text}</em>,
      [MARKS.UNDERLINE]: (text) => <u className="underline">{text}</u>,
      // 他のマーク (code, strikethrough など) も必要に応じて追加
    },
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node, children) => <p className="mb-2">{children}</p>,
      [BLOCKS.HEADING_1]: (node, children) => <h1 className="text-2xl font-bold mt-4 mb-2">{children}</h1>,
      [BLOCKS.HEADING_2]: (node, children) => <h2 className="text-xl font-bold mt-3 mb-2">{children}</h2>,
      [BLOCKS.HEADING_3]: (node, children) => <h3 className="text-lg font-bold mt-2 mb-1">{children}</h3>,
      // 他の見出しレベルも必要に応じて追加
      [BLOCKS.UL_LIST]: (node, children) => <ul className="list-disc list-inside mb-2 ml-4">{children}</ul>,
      [BLOCKS.OL_LIST]: (node, children) => <ol className="list-decimal list-inside mb-2 ml-4">{children}</ol>,
      [BLOCKS.LIST_ITEM]: (node, children) => <li>{children}</li>,
      [BLOCKS.QUOTE]: (node, children) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2">{children}</blockquote>,
      [BLOCKS.HR]: () => <hr className="my-4" />,

      // エラー回避のため、埋め込み要素は一旦 null (非表示) またはシンプルな表示にする
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        // 埋め込み画像を表示したい場合はここで img タグをレンダリングする
        // 例: const asset = findAssetById(node.data.target.sys.id); return <img src={...} alt={...} />;
        console.log("Embedded Asset found, but not rendered by default options:", node);
        return null; 
      },
      [BLOCKS.EMBEDDED_ENTRY]: (node) => {
        console.log("Embedded Entry found, but not rendered by default options:", node);
        return <div className="my-2 p-2 border border-dashed border-gray-300">[埋め込みコンテンツは表示されません]</div>;
      },

      [INLINES.HYPERLINK]: (node, children) => (
        <a href={node.data.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          {children}
        </a>
      ),
      // 他のインライン要素 (Entry/Asset Hyperlinkなど) も必要なら追加
    },
  };
  // --- ▲ Rich Text レンダリングオプション ▲ ---

  // Contentfulからニュースデータを取得
  useEffect(() => {
    const fetchNewsFromContentful = async () => {
      try {
        setLoading(true);
        // 環境変数を取得
        const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
        const accessToken = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;
        // ★ ハードコードを元に戻し、環境変数から読み込む
        // const contentTypeId = "kyotolawntennisclubNews"; 
        const contentTypeId = import.meta.env.VITE_CONTENTFUL_CONTENT_TYPE_ID;

        if (!spaceId || !accessToken || !contentTypeId) { // ← contentTypeId のチェックを元に戻す
          console.warn('Contentful環境変数が不足... フォールバック');
          const savedNews = localStorage.getItem('newsItems');
          const newsItems = savedNews ? JSON.parse(savedNews) : newsData.newsItems;
          const fallbackNews: Announcement[] = newsItems.map((item: any) => ({
            title: item.title || '',
            date: item.date || '',
            description: item.content || "", // 文字列としてフォールバック
            imageUrl: item.imageUrl || undefined
          }));
          setAnnouncements(fallbackNews);
          if (fallbackNews.length > 0) setLatestAnnouncement(fallbackNews[0]);
          setLoading(false);
          return;
        }

        const client = createClient({ space: spaceId!, accessToken: accessToken! });

        try {
          console.log('API呼び出し中... Content Type:', contentTypeId);
          const response = await client.getEntries<NewsEntrySkeleton>({
            content_type: contentTypeId!, // null/undefinedでないことを示すために ! を追加(チェック済みのため)
            order: ['-fields.date'],
            include: 1, // リンクされたアセットを解決
            // locale: 'ja-JP' // ★ 日本語ロケール指定はコメントアウトする (スペースに設定がないため)
          });
          console.log('応答:', response);

          if (response.items && response.items.length > 0) {
            const contentfulNews: Announcement[] = response.items.map((item) => {
              const title = item.fields.title || '';
              const body = item.fields.body;
              let date = '';
              if (item.fields.date) {
                 const dateObj = new Date(item.fields.date);
                 date = dateObj.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
              } else {
                 date = new Date(item.sys.createdAt).toLocaleDateString('ja-JP');
              }
              let imageUrl: string | undefined = undefined;
              const imageField = item.fields.image;
              if (imageField && typeof imageField === 'object' && 'fields' in imageField && imageField.fields?.file?.url) {
                 const rawUrl = imageField.fields.file.url;
                 imageUrl = rawUrl.startsWith('//') ? `https:${rawUrl}` : rawUrl;
              }
              return {
                title,
                date,
                description: body || "",
                imageUrl
              };
            });

            const validNews = contentfulNews.filter(item => item.title && item.description);
            setAnnouncements(validNews);
            if (validNews.length > 0) setLatestAnnouncement(validNews[0]);

          } else {
            console.warn('Contentfulにデータなし... フォールバック');
            const savedNews = localStorage.getItem('newsItems');
            const newsItems = savedNews ? JSON.parse(savedNews) : newsData.newsItems;
            const fallbackNews: Announcement[] = newsItems.map((item: any) => ({
              title: item.title || '',
              date: item.date || '',
              description: item.content || "",
              imageUrl: item.imageUrl || undefined
            }));
            setAnnouncements(fallbackNews);
            if (fallbackNews.length > 0) setLatestAnnouncement(fallbackNews[0]);
          }
        } catch (err) {
           console.error('APIエラー:', err);
           setError('ニュース取得エラー');
           const savedNews = localStorage.getItem('newsItems');
           const newsItems = savedNews ? JSON.parse(savedNews) : newsData.newsItems;
           const fallbackNews: Announcement[] = newsItems.map((item: any) => ({
             title: item.title || '',
             date: item.date || '',
             description: item.content || "",
             imageUrl: item.imageUrl || undefined
           }));
           setAnnouncements(fallbackNews);
           if (fallbackNews.length > 0) setLatestAnnouncement(fallbackNews[0]);
         }
        setLoading(false);
      } catch (err) {
        console.error('設定/予期せぬエラー:', err);
        setError('設定問題/予期せぬエラー');
        const savedNews = localStorage.getItem('newsItems');
        const newsItems = savedNews ? JSON.parse(savedNews) : newsData.newsItems;
        const fallbackNews: Announcement[] = newsItems.map((item: any) => ({
          title: item.title || '',
          date: item.date || '',
          description: item.content || "",
          imageUrl: item.imageUrl || undefined
        }));
        setAnnouncements(fallbackNews);
        if (fallbackNews.length > 0) setLatestAnnouncement(fallbackNews[0]);
        setLoading(false);
      }
    };
    fetchNewsFromContentful();
  }, []);

  // アニメーション効果のためのIntersection Observer
  useEffect(() => {
    console.log('アニメーションアップデート: 最新ニュース =', latestAnnouncement ? 'あり' : 'なし');
    
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
  }, [latestAnnouncement]); // latestAnnouncementの変更を監視

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
      // 最新のお知らせを更新
      setLatestAnnouncement(newAnnouncement);
      setNewAnnouncement({ title: "", date: "", description: "", imageUrl: "" });
      toast({
        title: "お知らせを追加しました",
        description: "ローカルストレージに保存されました（注: Contentfulには保存されていません）"
      });
    }
  };

  return (
    <section id="news" className="py-8 bg-kyoto-beige japanese-pattern-light">
      <div className="section-container py-8">
        <div className="text-center mb-6">
          <h2 
            ref={(el) => (fadeRefs.current[0] = el)} 
            className="section-title text-kyoto-dark-green opacity-0 mx-auto text-2xl md:text-3xl mb-2"
          >
            お知らせ
          </h2>
        </div>
        
        {/* お知らせセクション - 最新の1件のみ表示 */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-kyoto-gold/10 p-2 rounded-sm text-center mb-4 animate-pulse">
            <p className="text-sm font-bold text-kyoto-dark-green">＊ 最新のお知らせ ＊</p>
          </div>
          
          {loading ? (
            <div className="bg-white p-3 rounded-sm shadow-lg text-center animate-pulse">
              <p className="text-base text-kyoto-dark-green">読み込み中...</p>
            </div>
          ) : error ? (
            <div className="bg-white p-3 rounded-sm shadow-lg border-l-4 border-red-500">
              <p className="text-base text-red-500">{error}</p>
            </div>
          ) : !latestAnnouncement ? (
            <div className="bg-white p-3 rounded-sm shadow-lg text-center">
              <p className="text-base text-kyoto-dark-green">現在ニュースはありません</p>
            </div>
          ) : (
            <div 
              ref={(el) => (fadeRefs.current[1] = el)}
              className="bg-white p-4 rounded-sm shadow-lg hover-lift opacity-0 border-l-4 border-kyoto-gold/80 transition-all duration-500"
            >
              {/* 左右二段組みレイアウト */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* 左側: 日付、タイトル、本文 */}
                <div className="md:col-span-7 pl-2">
                  <div className="flex items-center mb-2">
                    {/* 日付を先に表示 */}
                    {latestAnnouncement.date && (
                      <span className="text-sm bg-kyoto-gold/20 px-2 py-0.5 rounded text-kyoto-dark-green mr-2 whitespace-nowrap">
                        {latestAnnouncement.date}
                      </span>
                        )}
                    <h4 className="text-lg font-bold text-kyoto-dark-green flex-grow text-left">
                      {latestAnnouncement.title}
                    </h4>
                  </div>
                  <div className="text-base text-gray-700 mb-4 break-words">
                    {(latestAnnouncement.description && typeof latestAnnouncement.description === 'object' && latestAnnouncement.description.nodeType === BLOCKS.DOCUMENT)
                      ? documentToReactComponents(latestAnnouncement.description, richTextOptions) as React.ReactNode
                      : <p>{latestAnnouncement.description}</p> // 文字列の場合はそのまま表示
                    }
                  </div>
                </div>
                
                {/* 右側: 画像 */}
                <div className="md:col-span-5">
                  {latestAnnouncement.imageUrl ? (
                    <div className="h-full flex items-center justify-center">
                          <img 
                        src={latestAnnouncement.imageUrl} 
                        alt={latestAnnouncement.title} 
                        className="w-full h-auto rounded-sm border border-gray-200 shadow-sm"
                        style={{ objectFit: "contain" }}
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
          )}
              
          {/* 過去のお知らせ一覧ボタン */}
          {announcements.length > 1 && (
            <div className="mt-4 text-center">
              <Link to="/news-archive" className="inline-flex items-center px-4 py-2 rounded-sm bg-kyoto-dark-green text-kyoto-white hover:bg-kyoto-dark-green/90 transition-colors">
                <span>過去のお知らせ一覧</span>
                <ArrowRight className="ml-2" size={16} />
              </Link>
              <p className="text-xs text-kyoto-dark-green/60 mt-1">
                全{announcements.length}件のお知らせがあります
              </p>
            </div>
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