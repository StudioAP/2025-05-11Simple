
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
      </div>
    </section>
  );
};

export default Programs;
