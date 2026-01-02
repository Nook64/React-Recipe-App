import { ChefHat } from "lucide-react";

function Footer() {
  return (
    <footer className="max-w-6xl mx-auto mt-16 py-10 border-t border-gray-200 text-sm">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 text-gray-600">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <ChefHat className="w-4 h-4 text-green-600" />
          </div>
          <span className="font-semibold">Co-Chef</span>
        </div>

        <div className="flex gap-6 text-gray-500">
          <button className="hover:text-gray-700">Wie es funktioniert</button>
          <button className="hover:text-gray-700">Über</button>
          <button className="hover:text-gray-700">Kontakt</button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
