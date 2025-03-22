
import React, { useEffect, useRef } from "react";
import Button from "./Button";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const ContactInfo = ({ icon, title, children }) => {
  return (
    <div className="flex items-start">
      <div className="text-kyoto-gold mr-4 shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="font-medium text-kyoto-white mb-1 text-base">{title}</h4>
        <div className="text-kyoto-white/80 text-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

const Contact = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const fadeRefs = useRef<Array<HTMLDivElement | null>>([]);

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
    <section id="contact" className="py-12 bg-kyoto-dark-green" ref={sectionRef}>
      <div className="section-container py-8 md:py-10">
        <div className="text-center mb-8">
          <h3 className="text-base uppercase tracking-wider text-kyoto-gold mb-2">
            お問い合わせ
          </h3>
          <h2 className="section-title text-kyoto-white mx-auto text-2xl md:text-3xl">
            テニスを始めたいなら
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div 
            ref={(el) => (fadeRefs.current[0] = el)} 
            className="opacity-0"
          >
            <div className="bg-kyoto-dark-green/50 backdrop-blur-sm p-6 rounded-sm border border-kyoto-gold/30 h-full">
              <h3 className="text-2xl font-bold text-kyoto-white mb-6">お問い合わせ・予約</h3>
              
              <div className="space-y-5">
                <ContactInfo icon={<MapPin size={24} />} title="住所">
                  <p className="text-base">京都ローンテニスクラブ事務所</p>
                  <p className="text-base">〒601-1121 京都市左京区静市静原町554</p>
                </ContactInfo>
                
                <ContactInfo icon={<Phone size={24} />} title="電話">
                  <p className="text-base">TEL/FAX: (075)-741-2917</p>
                </ContactInfo>
                
                <ContactInfo icon={<Clock size={24} />} title="受付時間">
                  <p className="text-base">年中無休 10:00～16:00</p>
                </ContactInfo>
                
                <ContactInfo icon={<Mail size={24} />} title="メール">
                  <p className="text-base">メールもお待ちしています。</p>
                </ContactInfo>
              </div>
              
              <div className="mt-6">
                <Button variant="secondary" className="w-full">
                  今すぐ予約する
                </Button>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div 
            ref={(el) => (fadeRefs.current[1] = el)} 
            className="opacity-0"
          >
            <div className="bg-kyoto-dark-green/50 backdrop-blur-sm p-6 rounded-sm border border-kyoto-gold/30 h-full">
              <h3 className="text-2xl font-bold text-kyoto-white mb-6">アクセス情報</h3>
              
              <div className="space-y-5">
                <div className="text-kyoto-white/80">
                  <h4 className="text-kyoto-gold font-bold mb-2 text-base">営業日</h4>
                  <p className="text-base mb-4">
                    年中無休で営業しています。お好きな日にお越しください。
                  </p>
                </div>
                
                <div className="text-kyoto-white/80">
                  <h4 className="text-kyoto-gold font-bold mb-2 text-base">駐車場</h4>
                  <p className="text-base mb-4">
                    無料駐車場を完備しています。お車でもお気軽にお越しください。
                  </p>
                </div>
                
                <div className="text-kyoto-white/80">
                  <h4 className="text-kyoto-gold font-bold mb-2 text-base">送迎</h4>
                  <p className="text-base">
                    イベント開催時には最寄り駅からの送迎も行っております。お問い合わせください。
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <Button variant="outline" className="w-full text-kyoto-gold">
                  詳細地図を見る
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
