import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return <header className={`sticky top-0 z-50 bg-white py-4 transition-all duration-300 ${isScrolled ? 'shadow-sm' : ''}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="font-cursive text-2xl md:text-2xl text-red mb-4">Rigorion</Link>
          <nav className="hidden md:flex ml-24 space-x-6 l-12">
            <Link to="/" className="text-gray-600 hover:text-[#8A0303]">Home</Link>
            <Link to="/landing" className="text-gray-600 hover:text-[#8A0303]">Landing</Link>
            <Link to="/about" className="text-gray-600 hover:text-[#8A0303]">About</Link>
            <Link to="/practice" className="text-gray-600 hover:text-[#8A0303]">Practice</Link>
            <Link to="/progress" className="text-gray-600 hover:text-[#8A0303]">Progress</Link>
          </nav>
        </div>
        
        <div>
          <Link to="/signin" className="text-gray-600 hover:text-[#8A0303] px-4 py-2">Login</Link>
        </div>
      </div>
    </header>;
};