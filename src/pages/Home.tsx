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
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    const handleClick = function (e: MouseEvent) {
      const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
      if (href && href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target instanceof HTMLElement) { // Check if target is HTMLElement
          window.scrollTo({
            top: target.offsetTop - 80, // Adjust for navbar height
            behavior: 'smooth'
          });
        }
      } else if (href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    anchors.forEach(anchor => {
      anchor.addEventListener('click', handleClick as EventListener); // Cast to EventListener
    });

    // Cleanup function
    return () => {
      anchors.forEach(anchor => {
        anchor.removeEventListener('click', handleClick as EventListener); // Cast to EventListener
      });
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

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