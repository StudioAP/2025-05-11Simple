import React, { useEffect, useRef } from "react";
import { MapPin, Clock, Car, Droplets, Image } from "lucide-react";

const FacilityItem = ({ icon, title, description }) => {
  // description を <br /> で分割し、各行を段落としてレンダリング
  const descriptionLines = typeof description === 'string' ? description.split('<br />') : [];

  return (
    <div className="flex flex-col h-full p-4 bg-white/80 backdrop-blur-sm rounded-sm shadow hover-lift">
      <div className="flex mb-3">
        <div className="mr-4 text-kyoto-dark-green">
          {icon}
        </div>
        <div className="inline-block border-2 border-kyoto-gold/40 bg-kyoto-cream/30 px-3 py-1 rounded-sm">
          <h4 className="font-bold text-kyoto-dark-green text-base md:text-lg">{title}</h4>
        </div>
      </div>
      <div className="text-gray-700 text-sm md:text-base flex-grow">
        {descriptionLines.length > 1 ? (
          descriptionLines.map((line, index) => (
            <p key={index} className={index > 0 ? 'mt-1' : ''}>{line.trim()}</p>
          ))
        ) : (
          <p>{description}</p>
        )}
      </div>
    </div>
  );
};

const PhotoFrame = ({ title, imageUrl, altText, isLarge = false, fillHeight = false }) => {
  let heightClass = 'h-48 md:h-56'; // Default height
  if (isLarge) {
    heightClass = 'h-64 md:h-72'; // Larger fixed height
  } else if (fillHeight) {
    heightClass = 'h-full'; // Fill height
  }

  return (
    <div className={`overflow-hidden rounded-sm shadow-lg hover-lift group ${fillHeight ? 'h-full' : ''}`}>
      <div className="relative h-full">
        <img
          src={imageUrl}
          alt={altText}
          className={`w-full ${heightClass} object-contain transition-transform duration-500 group-hover:scale-105`}
        />
      </div>
    </div>
  );
};

// 施設データ（写真と説明の一対一対応）
const facilityData = [
  {
    photo: {
      title: "コート", 
      imageUrl: "/images/コート.JPG",
      altText: "テニスコート写真"
    },
    photo2: {
      title: "コート図", 
      imageUrl: "/images/mukashinocourtnoe.jpg",
      altText: "テニスコート配置図"
    },
    info: {
      icon: <MapPin size={24} />, 
      title: "コート", 
      description: "コートは３面。オムニコート。砂入り人工芝のオムニコートはコンディションが良く、雨天後も比較的早く使用できるのが特徴です。<br />内１面はナイター設備も備えています。シャワーも完備しています。"
    }
  },
  {
    photo: {
      title: "クラブハウス", 
      imageUrl: "/images/clubhouse.JPG",
      altText: "クラブハウス設備写真"
    },
    info: {
      icon: <Droplets size={24} />, 
      title: "クラブハウス", 
      description: "クラブハウスでは、昼食をとることができ、コーヒーや紅茶を飲めて、サロンとして、会員同士の交流の場としても活用されています。"
    }
  },
  {
    photo: {
      title: "駐車場",
      imageUrl: "/images/駐車場.JPG",
      altText: "駐車場写真"
    },
    info: {
      icon: <Car size={24} />, 
      title: "駐車場", 
      description: "無料駐車場完備。広々とした駐車スペースで約20台駐車可能です。クラブハウスからすぐの場所にあり、テニス用具も楽に運べます。駐車場横には、壁打ちのスペースも備えています。"
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
    <section id="facilities" className="py-8 bg-kyoto-light-green relative overflow-hidden min-h-screen flex items-center" ref={sectionRef}>
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-kyoto-tennis-green/10 -z-10 rounded-br-full"></div>
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-kyoto-gold/10 -z-10 rounded-tl-full"></div>
      
      <div className="section-container max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-6">
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
            {/* コートセクション（スマホ表示） */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <PhotoFrame 
                  title={facilityData[0].photo.title} 
                  imageUrl={facilityData[0].photo.imageUrl} 
                  altText={facilityData[0].photo.altText}
                  isLarge={true}
                />
                <PhotoFrame 
                  title={facilityData[0].photo2.title} 
                  imageUrl={facilityData[0].photo2.imageUrl} 
                  altText={facilityData[0].photo2.altText} 
                />
              </div>
              <FacilityItem 
                icon={facilityData[0].info.icon} 
                title={facilityData[0].info.title} 
                description={facilityData[0].info.description} 
              />
              <div className="border-t border-kyoto-dark-green/20 pt-4"></div>
            </div>
            
            {/* クラブハウスと駐車場（スマホ表示） */}
            {facilityData.slice(1).map((facility, index) => (
              <div key={index} className="space-y-4">
                {facility.photo && (
                  <PhotoFrame 
                    title={facility.photo.title} 
                    imageUrl={facility.photo.imageUrl} 
                    altText={facility.photo.altText}
                    isLarge={true}
                  />
                )}
                <FacilityItem 
                  icon={facility.info.icon} 
                  title={facility.info.title} 
                  description={facility.info.description} 
                />
                {index < facilityData.slice(1).length - 1 && (
                  <div className="border-t border-kyoto-dark-green/20 pt-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* PC表示用のレイアウト - 上2つ下2つの4セクションレイアウト */}
        <div className="hidden md:block">
          {/* コートセクション - 上段に配置（特別レイアウト） */}
          <div className="mb-8">
            {/* 画像を5列グリッドで配置し、右側のコート図に多くの幅を割り当てる */}
            <div className="grid grid-cols-5 gap-6">
              {/* 左側の写真 (2列分) */}
              <div className="flex items-center col-span-2">
                <PhotoFrame 
                  title={facilityData[0].photo.title} 
                  imageUrl={facilityData[0].photo.imageUrl} 
                  altText={facilityData[0].photo.altText}
                  isLarge={true}
                />
              </div>
              {/* 右側の写真 (3列分) */}
              <div className="flex items-stretch col-span-3">
                <PhotoFrame 
                  title={facilityData[0].photo2.title} 
                  imageUrl={facilityData[0].photo2.imageUrl} 
                  altText={facilityData[0].photo2.altText}
                  fillHeight={true} 
                />
              </div>
            </div>
            {/* コートの説明文 - 両写真の下にバランスよく配置 */}
            <div className="mt-4">
              <FacilityItem 
                icon={facilityData[0].info.icon} 
                title={facilityData[0].info.title} 
                description={facilityData[0].info.description} 
              />
            </div>
          </div>
          
          {/* クラブハウスと駐車場 - 下段に2列で配置 */}
          <div 
            ref={infoRef} 
            className="grid grid-cols-2 gap-8 mx-auto opacity-0"
          >
            {facilityData.slice(1).map((facility, index) => (
              <div key={index} className="flex flex-col h-full">
                {/* 写真 */}
                <div className="mb-4">
                  <PhotoFrame 
                    title={facility.photo.title} 
                    imageUrl={facility.photo.imageUrl} 
                    altText={facility.photo.altText}
                    isLarge={true}
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
