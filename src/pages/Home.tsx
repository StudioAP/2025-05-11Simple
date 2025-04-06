import React, { useEffect } from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Facilities from "../components/Facilities";
import Testimonials from "../components/Testimonials";
import Programs from "../components/Programs";
import Pricing from "../components/Pricing";
import Contact from "../components/Contact";
import News from "../components/News";

const Home = () => {
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
    <>
      <Hero />
      <News />
      <Facilities />
      <Pricing />
      <Testimonials />
      <Programs />
      <Contact />
    </>
  );
};

export default Home; 