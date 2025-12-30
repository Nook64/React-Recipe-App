import { ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Co-Chef</h1>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-700 hover:text-green-600 font-medium">
              Home
            </Link>
            <Link to="/pantry" className="text-gray-700 hover:text-green-600 font-medium">
              Vorrat
            </Link>
            <Link to="/favorites" className="text-gray-700 hover:text-green-600 font-medium">
              Favoriten
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;