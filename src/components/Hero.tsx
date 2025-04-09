import React, { useEffect, useState } from "react";
import Button from "./Button";

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isWindows, setIsWindows] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    // Windows検出
    const detectWindows = () => {
      const platform = navigator.userAgent.toLowerCase();
      return platform.indexOf('win') !== -1;
    };
    
    setIsWindows(detectWindows());
  }, []);

  return (
    <section className={`relative min-h-screen flex items-start md:items-center overflow-hidden ${isWindows ? 'pt-32 md:pt-24' : 'pt-16 md:pt-0'}`}>
      {/* Background Image with overlay - アスペクト比3:4に最適化 */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/2025-04-09top.jpg"
          alt="テニスボールとラケット"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-kyoto-dark-green/50 to-kyoto-dark-green/30"></div>
      </div>

      {/* Content - F字型スキャンパターンに最適化 */}
      <div
        className={`relative z-10 container mx-auto px-6 md:px-8 py-6 text-left max-w-4xl transition-opacity duration-1000 ${isWindows ? 'mt-8 md:mt-0' : 'mt-4 md:mt-0'} ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* 左上から始まるF字型レイアウト */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 staggered-fade-in">
          {/* 左側カラム - F字型の縦線部分 */}
          <div className="md:col-span-8 md:pr-4">
            <h1 className={`text-2xl ${isWindows ? 'md:text-3xl' : 'md:text-4xl'} lg:text-5xl font-bold text-kyoto-white leading-tight mb-4`}>
              <span className="block">京都いちの歴史と、</span>
              <span className="block mt-2">豊かな緑がある</span>
              <span className="block mt-2">テニスクラブ。</span>
            </h1>
            
            <div className="w-20 h-1 bg-kyoto-gold mb-4"></div>
            
            <div className="text-highlight-container overflow-hidden">
              <p className={`${isWindows ? 'text-sm md:text-base' : 'text-base md:text-lg'} text-kyoto-white/90 ${isWindows ? 'mb-4' : 'mb-3'} leading-relaxed animate-fade-in-up-staggered-1`} style={{ fontFamily: 'Zen Old Mincho, serif' }}>
                <span className="block mb-2 translate-y-8 opacity-0 animate-fade-in-up-staggered-1">
                  1930年オープンの、伝統ある会員制クラブ。
                </span>
                <span className="block mb-2 translate-y-8 opacity-0 animate-fade-in-up-staggered-2">
                  会員による運営だから、年会費もプレー代もリーズナブル。
                </span>
                <span className="block translate-y-8 opacity-0 animate-fade-in-up-staggered-3">
                  お盆も正月も、いつでもコートが待っている。
                </span>
              </p>
            </div>
            
            <div className="my-4"></div>
            
            <h2 className={`text-lg ${isWindows ? 'md:text-2xl mb-4' : 'md:text-3xl mb-0'} text-kyoto-white font-light`}>
              <span className="block mb-1 translate-y-8 opacity-0 animate-fade-in-up-staggered-4">
                自然の中、心地よい汗を流そう。
              </span>
              <span className="block translate-y-8 opacity-0 animate-fade-in-up-staggered-5">
                京都ローンテニスクラブ。
              </span>
            </h2>
          </div>

          {/* 右側カラム - クラブ概要情報を配置調整 */}
          <div className="md:col-span-4 relative md:flex md:justify-center">
            {/* クラブ概要情報 - 右側中央付近に配置 */}
            <div className="bg-kyoto-dark-green/70 backdrop-blur-sm rounded p-3 animate-fade-in z-20 border border-kyoto-gold/20 absolute bottom-0 right-0 md:relative md:bottom-auto md:right-auto md:mt-4 max-w-xs">
              <h3 className="text-sm text-kyoto-gold font-medium mb-2">&lt;クラブ概要&gt;</h3>
              <ul className="text-xs text-kyoto-white/90 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2 text-kyoto-gold">•</span>
                  <span>創立：1930年</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-kyoto-gold">•</span>
                  <span>所在地：京都市左京区静市静原町</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-kyoto-gold">•</span>
                  <span>会員：50名（男性25名、女性25名）<br />2025年4月1日現在</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-kyoto-gold">•</span>
                  <span>年齢層：30〜80歳代</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 