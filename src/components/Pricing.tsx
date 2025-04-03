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
    <section id="pricing" className="py-12 bg-kyoto-cream min-h-screen flex items-center">
      <div className="section-container">
        <div className="text-center mb-8">
          <h2
            ref={titleRef}
            className="section-title text-kyoto-dark-green mx-auto opacity-0 text-3xl md:text-4xl font-bold"
          >
            会員プラン
          </h2>
        </div>

        {/* 左右2段組レイアウト */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 左側: 会員種別テーブル */}
          <div 
            ref={(el) => (sectionRefs.current[0] = el)}
            className="bg-white rounded-sm shadow-xl p-6 opacity-0 border-2 border-kyoto-gold/40 hover:shadow-2xl transition-all h-full flex flex-col"
          >
            <h3 className="text-2xl font-bold text-kyoto-dark-green mb-4 text-center border-b-2 border-kyoto-gold/30 pb-3">会員種別</h3>
            
            <div className="overflow-x-auto flex-grow">
              <table className="w-full">
                <thead className="bg-kyoto-dark-green/10">
                  <tr className="border-b-2 border-kyoto-gold/30">
                    <th className="py-3 px-4 text-left font-bold text-kyoto-dark-green text-base">会員種別</th>
                    <th className="py-3 px-4 text-center font-bold text-kyoto-dark-green text-base">入会金</th>
                    <th className="py-3 px-4 text-center font-bold text-kyoto-dark-green text-base">年会費</th>
                    <th className="py-3 px-4 text-left font-bold text-kyoto-dark-green text-base">プレーできる日</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 hover:bg-kyoto-cream/30">
                    <td className="py-3 px-4 font-medium text-base">一年正会員</td>
                    <td className="py-3 px-4 text-center text-base">不要</td>
                    <td className="py-3 px-4 text-center font-bold text-kyoto-dark-green text-lg">66,000円</td>
                    <td className="py-3 px-4 text-base">常時</td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-kyoto-cream/30">
                    <td className="py-3 px-4 font-medium text-base">週末・祝日会員</td>
                    <td className="py-3 px-4 text-center text-base">不要</td>
                    <td className="py-3 px-4 text-center font-bold text-kyoto-dark-green text-lg">51,000円</td>
                    <td className="py-3 px-4 text-base">土日、祝日</td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-kyoto-cream/30">
                    <td className="py-3 px-4 font-medium text-base">平日一年会員</td>
                    <td className="py-3 px-4 text-center text-base">不要</td>
                    <td className="py-3 px-4 text-center font-bold text-kyoto-dark-green text-lg">48,000円</td>
                    <td className="py-3 px-4 text-base">平日終日と土曜日13時まで</td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-kyoto-cream/30">
                    <td className="py-3 px-4 font-medium text-base">特定曜日ビジター</td>
                    <td className="py-3 px-4 text-center text-base">不要</td>
                    <td className="py-3 px-4 text-center font-bold text-kyoto-dark-green text-lg">24,000円</td>
                    <td className="py-3 px-4 text-base">月～金の希望する曜日</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* テニス画像を左カラムの下部に配置 */}
            <div className="mt-6 rounded-sm overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1622279457486-57c73dc6f8e8?q=80&w=2070&auto=format&fit=crop" 
                alt="テニスコート" 
                className="w-full h-40 object-cover"
              />
            </div>
          </div>

          {/* 右側: 残りの情報を縦に積み上げる */}
          <div className="space-y-6 flex flex-col">
            {/* プレーフィ情報 */}
            <div 
              ref={(el) => (sectionRefs.current[1] = el)}
              className="bg-white rounded-sm shadow-lg p-6 opacity-0 border-l-4 border-kyoto-gold/80"
            >
              <h3 className="text-xl font-bold text-kyoto-dark-green mb-3 pb-2 border-b border-kyoto-gold/30">プレーフィ</h3>
              <div className="space-y-4 mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 text-lg">会員：</span>
                  <span className="font-bold text-kyoto-dark-green text-xl">500円/日</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 text-lg">ビジター：</span>
                  <span className="font-bold text-kyoto-dark-green text-xl">1,500円/日</span>
                </div>
              </div>
              <p className="text-base text-gray-600 italic mt-3">
                ※会員にならずともビジターとして京都ローンテニスクラブでテニスを楽しめます。
              </p>
            </div>
            
            {/* 備考 */}
            <div 
              ref={(el) => (sectionRefs.current[2] = el)}
              className="bg-white rounded-sm shadow-lg p-6 opacity-0"
            >
              <h3 className="text-xl font-bold text-kyoto-dark-green mb-3 pb-2 border-b border-kyoto-gold/30">備考</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="text-kyoto-gold mr-3 font-bold text-lg">•</span>
                  <p className="text-gray-700 text-base">年度途中に入会の場合、年会費は月割り額になります。</p>
                </div>
                <div className="flex items-start">
                  <span className="text-kyoto-gold mr-3 font-bold text-lg">•</span>
                  <p className="text-gray-700 text-base">正会員、平日正会員には、入会金100,000円の支払いにより、年会費が継続して減額になるプランがあります。（正会員66,000円→60,000円、平日正会員54,000円→48,000円）</p>
                </div>
              </div>
            </div>
            
            {/* 具体例 */}
            <div 
              ref={(el) => (sectionRefs.current[3] = el)}
              className="bg-white rounded-sm shadow-lg p-6 opacity-0 border-l-4 border-kyoto-gold/80"
            >
              <h3 className="text-xl font-bold text-kyoto-dark-green mb-3 pb-2 border-b border-kyoto-gold/30">具体例</h3>
              <p className="text-lg text-gray-700 mb-3">平日一年会員が週2回プレーした場合</p>
              <div className="bg-kyoto-cream/30 p-4 rounded mt-1">
                <p className="text-kyoto-dark-green font-bold text-xl mb-2">年間費用: 96,000円（8,000円／月）</p>
                <p className="text-gray-700 text-base">内訳：年会費48,000円＋プレーフィ48,000円</p>
                <p className="text-gray-700 text-base">（500円×月8回×12か月）</p>
              </div>
            </div>

            {/* 右側カラムの下部に2枚の画像を横並びに配置 */}
            <div className="grid grid-cols-2 gap-4">
              <div 
                ref={(el) => (sectionRefs.current[5] = el)}
                className="rounded-sm overflow-hidden shadow-lg opacity-0 h-32"
              >
                <img 
                  src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=1064&auto=format&fit=crop" 
                  alt="テニスプレイヤー" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div 
                ref={(el) => (sectionRefs.current[6] = el)}
                className="rounded-sm overflow-hidden shadow-lg opacity-0 h-32"
              >
                <img 
                  src="https://images.unsplash.com/photo-1620742778397-c7c8f9a63d8a?q=80&w=1615&auto=format&fit=crop" 
                  alt="テニスコート" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing; 