import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import Button from "../components/Button";
import { toast } from "../components/ui/use-toast";
import { DatePicker } from "../components/ui/date-picker";
import { format } from "date-fns";
import newsData from "../data/news.json";

const ManageNewsPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  // ローカルストレージからニュースデータを読み込み
  const [newsItems, setNewsItems] = useState(() => {
    const savedNews = localStorage.getItem('newsItems');
    return savedNews ? JSON.parse(savedNews) : newsData.newsItems;
  });
  // ローカルストレージからイベントデータを読み込み
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem('events');
    return savedEvents ? JSON.parse(savedEvents) : newsData.events;
  });
  const [editMode, setEditMode] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [newItem, setNewItem] = useState({
    id: 0,
    date: "",
    title: "",
    content: "",
    imageUrl: ""
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleLogin = () => {
    // 簡易的な認証（実際のアプリでは安全な認証を使用してください）
    if (password === "admin123") {
      setIsAuthenticated(true);
      toast({
        title: "ログイン成功",
        description: "ニュースとイベントを管理できます"
      });
    } else {
      toast({
        title: "パスワードが正しくありません",
        variant: "destructive"
      });
    }
  };

  // ニュース追加処理
  const handleAddNewsItem = () => {
    if (newItem.title && newItem.content) {
      const updatedItems = [
        {
          ...newItem,
          id: newsItems.length > 0 ? Math.max(...newsItems.map(item => item.id)) + 1 : 1
        },
        ...newsItems
      ];
      // ローカルストレージに保存
      localStorage.setItem('newsItems', JSON.stringify(updatedItems));
      setNewsItems(updatedItems);
      setNewItem({
        id: 0,
        date: "",
        title: "",
        content: "",
        imageUrl: ""
      });
      setSelectedDate(undefined);
      toast({
        title: "ニュースを追加しました",
        description: "ローカルストレージに保存されました"
      });
    }
  };

  // ニュース削除処理
  const handleDeleteNewsItem = (id) => {
    const updatedItems = newsItems.filter(item => item.id !== id);
    // ローカルストレージに保存
    localStorage.setItem('newsItems', JSON.stringify(updatedItems));
    setNewsItems(updatedItems);
    toast({
      title: "ニュースを削除しました",
      description: "ローカルストレージから削除されました"
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-kyoto-light-green flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-sm shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-kyoto-dark-green mb-6 text-center">管理者ログイン</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
              <Input
                type="password"
                placeholder="管理者パスワードを入力"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              onClick={handleLogin}
              className="w-full"
            >
              ログイン
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kyoto-light-green p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-kyoto-dark-green">ニュース & イベント管理</h1>
          <a href="/" className="text-kyoto-dark-green hover:text-kyoto-gold text-sm">
            ← サイトに戻る
          </a>
        </div>

        <div className="bg-white p-6 rounded-sm shadow-lg mb-8">
          <h2 className="text-xl font-bold text-kyoto-dark-green mb-4">新規ニュース追加</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">日付</label>
              <DatePicker 
                date={selectedDate} 
                setDate={(date) => {
                  setSelectedDate(date);
                  if (date) {
                    setNewItem({ ...newItem, date: format(date, 'yyyy/MM/dd') });
                  }
                }}
                className="mb-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
              <Input
                type="text"
                placeholder="ニュースタイトル"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-sm"
                rows={3}
                placeholder="ニュース内容"
                value={newItem.content}
                onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
              />
            </div>
            <Button
              onClick={handleAddNewsItem}
              variant="secondary"
            >
              追加
            </Button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-sm shadow-lg">
          <h2 className="text-xl font-bold text-kyoto-dark-green mb-4">現在のニュース一覧</h2>
          <div className="space-y-4">
            {newsItems.map((item) => (
              <div key={item.id} className="border border-gray-200 p-4 rounded-sm">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold text-kyoto-dark-green">{item.title}</h3>
                    <p className="text-gray-500 text-sm">{item.date}</p>
                    <p className="mt-1">{item.content}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteNewsItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div className="bg-white p-4 rounded-sm shadow-lg mb-4">
            <h2 className="text-lg font-bold text-kyoto-dark-green mb-2">データ管理</h2>
            <div className="space-y-2">
              <Button 
                onClick={() => {
                  const dataStr = JSON.stringify({ newsItems, events });
                  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
                  const exportFileDefaultName = `news-backup-${new Date().toISOString().slice(0, 10)}.json`;
                  const linkElement = document.createElement('a');
                  linkElement.setAttribute('href', dataUri);
                  linkElement.setAttribute('download', exportFileDefaultName);
                  linkElement.click();
                }}
                variant="secondary"
                className="w-full"
              >
                データをJSONファイルで保存
              </Button>
              
              <Button
                onClick={() => {
                  if (confirm('ニュース設定を初期状態に戻しますか？')) {
                    localStorage.removeItem('newsItems');
                    localStorage.removeItem('events');
                    setNewsItems(newsData.newsItems);
                    setEvents(newsData.events);
                    toast({
                      title: "データをリセットしました",
                      description: "初期状態に戻しました"
                    });
                  }
                }}
                variant="primary"
                className="w-full bg-red-500 hover:bg-red-600"
              >
                データをリセット
              </Button>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            <p>※データはこのブラウザのローカルストレージに保存されています。</p>
            <p>※定期的にJSONファイルでバックアップすることをおすすめします。</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageNewsPage;
