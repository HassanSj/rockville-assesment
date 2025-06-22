import React from 'react';

interface Category {
  id: number;
  name: string;
}

interface Props {
  categories: Category[];
  selected: string[];
  onToggle: (name: string) => void;
  onClear: () => void;
}

const CategoryList = ({ categories, selected, onToggle, onClear }: Props) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto max-w-full pb-2">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onToggle(cat.name)}
          className={`px-3 py-1 text-sm rounded-full border transition-all ${selected.includes(cat.name)
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          {cat.name}
        </button>
      ))}
      {selected.length > 0 && (
        <button
          onClick={onClear}
          className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-600 border border-red-300 hover:bg-red-200"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default CategoryList;
