import React, { useEffect, useRef } from "react";
import Button from "./Button";

const PricingCard = ({ title, price, entryFee, features, isPopular = false }) => {
  const cardRef = useRef<HTMLDivElement>(null);

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

    if (cardRef.current) observer.observe(cardRef.current);

    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-sm shadow-lg p-4 hover-lift opacity-0 relative overflow-hidden flex flex-col h-full border border-gray-200"
    >

      <h3 className="text-lg font-bold text-kyoto-dark-green mb-1">{title}</h3>
      
      <div className="mb-3">
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-kyoto-dark-green">
            {price}
          </span>
          <span className="text-gray-600 ml-1 text-xs md:text-sm">円/年</span>
        </div>
        <div className="text-xs md:text-sm text-gray-600">
          入会金: {entryFee}
        </div>
      </div>

      <ul className="space-y-1 text-xs md:text-sm flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg
              className="w-4 h-4 text-kyoto-gold shrink-0 mr-1 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Pricing = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

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

    if (titleRef.current) observer.observe(titleRef.current);
    if (imageRef.current) observer.observe(imageRef.current);

    return () => {
      if (titleRef.current) observer.unobserve(titleRef.current);
      if (imageRef.current) observer.unobserve(imageRef.current);
    };
  }, []);

  const pricingPlans = [
    {
      title: "正会員",
      price: "60,000",
      entryFee: "100,000円",
      features: [
        "プレー可能日: 常時", 
        "いつでもプレーOK", 
        "コート優先予約権", 
        "クラブイベント参加可", 
        "プレー代: 500円/日", 
        "※入会金をお支払いいただくことで、年会費が永年割引（例：一年正会員66,000円→正会員60,000円）となります。"
      ],
      isPopular: true,
    },
    {
      title: "一年正会員",
      price: "66,000",
      entryFee: "なし",
      features: [
        "プレー可能日: 常時", 
        "いつでもプレーOK", 
        "コート予約可能", 
        "クラブイベント参加可", 
        "プレー代: 500円/日"
      ],
      isPopular: false,
    },
    {
      title: "平日会員",
      price: "48,000",
      entryFee: "100,000円",
      features: [
        "プレー可能日: 平日終日・土曜13時まで", 
        "平日コート予約可能", 
        "クラブイベント参加可", 
        "プレー代: 500円/日", 
        "※入会金をお支払いいただくことで、年会費が永年割引となります。"
      ],
      isPopular: false,
    },
    {
      title: "平日一年会員",
      price: "48,000",
      entryFee: "なし",
      features: [
        "プレー可能日: 平日終日と土曜日13時まで", 
        "平日コート予約可能", 
        "クラブイベント参加可", 
        "プレー代: 500円/日"
      ],
      isPopular: false,
    },
    {
      title: "週末・祝日会員",
      price: "51,000",
      entryFee: "なし",
      features: [
        "プレー可能日: 土日祝のみ", 
        "限定予約枠あり", 
        "クラブイベント参加可", 
        "プレー代: 500円/日"
      ],
      isPopular: false,
    },
    {
      title: "特定曜日ビジター",
      price: "24,000",
      entryFee: "なし",
      features: [
        "プレー可能日: 月～金の希望する曜日", 
        "プレー代: 500円/日"
      ],
      isPopular: false,
    },
  ];

  return (
    <section id="pricing" className="py-12 bg-kyoto-cream">
      <div className="section-container">
        <div className="text-center mb-8">
          <h2
            ref={titleRef}
            className="section-title text-kyoto-dark-green mx-auto opacity-0 text-2xl md:text-3xl"
          >
            Membership Plans
          </h2>
        </div>

        {/* PC表示用レイアウト */}
        <div className="hidden md:flex flex-col mb-8">
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="col-span-1 space-y-4">
              <div 
                ref={imageRef}
                className="opacity-0 rounded-sm overflow-hidden shadow-lg"
              >
                <img 
                  src="/lovable-uploads/a140f6d7-a8b7-489d-b607-c3ecfd71d3b3.png" 
                  alt="テニスコート" 
                  className="w-full h-52 object-cover"
                />
              </div>
              
              <div className="bg-white rounded-sm shadow p-3 text-center opacity-0 animate-fade-in-up flex flex-col justify-center max-w-xs h-auto">
                <h3 className="text-sm md:text-base font-bold text-kyoto-dark-green mb-1">
                  ビジターも大歓迎
                </h3>
                <p className="text-gray-700 text-xs mb-1">
                  会員でなくても1日単位でご利用いただけます
                </p>
                <div className="text-base md:text-lg font-bold text-kyoto-dark-green">
                  1,500<span className="text-xs font-normal text-gray-600">円/日</span>
                </div>
              </div>
            </div>

            <div className="col-span-2 grid grid-cols-3 gap-4 auto-rows-fr">
              {pricingPlans.map((plan, index) => (
                <PricingCard
                  key={index}
                  title={plan.title}
                  price={plan.price}
                  entryFee={plan.entryFee}
                  features={plan.features}
                  isPopular={plan.isPopular}
                />
              ))}
            </div>
          </div>
        </div>

        {/* スマホ表示用レイアウト */}
        <div className="md:hidden mb-8">
          {/* テニスコート画像 */}
          <div 
            className="opacity-0 rounded-sm overflow-hidden shadow-lg mb-6 animate-fade-in-up"
          >
            <img 
              src="/lovable-uploads/a140f6d7-a8b7-489d-b607-c3ecfd71d3b3.png" 
              alt="テニスコート" 
              className="w-full h-64 object-cover"
            />
          </div>

          {/* ビジター情報（上部に配置） */}
          <div className="bg-white rounded-sm shadow p-3 text-center mb-6 opacity-0 animate-fade-in-up">
            <h3 className="text-sm md:text-base font-bold text-kyoto-dark-green mb-1">
              ビジターも大歓迎
            </h3>
            <p className="text-gray-700 text-xs mb-1">
              会員でなくても1日単位でご利用いただけます
            </p>
            <div className="text-base md:text-lg font-bold text-kyoto-dark-green">
              1,500<span className="text-xs font-normal text-gray-600">円/日</span>
            </div>
          </div>

          {/* 会員プランカード */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            {pricingPlans.map((plan, index) => (
              <PricingCard
                key={index}
                title={plan.title}
                price={plan.price}
                entryFee={plan.entryFee}
                features={plan.features}
                isPopular={plan.isPopular}
              />
            ))}
          </div>
        </div>

        {/* 追加情報 */}
        <div className="bg-white rounded-sm shadow p-5 text-sm text-gray-700 mb-8">
          <h3 className="font-bold text-kyoto-dark-green mb-2">注意事項</h3>
          <ul className="space-y-1">
            <li>※年度途中に入会の場合、年会費は月割り額になります。</li>
            <li>※会員のプレー代: 500円（1日）</li>
            <li>※ビジターのプレー代: 1,500円（1日）</li>
          </ul>
          <div className="mt-3 p-3 bg-gray-50 rounded">
            <p className="font-medium">例: 平日一年会員が週2回プレーした場合 → 年間費用 96,000円 (8,000円/月)</p>
            <p className="text-xs mt-1">内訳: 年会費 48,000円 + プレー代 48,000円 (500円×月8回×12か月)</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
