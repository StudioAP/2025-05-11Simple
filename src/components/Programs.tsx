
import React, { useEffect, useRef } from "react";
import Button from "./Button";

const Programs = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const fadeRefs = useRef<Array<HTMLDivElement | null>>([]);

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

  return (
    <section id="programs" className="py-20 bg-kyoto-light-green japanese-pattern" ref={sectionRef}>
      <div className="section-container">
        <div className="text-center mb-16">
          <h3 
            ref={(el) => (fadeRefs.current[0] = el)} 
            className="text-sm uppercase tracking-wider text-kyoto-dark-green mb-2 opacity-0"
          >
            プログラム・サービス
          </h3>
          <h2 
            ref={(el) => (fadeRefs.current[1] = el)} 
            className="section-title text-kyoto-dark-green opacity-0 mx-auto"
          >
            気軽に始めよう
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* テニス体験 */}
          <div 
            ref={(el) => (fadeRefs.current[2] = el)} 
            className="opacity-0"
          >
            <div className="bg-white p-8 rounded-sm shadow-lg hover-lift">
              <h3 className="text-2xl font-bold text-kyoto-dark-green mb-4">一日テニス体験</h3>
              <p className="text-gray-700 mb-6">
                初めてでも安心。会員が温かく迎えます。<br />
                一人でも友達とでも、平日でも週末でもOK
              </p>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-kyoto-gold/20 flex items-center justify-center mr-3">
                    <span className="text-kyoto-dark-green font-semibold">1</span>
                  </div>
                  <p className="text-gray-700">お電話で体験予約</p>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-kyoto-gold/20 flex items-center justify-center mr-3">
                    <span className="text-kyoto-dark-green font-semibold">2</span>
                  </div>
                  <p className="text-gray-700">当日受付でお名前をお伝えください</p>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-kyoto-gold/20 flex items-center justify-center mr-3">
                    <span className="text-kyoto-dark-green font-semibold">3</span>
                  </div>
                  <p className="text-gray-700">会員とテニスを楽しむ</p>
                </div>
              </div>
            </div>
          </div>

          {/* 予約方法 */}
          <div 
            ref={(el) => (fadeRefs.current[3] = el)} 
            className="opacity-0"
          >
            <div className="relative rounded-sm overflow-hidden">
              <img 
                src="/lovable-uploads/63226b1a-e1c0-4ac8-a29c-b4746b1d91f5.png" 
                alt="テニスレッスン" 
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-kyoto-dark-green/80 to-transparent p-8 flex flex-col justify-end">
                <h3 className="text-2xl font-bold text-white mb-4">予約方法</h3>
                <p className="text-white mb-6">
                  電話: (075)-741-2917（前日まで）
                </p>
                <Button variant="outline" className="self-start">
                  今すぐ予約する
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* お知らせセクション */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-kyoto-dark-green text-center mb-8">お知らせ</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              ref={(el) => (fadeRefs.current[4] = el)} 
              className="bg-white p-6 rounded-sm shadow-lg hover-lift opacity-0"
            >
              <div className="border-l-4 border-kyoto-gold pl-4">
                <h4 className="text-kyoto-dark-green font-bold mb-2">第12回交流会</h4>
                <p className="text-gray-700 text-sm mb-2">
                  2025年3月29日(土) 10:00～16:00
                </p>
                <p className="text-gray-700 text-sm">
                  どなたでも参加可能。初心者歓迎！
                </p>
              </div>
            </div>
            
            <div 
              ref={(el) => (fadeRefs.current[5] = el)} 
              className="bg-white p-6 rounded-sm shadow-lg hover-lift opacity-0"
            >
              <div className="border-l-4 border-kyoto-gold pl-4">
                <h4 className="text-kyoto-dark-green font-bold mb-2">毎月最終土曜交流会</h4>
                <p className="text-gray-700 text-sm mb-2">
                  メンバー500円 / ビジター1,500円
                </p>
                <p className="text-gray-700 text-sm">
                  誰でも参加OK。遊びに来てください！
                </p>
              </div>
            </div>
            
            <div 
              ref={(el) => (fadeRefs.current[6] = el)} 
              className="bg-white p-6 rounded-sm shadow-lg hover-lift opacity-0"
            >
              <div className="border-l-4 border-kyoto-gold pl-4">
                <h4 className="text-kyoto-dark-green font-bold mb-2">会員優先予約期間</h4>
                <p className="text-gray-700 text-sm">
                  会員の方は2週間前から優先的にコートの予約が可能です。
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Button variant="outline" className="mx-auto">
              イベント一覧を見る
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Programs;
