import { useState, useEffect } from "react";
import {
  Search,
  X,
  ChefHat,
  Refrigerator,
  ChevronDown,
  Check,
} from "lucide-react";
import recipesData from "../assets/recipes.json";
import type { Recipe } from "../types/recipe";
import RecipeCard from "../components/RecipeCard";

function LandingPage() {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [showPantryRecipes, setShowPantryRecipes] = useState(false);
  const [pantryItems, setPantryItems] = useState<
    { name: string; category: string; quantity: string }[]
  >([]);
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Filteroptionen
  const filterOptions = [
    { value: "<20", label: "<20 Min" },
    { value: "vegetarisch", label: "Vegetarisch" },
    { value: "vegan", label: "Vegan" },
    { value: "high-protein", label: "High Protein" },
    { value: "low-carb", label: "Low Carb" },
    { value: "schnell", label: "Schnell" },
    { value: "gesund", label: "Gesund" },
    { value: "günstig", label: "Günstig" },
    { value: "sehr günstig", label: "Sehr günstig" },
    { value: "asiatisch", label: "Asiatisch" },
    { value: "italienisch", label: "Italienisch" },
    { value: "mexikanisch", label: "Mexikanisch" },
    { value: "orientalisch", label: "Orientalisch" },
    { value: "französisch", label: "Französisch" },
    { value: "deutsch", label: "Deutsch" },
    { value: "herzhaft", label: "Herzhaft" },
    { value: "frühstück", label: "Frühstück" },
  ];

  // Lade Rezepte beim Start
  useEffect(() => {
    setAllRecipes(recipesData.recipes);
    // Lade Vorratsdaten aus localStorage
    const savedItems = localStorage.getItem("coChefPantry");
    if (savedItems) {
      try {
        const parsedItems = JSON.parse(savedItems);
        setPantryItems(parsedItems);
      } catch (error) {
        console.error("Fehler beim Laden der Vorratsdaten:", error);
      }
    }

    // Lade Favoriten aus localStorage
    const savedFavorites = localStorage.getItem("coChefFavorites");
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavorites(parsedFavorites);
      } catch (error) {
        console.error("Fehler beim Laden der Favoriten:", error);
      }
    }
  }, []);

  const handleAddTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleRemoveFilter = (filterToRemove: string) => {
    setSelectedFilters(
      selectedFilters.filter((filter) => filter !== filterToRemove)
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTag();
    }
  };

  const handleFilterSelect = (filterValue: string) => {
    if (selectedFilters.includes(filterValue)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== filterValue));
    } else {
      setSelectedFilters([...selectedFilters, filterValue]);
    }
  };

  // Kombiniere alle aktiven Tags (Zutaten + Filter)
  const getAllActiveTags = () => {
    return [...tags, ...selectedFilters];
  };

  const handleSearch = () => {
    const allTags = getAllActiveTags();
    if (allTags.length === 0) {
      return;
    }

    setIsLoading(true);
    setShowPantryRecipes(false);

    setTimeout(() => {
      const filteredRecipes = allRecipes.filter((recipe) => {
        const lowerTags = allTags.map((tag) => tag.toLowerCase());

        return lowerTags.some((tag) => {
          // Zeit-Filter prüfen
          if (tag.includes("<")) {
            const time = parseInt(tag.replace("<", "").trim());
            return recipe.time <= time;
          }

          const matchesIngredient = recipe.ingredients.some((ingredient) => {
            const lowerIngredient = ingredient.toLowerCase();

            // Exakte Übereinstimmung oder Wortanfang
            if (
              lowerIngredient === tag ||
              lowerIngredient.startsWith(tag + " ") ||
              lowerIngredient.includes(" " + tag + " ") ||
              lowerIngredient.endsWith(" " + tag)
            ) {
              return true;
            }

            // Oder enthält das Wort als Teil, aber nicht zu allgemein
            const generalIngredients = [
              "öl",
              "salz",
              "pfeffer",
              "wasser",
              "zucker",
            ];
            if (generalIngredients.includes(tag)) {
              // Für allgemeine Zutaten machen wir genauere Suche
              return (
                lowerIngredient.includes(tag) &&
                (lowerIngredient === tag ||
                  lowerIngredient.includes(tag + "-") ||
                  lowerIngredient.includes(" " + tag))
              );
            }

            //  Für normale Zutaten berücksichtigen Wortgrenzen
            const words = lowerIngredient.split(/[\s,-]+/);
            return words.some((word) => word === tag);
          });

          // Suchen im Titel
          const matchesTitle = recipe.title.toLowerCase().includes(tag);

          // Suchen in Kategorie
          const matchesCategory = recipe.category.toLowerCase() === tag;

          // Suchen in Diet (exakte Übereinstimmung im Array)
          const matchesDiet = recipe.diet.some(
            (diet) => diet.toLowerCase() === tag
          );

          // Suchen in Kostenkategorie
          const matchesCost = recipe.cost.toLowerCase() === tag;

          return (
            matchesIngredient ||
            matchesTitle ||
            matchesCategory ||
            matchesDiet ||
            matchesCost
          );
        });
      });

      setRecipes(filteredRecipes);
      setIsLoading(false);
    }, 500);
  };

  // Suche mit Vorratsdaten
  const findRecipesWithPantry = () => {
    if (pantryItems.length === 0) {
      alert(
        "Du hast noch keine Zutaten in deinem Vorrat. Füge zuerst welche in der Vorratsliste hinzu."
      );
      return;
    }

    setIsLoading(true);
    setShowPantryRecipes(true);

    const pantryItemNames = pantryItems.map((item) => item.name.toLowerCase());

    setTimeout(() => {
      const matchedRecipes = allRecipes.filter((recipe) => {
        const basicIngredients = [
          "salz",
          "pfeffer",
          "olivenöl",
          "öl",
          "wasser",
          "zucker",
        ];

        const mainIngredients = recipe.ingredients
          .map((ingredient) => ingredient.toLowerCase())
          .filter(
            (ingredient) =>
              !basicIngredients.some((basic) => ingredient.includes(basic))
          );

        if (mainIngredients.length === 0) return true;

        const matchingIngredients = mainIngredients.filter((ingredient) =>
          pantryItemNames.some(
            (pantryItem) =>
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
    setSelectedFilters([]);
    setRecipes([]);
    setShowPantryRecipes(false);
  };

  const toggleFavorite = (recipe: Recipe) => {
    const isAlreadyFavorite = favorites.some((fav) => fav.id === recipe.id);
    let updatedFavorites: Recipe[];

    if (isAlreadyFavorite) {
      updatedFavorites = favorites.filter((fav) => fav.id !== recipe.id);
    } else {
      updatedFavorites = [...favorites, recipe];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("coChefFavorites", JSON.stringify(updatedFavorites));
  };

  const isFavorite = (recipeId: number) => {
    return favorites.some((fav) => fav.id === recipeId);
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
            Gib Zutaten ein oder wähle Filter aus, um passende Rezepte zu finden
          </p>

          {/* Suchfeld und Filter Dropdown*/}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Linke Seite: Suchfeld für Zutaten - kleiner auf großen Bildschirmen */}
            <div className="lg:w-2/3">
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Zutat, z.B. Tomaten, Kartoffeln, Hähnchen"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none text-sm md:text-base"
                />
                <button
                  onClick={handleAddTag}
                  className="absolute right-3 top-3 text-gray-500 hover:text-green-600"
                  title="Zutat hinzufügen"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filter Dropdown */}
            <div className="lg:w-1/3 relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center justify-between gap-3 px-5 py-3.5 border-2 border-gray-300 rounded-xl hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 bg-white w-full h-full"
              >
                <span className="font-medium text-gray-700 text-base">
                  Filterkategorien{" "}
                  {selectedFilters.length > 0 && `(${selectedFilters.length})`}
                </span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${showFilterDropdown ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown Menu */}
              {showFilterDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-lg z-50 overflow-hidden">
                  <div className="max-h-82 overflow-y-auto w-full min-w-full">
                    <div className="p-4 md:p-5 border-b border-gray-100 bg-gray-50">
                      <h4 className="text-lg md:text-xl font-semibold text-gray-800">
                        Filter auswählen
                      </h4>
                      <p className="text-sm md:text-base text-gray-600 mt-2">
                        Mehrfachauswahl möglich
                      </p>
                    </div>

                    <div className="p-3 md:p-4">
                      {filterOptions.map((filter) => {
                        const isSelected = selectedFilters.includes(
                          filter.value
                        );
                        return (
                          <button
                            key={filter.value}
                            onClick={() => handleFilterSelect(filter.value)}
                            className={`w-full flex items-center justify-between px-4 py-3.5 md:px-5 md:py-4 rounded-lg hover:bg-gray-50 transition-colors mb-2 ${
                              isSelected
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "text-gray-700"
                            }`}
                          >
                            <div className="flex items-center">
                              <span
                                className={`font-medium text-base md:text-lg ${isSelected ? "font-semibold" : ""}`}
                              >
                                {filter.label}
                              </span>
                            </div>
                            {isSelected && (
                              <Check className="w-5 h-5 md:w-6 md:h-6 text-green-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {selectedFilters.length > 0 && (
                      <div className="p-4 border-t border-gray-100 bg-gray-50">
                        <button
                          onClick={() => {
                            setSelectedFilters([]);
                            setShowFilterDropdown(false);
                          }}
                          className="w-full text-center text-base text-red-600 hover:text-red-800 font-medium py-3 flex items-center justify-center gap-2"
                        >
                          <X className="w-5 h-5" />
                          Alle Filter entfernen
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Hinweis */}
          <p className="text-sm text-gray-500 mb-6">
            Drücke Enter oder klicke auf das Lupensymbol, um Zutaten
            hinzuzufügen
          </p>

          {/* Aktive Zutaten und Filter Anzeige */}
          {(tags.length > 0 || selectedFilters.length > 0) && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm md:text-base font-medium text-gray-700">
                  Aktive Suche ({getAllActiveTags().length}):
                </h3>
                <button
                  onClick={handleClearAll}
                  className="text-sm md:text-base text-red-600 hover:text-red-800 flex items-center gap-1 md:gap-2"
                >
                  <X className="w-3 h-3 md:w-4 md:h-4" />
                  Alles zurücksetzen
                </button>
              </div>

              <div className="flex flex-wrap gap-2 md:gap-3">
                {/* Zutaten anzeigen */}
                {tags.map((tag, index) => (
                  <div
                    key={`zutat-${index}`}
                    className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded-full border border-green-200 hover:bg-green-200 transition-colors group text-sm md:text-base"
                  >
                    <span className="font-medium">{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="text-green-600 hover:text-green-800"
                      title="Entfernen"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Filter anzeigen */}
                {selectedFilters.map((filterValue, index) => {
                  const filterInfo = filterOptions.find(
                    (f) => f.value === filterValue
                  );
                  return (
                    <div
                      key={`filter-${index}`}
                      className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-2 rounded-full border border-blue-200 hover:bg-blue-200 transition-colors group text-sm md:text-base"
                    >
                      <span className="font-medium">
                        {filterInfo?.label || filterValue}
                      </span>
                      <button
                        onClick={() => handleRemoveFilter(filterValue)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Entfernen"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Aktionsbuttons - NUR ZWEI BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className={`flex-1 px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                getAllActiveTags().length === 0 || isLoading
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-linear-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-200 hover:scale-[1.02]"
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
                  Rezepte finden ({
                    getAllActiveTags().length
                  })
                </>
              )}
            </button>

            {/* Button für Vorratssuche */}
            <button
              onClick={findRecipesWithPantry}
              disabled={isLoading}
              className={`flex-1 px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                isLoading || pantryItems.length === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-linear-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-200 hover:scale-[1.02]"
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
          </div>

          {/* Hinweis zur Vorratssuche */}
          {pantryItems.length === 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700 flex items-center gap-2">
                <Refrigerator className="w-4 h-4" />
                Du hast noch keine Zutaten in deinem Vorrat. Füge zuerst welche
                in der
                <a
                  href="/pantry"
                  className="font-semibold underline hover:text-blue-900 ml-1"
                >
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
                <p className="text-gray-600">
                  Suche nach passenden Rezepten...
                </p>
              </div>
            </div>
          ) : recipes.length > 0 ? (
            <>
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
                  Gefundene Rezepte ({recipes.length})
                </h2>
                <p className="text-gray-600">
                  {showPantryRecipes
                    ? "Rezepte, die du mit deinem Vorrat kochen kannst"
                    : "Passend zu deinen ausgewählten Zutaten und Filtern"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isFavorite={isFavorite(recipe.id)}
                    onToggleFavorite={toggleFavorite}
                    highlightTags={getAllActiveTags()}
                    showViewButton={true}
                  />
                ))}
              </div>
            </>
          ) : getAllActiveTags().length > 0 || showPantryRecipes ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Keine Rezepte gefunden
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {showPantryRecipes
                  ? "Es wurden keine Rezepte gefunden, die mit deinem Vorrat zubereitet werden können."
                  : "Keine Rezepte passen zu deinen ausgewählten Zutaten und Filtern. Versuche andere Zutaten oder Filter."}
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
                Gib oben Zutaten ein oder wähle Filter aus, um passende Rezepte
                zu finden.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default LandingPage;
