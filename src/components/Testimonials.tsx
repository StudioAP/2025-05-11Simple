
import React, { useEffect, useRef } from "react";

const Testimonials = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<Array<HTMLDivElement | null>>([]);

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
      quote: "市のコートは予約が大変。でもここなら、思い立った時にプレーできる。自然に囲まれて、毎回スッキリ！",
      author: "京都ローンテニスクラブ会員",
      position: "10年以上のメンバー",
      image: "/lovable-uploads/2dcc5e2e-3ed3-41e2-9038-cbab6f2a3962.png"
    },
    {
      quote: "家族でテニスを始めましたが、コーチのアドバイスのおかげで上達が早いです。休日の充実した時間を過ごせています。",
      author: "S.K様",
      position: "家族会員",
      image: "/lovable-uploads/8169b11f-0cde-4649-8dc2-a0cfaf118a91.png"
    },
    {
      quote: "引退後の趣味として始めましたが、ここの雰囲気がとても良く、新しい仲間もできました。健康維持にも最適です。",
      author: "T.M様",
      position: "シニア会員",
      image: "/lovable-uploads/a140f6d7-a8b7-489d-b607-c3ecfd71d3b3.png"
    }
  ];

  return (
    <section id="testimonials" className="py-6 bg-kyoto-dark-green" ref={sectionRef}>
      <div className="section-container py-8 md:py-12">
        <div className="text-center mb-4">
          <h3 className="text-sm uppercase tracking-wider text-kyoto-gold mb-1">
            お客様の声
          </h3>
          <h2 className="section-title text-kyoto-white mx-auto text-2xl md:text-3xl">
            会員の声
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              ref={el => testimonialsRef.current[index] = el}
              className="bg-white/10 backdrop-blur-sm p-4 rounded-sm border border-kyoto-gold/30 opacity-0"
            >
              <div className="mb-3">
                <svg className="w-6 h-6 text-kyoto-gold/50" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                  <path d="M9.352 4C4.456 4 0.672 7.456 0.672 12.224c0 4.224 3.36 8.224 8.512 8.224 0.672 0 1.248-0.096 1.76-0.224 0.672 0.448 2.24 1.504 2.016 3.328 0 0-0.096 0.672-0.96 0.448-5.6-2.016-9.632-7.232-9.632-13.76 0-6.56 5.392-9.632 9.632-9.632 3.584 0 5.824 2.24 5.824 5.472 0 3.808-3.2 6.528-6.272 6.528-1.312 0-2.016-0.288-2.624-0.672-0.448-0.448-0.96-0.672-1.312-0.672-0.352 0-0.672 0.224-0.672 0.672 0 0.288 0.096 0.544 0.32 0.768 1.312 1.312 3.104 1.984 4.832 1.984 6.272 0 12-5.28 12-12C24.032 6.912 17.088 4 9.352 4z" />
                </svg>
              </div>
              
              <blockquote className="text-base md:text-lg text-white italic leading-relaxed mb-3 h-20 overflow-y-auto">
                {testimonial.quote}
              </blockquote>
              
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-kyoto-gold overflow-hidden mr-2">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.author} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-kyoto-gold font-bold text-sm">{testimonial.author}</p>
                  <p className="text-white/70 text-sm">{testimonial.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
