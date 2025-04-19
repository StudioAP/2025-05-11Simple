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
    <section id="pricing" className="py-6 bg-kyoto-cream min-h-screen flex items-center">
      <div className="section-container py-0">
        <div className="text-center mb-3">
          <h2
            ref={titleRef}
            className="section-title text-kyoto-dark-green mx-auto opacity-0"
          >
            会員プラン
          </h2>
        </div>

        {/* 左右2段組レイアウト */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 左側: 会員種別テーブル */}
          <div 
            ref={(el) => (sectionRefs.current[0] = el)}
            className="bg-white rounded-sm shadow-xl p-4 opacity-0 border-2 border-kyoto-gold/40 hover:shadow-2xl transition-all h-full"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-kyoto-dark-green/10">
                  <tr className="border-b-2 border-kyoto-gold/30">
                    <th className="py-2 px-3 text-left font-bold text-kyoto-dark-green text-base">会員種別</th>
                    <th className="py-2 px-3 text-center font-bold text-kyoto-dark-green text-base">入会金</th>
                    <th className="py-2 px-3 text-center font-bold text-kyoto-dark-green text-base">年会費</th>
                    <th className="py-2 px-3 text-left font-bold text-kyoto-dark-green text-base">プレーできる日</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 hover:bg-kyoto-cream/30">
                    <td className="py-2 px-3 font-medium text-base">一年正会員</td>
                    <td className="py-2 px-3 text-center text-base">不要</td>
                    <td className="py-2 px-3 text-center">
                      <span className="font-bold text-kyoto-dark-green text-lg">
                        66,000円
                      </span>
                    </td>
                    <td className="py-2 px-3 text-base">常時</td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-kyoto-cream/30">
                    <td className="py-2 px-3 font-medium text-base">週末・祝日会員</td>
                    <td className="py-2 px-3 text-center text-base">不要</td>
                    <td className="py-2 px-3 text-center">
                      <span className="font-bold text-kyoto-dark-green text-lg">
                        51,000円
                      </span>
                    </td>
                    <td className="py-2 px-3 text-base">土日、祝日</td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-kyoto-cream/30">
                    <td className="py-2 px-3 font-medium text-base">平日一年会員</td>
                    <td className="py-2 px-3 text-center text-base">不要</td>
                    <td className="py-2 px-3 text-center">
                      <span className="font-bold text-kyoto-dark-green text-lg">
                        48,000円
                      </span>
                    </td>
                    <td className="py-2 px-3 text-base">平日終日と土曜日13時まで</td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-kyoto-cream/30">
                    <td className="py-2 px-3 font-medium text-base">特定曜日ビジター</td>
                    <td className="py-2 px-3 text-center text-base">不要</td>
                    <td className="py-2 px-3 text-center">
                      <span className="font-bold text-kyoto-dark-green text-lg">
                        24,000円
                      </span>
                    </td>
                    <td className="py-2 px-3 text-base">月～金の希望する曜日</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* 会員種別表の下のプレーフィ情報(会員)を改善 - 金額配置を年会費に合わせる */}
            <div className="mt-4 bg-white rounded-sm shadow-lg p-3 border-l-4 border-kyoto-gold/80">
              <h3 className="text-lg font-bold text-kyoto-dark-green mb-2 pb-1 border-b border-kyoto-gold/30">プレーフィ（会員）</h3>
              <div className="flex items-center">
                <div className="w-2/3 text-base text-gray-700">1日あたりのプレー料金</div>
                <div className="w-1/3 text-center">
                  <p className="font-bold text-kyoto-dark-green text-lg">500円</p>
                </div>
              </div>
              </div>
              
            {/* 備考を会員種別表の下に移動 */}
            <div 
              ref={(el) => (sectionRefs.current[2] = el)}
              className="mt-4 bg-white rounded-sm shadow-lg p-3 opacity-0"
            >
              <h3 className="text-lg font-bold text-kyoto-dark-green mb-2 pb-1 border-b border-kyoto-gold/30">備考</h3>
              <div className="space-y-2">
                <div className="flex items-start">
                  <span className="text-kyoto-gold mr-2 font-bold">•</span>
                  <p className="text-gray-700 text-sm">年度途中に入会の場合、年会費は月割り額になります。</p>
                </div>
                <div className="flex items-start">
                  <span className="text-kyoto-gold mr-2 font-bold">•</span>
                  <p className="text-gray-700 text-sm">正会員、平日正会員には、入会金100,000円の支払いにより、年会費が継続して減額になるプランがあります。（正会員66,000円→60,000円、平日正会員54,000円→48,000円）</p>
                </div>
              </div>
            </div>
          </div>

          {/* 右側: 残りの情報を縦に積み上げる */}
          <div className="space-y-3 flex flex-col justify-between">
            {/* 具体例を右段の最上部に移動 */}
            <div 
              ref={(el) => (sectionRefs.current[3] = el)}
              className="bg-white rounded-sm shadow-lg p-3 opacity-0 border-l-4 border-kyoto-gold/80"
            >
              <h3 className="text-lg font-bold text-kyoto-dark-green mb-2 pb-1 border-b border-kyoto-gold/30">具体例</h3>
              <p className="text-base text-gray-700 mb-2">平日一年会員が週2回プレーした場合</p>
              <div className="bg-kyoto-cream/30 p-3 rounded">
                <p className="bg-white/50 px-2 py-1 rounded-sm inline-block font-bold text-kyoto-dark-green text-lg mb-1">
                  年間費用: 96,000円（8,000円／月）
                </p>
                <p className="text-gray-700 text-sm">内訳：年会費48,000円＋プレーフィ48,000円</p>
                <p className="text-gray-700 text-sm">（500円×月8回×12か月）</p>
              </div>
            </div>

            {/* ビジター利用情報 - 写真を最下部に移動し、レイアウト調整 */}
            <div className="bg-white rounded-sm shadow-lg p-3 opacity-0 animate-fade-in border-l-4 border-kyoto-gold/80">
              <h3 className="text-lg font-bold text-kyoto-dark-green mb-2 pb-1 border-b border-kyoto-gold/30">ビジター利用</h3>
              
              {/* ビジター情報 - 上部に配置 */}
              <div className="bg-kyoto-cream/30 p-3 rounded-sm mb-3">
                <p className="text-base text-gray-700">
                  会員にならずともビジターとして京都ローンテニスクラブでテニスを楽しめます。
                </p>
        </div>

              {/* プレーフィ情報 - 年会費と同じ配置に */}
              <div className="flex items-center mb-4">
                <div className="w-2/3 text-base text-gray-700">ビジタープレーフィ（1日）</div>
                <div className="w-1/3 text-center">
                  <p className="font-bold text-kyoto-dark-green text-lg">1,500円</p>
                </div>
          </div>
          
              {/* 写真 - 最下部に移動 */}
              <div className="overflow-hidden rounded-sm shadow-md hover:shadow-lg transition-all">
            <img 
                  src="/images/20250404131442-sport-5018610_1920.jpg"
                  alt="テニスクラブの風景"
                  className="w-full h-40 object-cover"
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