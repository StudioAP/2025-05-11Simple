import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-kyoto-dark-green border-t border-kyoto-gold/30 py-4 md:py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center">
          {/* Logo and Club Name */}
          <div className="mb-6 text-center">
            <div className="flex flex-col items-center mb-2">
              <a 
                href="/manage-news" 
                className="text-kyoto-gold font-mincho text-2xl md:text-3xl font-bold tracking-wider hover:text-kyoto-gold/80 transition-colors duration-200"
                title="管理画面へ"
              >
                京都ローンテニスクラブ
              </a>
              <span className="text-kyoto-white text-sm md:text-base tracking-widest mt-1">
                KYOTO LAWN TENNIS CLUB
              </span>
            </div>
          </div>
        </div>
        
        <div className="kyoto-divider my-4"></div>
        
        <div className="text-center text-kyoto-white/50 text-xs">
          <p>© {currentYear} 京都ローンテニスクラブ. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
