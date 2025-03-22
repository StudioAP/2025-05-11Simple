import React, { useEffect, useRef, useState } from "react";
import Button from "./Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { toast } from "./ui/use-toast";

const Programs = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const fadeRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [adminOpen, setAdminOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [announcements, setAnnouncements] = useState([
    {
      title: "第12回交流会",
      date: "2025年3月29日(土) 10:00～16:00",
      description: "どなたでも参加可能。初心者歓迎！"
    },
    {
      title: "毎月最終土曜交流会",
      date: "メンバー500円 / ビジター1,500円",
      description: "誰でも参加OK。遊びに来てください！"
    },
    {
      title: "会員優先予約期間",
      date: "",
      description: "会員の方は2週間前から優先的にコートの予約が可能です。"
    }
  ]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    date: "",
    description: ""
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
      setAnnouncements([newAnnouncement, ...announcements]);
      setNewAnnouncement({ title: "", date: "", description: "" });
      toast({
        title: "お知らせを追加しました",
      });
    }
  };

  return (
    <section id="programs" className="py-12 bg-kyoto-light-green japanese-pattern">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Programs & Services */}
          <div>
            <div className="text-center mb-6">
              <h2 
                ref={(el) => (fadeRefs.current[0] = el)} 
                className="section-title text-kyoto-dark-green opacity-0 mx-auto text-2xl md:text-3xl"
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
                <div className="bg-white p-6 rounded-sm shadow-lg hover-lift">
                  <h3 className="text-xl font-bold text-kyoto-dark-green mb-3">Tennis Experience</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <img 
                      src="/lovable-uploads/2dcc5e2e-3ed3-41e2-9038-cbab6f2a3962.png" 
                      alt="テニス体験" 
                      className="w-full h-48 md:h-56 object-cover rounded-sm"
                    />
                    <div>
                      <p className="text-gray-700 text-sm md:text-base mb-3">
                        初めてでも安心。会員が温かく迎えます。<br />
                        一人でも友達とでも、平日でも週末でもOK
                      </p>
                      <div className="mb-3">
                        <p className="text-gray-700 font-medium text-sm md:text-base">ご予約方法：</p>
                        <p className="text-gray-700 text-sm md:text-base">
                          電話: (075)-741-2917（前日まで）
                        </p>
                      </div>
                      <Button variant="secondary" className="self-start text-sm md:text-base">
                        今すぐ予約する
                      </Button>
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
                      <p className="text-gray-700 text-sm md:text-base">会員とテニスを楽しむ</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonials */}
              <div 
                ref={(el) => (fadeRefs.current[2] = el)} 
                className="opacity-0"
              >
                <div className="bg-white p-6 rounded-sm shadow-lg hover-lift">
                  <h3 className="text-xl font-bold text-kyoto-dark-green mb-3">Testimonials</h3>
                  <div className="space-y-4">
                    <div className="bg-kyoto-cream/50 p-3 rounded-sm">
                      <p className="text-gray-700 italic text-sm md:text-base mb-2">
                        「40代から始めましたが、温かく迎えていただきました。今では週末が待ち遠しいです。」
                      </p>
                      <p className="text-right text-sm text-gray-600">- 田中さん（会員歴2年）</p>
                    </div>
                    <div className="bg-kyoto-cream/50 p-3 rounded-sm">
                      <p className="text-gray-700 italic text-sm md:text-base mb-2">
                        「自然の中でテニスができる環境が素晴らしい。ストレス解消になります。」
                      </p>
                      <p className="text-right text-sm text-gray-600">- 佐藤さん（会員歴5年）</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* News & Events */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-kyoto-dark-green">News & Events</h3>
              <button 
                onClick={() => setAdminOpen(true)} 
                className="text-xs text-kyoto-dark-green/50 hover:text-kyoto-dark-green"
              >
                管理者
              </button>
            </div>
            
            <div className="space-y-4">
              {announcements.map((announcement, index) => (
                <div 
                  key={index}
                  ref={(el) => (fadeRefs.current[3 + index] = el)} 
                  className="bg-white p-4 rounded-sm shadow-lg hover-lift opacity-0"
                >
                  <div className="border-l-3 border-kyoto-gold pl-3">
                    <h4 className="text-lg font-bold text-kyoto-dark-green">{announcement.title}</h4>
                    {announcement.date && (
                      <p className="text-xs text-gray-500 mb-2">{announcement.date}</p>
                    )}
                    <p className="text-sm text-gray-700">{announcement.description}</p>
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
