import { Heart, Clock } from 'lucide-react';
import type { Recipe } from '../types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite?: boolean;
  onToggleFavorite?: (recipe: Recipe) => void;
  highlightTags?: string[];
  showViewButton?: boolean;
}

function RecipeCard({ 
  recipe, 
  isFavorite = false, 
  onToggleFavorite,
  highlightTags = [],
  showViewButton = true 
}: RecipeCardProps) {
  const matchesTag = (value: string) => {
    return highlightTags.some(tag => 
      value.toLowerCase().includes(tag.toLowerCase())
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all duration-200 relative">
      {/* Favoriten Button */}
      {onToggleFavorite && (
        <button
          onClick={() => onToggleFavorite(recipe)}
          className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-sm hover:bg-red-50 transition-colors z-10"
          title={isFavorite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
        >
          <Heart 
            className={`w-5 h-5 transition-all ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'}`}
          />
        </button>
      )}
      
      <div className="mb-4">
        <h3 className={`text-lg font-semibold mb-2 pr-10 ${
          matchesTag(recipe.title) ? 'text-green-700' : 'text-gray-900'
        }`}>
          {recipe.title}
        </h3>
        
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <Clock className='w-4 h-4 text-gray-500' />
          <span className={`text-sm ${
            highlightTags.some(tag => tag.includes(recipe.time.toString()) || tag.includes('min') || tag.includes('<')) 
              ? 'text-green-700 font-medium' 
              : 'text-gray-600'
          }`}>
            {recipe.time} Min
          </span>
        </div>
        
        {/* Kategorie, Diät und Kosten Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`text-xs px-2 py-1 rounded-full ${
            matchesTag(recipe.category) 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {recipe.category}
          </span>
          
          {recipe.diet.map((diet, idx) => (
            <span
              key={idx}
              className={`text-xs px-2 py-1 rounded-full ${
                matchesTag(diet)
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {diet}
            </span>
          ))}
          
          <span className={`text-xs px-2 py-1 rounded-full ${
            matchesTag(recipe.cost)
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-gray-100 text-gray-600'
          }`}>
            {recipe.cost}
          </span>
        </div>
        
        {/* Zutaten-Tags */}
        <div className="flex flex-wrap gap-2">
          {recipe.ingredients.slice(0, 6).map((ingredient, idx) => (
            <span
              key={idx}
              className={`text-xs px-2 py-1 rounded-full ${
                matchesTag(ingredient)
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-gray-100 text-gray-600'
              }`}
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
      
      {showViewButton && (
        <button className="w-full text-center text-green-600 hover:text-green-800 font-medium py-2 border border-green-200 rounded-lg hover:bg-green-50 transition-colors">
          Rezept ansehen
        </button>
      )}
    </div>
  );
}

export default RecipeCard;