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
        <h4 className="font-medium text-kyoto-white mb-1 text-base md:text-lg">{title}</h4>
        <div className="text-kyoto-white/80 text-sm md:text-base">
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
    <section id="contact" className="py-12 bg-kyoto-dark-green" ref={sectionRef}>
      <div className="section-container py-8 md:py-10">
        <div className="text-center mb-8">
          <h2 className="section-title text-kyoto-white mx-auto text-2xl md:text-3xl">
            Contact Us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Contact Information */}
          <div 
            ref={(el) => (fadeRefs.current[0] = el)} 
            className="opacity-0 md:col-span-5"
          >
            <div className="bg-kyoto-dark-green/50 backdrop-blur-sm p-6 rounded-sm border border-kyoto-gold/30 h-full">
              <h3 className="text-2xl font-bold text-kyoto-white mb-6">Contact & Reservations</h3>
              
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
                <Button variant="secondary" className="w-full text-base">
                  今すぐ予約する
                </Button>
              </div>
            </div>
          </div>

          {/* Map Area */}
          <div 
            ref={mapRef} 
            className="opacity-0 md:col-span-7"
          >
            <div className="bg-kyoto-dark-green/50 backdrop-blur-sm p-6 rounded-sm border border-kyoto-gold/30 h-full">
              <h3 className="text-2xl font-bold text-kyoto-white mb-6">Access Map</h3>
              
              <div className="w-full h-80 bg-kyoto-white/10 rounded-sm overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-kyoto-gold text-lg">
                    <MapPin size={48} className="mx-auto mb-2" />
                    <p>地図が表示されます</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-kyoto-white/80 text-base">
                <h4 className="text-kyoto-gold font-bold mb-2">アクセス方法</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="font-medium mr-2">バス:</span>
                    <span>叡山電鉄市原駅 → 京都バス大原行「しずはうす前」下車 徒歩2分</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">車:</span>
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
