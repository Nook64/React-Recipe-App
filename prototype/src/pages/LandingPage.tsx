import { useState, useEffect } from "react";
import {
  Search,
  X,
  ChefHat,
  Refrigerator,
  ChevronDown,
  Check,
  Sparkles,
  Filter,
  Clock,
  Flame,
  Leaf,
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
  const [hasSearched, setHasSearched] = useState(false);

  // Filteroptionen mit Icons
  const filterOptions = [
    {
      value: "vegetarisch",
      label: "Vegetarisch",
      icon: <Leaf className="w-4 h-4" />,
    },
    { value: "vegan", label: "Vegan", icon: <Leaf className="w-4 h-4" /> },
    {
      value: "high-protein",
      label: "High Protein",
      icon: <Flame className="w-4 h-4" />,
    },
    {
      value: "low-carb",
      label: "Low Carb",
      icon: <Flame className="w-4 h-4" />,
    },
    { value: "schnell", label: "Schnell", icon: <Clock className="w-4 h-4" /> },
    {
      value: "gesund",
      label: "Gesund",
      icon: <Sparkles className="w-4 h-4" />,
    },
    { value: "günstig", label: "Günstig", icon: "€" },
    { value: "sehr günstig", label: "Sehr günstig", icon: "€" },
    { value: "asiatisch", label: "Asiatisch", icon: "🌏" },
    { value: "italienisch", label: "Italienisch", icon: "🇮🇹" },
    { value: "mexikanisch", label: "Mexikanisch", icon: "🇲🇽" },
    { value: "orientalisch", label: "Orientalisch", icon: "🌙" },
    { value: "französisch", label: "Französisch", icon: "🇫🇷" },
    { value: "deutsch", label: "Deutsch", icon: "🇩🇪" },
    { value: "herzhaft", label: "Herzhaft", icon: "🥘" },
    { value: "frühstück", label: "Frühstück", icon: "☕" },
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
    setHasSearched(true);

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
      alert(
        "Du hast noch keine Zutaten in deinem Vorrat. Füge zuerst welche in der Vorratsliste hinzu."
      );
      return;
    }

    setIsLoading(true);
    setShowPantryRecipes(true);
    setHasSearched(true);

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
    setHasSearched(false);
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
    <div className="min-h-screen bg-linear-to-b from-white via-emerald-50/20 to-white p-4 md:p-8 relative overflow-hidden mt-8">
      {/* Hintergrund-Elemente */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-linear-to-br from-emerald-50/30 via-transparent to-transparent -z-10"></div>
      <div className="absolute top-40 -right-40 w-80 h-80 bg-emerald-100/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-40 -left-40 w-80 h-80 bg-green-100/20 rounded-full blur-3xl -z-10"></div>
      <div className="max-w-6xl mx-auto">
        {/* Hero Section*/}
        <div className="text-center mb-10 md:mb-12">
          <h1 className="text-4xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-green-600 to-emerald-700">
              Koche schlauer.
            </span>
            <br />
            <span className="text-gray-900">Mit dem was da ist.</span>
          </h1>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto md:text-base lg:text-lg">
            Entdecke Rezepte basierend auf deinen Zutaten, Vorräten und
            Vorlieben
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-10 bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
          {/* Search Input and Filter */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Left: Ingredient Search */}
            <div className="lg:w-2/3 relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Z.B. Tomaten, Kartoffeln, Hähnchen..."
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:outline-none transition-all text-base"
                />
                {inputValue && (
                  <button
                    onClick={() => setInputValue("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Dropdown */}
            <div className="lg:w-1/3 relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={`flex items-center justify-between gap-3 px-6 py-4 bg-gray-50 border-2 rounded-xl hover:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-100 transition-all w-full h-full ${showFilterDropdown ? "border-green-500" : "border-gray-200"}`}
              >
                <div className="flex items-center gap-3">
                  <Filter className="w-5 h-5 text-gray-600" />
                  <span className="font-semibold text-gray-700">
                    Filter
                    {selectedFilters.length > 0 && (
                      <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        {selectedFilters.length}
                      </span>
                    )}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-600 transition-transform ${showFilterDropdown ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown Menu */}
              {showFilterDropdown && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl border border-gray-200 shadow-2xl z-50 overflow-hidden">
                  <div className="max-h-82 overflow-y-auto">
                    <div className="p-5 border-b border-gray-100 bg-emerald-200">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-bold text-gray-800 md:text-xl">
                          Filter auswählen
                        </h4>
                        {selectedFilters.length > 0 && (
                          <button
                            onClick={() => setSelectedFilters([])}
                            className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-1"
                          >
                            <X className="w-4 h-4" />
                            Zurücksetzen
                          </button>
                        )}
                      </div>
                      <p className="text-gray-600 mt-1 text-sm md:text-base">
                        Mehrfachauswahl möglich
                      </p>
                    </div>

                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {filterOptions.map((filter) => {
                        const isSelected = selectedFilters.includes(
                          filter.value
                        );
                        return (
                          <button
                            key={filter.value}
                            onClick={() => handleFilterSelect(filter.value)}
                            className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                              isSelected
                                ? "bg-linear-to-r from-green-500 to-emerald-600 text-white shadow-lg transform scale-[1.02]"
                                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-lg">
                                {typeof filter.icon === "string"
                                  ? filter.icon
                                  : filter.icon}
                              </span>
                              <span
                                className={`font-medium ${isSelected ? "font-bold" : ""}`}
                              >
                                {filter.label}
                              </span>
                            </div>
                            {isSelected && <Check className="w-5 h-5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Active Tags Display */}
          {(tags.length > 0 || selectedFilters.length > 0) && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Aktive Suche:
                  </span>
                  <span className="bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full">
                    {getAllActiveTags().length}
                  </span>
                </div>
                <button
                  onClick={handleClearAll}
                  className="text-sm text-red-600 hover:text-red-800 flex items-center gap-2 font-semibold"
                >
                  <X className="w-4 h-4" />
                  Alles zurücksetzen
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {/* Ingredients */}
                {tags.map((tag, index) => (
                  <div
                    key={`zutat-${index}`}
                    className="inline-flex items-center gap-2 bg-linear-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all group"
                  >
                    <span className="font-semibold">{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="opacity-80 hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Filters */}
                {selectedFilters.map((filterValue, index) => {
                  const filterInfo = filterOptions.find(
                    (f) => f.value === filterValue
                  );
                  return (
                    <div
                      key={`filter-${index}`}
                      className="inline-flex items-center gap-2 bg-linear-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all group"
                    >
                      <span className="font-semibold">
                        {filterInfo?.label || filterValue}
                      </span>
                      <button
                        onClick={() => handleRemoveFilter(filterValue)}
                        className="opacity-80 hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleSearch}
              disabled={isLoading || getAllActiveTags().length === 0}
              className={`flex-1 px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 ${
                getAllActiveTags().length === 0 || isLoading
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-linear-to-r from-green-500 to-emerald-600 text-white hover:shadow-2xl hover:shadow-green-300 hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Suche läuft...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Rezepte finden</span>
                  <span className="bg-white/20 px-2 py-1 rounded-full text-sm">
                    {getAllActiveTags().length}
                  </span>
                </>
              )}
            </button>

            <button
              onClick={findRecipesWithPantry}
              disabled={isLoading}
              className={`flex-1 px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 ${
                isLoading || pantryItems.length === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-linear-to-r from-blue-500 to-indigo-600 text-white hover:shadow-2xl hover:shadow-blue-300 hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              <Refrigerator className="w-5 h-5" />
              <span>Mit Vorrat kochen</span>
              {pantryItems.length > 0 && (
                <span className="bg-white/20 px-2 py-1 rounded-full text-sm">
                  {pantryItems.length}
                </span>
              )}
            </button>
          </div>

          {/* Pantry Hint */}
          {pantryItems.length === 0 && (
            <div className="mt-6 p-4 bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
              <p className="text-blue-700 flex items-center justify-center gap-2">
                <Refrigerator className="w-5 h-5" />
                <span>
                  Noch leer? Füge Zutaten in der{" "}
                  <a
                    href="/pantry"
                    className="font-bold underline hover:text-blue-900"
                  >
                    Vorratsliste
                  </a>{" "}
                  hinzu
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Recipes Section */}
        <main>
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mx-auto mb-6"></div>
                <p className="text-gray-600 text-lg font-medium">
                  Suche nach den besten Rezepten für dich...
                </p>
              </div>
            </div>
          ) : recipes.length > 0 ? (
            <>
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      Gefundene Rezepte
                    </h2>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600">
                        {showPantryRecipes
                          ? "Basierend auf deinem Vorrat"
                          : "Basierend auf deiner Suche"}
                      </span>
                      <span className="bg-linear-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full font-bold">
                        {recipes.length}
                      </span>
                    </div>
                  </div>
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
              </div>
            </>
          ) : hasSearched ? (
            <div className="text-center py-16 bg-linear-to-b from-gray-50 to-white rounded-2xl border border-gray-200">
              <div className="w-20 h-20 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Keine Rezepte gefunden
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                {showPantryRecipes
                  ? "Dein Vorrat passt leider nicht zu unseren Rezepten. Versuche andere Zutaten hinzuzufügen."
                  : "Probiere andere Zutaten oder passe deine Filter an."}
              </p>
              <button
                onClick={handleClearAll}
                className="px-6 py-3 bg-linear-to-r from-gray-500 to-gray-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Neue Suche starten
              </button>
            </div>
          ) : (
            <div className="text-center py-20 bg-linear-to-b from-green-50 to-white rounded-2xl border border-green-100">
              <div className="w-24 h-24 bg-linear-to-br from-green-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <ChefHat className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Bereit zum Kochen?
              </h3>
              <p className="text-gray-600 max-w-lg mx-auto text-lg mb-8">
                Gib Zutaten ein, wähle Filter aus oder lass dich von deinem
                Vorrat inspirieren
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center"></div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default LandingPage;
