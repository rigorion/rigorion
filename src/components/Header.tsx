
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="bg-white border-b py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">Personality Arc</Link>
        <nav className="space-x-6">
          <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
          <Link to="/about" className="text-gray-600 hover:text-blue-600">About</Link>
          <Link to="/practice" className="text-gray-600 hover:text-blue-600">Practice</Link>
          <Link to="/progress" className="text-gray-600 hover:text-blue-600">Progress</Link>
        </nav>
      </div>
    </header>
  );
};
