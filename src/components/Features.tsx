
import React, { useRef, useEffect } from "react";

const Features = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === textRef.current) {
              entry.target.classList.add("animate-slide-in-left");
            }
            if (entry.target === imageRef.current) {
              entry.target.classList.add("animate-slide-in-right");
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (textRef.current) observer.observe(textRef.current);
    if (imageRef.current) observer.observe(imageRef.current);

    return () => {
      if (textRef.current) observer.unobserve(textRef.current);
      if (imageRef.current) observer.unobserve(imageRef.current);
    };
  }, []);

  return (
    <section id="features" className="py-20 bg-kyoto-white" ref={sectionRef}>
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div
            ref={textRef}
            className="opacity-0 transform translate-x-[-100%]"
          >
            <h3 className="text-sm uppercase tracking-wider text-kyoto-dark-green mb-2">
              クラブの特徴
            </h3>
            <h2 className="section-title text-kyoto-dark-green">
              京都ローンテニスクラブへ<br />ようこそ
            </h2>
            <div className="space-y-6 text-gray-700">
              <p className="leading-relaxed">
                伝統ある会員制クラブ。会員の手で運営しているから、年会費もプレー代もお手頃。
              </p>
              <p className="leading-relaxed">
                お盆も正月も、いつでもコートが待ってる。
              </p>
              <p className="leading-relaxed">
                初心者もベテランも、みんなが楽しめる場所。
              </p>
              <p className="leading-relaxed">
                静原の自然に囲まれて、心が軽くなるテニスを。
              </p>
            </div>
          </div>

          {/* Image */}
          <div
            ref={imageRef}
            className="opacity-0 transform translate-x-[100%]"
          >
            <div className="relative">
              <div className="aspect-square overflow-hidden rounded">
                <img
                  src="/lovable-uploads/a140f6d7-a8b7-489d-b607-c3ecfd71d3b3.png"
                  alt="テニスラケットの準備"
                  className="object-cover w-full h-full transform transition-transform duration-700 hover:scale-105"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-kyoto-tennis-green/10 rounded-full -z-10"></div>
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-kyoto-gold/10 rounded-full -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
