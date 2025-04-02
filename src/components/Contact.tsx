import React, { useEffect, useRef } from "react";
import Button from "./Button";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const ContactInfo = ({ icon, title, children }) => {
  return (
    <div className="flex items-start">
      <div className="text-kyoto-gold mr-3 shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="font-medium text-kyoto-white mb-0.5 text-sm md:text-base">{title}</h4>
        <div className="text-kyoto-white/80 text-xs md:text-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

const Contact = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const fadeRefs = useRef<Array<HTMLDivElement | null>>([]);
  const mapRef = useRef<HTMLDivElement>(null);

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
    
    if (mapRef.current) observer.observe(mapRef.current);

    return () => {
      fadeRefs.current.forEach((el) => {
        if (el) observer.unobserve(el);
      });
      
      if (mapRef.current) observer.unobserve(mapRef.current);
    };
  }, []);

  return (
    <section id="contact" className="py-6 bg-kyoto-dark-green" ref={sectionRef}>
      <div className="section-container py-6 md:py-8">
        <div className="text-center mb-4">
          <h2 className="section-title text-kyoto-white mx-auto text-xl md:text-2xl">
            お問合せ・所在地
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Contact Information */}
          <div 
            ref={(el) => (fadeRefs.current[0] = el)} 
            className="opacity-0 md:col-span-5"
          >
            <div className="bg-kyoto-dark-green/50 backdrop-blur-sm p-4 rounded-sm border border-kyoto-gold/30 h-full">
              <h3 className="text-lg font-bold text-kyoto-white mb-4">お気軽にお問合せください</h3>
              
              <div className="space-y-3">
                <ContactInfo icon={<MapPin size={20} />} title="住所">
                  <p>京都ローンテニスクラブ事務所</p>
                  <p>〒601-1121 京都市左京区静市静原町554</p>
                </ContactInfo>
                
                <ContactInfo icon={<Phone size={20} />} title="電話">
                  <p>TEL/FAX: (075)-741-2917</p>
                </ContactInfo>
                
                <ContactInfo icon={<Clock size={20} />} title="受付時間">
                  <p>年中無休 10:00～16:00</p>
                </ContactInfo>
                
                <ContactInfo icon={<Mail size={20} />} title="メール">
                  <p>info@kyoto-ltc.example.jp</p>
                </ContactInfo>
              </div>
              
              {/* 予約ボタンを削除しました */}
            </div>
          </div>

          {/* Map Area */}
          <div 
            ref={mapRef} 
            className="opacity-0 md:col-span-7"
          >
            <div className="bg-kyoto-dark-green/50 backdrop-blur-sm p-4 rounded-sm border border-kyoto-gold/30 h-full">
              <h3 className="text-lg font-bold text-kyoto-white mb-4">Access Map</h3>
              
              <div className="w-full h-60 bg-kyoto-white/10 rounded-sm overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-kyoto-gold text-lg">
                    <MapPin size={40} className="mx-auto mb-2" />
                    <p>地図が表示されます</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-kyoto-white/80 text-xs md:text-sm">
                <h4 className="text-kyoto-gold font-bold mb-1">アクセス方法</h4>
                <ul className="space-y-1">
                  <li className="flex items-start">
                    <span className="font-medium mr-1">バス:</span>
                    <span>叡山電鉄市原駅 → 京都バス大原行「しずはうす前」下車 徒歩2分</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-1">車:</span>
                    <span>市原交差点から東へ5分、無料駐車場あり</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
