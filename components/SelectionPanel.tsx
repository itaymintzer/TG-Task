
import React, { useState } from 'react';
import { CATEGORIES, MOCK_CHARMS } from '../constants';
import { Category, Charm } from '../types';

interface SelectionPanelProps {
  onSelect: (charm: Charm) => void;
  onClose: () => void;
  initialCategory?: string;
}

const SelectionPanel: React.FC<SelectionPanelProps> = ({ onSelect, onClose, initialCategory }) => {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory || CATEGORIES[0].id);
  const [hoveredCharm, setHoveredCharm] = useState<Charm | null>(null);

  const filteredCharms = MOCK_CHARMS.filter(c => c.category === activeCategory);

  return (
    <div className="w-full h-full bg-white flex flex-col animate-in slide-in-from-bottom duration-500 md:slide-in-from-right md:border-l md:border-gray-100">
      <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl text-gray-800">Choose Your Story</h2>
          <p className="text-[9px] md:text-sm text-gray-400 mt-1 uppercase tracking-widest">Select an item to add to your slot</p>
        </div>
        <button 
          onClick={onClose}
          className="p-3 bg-gray-50 hover:bg-[#CBE4F9]/20 rounded-full transition-colors"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar bg-white sticky top-[88px] md:top-[112px] z-10">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 md:px-6 py-4 text-[11px] md:text-sm font-bold transition-all whitespace-nowrap border-b-2 uppercase tracking-widest ${
              activeCategory === cat.id 
              ? 'border-black text-black' 
              : 'border-transparent text-gray-400 hover:text-black hover:border-[#CBE4F9]'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-8 pb-32">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
          {filteredCharms.map(charm => (
            <div 
              key={charm.id}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredCharm(charm)}
              onMouseLeave={() => setHoveredCharm(null)}
              onClick={() => onSelect(charm)}
            >
              <div className="aspect-square bg-[#CBE4F9]/10 rounded-xl overflow-hidden border border-transparent group-hover:border-[#CBE4F9] group-hover:bg-[#CBE4F9]/30 transition-all relative">
                <img 
                  src={charm.imageUrl} 
                  alt={charm.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity" />
              </div>
              <div className="mt-3">
                <h3 className="text-[11px] md:text-sm font-bold text-gray-800 uppercase tracking-tight truncate">{charm.name}</h3>
                <p className="text-[10px] md:text-xs text-gray-400 mt-0.5">£{charm.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hover Meaning Box (Hidden if no meaning) */}
      <div className={`fixed bottom-24 left-0 right-0 md:relative md:bottom-auto bg-[#CBE4F9]/90 backdrop-blur-md p-5 border-t border-gray-100 transition-all duration-300 ${hoveredCharm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        {hoveredCharm && (
          <div className="max-w-md mx-auto md:max-w-none">
            <span className="text-[8px] font-black text-blue-900 uppercase tracking-widest block mb-1">The Story</span>
            <p className="text-xs md:text-sm italic text-gray-700 leading-tight">"{hoveredCharm.meaning}"</p>
          </div>
        )}
      </div>

      <div className="p-6 md:p-8 border-t border-gray-100 bg-white sticky bottom-0 z-20">
        <button 
          onClick={onClose}
          className="w-full py-4 bg-black text-white text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gray-800 transition-colors shadow-lg active:scale-95"
        >
          Confirm Selection
        </button>
      </div>
    </div>
  );
};

export default SelectionPanel;
