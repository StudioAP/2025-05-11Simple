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
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-kyoto-white leading-tight mb-6">
            <span className="block">京都いちの歴史と、</span>
            <span className="block mt-2">豊かな緑がある</span>
            <span className="block mt-2">テニスクラブ。</span>
          </h1>
          
          <div className="w-20 h-1 bg-kyoto-gold mb-6"></div>
          
          <p className={`text-base md:text-lg text-kyoto-white/90 ${isWindows ? 'mb-5 leading-relaxed' : 'mb-4'}`} style={{ fontFamily: 'Zen Old Mincho, serif' }}>
            <span className={isWindows ? 'block mb-1' : ''}>
              1935年オープンの、伝統ある会員制クラブ。
            </span>
            <span className={isWindows ? 'block mb-1' : ''}>
              会員の手で運営しているから、年会費もプレー代もお手頃。
            </span>
            <span className={isWindows ? 'block' : ''}>
              お盆も正月も、いつでもコートが待ってる。
            </span>
          </p>
          
          <div className="mb-8"></div>
          
          <h2 className={`text-xl md:text-3xl text-kyoto-white ${isWindows ? 'mb-2 leading-relaxed' : 'mb-0 font-light'}`}>
            <span className={isWindows ? 'block mb-1' : ''}>
              自然の中、心地よい汗を流そう。
            </span>
            <span className={isWindows ? 'block' : ''}>
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
          
          {/* 予約ボタンを削除 */}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator animate-bounce-subtle"></div>
    </section>
  );
};

export default Hero;
