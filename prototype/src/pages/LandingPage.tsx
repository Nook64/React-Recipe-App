import { useState, useEffect } from 'react';
import { Search, X, ChefHat, Refrigerator } from 'lucide-react';
import recipesData from '../assets/recipes.json';
import type { Recipe } from '../types/recipe';
import RecipeCard from '../components/RecipeCard';

function LandingPage() {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [showPantryRecipes, setShowPantryRecipes] = useState(false);
  const [pantryItems, setPantryItems] = useState<{name: string, category: string, quantity: string}[]>([]);
  const [favorites, setFavorites] = useState<Recipe[]>([]);

  // Lade Rezepte beim Start
  useEffect(() => {
    setAllRecipes(recipesData.recipes);
    // Lade Vorratsdaten aus localStorage
    const savedItems = localStorage.getItem('coChefPantry');
    if (savedItems) {
      try {
        const parsedItems = JSON.parse(savedItems);
        setPantryItems(parsedItems);
      } catch (error) {
        console.error('Fehler beim Laden der Vorratsdaten:', error);
      }
    }

    // Lade Favoriten aus localStorage
    const savedFavorites = localStorage.getItem('coChefFavorites');
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavorites(parsedFavorites);
      } catch (error) {
        console.error('Fehler beim Laden der Favoriten:', error);
      }
    }
  }, []);

  const handleAddTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      setTags([...tags, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };
  // Normale Suche mit Tags
  const handleSearch = () => {
    if (tags.length === 0) {
        alert("Du hast noch keinen Tag angegeben. Schreibe dafür etwas in die Suchleiste und probiere es erneut.")
        return;
    }
    
    setIsLoading(true);
    setShowPantryRecipes(false);

    setTimeout(() => {
      const lowerTags = tags.map(tag => tag.toLowerCase());
      
      const filteredRecipes = allRecipes.filter(recipe => {
        // Kombiniere alle durchsuchbaren Felder des Rezepts in einen großen String
        const searchableContent = [
          recipe.title,
          recipe.category,
          recipe.cost,
          ...recipe.ingredients,
          ...recipe.diet
        ].join(' ').toLowerCase();
        
        // Prüfe, ob all Tags im kombinierten Inhalt vorkommen
        return lowerTags.every(tag => searchableContent.includes(tag));
      });
      
      setRecipes(filteredRecipes);
      setIsLoading(false);
    }, 500);
  };
  
    // Suche mit Vorratsdaten
  const findRecipesWithPantry = () => {
    if (pantryItems.length === 0) {
      alert('Du hast noch keine Zutaten in deinem Vorrat. Füge zuerst welche in der Vorratsliste hinzu.');
      return;
    }
    
    setIsLoading(true);
    setShowPantryRecipes(true);
    
    // Extrahiere alle Zutatennamen aus dem Vorrat (in Kleinbuchstaben für bessere Übereinstimmung)
    const pantryItemNames = pantryItems.map(item => item.name.toLowerCase());
    
    setTimeout(() => {
      // Finde Rezepte, bei denen alle Hauptzutaten im Vorrat sind
      const matchedRecipes = allRecipes.filter(recipe => {
        // Liste von Grundzutaten, die ignoriert werden (weil sie meistens vorhanden sind)
        const basicIngredients = ['salz', 'pfeffer', 'olivenöl', 'öl', 'wasser', 'zucker'];
        
        // Filtere Grundzutaten heraus und prüfe nur die Hauptzutaten
        const mainIngredients = recipe.ingredients
          .map(ingredient => ingredient.toLowerCase())
          .filter(ingredient => 
            !basicIngredients.some(basic => ingredient.includes(basic))
          );
        
        // Wenn ein Rezept nur aus Grundzutaten besteht, ist es machbar
        if (mainIngredients.length === 0) return true;
        
        // Prüfe, ob mindestens 70% der Hauptzutaten im Vorrat sind
        const matchingIngredients = mainIngredients.filter(ingredient =>
          pantryItemNames.some(pantryItem => 
            pantryItem.includes(ingredient) || ingredient.includes(pantryItem)
          )
        );
        
        return matchingIngredients.length >= mainIngredients.length * 0.7;
      });
      
      setRecipes(matchedRecipes);
      setIsLoading(false);
    }, 500);
  };

  const handleClearAll = () => {
    setTags([]);
    setRecipes([]);
    setShowPantryRecipes(false);
  };

  const toggleFavorite = (recipe: Recipe) => {
    const isAlreadyFavorite = favorites.some(fav => fav.id === recipe.id);
    let updatedFavorites: Recipe[];
    
    if (isAlreadyFavorite) {
      // Entfernen
      updatedFavorites = favorites.filter(fav => fav.id !== recipe.id);
    } else {
      // Hinzufügen
      updatedFavorites = [...favorites, recipe];
    }
    
    setFavorites(updatedFavorites);
    localStorage.setItem('coChefFavorites', JSON.stringify(updatedFavorites));
  };

  const isFavorite = (recipeId: number) => {
    return favorites.some(fav => fav.id === recipeId);
  };

  return (
    <div className="bg-linear-to-b from-gray-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Suchbereich */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Was möchtest du verwenden?
          </h1>
          <p className="text-gray-600 mb-6">
            Gib Zutaten oder Filter ein, um passende Rezepte zu finden
          </p>
          
          {/* Tags Input */}
          <div className="relative mb-4">
            <div className="flex items-center border-2 border-gray-300 rounded-xl focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-200">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="z.B. 'Tomaten', 'vegetarisch', 'schnell', '<20min'"
                className="w-full px-4 py-3 focus:outline-none rounded-xl bg-transparent"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-3 text-gray-500 hover:text-green-600"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Drücke Enter oder klicke das Suchsymbol, um Tags hinzuzufügen
            </p>
          </div>

          {/* Tags Anzeige */}
          {tags.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded-full border border-green-200"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Aktionsbuttons (Suchbutton + Zurücksetzen) */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className={`flex-1 px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                tags.length === 0 || isLoading
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-linear-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-200 hover:scale-[1.02]'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Suche Rezepte...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Rezepte finden ({tags.length})
                </>
              )}
            </button>

            {/* Button für Vorratssuche */}
            <button
              onClick={findRecipesWithPantry}
              disabled={isLoading}
              className={`flex-1 px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                isLoading || pantryItems.length === 0
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-linear-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-200 hover:scale-[1.02]'
              }`}
            >
              <Refrigerator className="w-5 h-5" />
              Mit Vorrat kochen
              {pantryItems.length > 0 && (
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  {pantryItems.length} Zutaten
                </span>
              )}
            </button>
            
            {(tags.length > 0 || showPantryRecipes) &&  (
              <button
                onClick={handleClearAll}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-xl font-medium transition-colors"
              >
                Alles zurücksetzen
              </button>
            )}
          </div>
          {/* Hinweis zur Vorratssuche */}
          {pantryItems.length === 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700 flex items-center gap-2">
                <Refrigerator className="w-4 h-4" />
                Du hast noch keine Zutaten in deinem Vorrat. Füge zuerst welche in der 
                <a href="/pantry" className="font-semibold underline hover:text-blue-900 ml-1">
                  Vorratsliste
                </a>
                hinzu.
              </p>
            </div>
          )}
        </div>

        {/* Rezepte Ausgabe */}
        <main>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Suche nach passenden Rezepten...</p>
              </div>
            </div>
          ) : recipes.length > 0 ? (
            <>
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
                  Gefundene Rezepte ({recipes.length})
                </h2>
                <p className="text-gray-600">
                  Passend zu deinen ausgewählten Zutaten
                </p>
              </div>
              
              {/* RecipeCard */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isFavorite={isFavorite(recipe.id)}
                    onToggleFavorite={toggleFavorite}
                    highlightTags={tags}
                    showViewButton={true}
                  />
                ))}
              </div>

            </>
          ) : tags.length > 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Keine Rezepte gefunden
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Keine Rezepte passen zu deinen ausgewählten Tags. Versuche andere Zutaten oder Filter.
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Füge Zutaten hinzu
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Gib oben Zutaten ein, die du verwenden möchtest, und finde passende Rezepte.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default LandingPage;
