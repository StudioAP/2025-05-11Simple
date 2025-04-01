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
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${isWindows ? 'pt-32 md:pt-24' : 'pt-16 md:pt-0'}`}>
      {/* Background Image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/lovable-uploads/8169b11f-0cde-4649-8dc2-a0cfaf118a91.png"
          alt="テニスボールとラケット"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-kyoto-dark-green/80 to-kyoto-dark-green/50"></div>
      </div>

      {/* Content */}
      <div
        className={`relative z-10 container mx-auto px-4 text-left max-w-4xl transition-opacity duration-1000 ${isWindows ? 'mt-12 sm:mt-12' : 'mt-4 sm:mt-0'} ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="staggered-fade-in">
          <h1 className={`text-2xl ${isWindows ? 'md:text-3xl' : 'md:text-4xl'} lg:text-5xl font-bold text-kyoto-white leading-tight mb-6`}>
            <span className="block">京都いちの歴史と、</span>
            <span className="block mt-2">豊かな緑がある</span>
            <span className="block mt-2">テニスクラブ。</span>
          </h1>
          
          <div className="w-20 h-1 bg-kyoto-gold mb-6"></div>
          
          <p className={`${isWindows ? 'text-sm md:text-base' : 'text-base md:text-lg'} text-kyoto-white/90 ${isWindows ? 'mb-5' : 'mb-4'}`} style={{ fontFamily: 'Zen Old Mincho, serif' }}>
            <span className={isWindows ? 'block mb-1' : 'inline'}>
              1930年オープンの、伝統ある会員制クラブ。
            </span>
            <br className={isWindows ? 'hidden' : ''} />
            <span className={isWindows ? 'block mb-1' : 'inline'}>
              会員の手で運営しているから、年会費もプレー代もリーズナブル。
            </span>
            <br className={isWindows ? 'hidden' : ''} />
            <span className={isWindows ? 'block' : 'inline'}>
              お盆も正月も、いつでもコートが待ってる。
            </span>
          </p>
          
          <div className="mb-8"></div>
          
          <h2 className={`text-lg ${isWindows ? 'md:text-2xl mb-6' : 'md:text-3xl mb-0'} text-kyoto-white font-light`}>
            <span className={isWindows ? 'block mb-1' : 'inline'}>
              自然の中、心地よい汗を流そう。
            </span>
            <br className={isWindows ? 'hidden' : ''} />
            <span className={isWindows ? 'block' : 'inline'}>
              京都ローンテニスクラブ。
            </span>
          </h2>
          <div className="text-center mb-4 p-4 bg-kyoto-dark-green/50 backdrop-blur-sm rounded">
            <h1 className="text-3xl md:text-4xl text-kyoto-gold font-bold mb-2">
              京都ローンテニスクラブ
            </h1>
            <h2 className="text-xl md:text-2xl text-kyoto-white font-medium tracking-wider">
              KYOTO LAWN TENNIS CLUB
            </h2>
          </div>
        </div>
        
        {/* クラブ概要情報 - 小さめに表示 */}
        <div className="absolute bottom-16 right-4 md:right-8 p-3 bg-kyoto-dark-green/70 backdrop-blur-sm rounded text-left max-w-xs animate-fade-in z-20">
          <h3 className="text-sm text-kyoto-gold font-medium mb-1">&lt;クラブ概要&gt;</h3>
          <ul className="text-xs text-kyoto-white/90 space-y-1">
            <li className="flex items-start">
              <span className="mr-1">•</span>
              <span>創立：1930年</span>
            </li>
            <li className="flex items-start">
              <span className="mr-1">•</span>
              <span>所在地：京都市左京区静市静原町</span>
            </li>
            <li className="flex items-start">
              <span className="mr-1">•</span>
              <span>会員：50名（男性25名、女性25名）2025年4月1日現在</span>
            </li>
            <li className="flex items-start">
              <span className="mr-1">•</span>
              <span>年齢層：30〜80歳代</span>
            </li>
          </ul>
        </div>
          
          {/* 予約ボタンを削除 */}
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator animate-bounce-subtle"></div>
    </section>
  );
};

export default Hero;
