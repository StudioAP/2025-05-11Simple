import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { createClient } from "contentful";
import newsData from "../data/news.json";
import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS, Document } from '@contentful/rich-text-types';
import type { EntryFieldTypes, Entry } from 'contentful';

interface NewsEntrySkeleton {
  contentTypeId: 'kyotolawntennisclubNews'
  fields: {
    title: EntryFieldTypes.Symbol;
    date: EntryFieldTypes.Date;
    body: EntryFieldTypes.RichText;
    image?: EntryFieldTypes.AssetLink;
  }
}

interface Announcement {
  title: string;
  date: string;
  description: Document | string;
  imageUrl?: string;
}

const NewsArchive = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const richTextOptions: Options = {
    renderMark: {
      [MARKS.BOLD]: (text) => <strong className="font-bold">{text}</strong>,
      [MARKS.ITALIC]: (text) => <em className="italic">{text}</em>,
      [MARKS.UNDERLINE]: (text) => <u className="underline">{text}</u>,
    },
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node, children) => <p className="mb-1">{children}</p>,
      [BLOCKS.HEADING_1]: (node, children) => <h1 className="text-xl font-bold mt-3 mb-1">{children}</h1>,
      [BLOCKS.HEADING_2]: (node, children) => <h2 className="text-lg font-bold mt-2 mb-1">{children}</h2>,
      [BLOCKS.HEADING_3]: (node, children) => <h3 className="text-base font-bold mt-1 mb-1">{children}</h3>,
      [BLOCKS.UL_LIST]: (node, children) => <ul className="list-disc list-inside mb-1 ml-4">{children}</ul>,
      [BLOCKS.OL_LIST]: (node, children) => <ol className="list-decimal list-inside mb-1 ml-4">{children}</ol>,
      [BLOCKS.LIST_ITEM]: (node, children) => <li>{children}</li>,
      [BLOCKS.QUOTE]: (node, children) => <blockquote className="border-l-4 border-gray-300 pl-3 italic my-1">{children}</blockquote>,
      [BLOCKS.HR]: () => <hr className="my-2" />,
      [BLOCKS.EMBEDDED_ASSET]: (node) => null,
      [BLOCKS.EMBEDDED_ENTRY]: (node) => <div className="my-1 p-1 border border-dashed border-gray-300 text-xs">[埋込コンテンツ]</div>,
      [INLINES.HYPERLINK]: (node, children) => (
        <a href={node.data.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          {children}
        </a>
      ),
    },
  };

  useEffect(() => {
    const fetchNewsFromContentful = async () => {
      try {
        setLoading(true);
        const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
        const accessToken = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;
        const contentTypeId = import.meta.env.VITE_CONTENTFUL_CONTENT_TYPE_ID;

        if (!spaceId || !accessToken || !contentTypeId) {
          console.warn('Contentful環境変数が不足... フォールバック (NewsArchive)');
          const savedNews = localStorage.getItem('newsItems');
          const newsItems = savedNews ? JSON.parse(savedNews) : newsData.newsItems;
          const fallbackNews: Announcement[] = newsItems.map((item: any) => ({
            title: item.title || '',
            date: item.date || '',
            description: item.content || "",
            imageUrl: item.imageUrl || undefined
          }));
          setAnnouncements(fallbackNews);
          setLoading(false);
          return;
        }

        const client = createClient({ space: spaceId!, accessToken: accessToken! });

        try {
          console.log('API呼び出し中 (NewsArchive)... Content Type:', contentTypeId);
          const response = await client.getEntries<NewsEntrySkeleton>({
            content_type: contentTypeId!,
            order: ['-fields.date'],
            include: 1
          });
          console.log('応答 (NewsArchive):', response);

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

            const validNews = contentfulNews.filter(item => item.title);
            setAnnouncements(validNews);
          } else {
            console.warn('Contentfulにデータなし... フォールバック (NewsArchive)');
            const savedNews = localStorage.getItem('newsItems');
            const newsItems = savedNews ? JSON.parse(savedNews) : newsData.newsItems;
            const fallbackNews: Announcement[] = newsItems.map((item: any) => ({
              title: item.title || '',
              date: item.date || '',
              description: item.content || "",
              imageUrl: item.imageUrl || undefined
            }));
            setAnnouncements(fallbackNews);
          }
        } catch (err) {
           console.error('APIエラー (NewsArchive):', err);
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
         }
        setLoading(false);
      } catch (err) {
        console.error('設定/予期せぬエラー (NewsArchive):', err);
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
        setLoading(false);
      }
    };
    fetchNewsFromContentful();
  }, []);

  const groupByYearMonth = (news: Announcement[]) => {
    const groups: { [key: string]: Announcement[] } = {};
    
    news.forEach(item => {
      let groupKey = '不明な日付';
      
      if (item.date) {
        try {
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
          <div className="text-center p-6">読み込み中...</div>
        ) : error ? (
          <div className="text-center p-6 text-red-600">{error}</div>
        ) : announcements.length === 0 ? (
          <div className="text-center p-6">お知らせはありません。</div>
        ) : (
          <div className="space-y-8">
            {Object.entries(newsGroups).map(([yearMonth, newsList]) => (
              <div key={yearMonth}>
                <h2 className="text-xl font-semibold text-kyoto-dark-green mb-3 border-b-2 border-kyoto-gold pb-1">{yearMonth}</h2>
                <ul className="space-y-4">
                  {newsList.map((item, index) => (
                    <li key={index} className="bg-white p-4 rounded-sm shadow hover-lift transition-shadow duration-200">
                      <div className="flex flex-col md:flex-row gap-4">
                        {item.imageUrl && (
                          <div className="md:w-1/4 flex-shrink-0">
                            <img 
                              src={item.imageUrl} 
                              alt={item.title} 
                              className="w-full h-auto object-contain rounded border"
                            />
                          </div>
                        )}
                        <div className="flex-grow">
                          <div className="flex items-center mb-1">
                             {item.date && (
                               <span className="text-xs bg-kyoto-gold/20 px-2 py-0.5 rounded text-kyoto-dark-green mr-2 whitespace-nowrap">
                                 {item.date}
                               </span>
                             )}
                             <h3 className="text-lg font-bold text-kyoto-dark-green">{item.title}</h3>
                          </div>
                          <div className="text-sm text-gray-700 break-words">
                             {item.description && typeof item.description === 'object' && 'nodeType' in item.description
                               ? documentToReactComponents(item.description, richTextOptions) as React.ReactNode
                               : <p>{item.description}</p>
                             }
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsArchive; 