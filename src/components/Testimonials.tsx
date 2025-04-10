import React, { useEffect, useRef, useState } from "react";

const Testimonials = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<Array<HTMLDivElement | null>>([]);
  const [isWindows, setIsWindows] = useState(false);

  useEffect(() => {
    // Windows環境検出
    const detectWindows = () => {
      const platform = navigator.userAgent.toLowerCase();
      return platform.indexOf('win') !== -1;
    };
    
    setIsWindows(detectWindows());
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
            entry.target.classList.remove("opacity-0");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    testimonialsRef.current.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => {
      testimonialsRef.current.forEach(el => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const testimonials = [
    {
      quote: "以前は友人と市のコートを予約してテニスをしていましたが、京都ローンテニスクラブの会員になってからは、思い立った時にプレーでき、コート確保のわずらわしさがありません。",
      author: "S.K様",
      position: "一年正会員／５０代・主婦",
      image: "/images/Generated Image April 04, 2025 - 10_00PM (1).jpeg"
    },
    {
      quote: "以前はいつも友人とテニスをしていましたが、会員になってからは様々な会員とプレーできるのが魅力です。",
      author: "T.M様",
      position: "週末・祝日会員／４０代・会社員",
      image: "/images/Generated Image April 04, 2025 - 10_12PM.jpeg"
    },
    {
      quote: "テニスはもちろんのこと、クラブにいってほかの会員とコーヒーを飲みながら談笑するのも楽しみの一つです。おかげで交流関係も広がりました。",
      author: "Y.R様",
      position: "特定曜日ビジター／６０代・パート",
      image: "/images/Generated Image April 05, 2025 - 11_12AM (1).jpeg"
    },
    {
      quote: "会員制テニスクラブというと高額なイメージでしたが、実質月1万円以内で十分に楽しめて経済的です。",
      author: "M.S様",
      position: "平日一年会員／７０代",
      image: "/images/Generated Image April 04, 2025 - 10_11PM (1).jpeg"
    }
  ];

  return (
    <section id="testimonials" className="py-8 bg-kyoto-dark-green" ref={sectionRef}>
      <div className="section-container py-6 md:py-10 px-4 md:px-6">
        {/* F字型スキャンパターンに基づく配置 - 上部に主見出しを配置 */}
        <div className="flex flex-col items-center max-w-4xl mx-auto mb-8"> 
          <h2 className="section-title text-kyoto-white text-center text-2xl md:text-3xl font-bold mb-2">
            お客様の声
          </h2>
          <div className="w-16 h-1 bg-kyoto-gold mb-3"></div>
          <p className="text-kyoto-white/80 text-sm md:text-base max-w-2xl">
            
          </p>
        </div>

        {/* テスティモニアルカードの配置を最適化 - 15-20%のホワイトスペース比率 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              ref={el => testimonialsRef.current[index] = el}
              className="bg-white/10 backdrop-blur-sm p-5 rounded border border-kyoto-gold/30 opacity-0 transition-all duration-500 hover:bg-white/15"
            >
              {/* F字型スキャンパターンを強化するための内部構造 */}
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 mr-4">
                  <div className="h-20 w-20 rounded-full bg-kyoto-gold/20 overflow-hidden border border-kyoto-gold/30">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.author} 
                      className="h-full w-full object-cover object-center"
                      style={{ aspectRatio: '0.75/1' }} 
                    />
                  </div>
                </div>
                
                <div>
                  <p className="text-kyoto-gold font-medium text-base">{testimonial.author}</p>
                  <p className="text-white/70 text-sm">{testimonial.position}</p>
                </div>
              </div>
              
              <div className="mb-3">
                <svg className="w-8 h-8 text-kyoto-gold/40" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                  <path d="M9.352 4C4.456 4 0.672 7.456 0.672 12.224c0 4.224 3.36 8.224 8.512 8.224 0.672 0 1.248-0.096 1.76-0.224 0.672 0.448 2.24 1.504 2.016 3.328 0 0-0.096 0.672-0.96 0.448-5.6-2.016-9.632-7.232-9.632-13.76 0-6.56 5.392-9.632 9.632-9.632 3.584 0 5.824 2.24 5.824 5.472 0 3.808-3.2 6.528-6.272 6.528-1.312 0-2.016-0.288-2.624-0.672-0.448-0.448-0.96-0.672-1.312-0.672-0.352 0-0.672 0.224-0.672 0.672 0 0.288 0.096 0.544 0.32 0.768 1.312 1.312 3.104 1.984 4.832 1.984 6.272 0 12-5.28 12-12C24.032 6.912 17.088 4 9.352 4z" />
                </svg>
              </div>
              
              <blockquote className="text-white/90 leading-relaxed mb-4 text-base md:text-base space-y-2 pl-1 border-l-2 border-kyoto-gold/30 py-1">
                {testimonial.quote}
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
