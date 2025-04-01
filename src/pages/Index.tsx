
import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Facilities from "../components/Facilities";
import Testimonials from "../components/Testimonials";
import Programs from "../components/Programs";
import Pricing from "../components/Pricing";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import News from "../components/News";

const Index = () => {
  useEffect(() => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 80, // Adjust for navbar height
            behavior: 'smooth'
          });
        }
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar />
      <Hero />
      <News />
      {/* 新しいセクション順序: Hero、News、Facilities、Pricing、Testimonials、Programs、Contact */}
      <Facilities />
      <Pricing />
      <Testimonials />
      <Programs />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
