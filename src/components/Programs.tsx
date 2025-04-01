import React, { useEffect, useRef } from "react";
import newsData from "../data/news.json";

const Programs = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const fadeRefs = useRef<Array<HTMLDivElement | null>>([]);

  // アニメーション効果のためのIntersection Observer
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
    <section id="programs" className="py-8 bg-kyoto-light-green japanese-pattern">
      <div className="section-container">
        <div className="max-w-4xl mx-auto">
          {/* Programs & Event */}
          <div className="text-center mb-4">
            <h2 
              ref={(el) => (fadeRefs.current[0] = el)} 
              className="section-title text-kyoto-dark-green opacity-0 mx-auto text-xl md:text-2xl"
            >
              Programs & Event
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Tennis Experience */}
            <div 
              ref={(el) => (fadeRefs.current[1] = el)} 
              className="opacity-0"
            >
              <div className="bg-white p-4 md:p-5 rounded-sm shadow-lg hover-lift">
                <h3 className="text-xl font-bold text-kyoto-dark-green mb-3">＊ お気軽テニス体験 ＊</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <img 
                    src="/lovable-uploads/2dcc5e2e-3ed3-41e2-9038-cbab6f2a3962.png" 
                    alt="テニス体験" 
                    className="w-full h-40 md:h-48 object-cover rounded-sm"
                  />
                  <div>
                    <p className="text-gray-700 text-sm md:text-base mb-3">
                      初めてでも安心！<br />
                      会員が温かく迎えます。<br />
                      一人でも友達とでも。<br /> 
                      平日でも週末でもOK！<br /> 
                    </p>
                    <div className="mb-3">
                      <p className="text-gray-700 font-medium text-sm md:text-base">ご予約方法：</p>
                      <p className="text-base md:text-lg font-medium text-kyoto-dark-green">
                        電話: (075)-741-2917<br />（前日まで）
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-kyoto-gold/20 flex items-center justify-center mr-2">
                      <span className="text-kyoto-dark-green font-semibold text-xs">1</span>
                    </div>
                    <p className="text-gray-700 text-sm md:text-base">当日はラケットとシューズをご持参ください。（レンタル可）</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-kyoto-gold/20 flex items-center justify-center mr-2">
                      <span className="text-kyoto-dark-green font-semibold text-xs">2</span>
                    </div>
                    <p className="text-gray-700 text-sm md:text-base">約1時間のレッスンを体験していただけます。</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-kyoto-gold/20 flex items-center justify-center mr-2">
                      <span className="text-kyoto-dark-green font-semibold text-xs">3</span>
                    </div>
                    <p className="text-gray-700 text-sm md:text-base">体験料: <span className="font-bold text-kyoto-dark-green">¥2,000</span>（税込）</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 会員＆ビジター交流会 - よりコンパクトなデザイン */}
            <div 
              ref={(el) => (fadeRefs.current[2] = el)}
              className="opacity-0"
            >
              <div className="bg-white p-3 md:p-4 rounded-sm shadow-lg hover-lift mt-3 md:mt-4">
                <h3 className="text-lg font-bold text-kyoto-dark-green mb-2">{newsData.events[0].title}</h3>
                <p className="text-kyoto-dark-green font-medium text-sm md:text-base mb-2">
                  {newsData.events[0].schedule}
                </p>
                <div className="space-y-1 text-sm">
                  {newsData.events[0].details.map((detail, index) => (
                    <p key={index} className="text-gray-700 text-xs md:text-sm flex items-center">
                      <span className="w-1 h-1 rounded-full bg-kyoto-gold inline-block mr-1"></span>
                      {/* 参加費の場合は強調表示 */}
                      {detail.includes('参加費') ? (
                        <span className="font-bold text-sm md:text-base text-kyoto-dark-green">{detail}</span>
                      ) : (
                        detail
                      )}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            
            {/* レディース交流会 */}
            <div 
              ref={(el) => (fadeRefs.current[3] = el)} 
              className="opacity-0"
            >
              <div className="bg-white p-4 md:p-5 rounded-sm shadow-lg hover-lift">
                <h3 className="text-xl font-bold text-kyoto-dark-green mb-3">＊ レディース交流会 ＊</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <img 
                    src="/lovable-uploads/8169b11f-0cde-4649-8dc2-a0cfaf118a91.png" 
                    alt="レディース交流会" 
                    className="w-full h-40 md:h-48 object-cover rounded-sm"
                  />
                  <div>
                    <p className="text-gray-700 text-sm md:text-base mb-3">
                      女子会員の技術の向上を目的として、試合形式（ダブルス）の交流会を実施しています。
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <span className="text-kyoto-dark-green mr-2">•</span>
                    <p className="text-gray-700 text-sm md:text-base">日程: 毎月1回木曜日 10時～16時（予定）</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-kyoto-dark-green mr-2">•</span>
                    <p className="text-gray-700 text-sm md:text-base">対象: 会員およびビジター。クラスは不問です（お一人様でも参加できます）</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-kyoto-dark-green mr-2">•</span>
                    <p className="text-gray-700 text-sm md:text-base">参加費: <span className="font-bold text-kyoto-dark-green">会員500円、ビジター1,500円</span></p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-kyoto-dark-green mr-2">•</span>
                    <p className="text-gray-700 text-sm md:text-base">募集人数: 20名程度</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* コーチによるレッスン */}
            <div 
              ref={(el) => (fadeRefs.current[4] = el)} 
              className="opacity-0"
            >
              <div className="bg-white p-4 md:p-5 rounded-sm shadow-lg hover-lift">
                <h3 className="text-xl font-bold text-kyoto-dark-green mb-3">＊ コーチによるレッスン ＊</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <img 
                    src="/lovable-uploads/2dcc5e2e-3ed3-41e2-9038-cbab6f2a3962.png" 
                    alt="コーチによるレッスン" 
                    className="w-full h-40 md:h-48 object-cover rounded-sm"
                  />
                  <div>
                    <p className="text-gray-700 text-sm md:text-base mb-3">
                      会員の技術の向上を目的として、初級・中級者を対象にコーチによるレッスンを行っています。
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <span className="text-kyoto-dark-green mr-2">•</span>
                    <p className="text-gray-700 text-sm md:text-base">日程: 毎週火曜日 14時～16時（予定）</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-kyoto-dark-green mr-2">•</span>
                    <p className="text-gray-700 text-sm md:text-base">対象: 会員およびビジター。クラスは不問です（お一人様でも参加できます）</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-kyoto-dark-green mr-2">•</span>
                    <p className="text-gray-700 text-sm md:text-base">参加費: <span className="font-bold text-kyoto-dark-green">会員500円、ビジター1,500円</span></p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-kyoto-dark-green mr-2">•</span>
                    <p className="text-gray-700 text-sm md:text-base">募集人数: 10名程度</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 100歳大会 */}
            <div 
              ref={(el) => (fadeRefs.current[5] = el)} 
              className="opacity-0"
            >
              <div className="bg-white p-4 md:p-5 rounded-sm shadow-lg hover-lift">
                <h3 className="text-xl font-bold text-kyoto-dark-green mb-3">＊ 京都ローンテニスクラブ主催の試合（100歳大会） ＊</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <img 
                    src="/lovable-uploads/a140f6d7-a8b7-489d-b607-c3ecfd71d3b3.png" 
                    alt="100歳大会" 
                    className="w-full h-40 md:h-48 object-cover rounded-sm"
                  />
                  <div>
                    <p className="text-gray-700 text-sm md:text-base mb-3">
                      会員の日頃の研鑽の成果を試す機会として開催するダブルスの大会です。ペアの合計年齢100歳を中心に行います。
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <span className="text-kyoto-dark-green mr-2">•</span>
                    <p className="text-gray-700 text-sm md:text-base">日程: 11月（予定）</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-kyoto-dark-green mr-2">•</span>
                    <p className="text-gray-700 text-sm md:text-base">対象: 会員およびビジター。クラスは不問です（お一人様でも参加できます）</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-kyoto-dark-green mr-2">•</span>
                    <p className="text-gray-700 text-sm md:text-base">参加費: <span className="font-bold text-kyoto-dark-green">会員2,000円</span></p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-kyoto-dark-green mr-2">•</span>
                    <p className="text-gray-700 text-sm md:text-base">募集人数: 50名程度</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Programs;
