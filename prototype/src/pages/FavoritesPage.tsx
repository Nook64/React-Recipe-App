import { useState, useEffect } from 'react';
import { Heart, Clock, X, ChefHat } from 'lucide-react';
import type { Recipe } from '../types/recipe';

function FavoritesPage() {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Lade Favoriten aus localStorage
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const savedFavorites = localStorage.getItem('coChefFavorites');
        if (savedFavorites) {
          const parsedFavorites = JSON.parse(savedFavorites);
          setFavorites(parsedFavorites);
        }
      } catch (error) {
        console.error('Fehler beim Laden der Favoriten:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // Entferne Rezept aus Favoriten
  const removeFromFavorites = (recipeId: number) => {
    const updatedFavorites = favorites.filter(recipe => recipe.id !== recipeId);
    setFavorites(updatedFavorites);
    localStorage.setItem('coChefFavorites', JSON.stringify(updatedFavorites));
  };

  // Entferne alle Favoriten
  const clearAllFavorites = () => {
    if (window.confirm('Möchtest du wirklich alle Favoriten entfernen?')) {
      setFavorites([]);
      localStorage.removeItem('coChefFavorites');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-linear-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Meine Favoriten</h1>
                <p className="text-gray-600">Deine gespeicherten Lieblingsrezepte</p>
              </div>
            </div>
            
            {favorites.length > 0 && (
              <button
                onClick={clearAllFavorites}
                className="px-4 py-2 border-2 border-red-300 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors"
              >
                Alle löschen
              </button>
            )}
          </div>
        </div>

        {/* Favoriten Liste */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Lade Favoriten...</p>
            </div>
          </div>
        ) : favorites.length > 0 ? (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                  {favorites.length} gespeicherte Rezepte
                </h2>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((recipe) => (
                <div
                  key={recipe.id}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all duration-200 relative"
                >
                  {/* Entfernen Button */}
                  <button
                    onClick={() => removeFromFavorites(recipe.id)}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-sm hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="Aus Favoriten entfernen"
                  >
                    <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                  </button>
                  
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 pr-8">
                      {recipe.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <Clock className='w-4 h-4 text-gray-500' />
                      <span className="text-sm"> {recipe.time} Min</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recipe.ingredients.slice(0, 6).map((ingredient, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                        >
                          {ingredient}
                        </span>
                      ))}
                      {recipe.ingredients.length > 6 && (
                        <span className="text-xs px-2 py-1 text-gray-500">
                          +{recipe.ingredients.length - 6} weitere
                        </span>
                      )}
                    </div>
                  </div>
                  <button className="w-full text-center text-green-600 hover:text-green-800 font-medium py-2 border border-green-200 rounded-lg hover:bg-green-50 transition-colors">
                    Rezept ansehen
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              Noch keine Favoriten
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Du hast noch keine Rezepte als Favoriten markiert. Gehe zur Startseite und klicke auf das Herz-Symbol bei Rezepten, die dir gefallen.
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-200 transition-all"
            >
              <ChefHat className="w-5 h-5" />
              Zurück zur Startseite
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoritesPage;