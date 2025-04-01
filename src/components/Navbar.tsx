
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Button from "./Button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-kyoto-dark-green/95 shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <a href="#" className="flex flex-col items-start">
            <span className="text-kyoto-gold font-mincho text-2xl font-bold tracking-wider">
              京都ローンテニスクラブ
            </span>
            <span className="text-kyoto-white text-xs tracking-widest">
              KYOTO LAWN TENNIS CLUB
            </span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a
            href="#news"
            className="text-kyoto-white hover:text-kyoto-gold transition-colors"
          >
            ニュース
          </a>
          <a
            href="#facilities"
            className="text-kyoto-white hover:text-kyoto-gold transition-colors"
          >
            施設
          </a>
          <a
            href="#pricing"
            className="text-kyoto-white hover:text-kyoto-gold transition-colors"
          >
            会員プラン
          </a>
          <a
            href="#testimonials"
            className="text-kyoto-white hover:text-kyoto-gold transition-colors"
          >
            お客様の声
          </a>
          <a
            href="#programs"
            className="text-kyoto-white hover:text-kyoto-gold transition-colors"
          >
            プログラム
          </a>
          <a
            href="#contact"
            className="text-kyoto-white hover:text-kyoto-gold transition-colors"
          >
            お問い合わせ
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-kyoto-white hover:text-kyoto-gold z-50 relative"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen ? (
        <div className="md:hidden absolute top-full left-0 w-full bg-kyoto-dark-green/95 transform transition-opacity duration-300">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <a
              href="#news"
              className="text-kyoto-white hover:text-kyoto-gold transition-colors py-2 border-b border-kyoto-gold/20"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              ニュース
            </a>
            <a
              href="#facilities"
              className="text-kyoto-white hover:text-kyoto-gold transition-colors py-2 border-b border-kyoto-gold/20"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              施設
            </a>
            <a
              href="#pricing"
              className="text-kyoto-white hover:text-kyoto-gold transition-colors py-2 border-b border-kyoto-gold/20"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              会員プラン
            </a>
            <a
              href="#testimonials"
              className="text-kyoto-white hover:text-kyoto-gold transition-colors py-2 border-b border-kyoto-gold/20"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              お客様の声
            </a>
            <a
              href="#programs"
              className="text-kyoto-white hover:text-kyoto-gold transition-colors py-2 border-b border-kyoto-gold/20"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              プログラム
            </a>
            <a
              href="#contact"
              className="text-kyoto-white hover:text-kyoto-gold transition-colors py-2 border-b border-kyoto-gold/20"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              お問い合わせ
            </a>
          </div>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
