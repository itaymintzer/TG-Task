
import React from 'react';
import { BuilderState } from '../types';
import NecklaceCanvas from './NecklaceCanvas';

interface BagViewProps {
  state: BuilderState;
  onClose: () => void;
  onEdit: () => void;
  onRemove: () => void;
  totalPrice: number;
}

const BagView: React.FC<BagViewProps> = ({ state, onClose, onEdit, onRemove, totalPrice }) => {
  const charms = state.slots.filter(s => !!s.charm).map(s => s.charm!);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white animate-in fade-in duration-500">
      {/* Header */}
      <header className="h-16 md:h-20 border-b border-gray-100 flex items-center justify-between px-6 md:px-10 bg-white shrink-0">
        <h1 
          className="font-serif text-xl md:text-2xl tracking-tighter font-semibold cursor-pointer"
          onClick={onClose}
        >
          THEO GRACE
        </h1>
        <button 
          onClick={onClose}
          className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest hover:text-black transition-colors"
        >
          Close Bag
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row gap-16">
          
          {/* Left: Visualization */}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-full max-w-[500px] aspect-square bg-[#CBE4F9]/40 rounded-3xl relative flex items-center justify-center p-4 shadow-inner">
              <div className="w-full h-full scale-110 md:scale-125">
                <NecklaceCanvas 
                  holderId={state.selectedHolder!.id}
                  metal={state.metal}
                  slots={state.slots}
                  activeSlotId={null}
                  onSlotClick={() => {}}
                  onAddSlot={() => {}}
                  onRemoveSlot={() => {}}
                  onSwapInitiate={() => {}}
                  isSwapMode={false}
                  swapSourceSlotId={null}
                  isSplitView={false}
                  activeTool="NONE"
                />
              </div>
            </div>
            <div className="flex gap-8 mt-8">
              <button 
                onClick={onEdit}
                className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] border-b border-black pb-1 hover:opacity-60 transition-opacity"
              >
                Modify Design
              </button>
              <button 
                onClick={onRemove}
                className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-red-400 border-b border-red-400 pb-1 hover:text-red-600 hover:border-red-600 transition-all"
              >
                Remove from Bag
              </button>
            </div>
          </div>

          {/* Right: Breakdown */}
          <div className="flex-1 flex flex-col">
            <div className="mb-10">
              <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mb-2">Your Story Design</h2>
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400">Personalized Necklace Summary</p>
            </div>

            <div className="space-y-6">
              {/* Chain */}
              <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-[#CBE4F9]/20 rounded-lg p-2">
                    <img src={state.selectedHolder?.imageUrl} alt={state.selectedHolder?.name} className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-tight text-gray-800">{state.selectedHolder?.name}</h3>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">{state.metal.replace('-', ' ')} • {state.length}" Length</p>
                  </div>
                </div>
                <span className="text-sm font-medium">£{state.selectedHolder?.basePrice}</span>
              </div>

              {/* Charms List */}
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 mb-2">Added Components</p>
                {charms.length === 0 ? (
                  <p className="text-xs italic text-gray-400">No charms added to this story yet.</p>
                ) : (
                  charms.map((charm, idx) => (
                    <div key={`${charm.id}-${idx}`} className="flex justify-between items-center group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#CBE4F9]/10 rounded-full overflow-hidden border border-gray-100">
                          <img src={charm.imageUrl} alt={charm.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-700">{charm.name}</h4>
                          <p className="text-[9px] text-gray-400 italic">"{charm.meaning}"</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium">£{charm.price}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Final Summary */}
            <div className="mt-12 pt-8 border-t-2 border-black/5">
              <div className="flex justify-between items-baseline mb-6">
                <span className="text-[10px] uppercase tracking-[0.3em] font-black">Subtotal</span>
                <span className="text-3xl font-serif">£{totalPrice}</span>
              </div>
              
              <button className="w-full py-5 bg-black text-white text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gray-800 transition-colors shadow-2xl active:scale-95 mb-4">
                Proceed to Checkout
              </button>
              
              <p className="text-[9px] text-gray-400 text-center uppercase tracking-widest leading-relaxed">
                Free standard shipping on all custom orders.<br/>
                Each story is handmade with care in our London studio.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BagView;
