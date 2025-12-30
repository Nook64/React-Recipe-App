import { ChefHat } from 'lucide-react';

function Footer() {
  return (
    <footer className="max-w-4xl mx-auto mt-12 pt-8 border-t border-gray-200">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-gray-600">
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-green-600" />
            <span className="font-medium">Co-Chef</span>
          </div>
          <p className="text-sm mt-1">Koche smart mit dem, was da ist</p>
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <button className="hover:text-gray-700">Wie es funktioniert</button>
          <button className="hover:text-gray-700">Über Co-Chef</button>
          <button className="hover:text-gray-700">Kontakt</button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;