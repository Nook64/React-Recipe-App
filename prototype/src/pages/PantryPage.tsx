import { useState, useEffect } from 'react';
import { Plus, Trash2, Refrigerator } from 'lucide-react';
import PantryItem from '../components/PantryItem';

interface PantryItem {
  id: string;
  name: string;
  category: string;
  quantity: string;
  addedAt: Date;
}

function PantryPage() {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Gemüse',
    quantity: '',
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('alle');
  const [isInitialized, setIsInitialized] = useState(false);

  // Kategorien für die Filterung
  const categories = [
    'alle',
    'Gemüse',
    'Obst',
    'Kühlschrank',
    'Gefrierfach',
    'Grundnahrungsmittel',
    'Gewürze & Öle',
    'Milchprodukte',
    'Fleisch & Fisch',
    'Getreide & Backen',
    'Getränke',
    'Sonstiges'
  ];

  // Lade Daten aus localStorage beim Start
  useEffect(() => {
    const savedItems = localStorage.getItem('coChefPantry');
    if (savedItems) {
      try {
        const parsedItems = JSON.parse(savedItems);
        // Konvertiere addedAt strings zurück zu Date-Objekten
        const itemsWithDates = parsedItems.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        }));
        setItems(itemsWithDates);
      } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
        // Fallback auf leeres Array bei Fehler
        setItems([]);
      }
    } else {
      // Keine gespeicherten Daten vorhanden → leeres Array
      setItems([]);
    }
    setIsInitialized(true);
  }, []);

  // Speichere Daten in localStorage bei jeder Änderung
  useEffect(() => {
    if (!isInitialized) return;
    
    // Speichere die aktuellen Items im localStorage
    localStorage.setItem('coChefPantry', JSON.stringify(items));
  }, [items, isInitialized]);

  const filteredItems = selectedCategory === 'alle' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  const handleAddItem = () => {
    if (!newItem.name.trim()) {
        alert("Es fehlt der Name für das Gericht.")
        return;
    }

    const newItemObj: PantryItem = {
      id: Date.now().toString(),
      name: newItem.name.trim(),
      category: newItem.category,
      quantity: newItem.quantity || '1 Stück',
      addedAt: new Date(),
    };

    setItems([newItemObj, ...items]);
    setNewItem({ name: '', category: 'Gemüse', quantity: '' });
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleEditItem = (id: string, data: { name: string; category: string; quantity: string }) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, ...data }
        : item
    ));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  const clearAll = () => {
    if (window.confirm('Möchtest du wirklich alle Zutaten löschen?')) {
      setItems([]);
    }
  };

  const itemCount = items.length;
  
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Refrigerator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mein Vorrat</h1>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Linke Spalte: Neue Zutat hinzufügen */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Neue Zutat hinzufügen</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zutat *
                  </label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    onKeyDown={handleKeyDown}
                    placeholder="z.B. Kartoffeln, Hähnchen, Paprika"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategorie
                  </label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  >
                    {categories.filter(cat => cat !== 'alle').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Menge (optional)
                  </label>
                  <input
                    type="text"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                    onKeyDown={handleKeyDown}
                    placeholder="z.B. 500g, 6 Stück, 1 Flasche"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleAddItem}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                    !newItem.name.trim()
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-linear-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-200 hover:scale-[1.02]'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                  Zur Liste hinzufügen
                </button>

                {itemCount > 0 && (
                  <button
                    onClick={clearAll}
                    className="w-full py-3 border-2 border-red-300 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    Alle Zutaten löschen
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Rechte Spalte: Zutatenliste */}
          <div className="lg:col-span-2">
            {/* Filter */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Meine Zutaten</h2>
                  <p className="text-gray-600 text-sm">
                    {itemCount} Zutaten
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'alle' ? 'Alle Kategorien' : category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Zutatenliste */}
            {filteredItems.length > 0 ? (
              <div className="space-y-4">
                {filteredItems.map(item => (
                  <PantryItem
                    key={item.id}
                    item={item}
                    categories={categories}
                    onEdit={handleEditItem}
                    onDelete={handleDeleteItem}
                  />
                ))}
              </div>
            ) : (
              /* Leere Liste */
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Refrigerator className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {selectedCategory === 'alle' ? 'Keine Zutaten vorhanden' : 'Keine Zutaten in dieser Kategorie'}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  {selectedCategory === 'alle' 
                    ? 'Füge deine ersten Zutaten hinzu.' 
                    : `Keine Zutaten in der Kategorie "${selectedCategory}".`}
                </p>
                {selectedCategory !== 'alle' && (
                  <button
                    onClick={() => setSelectedCategory('alle')}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Alle Zutaten anzeigen
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PantryPage;
