import { ChefHat, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/pantry", label: "Vorrat" },
    { to: "/favorites", label: "Favoriten" },
  ];

  return (
    <header className="bg-linear-to-r from-green-500 to-emerald-500 border-b border-green-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="w-10 h-10 bg-linear-to-br from-green-700 to-emerald-400 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Co-Chef</h1>
              <p className="text-xs text-white opacity-90">
                Dein Küchen-Assistent
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`
                  px-4 py-2 rounded-lg font-medium transition
                  ${
                    location.pathname === item.to
                      ? "text-lime-300"
                      : "text-white hover:text-lime-300"
                  }
                `}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-3">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`
                    px-4 py-3 rounded-lg font-medium transition
                    relative overflow-hidden
                    ${
                      location.pathname === item.to
                        ? "bg-white/25 text-white"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }
                  `}
                >
                  {location.pathname === item.to && (
                    <span className="absolute left-0 top-0 h-full w-1 bg-lime-300 rounded-r" />
                  )}
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
