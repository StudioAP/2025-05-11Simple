import React, { useEffect, useRef } from "react";
import { MapPin, Clock, Car, Droplets, Image } from "lucide-react";

const FacilityItem = ({ icon, title, description }) => {
  return (
    <div className="flex p-4 bg-white/80 backdrop-blur-sm rounded-sm shadow hover-lift">
      <div className="mr-4 text-kyoto-dark-green">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-kyoto-dark-green mb-1 text-base md:text-lg">{title}</h4>
        <p className="text-gray-700 text-sm md:text-base">{description}</p>
      </div>
    </div>
  );
};

const PhotoFrame = ({ title, imageUrl, altText }) => {
  return (
    <div className="overflow-hidden rounded-sm shadow-lg hover-lift group">
      <div className="relative">
        <img
          src={imageUrl}
          alt={altText}
          className="w-full h-48 md:h-56 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-kyoto-dark-green/70 p-2 text-center">
          <span className="text-kyoto-white text-sm font-medium">{title}</span>
        </div>
      </div>
    </div>
  );
};

// 施設データ（写真と説明の一対一対応）
const facilityData = [
  {
    photo: {
      title: "コート写真", 
      imageUrl: "/lovable-uploads/coat.jpeg", 
      altText: "テニスコート写真"
    },
    info: {
      icon: <MapPin size={24} />, 
      title: "コート", 
      description: "3面（オムニコート）、ナイター1面"
    }
  },
  {
    photo: {
      title: "設備写真", 
      imageUrl: "/lovable-uploads/setsubi.jpg", 
      altText: "クラブハウス設備写真"
    },
    info: {
      icon: <Droplets size={24} />, 
      title: "設備", 
      description: "クラブハウス・シャワー完備"
    }
  },
  {
    photo: {
      title: "駐車場写真", 
      imageUrl: "/lovable-uploads/carport.jpg", 
      altText: "駐車場写真"
    },
    info: {
      icon: <Car size={24} />, 
      title: "駐車場", 
      description: "無料駐車場完備"
    }
  }
  // 営業時間情報を削除しました
];

const Facilities = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const photosRef = useRef<HTMLDivElement>(null);
  const mobileViewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("opacity-0");
            entry.target.classList.add("animate-fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (infoRef.current) observer.observe(infoRef.current);
    if (photosRef.current) observer.observe(photosRef.current);
    if (mobileViewRef.current) observer.observe(mobileViewRef.current);

    return () => {
      if (infoRef.current) observer.unobserve(infoRef.current);
      if (photosRef.current) observer.unobserve(photosRef.current);
      if (mobileViewRef.current) observer.unobserve(mobileViewRef.current);
    };
  }, []);

  return (
    <section id="facilities" className="py-12 bg-kyoto-light-green relative overflow-hidden" ref={sectionRef}>
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-kyoto-tennis-green/10 -z-10 rounded-br-full"></div>
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-kyoto-gold/10 -z-10 rounded-tl-full"></div>
      
      <div className="section-container max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-8">
          <h2 className="section-title text-kyoto-dark-green mx-auto text-2xl md:text-3xl">
            施設・設備
          </h2>
        </div>

        {/* スマホ表示用のレイアウト - 写真と説明文を連続して表示 */}
        <div 
          ref={mobileViewRef}
          className="md:hidden opacity-0"
        >
          <div className="space-y-6">
            {facilityData.map((facility, index) => (
              <div key={index} className="space-y-4">
                {facility.photo && (
                  <PhotoFrame 
                    title={facility.photo.title} 
                    imageUrl={facility.photo.imageUrl} 
                    altText={facility.photo.altText} 
                  />
                )}
                <FacilityItem 
                  icon={facility.info.icon} 
                  title={facility.info.title} 
                  description={facility.info.description} 
                />
                {index < facilityData.length - 1 && (
                  <div className="border-t border-kyoto-dark-green/20 pt-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* PC表示用のレイアウト - 横並びに変更 */}
        <div className="hidden md:block">
          {/* 施設情報と写真を横並びに表示 */}
          <div 
            ref={infoRef} 
            className="grid grid-cols-3 gap-8 mx-auto opacity-0"
          >
            {facilityData.map((facility, index) => (
              <div key={index} className="flex flex-col">
                {/* 写真 */}
                <div className="mb-4">
                  <PhotoFrame 
                    title={facility.photo.title} 
                    imageUrl={facility.photo.imageUrl} 
                    altText={facility.photo.altText} 
                  />
                </div>
                {/* 施設情報 */}
                <FacilityItem 
                  icon={facility.info.icon} 
                  title={facility.info.title} 
                  description={facility.info.description} 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Facilities;
