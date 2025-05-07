
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "lucide-react";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <header className={`sticky top-0 z-50 bg-white py-4 transition-all duration-300 ${isScrolled ? 'shadow-sm' : ''}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => setIsNavOpen(!isNavOpen)} 
            className="mr-4 md:hidden rounded-lg p-2 hover:bg-gray-100 transition-colors"
          >
            <Navigation className="h-5 w-5 text-blue-500" />
          </button>
          <Link to="/" className="font-bold text-2xl md:text-2xl text-[#8A0303]">Rigorion</Link>
          <nav className="hidden md:flex ml-24 space-x-6 l-12">
            <Link to="/" className="text-gray-600 hover:text-[#8A0303] transition-colors">Home</Link>
            <Link to="/landing" className="text-gray-600 hover:text-[#8A0303] transition-colors">Landing</Link>
            <Link to="/about" className="text-gray-600 hover:text-[#8A0303] transition-colors">About</Link>
            <Link to="/practice" className="text-gray-600 hover:text-[#8A0303] transition-colors">Practice</Link>
            <Link to="/progress" className="text-gray-600 hover:text-[#8A0303] transition-colors">Progress</Link>
          </nav>
        </div>
        
        <div>
          <Link to="/signin" className="text-gray-600 hover:text-[#8A0303] px-4 py-2 transition-colors">Login</Link>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isNavOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b shadow-md py-2">
          <div className="container mx-auto px-4">
            <div className="flex flex-col space-y-2">
              <Link to="/" className="text-gray-600 hover:text-[#8A0303] py-2 transition-colors" onClick={() => setIsNavOpen(false)}>Home</Link>
              <Link to="/landing" className="text-gray-600 hover:text-[#8A0303] py-2 transition-colors" onClick={() => setIsNavOpen(false)}>Landing</Link>
              <Link to="/about" className="text-gray-600 hover:text-[#8A0303] py-2 transition-colors" onClick={() => setIsNavOpen(false)}>About</Link>
              <Link to="/practice" className="text-gray-600 hover:text-[#8A0303] py-2 transition-colors" onClick={() => setIsNavOpen(false)}>Practice</Link>
              <Link to="/progress" className="text-gray-600 hover:text-[#8A0303] py-2 transition-colors" onClick={() => setIsNavOpen(false)}>Progress</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
