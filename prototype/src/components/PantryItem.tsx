import { useState } from 'react';
import { Trash2, Check, Edit, X } from 'lucide-react';

interface PantryItemData {
  id: string;
  name: string;
  category: string;
  quantity: string;
  addedAt: Date;
}

interface PantryItemProps {
  item: PantryItemData;
  categories: string[];
  onEdit: (id: string, data: { name: string; category: string; quantity: string }) => void;
  onDelete: (id: string) => void;
}

function PantryItem({ item, categories, onEdit, onDelete }: PantryItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: item.name,
    category: item.category,
    quantity: item.quantity
  });

  const handleSave = () => {
    if (!editForm.name.trim()) return;
    onEdit(item.id, {
      name: editForm.name.trim(),
      category: editForm.category,
      quantity: editForm.quantity
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      name: item.name,
      category: item.category,
      quantity: item.quantity
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all duration-200">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({...editForm, name: e.target.value})}
              className="text-lg font-semibold px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 flex-1 mr-2"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                title="Speichern"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancel}
                className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                title="Abbrechen"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <select
              value={editForm.category}
              onChange={(e) => setEditForm({...editForm, category: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
            >
              {categories.filter(cat => cat !== 'alle').map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <input
              type="text"
              value={editForm.quantity}
              onChange={(e) => setEditForm({...editForm, quantity: e.target.value})}
              placeholder="Menge"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {item.name}
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
              {item.category}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
              {item.quantity}
            </span>
            <span className="text-gray-400">
              {item.addedAt.toLocaleDateString('de-DE')}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
            title="Bearbeiten"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
            title="Löschen"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PantryItem;