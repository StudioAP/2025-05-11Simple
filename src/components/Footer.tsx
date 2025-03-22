
import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-kyoto-dark-green border-t border-kyoto-gold/30 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div>
            <div className="flex flex-col items-start mb-4">
              <span className="text-kyoto-gold font-mincho text-xl font-bold tracking-wider">
                京都ローンテニスクラブ
              </span>
              <span className="text-kyoto-white text-xs tracking-widest">
                KYOTO LAWN TENNIS CLUB
              </span>
            </div>
            <p className="text-kyoto-white/70 text-sm">
              京都で一番歴史あるテニスクラブ。自然の中、心地よい汗を流そう。
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-kyoto-gold font-bold mb-4">クイックリンク</h4>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-kyoto-white/70 hover:text-kyoto-gold transition-colors text-sm">
                  特徴
                </a>
              </li>
              <li>
                <a href="#programs" className="text-kyoto-white/70 hover:text-kyoto-gold transition-colors text-sm">
                  プログラム
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-kyoto-white/70 hover:text-kyoto-gold transition-colors text-sm">
                  料金
                </a>
              </li>
              <li>
                <a href="#facilities" className="text-kyoto-white/70 hover:text-kyoto-gold transition-colors text-sm">
                  施設
                </a>
              </li>
              <li>
                <a href="#contact" className="text-kyoto-white/70 hover:text-kyoto-gold transition-colors text-sm">
                  お問い合わせ
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact Information */}
          <div>
            <h4 className="text-kyoto-gold font-bold mb-4">お問い合わせ</h4>
            <address className="not-italic">
              <p className="text-kyoto-white/70 text-sm mb-2">
                〒601-1121<br />
                京都市左京区静市静原町554
              </p>
              <p className="text-kyoto-white/70 text-sm mb-2">
                TEL/FAX: (075)-741-2917
              </p>
              <p className="text-kyoto-white/70 text-sm">
                営業時間: 10:00～16:00（年中無休）
              </p>
            </address>
          </div>
        </div>
        
        <div className="kyoto-divider my-6"></div>
        
        <div className="text-center text-kyoto-white/50 text-xs">
          <p>© {currentYear} 京都ローンテニスクラブ. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
