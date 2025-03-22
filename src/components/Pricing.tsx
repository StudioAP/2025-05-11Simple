
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
      className={`bg-white rounded-sm shadow-lg p-4 hover-lift opacity-0 relative overflow-hidden ${
        isPopular ? "border-2 border-kyoto-gold" : "border border-gray-200"
      }`}
    >
      {isPopular && (
        <div className="absolute top-0 right-0">
          <div className="bg-kyoto-gold text-kyoto-dark-green text-xs font-bold uppercase py-1 px-2 transform rotate-45 translate-x-5 translate-y-2">
            人気
          </div>
        </div>
      )}

      <h3 className="text-lg font-bold text-kyoto-dark-green mb-1">{title}</h3>
      
      <div className="mb-3">
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-kyoto-dark-green">
            {price}
          </span>
          <span className="text-gray-600 ml-1 text-xs">円/年</span>
        </div>
        <div className="text-xs text-gray-600">
          入会金: {entryFee}
        </div>
      </div>

      <ul className="space-y-1 mb-4 text-xs">
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

      <Button
        variant={isPopular ? "secondary" : "outline"}
        className="w-full text-xs py-1"
      >
        詳細を見る
      </Button>
    </div>
  );
};

const Pricing = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);

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

    return () => {
      if (titleRef.current) observer.unobserve(titleRef.current);
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
          <h3 className="text-sm uppercase tracking-wider text-kyoto-dark-green mb-1">
            料金プラン
          </h3>
          <h2
            ref={titleRef}
            className="section-title text-kyoto-dark-green mx-auto opacity-0 text-2xl md:text-3xl"
          >
            テニスを始めよう
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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

        <div className="mt-6 bg-white rounded-sm shadow p-4 text-center opacity-0 animate-fade-in-up max-w-md mx-auto">
          <h3 className="text-lg font-bold text-kyoto-dark-green mb-2">
            ビジターも大歓迎
          </h3>
          <p className="text-gray-700 text-sm mb-2">
            会員でなくても1日単位でご利用いただけます
          </p>
          <div className="text-2xl font-bold text-kyoto-dark-green">
            1,500<span className="text-base font-normal text-gray-600">円/日</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
