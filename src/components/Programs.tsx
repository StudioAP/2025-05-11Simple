import React, { useEffect, useRef, useState } from "react";
import Button from "./Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { toast } from "./ui/use-toast";
import newsData from "../data/news.json";

interface Announcement {
  title: string;
  date: string;
  description: string;
  imageUrl?: string;
}

const Programs = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const fadeRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [adminOpen, setAdminOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  // ローカルストレージのデータを優先してニュースを読み込む
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    // ローカルストレージから読み込み
    const savedNews = localStorage.getItem('newsItems');
    const newsItems = savedNews ? JSON.parse(savedNews) : newsData.newsItems;
    
    return newsItems.map(item => ({
      title: item.title,
      date: item.date,
      description: item.content,
      imageUrl: item.imageUrl || ""
    }));
  });
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    date: "",
    description: "",
    imageUrl: ""
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
          }
        });
      },
      { threshold: 0.1 }
    );

    fadeRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      fadeRefs.current.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

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
        description: "ローカルストレージに保存されました"
      });
    }
  };

  return (
    <section id="programs" className="py-8 bg-kyoto-light-green japanese-pattern">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Programs & Services */}
          <div>
            <div className="text-center mb-4">
              <h2 
                ref={(el) => (fadeRefs.current[0] = el)} 
                className="section-title text-kyoto-dark-green opacity-0 mx-auto text-xl md:text-2xl"
              >
                Programs & Services
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Tennis Experience */}
              <div 
                ref={(el) => (fadeRefs.current[1] = el)} 
                className="opacity-0"
              >
                <div className="bg-white p-4 md:p-5 rounded-sm shadow-lg hover-lift">
                  <h3 className="text-xl font-bold text-kyoto-dark-green mb-3">＊ お気軽テニス体験 ＊</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <img 
                      src="/lovable-uploads/2dcc5e2e-3ed3-41e2-9038-cbab6f2a3962.png" 
                      alt="テニス体験" 
                      className="w-full h-40 md:h-48 object-cover rounded-sm"
                    />
                    <div>
                      <p className="text-gray-700 text-sm md:text-base mb-3">
                        初めてでも安心！<br />
                        会員が温かく迎えます。<br />
                        一人でも友達とでも。<br /> 
                        平日でも週末でもOK！<br /> 
                      </p>
                      <div className="mb-3">
                        <p className="text-gray-700 font-medium text-sm md:text-base">ご予約方法：</p>
                        <p className="text-base md:text-lg font-medium text-kyoto-dark-green">
                          電話: (075)-741-2917（前日まで）
                        </p>
                      </div>
                      {/* 予約ボタンを削除しました */}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-kyoto-gold/20 flex items-center justify-center mr-2">
                        <span className="text-kyoto-dark-green font-semibold text-xs">1</span>
                      </div>
                      <p className="text-gray-700 text-sm md:text-base">お電話で体験予約</p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-kyoto-gold/20 flex items-center justify-center mr-2">
                        <span className="text-kyoto-dark-green font-semibold text-xs">2</span>
                      </div>
                      <p className="text-gray-700 text-sm md:text-base">当日受付でお名前をお伝えください</p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-kyoto-gold/20 flex items-center justify-center mr-2">
                        <span className="text-kyoto-dark-green font-semibold text-xs">3</span>
                      </div>
                      <p className="text-gray-700 text-sm md:text-base">さっそくテニスを楽しみましょう！</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* 会員＆ビジター交流会 - よりコンパクトなデザイン */}
              <div className="bg-white p-3 md:p-4 rounded-sm shadow-lg hover-lift mt-3 md:mt-4">
                <h3 className="text-lg font-bold text-kyoto-dark-green mb-2">{newsData.events[0].title}</h3>
                <p className="text-kyoto-dark-green font-medium text-sm md:text-base mb-2">
                  {newsData.events[0].schedule}
                </p>
                <div className="space-y-1 text-sm">
                  {newsData.events[0].details.map((detail, index) => (
                    <p key={index} className="text-gray-700 text-xs md:text-sm flex items-center">
                      <span className="w-1 h-1 rounded-full bg-kyoto-gold inline-block mr-1"></span>
                      {/* 参加費の場合は強調表示 */}
                      {detail.includes('参加費') ? (
                        <span className="font-bold text-sm md:text-base text-kyoto-dark-green">{detail}</span>
                      ) : (
                        detail
                      )}
                    </p>
                  ))}
                </div>
              </div>
              {/* Testimonials */}
              <div 
                ref={(el) => (fadeRefs.current[2] = el)} 
                className="opacity-0"
              > 
              </div> 
            </div>
          </div>

          {/* News & Events */}
          <div>
            <div className="text-center mb-4">
              <h3 className="section-title text-kyoto-dark-green mx-auto text-xl md:text-2xl">News & Events</h3>
            </div>
            
            {/* 差別化したデザインのNewsセクション */}
            <div className="space-y-3">
              <div className="bg-kyoto-gold/10 p-2 rounded-sm text-center mb-2 animate-pulse">
                <p className="text-xs font-bold text-kyoto-dark-green">＊ 随時更新 ＊</p>
              </div>
              {announcements.map((announcement, index) => (
                <div 
                  key={index}
                  ref={(el) => (fadeRefs.current[3 + index] = el)} 
                  className="bg-white p-3 rounded-sm shadow-lg hover-lift opacity-0 border-l-4 border-kyoto-gold/80"
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
          </div>
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
                  className="w-full border rounded-sm p-2 text-sm"
                  rows={4}
                />
              </div>
              
              <div>
                <label htmlFor="announcement-image" className="block text-sm font-medium mb-1">
                  画像URL
                </label>
                <Input
                  id="announcement-image"
                  placeholder="/lovable-uploads/画像ファイル名.jpg"
                  value={newAnnouncement.imageUrl}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, imageUrl: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1">※ 画像ファイルをアップロードしたパスを入力してください</p>
              </div>
              
              <div className="flex justify-end">
                <Button variant="secondary" onClick={handleAddAnnouncement}>
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
                {password !== "admin123" && (
                  <p className="text-red-500 text-xs mt-1">パスワードが正しくありません</p>
                )}
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

export default Programs;
