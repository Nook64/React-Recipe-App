import { ChefHat } from "lucide-react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-linear-to-r from-green-500 to-emerald-500 border-b border-green-100">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-linear-to-br from-green-700 to-emerald-400 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Co-Chef</h1>
              <p className="text-xs text-white">Dein Küchen-Assistent</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 ">
            {[
              { to: "/", label: "Home" },
              { to: "/pantry", label: "Vorrat" },
              { to: "/favorites", label: "Favoriten" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="px-4 py-2 rounded-lg text-white font-medium hover:text-lime-300  transition"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
