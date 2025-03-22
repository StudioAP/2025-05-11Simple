import React, { useEffect, useState } from "react";
import Button from "./Button";

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
        className={`relative z-10 container mx-auto px-4 text-left max-w-4xl transition-opacity duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="staggered-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-kyoto-white leading-tight mb-6">
            <span className="block">京都で一番歴史ある</span>
            <span className="block mt-2">テニスクラブ。</span>
          </h1>
          
          <div className="w-20 h-1 bg-kyoto-gold mb-6"></div>
          
          <h2 className="text-xl md:text-2xl text-kyoto-white mb-8 font-light">
            自然の中、心地よい汗を流そう。
          </h2>
          
          <Button size="lg" className="animate-fade-in">
            体験を今すぐ予約
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator animate-bounce-subtle"></div>
    </section>
  );
};

export default Hero;
