import { useState } from 'react';
import { Search, X, ChefHat } from 'lucide-react';

function LandingPage() {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [recipes, setRecipes] = useState<Array<{id: number, title: string, ingredients: string[], time: number}>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const dummyRecipes = [
    { id: 1, title: 'Zucchini-Feta Omelett', ingredients: ['Eier', 'Zucchini', 'Feta'], time: 15 },
    { id: 2, title: 'Mediterrane Gemüsepfanne', ingredients: ['Paprika', 'Zucchini', 'Tomaten'], time: 25 },
    { id: 3, title: 'Schnelle Nudeln mit Spinat', ingredients: ['Nudeln', 'Spinat', 'Knoblauch'], time: 20 },
    { id: 4, title: 'Quinoa-Salat mit Kichererbsen', ingredients: ['Quinoa', 'Kichererbsen', 'Spinat'], time: 30 },
    { id: 5, title: 'Hähnchen-Curry', ingredients: ['Hähnchen', 'Kokosmilch', 'Currypulver'], time: 35 },
  ];

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

  const handleSearch = () => {
    if (tags.length === 0) return;
    
    setIsLoading(true);
    setTimeout(() => {
      const filteredRecipes = dummyRecipes.filter(recipe =>
        tags.some(tag => 
          recipe.ingredients.some(ingredient => 
            ingredient.toLowerCase().includes(tag.toLowerCase())
          ) ||
          recipe.title.toLowerCase().includes(tag.toLowerCase())
        )
      );
      setRecipes(filteredRecipes);
      setIsLoading(false);
    }, 500);
  };

  const handleClearAll = () => {
    setTags([]);
    setRecipes([]);
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white p-4 md:p-8">
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
                onKeyPress={handleKeyPress}
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
              disabled={tags.length === 0 || isLoading}
              className={`flex-1 px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                tags.length === 0 || isLoading
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-200 hover:scale-[1.02]'
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
            
            {tags.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-xl font-medium transition-colors"
              >
                Alles zurücksetzen
              </button>
            )}
          </div>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="bg-white rounded-xl border border-gray-200 p-5 hover:border-green-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {recipe.title}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <span className="text-sm">⏱️ {recipe.time} Min</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recipe.ingredients.map((ingredient, idx) => (
                          <span
                            key={idx}
                            className={`text-xs px-2 py-1 rounded-full ${
                              tags.some(tag => ingredient.toLowerCase().includes(tag.toLowerCase()))
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button className="w-full text-center text-green-600 hover:text-green-800 font-medium py-2 border border-green-200 rounded-lg hover:bg-green-50 transition-colors">
                      Rezept ansehen
                    </button>
                  </div>
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
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-lg mx-auto">
                {['Tomaten', 'vegetarisch', 'schnell', '<20min', 'Reis', 'gesund', 'Hühnchen', 'einfach'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      if (!tags.includes(tag)) {
                        setTags([...tags, tag]);
                      }
                    }}
                    className="text-sm px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default LandingPage;