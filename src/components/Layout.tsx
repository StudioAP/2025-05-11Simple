import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default Layout; 