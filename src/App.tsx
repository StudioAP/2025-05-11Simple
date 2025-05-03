import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import NewsArchive from "./components/NewsArchive";
import "./index.css";
import { Toaster } from "./components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotFound from "./pages/NotFound";
import ManageNewsPage from "./pages/manage-news";

const queryClient = new QueryClient();

const App = () => {
  return (
  <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/news-archive" element={<Layout><NewsArchive /></Layout>} />
          {/* <Route path="/news-archive" element={<NewsArchive />} /> */}
          <Route path="/manage-news" element={<ManageNewsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
  </QueryClientProvider>
);
};

export default App;
// 強制更新テスト
// 最終テスト - 2025年 4月 2日 水曜日 23時38分16秒 JST
