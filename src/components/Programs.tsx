
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
    <section id="programs" className="py-12 bg-kyoto-light-green japanese-pattern" ref={sectionRef}>
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* プログラム・サービス */}
          <div>
            <div className="text-center mb-6">
              <h3 
                ref={(el) => (fadeRefs.current[0] = el)} 
                className="text-sm uppercase tracking-wider text-kyoto-dark-green mb-1 opacity-0"
              >
                プログラム・サービス
              </h3>
              <h2 
                ref={(el) => (fadeRefs.current[1] = el)} 
                className="section-title text-kyoto-dark-green opacity-0 mx-auto text-2xl md:text-3xl"
              >
                気軽に始めよう
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* テニス体験 */}
              <div 
                ref={(el) => (fadeRefs.current[2] = el)} 
                className="opacity-0"
              >
                <div className="bg-white p-6 rounded-sm shadow-lg hover-lift">
                  <h3 className="text-xl font-bold text-kyoto-dark-green mb-3">一日テニス体験</h3>
                  <p className="text-gray-700 mb-4 text-sm">
                    初めてでも安心。会員が温かく迎えます。<br />
                    一人でも友達とでも、平日でも週末でもOK
                  </p>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-kyoto-gold/20 flex items-center justify-center mr-2">
                        <span className="text-kyoto-dark-green font-semibold text-xs">1</span>
                      </div>
                      <p className="text-gray-700 text-sm">お電話で体験予約</p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-kyoto-gold/20 flex items-center justify-center mr-2">
                        <span className="text-kyoto-dark-green font-semibold text-xs">2</span>
                      </div>
                      <p className="text-gray-700 text-sm">当日受付でお名前をお伝えください</p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-kyoto-gold/20 flex items-center justify-center mr-2">
                        <span className="text-kyoto-dark-green font-semibold text-xs">3</span>
                      </div>
                      <p className="text-gray-700 text-sm">会員とテニスを楽しむ</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 予約方法 */}
              <div 
                ref={(el) => (fadeRefs.current[3] = el)} 
                className="opacity-0"
              >
                <div className="bg-white p-6 rounded-sm shadow-lg hover-lift">
                  <h3 className="text-xl font-bold text-kyoto-dark-green mb-3">予約方法</h3>
                  <p className="text-gray-700 mb-4 text-sm">
                    電話: (075)-741-2917（前日まで）
                  </p>
                  <Button variant="secondary" className="self-start text-sm">
                    今すぐ予約する
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* お知らせセクション */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-kyoto-dark-green">お知らせ</h3>
              <button 
                onClick={() => setAdminOpen(true)} 
                className="text-xs text-kyoto-dark-green/50 hover:text-kyoto-dark-green"
              >
                管理
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {announcements.map((announcement, index) => (
                <div 
                  key={index}
                  ref={(el) => (fadeRefs.current[4 + index] = el)} 
                  className="bg-white p-4 rounded-sm shadow-lg hover-lift opacity-0"
                >
                  <div className="border-l-3 border-kyoto-gold pl-3">
                    <h4 className="text-kyoto-dark-green font-bold mb-1">{announcement.title}</h4>
                    {announcement.date && (
                      <p className="text-gray-700 text-xs mb-1">
                        {announcement.date}
                      </p>
                    )}
                    <p className="text-gray-700 text-sm">
                      {announcement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <Button variant="outline" className="mx-auto text-sm">
                イベント一覧を見る
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 管理者ダイアログ */}
      <Dialog open={adminOpen} onOpenChange={setAdminOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>お知らせ管理</DialogTitle>
            <DialogDescription>
              {!isAdmin ? "管理者パスワードを入力してください" : "お知らせの追加・編集"}
            </DialogDescription>
          </DialogHeader>
          
          {!isAdmin ? (
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button onClick={handleAdminLogin} className="w-full">ログイン</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                placeholder="タイトル"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
              />
              <Input
                placeholder="日付 (任意)"
                value={newAnnouncement.date}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, date: e.target.value})}
              />
              <Input
                placeholder="詳細"
                value={newAnnouncement.description}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, description: e.target.value})}
              />
              <Button onClick={handleAddAnnouncement} className="w-full">追加</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Programs;
