import React, { useEffect, useRef } from "react";

const Pricing = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sectionRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
            entry.target.classList.remove("opacity-0");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (titleRef.current) observer.observe(titleRef.current);
    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      if (titleRef.current) observer.unobserve(titleRef.current);
      sectionRefs.current.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  return (
    <section id="pricing" className="py-8 bg-kyoto-cream min-h-screen flex flex-col justify-center">
      <div className="section-container">
        <div className="text-center mb-4">
          <h2
            ref={titleRef}
            className="section-title text-kyoto-dark-green mx-auto opacity-0 text-2xl md:text-3xl"
          >
            会員プラン
          </h2>
        </div>

        {/* 会員種別テーブル - メインコンテンツとして強調 */}
        <div 
          ref={(el) => (sectionRefs.current[0] = el)}
          className="bg-white rounded-sm shadow-lg p-4 mb-5 opacity-0 border-2 border-kyoto-gold/40 transform hover:scale-[1.01] transition-all"
        >
          <h3 className="text-xl font-bold text-kyoto-dark-green mb-3 text-center">会員種別</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-kyoto-dark-green/10">
                <tr className="border-b-2 border-kyoto-gold/30">
                  <th className="py-2 px-2 text-left font-bold text-kyoto-dark-green">会員種別</th>
                  <th className="py-2 px-2 text-center font-bold text-kyoto-dark-green">入会金</th>
                  <th className="py-2 px-2 text-center font-bold text-kyoto-dark-green">年会費</th>
                  <th className="py-2 px-2 text-left font-bold text-kyoto-dark-green">プレーできる日</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-kyoto-cream/30">
                  <td className="py-2 px-2 font-medium">一年正会員</td>
                  <td className="py-2 px-2 text-center">不要</td>
                  <td className="py-2 px-2 text-center font-bold text-kyoto-dark-green">66,000円</td>
                  <td className="py-2 px-2">常時</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-kyoto-cream/30">
                  <td className="py-2 px-2 font-medium">週末・祝日会員</td>
                  <td className="py-2 px-2 text-center">不要</td>
                  <td className="py-2 px-2 text-center font-bold text-kyoto-dark-green">51,000円</td>
                  <td className="py-2 px-2">土日、祝日</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-kyoto-cream/30">
                  <td className="py-2 px-2 font-medium">平日一年会員</td>
                  <td className="py-2 px-2 text-center">不要</td>
                  <td className="py-2 px-2 text-center font-bold text-kyoto-dark-green">48,000円</td>
                  <td className="py-2 px-2">平日終日と土曜日13時まで</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-kyoto-cream/30">
                  <td className="py-2 px-2 font-medium">特定曜日ビジター</td>
                  <td className="py-2 px-2 text-center">不要</td>
                  <td className="py-2 px-2 text-center font-bold text-kyoto-dark-green">24,000円</td>
                  <td className="py-2 px-2">月～金の希望する曜日</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3列グリッドレイアウト - 残りの情報をコンパクトに */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 左: プレーフィ情報 */}
          <div 
            ref={(el) => (sectionRefs.current[1] = el)}
            className="bg-white rounded-sm shadow-lg p-4 opacity-0 h-full flex flex-col"
          >
            <h3 className="text-base font-bold text-kyoto-dark-green mb-2 pb-1 border-b border-kyoto-gold/30">プレーフィ</h3>
            <div className="space-y-2 mb-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 text-sm">会員：</span>
                <span className="font-bold text-kyoto-dark-green">500円/日</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 text-sm">ビジター：</span>
                <span className="font-bold text-kyoto-dark-green">1,500円/日</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 italic mt-auto">
              ※会員にならずともビジターとして京都ローンテニスクラブでテニスを楽しめます。
            </p>
          </div>
          
          {/* 中央: 備考 */}
          <div 
            ref={(el) => (sectionRefs.current[2] = el)}
            className="bg-white rounded-sm shadow-lg p-4 opacity-0 text-sm"
          >
            <h3 className="text-base font-bold text-kyoto-dark-green mb-2 pb-1 border-b border-kyoto-gold/30">備考</h3>
            <div className="space-y-2">
              <div className="flex items-start">
                <span className="text-kyoto-gold mr-2 font-bold">•</span>
                <p className="text-gray-700 text-xs">年度途中に入会の場合、年会費は月割り額になります。</p>
              </div>
              <div className="flex items-start">
                <span className="text-kyoto-gold mr-2 font-bold">•</span>
                <p className="text-gray-700 text-xs">正会員、平日正会員には、入会金100,000円の支払いにより、年会費が継続して減額になるプランがあります。</p>
              </div>
            </div>
          </div>
          
          {/* 右: 具体例 */}
          <div 
            ref={(el) => (sectionRefs.current[3] = el)}
            className="bg-white rounded-sm shadow-lg p-4 opacity-0 border-l-4 border-kyoto-gold/80 flex flex-col"
          >
            <h3 className="text-base font-bold text-kyoto-dark-green mb-2 pb-1 border-b border-kyoto-gold/30">具体例</h3>
            <p className="text-gray-700 text-sm mb-1">平日一年会員が週2回プレーした場合</p>
            <div className="bg-gray-50 p-2 rounded mt-1 flex-grow">
              <p className="text-kyoto-dark-green font-bold text-sm mb-1">年間費用: 96,000円（8,000円／月）</p>
              <p className="text-gray-600 text-xs">内訳：年会費48,000円＋プレーフィ48,000円</p>
              <p className="text-gray-600 text-xs">（500円×月8回×12か月）</p>
            </div>
          </div>
        </div>

        {/* テニスコート写真 - 下部に小さく配置 */}
        <div className="grid grid-cols-3 gap-2 mt-4 h-24">
          <div 
            ref={(el) => (sectionRefs.current[4] = el)}
            className="rounded-sm overflow-hidden shadow-sm opacity-0 h-full"
          >
            <img 
              src="https://images.unsplash.com/photo-1622279457486-57c73dc6f8e8?q=80&w=2070&auto=format&fit=crop" 
              alt="テニスコート" 
              className="w-full h-full object-cover"
            />
          </div>
          <div 
            ref={(el) => (sectionRefs.current[5] = el)}
            className="rounded-sm overflow-hidden shadow-sm opacity-0 h-full"
          >
            <img 
              src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=1064&auto=format&fit=crop" 
              alt="テニスプレイヤー" 
              className="w-full h-full object-cover"
            />
          </div>
          <div 
            ref={(el) => (sectionRefs.current[6] = el)}
            className="rounded-sm overflow-hidden shadow-sm opacity-0 h-full"
          >
            <img 
              src="https://images.unsplash.com/photo-1620742778397-c7c8f9a63d8a?q=80&w=1615&auto=format&fit=crop" 
              alt="テニスコート" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing; 