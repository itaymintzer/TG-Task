
import React from 'react';
import { MOCK_HOLDERS } from '../constants';
import { NecklaceHolder, MetalType, NecklaceLength } from '../types';

interface HolderSelectionProps {
  onSelect: (holder: NecklaceHolder) => void;
  selectedMetal: MetalType;
  onMetalChange: (metal: MetalType) => void;
  selectedLength: NecklaceLength;
  onLengthChange: (length: NecklaceLength) => void;
  currentHolderId?: string;
}

const HolderSelection: React.FC<HolderSelectionProps> = ({ 
  onSelect, 
  selectedMetal, 
  onMetalChange, 
  selectedLength, 
  onLengthChange,
  currentHolderId
}) => {
  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-white h-full">
      {/* Configuration Sidebar */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-gray-100 p-6 md:p-8 flex flex-col gap-6 md:gap-10 shrink-0 bg-[#FAFAFA] overflow-y-auto">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl mb-1 md:mb-2 text-gray-900">Your Base</h2>
          <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-black text-gray-400">Step 1: Chain Setup</p>
        </div>

        <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible no-scrollbar pb-2 md:pb-0">
          <div className="shrink-0 md:shrink-1 w-40 md:w-auto">
            <span className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-700 block mb-3">Metal Finish</span>
            <div className="flex flex-col gap-2">
              {(['sterling-silver', 'gold-vermeil'] as MetalType[]).map(m => (
                <button
                  key={m}
                  onClick={() => onMetalChange(m)}
                  className={`w-full px-3 py-3 text-[9px] md:text-[10px] uppercase tracking-widest font-black border transition-all flex items-center justify-between rounded-lg ${
                    selectedMetal === m ? 'bg-black text-white border-black shadow-md' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {m.split('-')[0]}
                  {selectedMetal === m && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </button>
              ))}
            </div>
          </div>

          <div className="shrink-0 md:shrink-1 w-52 md:w-auto">
            <span className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-700 block mb-3">Length</span>
            <div className="grid grid-cols-3 gap-2">
              {(['16', '18', '20'] as NecklaceLength[]).map(l => (
                <button
                  key={l}
                  onClick={() => onLengthChange(l)}
                  className={`py-3 flex flex-col items-center justify-center text-[10px] font-black border rounded-lg transition-all ${
                    selectedLength === l ? 'bg-black text-white border-black shadow-md' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <span>{l}"</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex mt-auto pt-8 border-t border-gray-200">
           <div className={`flex items-center gap-3 transition-all ${currentHolderId ? 'text-black opacity-100' : 'text-gray-400 grayscale opacity-50 select-none'}`}>
              <div className={`w-10 h-10 border-2 rounded-full flex items-center justify-center text-lg ${currentHolderId ? 'border-black bg-black text-white' : 'border-dashed border-gray-300'}`}>
                {currentHolderId ? '✓' : '+'}
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold">
                {currentHolderId ? 'Build your story' : 'Next: Add Charms'}
              </span>
           </div>
        </div>
      </div>

      {/* Main Grid Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-16 bg-white pb-32">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 md:mb-12">
            <h3 className="font-serif text-3xl md:text-4xl text-gray-900 mb-2">Chain Styles</h3>
            <p className="text-[9px] md:text-[10px] uppercase tracking-widest font-black text-gray-400">Foundation of your story</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {MOCK_HOLDERS.map((holder, idx) => {
              const isSelected = currentHolderId === holder.id;
              return (
                <div 
                  key={holder.id}
                  onClick={() => onSelect(holder)}
                  className="group cursor-pointer animate-in fade-in slide-in-from-bottom-2 duration-500 relative"
                  style={{ animationDelay: `${idx * 30}ms` }}
                >
                  <div className={`aspect-square bg-[#CBE4F9]/20 overflow-hidden mb-3 relative rounded-2xl border transition-all duration-500 ${isSelected ? 'border-black ring-2 ring-black ring-offset-2 bg-[#CBE4F9]/40' : 'border-gray-100 group-hover:shadow-lg group-hover:bg-[#CBE4F9]/30'}`}>
                    <img 
                      src={holder.imageUrl} 
                      alt={holder.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out mix-blend-multiply p-4"
                    />
                    <div className={`absolute inset-0 flex items-center justify-center transition-all ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      <span className="bg-black text-white text-[8px] md:text-[9px] font-black uppercase tracking-widest px-4 md:px-6 py-2 md:py-3 shadow-2xl">
                        {isSelected ? 'Selected' : 'Select'}
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <h4 className={`font-serif text-base md:text-lg mb-0.5 transition-colors ${isSelected ? 'text-black font-semibold' : 'text-gray-800'}`}>
                      {holder.name}
                    </h4>
                    <p className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-widest font-black">£{holder.basePrice}</p>
                  </div>
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-black text-white w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-in zoom-in duration-300">
                       <span className="text-[8px] md:text-[10px]">✓</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolderSelection;
