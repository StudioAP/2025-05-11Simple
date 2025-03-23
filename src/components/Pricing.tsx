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
      className="bg-white rounded-sm shadow-lg p-4 hover-lift opacity-0 relative overflow-hidden flex flex-col min-h-[250px] border border-gray-200"
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

      <ul className="space-y-1 text-xs md:text-sm">
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
      {/* 「詳細を見る」ボタンを削除しました */}
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
      features: ["いつでもプレーOK", "コート優先予約権", "クラブイベント参加可", "プレー代: 500円/日"],
      isPopular: true,
    },
    {
      title: "一年正会員",
      price: "66,000",
      entryFee: "なし",
      features: ["いつでもプレーOK", "コート予約可能", "クラブイベント参加可", "プレー代: 500円/日"],
      isPopular: false,
    },
    {
      title: "平日会員",
      price: "48,000",
      entryFee: "100,000円",
      features: ["平日・土曜13時までプレーOK", "平日コート予約可能", "クラブイベント参加可", "プレー代: 500円/日"],
      isPopular: false,
    },
    {
      title: "週末・祝日会員",
      price: "51,000",
      entryFee: "なし",
      features: ["土日祝のみプレーOK", "限定予約枠あり", "クラブイベント参加可", "プレー代: 500円/日"],
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
        <div className="hidden md:grid grid-cols-2 gap-8 items-start mb-8">
          <div className="space-y-4">
            <div 
              ref={imageRef}
              className="opacity-0 rounded-sm overflow-hidden shadow-lg"
            >
              <img 
                src="/lovable-uploads/a140f6d7-a8b7-489d-b607-c3ecfd71d3b3.png" 
                alt="テニスコート" 
                className="w-full h-80 object-cover"
              />
            </div>
            
            <div className="bg-white rounded-sm shadow p-5 text-center opacity-0 animate-fade-in-up">
              <h3 className="text-lg font-bold text-kyoto-dark-green mb-2">
                ビジターも大歓迎
              </h3>
              <p className="text-gray-700 text-base mb-2">
                会員でなくても1日単位でご利用いただけます
              </p>
              <div className="text-2xl font-bold text-kyoto-dark-green">
                1,500<span className="text-base font-normal text-gray-600">円/日</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
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

          {/* ビジター情報（最下部に配置） */}
          <div className="bg-white rounded-sm shadow p-5 text-center opacity-0 animate-fade-in-up">
            <h3 className="text-lg font-bold text-kyoto-dark-green mb-2">
              ビジターも大歓迎
            </h3>
            <p className="text-gray-700 text-base mb-2">
              会員でなくても1日単位でご利用いただけます
            </p>
            <div className="text-2xl font-bold text-kyoto-dark-green">
              1,500<span className="text-base font-normal text-gray-600">円/日</span>
            </div>
          </div>
        </div>

        {/* 会員優先予約期間の情報を削除し、ビジター情報を写真下に移動 */}
      </div>
    </section>
  );
};

export default Pricing;
