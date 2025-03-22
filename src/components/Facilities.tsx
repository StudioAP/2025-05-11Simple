
import React, { useEffect, useRef } from "react";
import { MapPin, Clock, Car, Droplets } from "lucide-react";

const FacilityItem = ({ icon, title, description }) => {
  return (
    <div className="flex p-4 bg-white/80 backdrop-blur-sm rounded-sm shadow hover-lift">
      <div className="mr-4 text-kyoto-dark-green">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-kyoto-dark-green mb-1">{title}</h4>
        <p className="text-gray-700 text-sm">{description}</p>
      </div>
    </div>
  );
};

const Facilities = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === mapRef.current) {
              entry.target.classList.add("animate-slide-in-left");
            }
            if (entry.target === infoRef.current) {
              entry.target.classList.add("animate-slide-in-right");
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (mapRef.current) observer.observe(mapRef.current);
    if (infoRef.current) observer.observe(infoRef.current);

    return () => {
      if (mapRef.current) observer.unobserve(mapRef.current);
      if (infoRef.current) observer.unobserve(infoRef.current);
    };
  }, []);

  return (
    <section id="facilities" className="py-20 bg-kyoto-light-green relative overflow-hidden" ref={sectionRef}>
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-kyoto-tennis-green/10 -z-10 rounded-br-full"></div>
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-kyoto-gold/10 -z-10 rounded-tl-full"></div>
      
      <div className="section-container">
        <div className="text-center mb-16">
          <h3 className="text-sm uppercase tracking-wider text-kyoto-dark-green mb-2">
            アクセス・施設案内
          </h3>
          <h2 className="section-title text-kyoto-dark-green mx-auto">
            静原の自然の中で
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Map image */}
          <div 
            ref={mapRef}
            className="rounded-sm overflow-hidden shadow-lg opacity-0 transform translate-x-[-100%]"
          >
            <div className="relative">
              <img 
                src="/lovable-uploads/bc28539d-5d5f-4dec-8fce-4ba7e99d3b22.png" 
                alt="テニスコート空撮" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-kyoto-dark-green/30 hover:bg-kyoto-dark-green/20 transition-colors duration-300">
                <span className="px-4 py-2 bg-kyoto-gold text-kyoto-dark-green font-bold">
                  航空写真
                </span>
              </div>
            </div>
          </div>

          {/* Facility information */}
          <div 
            ref={infoRef}
            className="opacity-0 transform translate-x-[100%]"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FacilityItem 
                icon={<MapPin size={24} />} 
                title="コート" 
                description="3面（オムニコート）、ナイター1面あり" 
              />
              <FacilityItem 
                icon={<Droplets size={24} />} 
                title="設備" 
                description="クラブハウス・シャワー完備" 
              />
              <FacilityItem 
                icon={<Car size={24} />} 
                title="駐車場" 
                description="無料駐車場完備" 
              />
              <FacilityItem 
                icon={<Clock size={24} />} 
                title="営業時間" 
                description="年中無休 10:00～16:00" 
              />
            </div>

            <div className="mt-8 bg-white/80 backdrop-blur-sm p-6 rounded-sm shadow">
              <h4 className="font-bold text-kyoto-dark-green mb-4">アクセス</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="font-medium mr-2">バス:</span>
                  <span>叡山電鉄市原駅 → 京都バス大原行「しずはうす前」下車 徒歩2分</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">車:</span>
                  <span>市原交差点から東へ5分</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Facilities;
