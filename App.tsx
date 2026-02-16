
import React, { useState, useEffect } from 'react';
import { BuilderState, MetalType, NecklaceLength, Charm, NecklaceHolder, SlotInstance, BuilderTool } from './types';
import NecklaceCanvas from './components/NecklaceCanvas';
import SelectionPanel from './components/SelectionPanel';
import HolderSelection from './components/HolderSelection';
import BagView from './components/BagView';

const STORAGE_KEY = 'necklace-builder-tool-v1';

const App: React.FC = () => {
  const [state, setState] = useState<BuilderState>({
    selectedHolder: null,
    metal: 'sterling-silver',
    length: '18',
    slots: [],
    activeSlotId: null,
    isSwapMode: false,
    swapSourceSlotId: null,
    activeTool: 'NONE'
  });

  const [showBag, setShowBag] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to load saved state", e);
      }
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        selectedHolder: state.selectedHolder,
        metal: state.metal,
        length: state.length,
        slots: state.slots
      }));
      setLastSaved(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, [state.selectedHolder, state.metal, state.length, state.slots]);

  const handleReturnToSelection = () => {
    setState(prev => ({ 
      ...prev, 
      selectedHolder: null, 
      activeSlotId: null, 
      isSwapMode: false, 
      swapSourceSlotId: null,
      activeTool: 'NONE'
    }));
    setShowBag(false);
  };

  const handleRemoveFromBag = () => {
    setState({
      selectedHolder: null,
      metal: 'sterling-silver',
      length: '18',
      slots: [],
      activeSlotId: null,
      isSwapMode: false,
      swapSourceSlotId: null,
      activeTool: 'NONE'
    });
    setShowBag(false);
  };

  const handleHolderSelect = (holder: NecklaceHolder) => {
    setState(prev => ({ ...prev, selectedHolder: holder }));
  };

  const handleAddSlot = (angle: number) => {
    const newSlot: SlotInstance = {
      id: `slot-${Date.now()}`,
      angle,
      charm: null
    };
    setState(prev => ({
      ...prev,
      slots: [...prev.slots, newSlot],
      activeSlotId: newSlot.id,
      activeTool: 'NONE' 
    }));
  };

  const handleRemoveSlot = (slotId: string) => {
    setState(prev => ({
      ...prev,
      slots: prev.slots.filter(s => s.id !== slotId),
      activeSlotId: prev.activeSlotId === slotId ? null : prev.activeSlotId,
      isSwapMode: false,
      swapSourceSlotId: null
    }));
  };

  const handleSlotClick = (slotId: string) => {
    if (state.activeTool === 'REMOVE') {
      handleRemoveSlot(slotId);
      return;
    }

    if (state.isSwapMode) {
      if (state.swapSourceSlotId === null) {
        const slot = state.slots.find(s => s.id === slotId);
        if (slot?.charm) {
          setState(prev => ({ ...prev, swapSourceSlotId: slotId }));
        }
      } else {
        const sourceId = state.swapSourceSlotId;
        const targetId = slotId;
        
        if (sourceId === targetId) {
          setState(prev => ({ ...prev, isSwapMode: false, swapSourceSlotId: null }));
          return;
        }

        setState(prev => {
          const newSlots = prev.slots.map(s => {
            if (s.id === sourceId) {
              const target = prev.slots.find(ts => ts.id === targetId);
              return { ...s, charm: target?.charm || null };
            }
            if (s.id === targetId) {
              const source = prev.slots.find(ss => ss.id === sourceId);
              return { ...s, charm: source?.charm || null };
            }
            return s;
          });
          return {
            ...prev,
            slots: newSlots,
            isSwapMode: false,
            swapSourceSlotId: null
          };
        });
      }
      return;
    }

    setState(prev => ({ ...prev, activeSlotId: slotId }));
  };

  const handleSwapInitiate = (slotId: string) => {
    setState(prev => ({
      ...prev,
      isSwapMode: true,
      swapSourceSlotId: slotId,
      activeSlotId: null 
    }));
  };

  const handleCharmSelect = (charm: Charm) => {
    if (state.activeSlotId !== null) {
      setState(prev => ({
        ...prev,
        slots: prev.slots.map(s => s.id === prev.activeSlotId ? { ...s, charm } : s),
        activeSlotId: null
      }));
    }
  };

  const setTool = (tool: BuilderTool) => {
    setState(prev => ({ 
      ...prev, 
      activeTool: prev.activeTool === tool ? 'NONE' : tool,
      activeSlotId: null,
      isSwapMode: false
    }));
  };

  const totalPrice = (state.selectedHolder?.basePrice || 0) + 
    state.slots.reduce<number>((acc, s) => acc + (s.charm?.price || 0), 0);

  const bagCount = state.selectedHolder ? 1 : 0;

  if (showBag) {
    return <BagView 
      state={state} 
      onClose={() => setShowBag(false)} 
      totalPrice={totalPrice}
      onEdit={() => setShowBag(false)}
      onRemove={handleRemoveFromBag}
    />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#FDFDFD]">
      {/* Header */}
      <header className="h-16 md:h-20 border-b border-gray-100 flex items-center justify-between px-6 md:px-10 bg-white z-50 shrink-0 shadow-sm">
        <div className="flex items-center gap-4 md:gap-8">
          <h1 
            className="font-serif text-xl md:text-2xl tracking-tighter font-semibold cursor-pointer"
            onClick={() => {
              handleReturnToSelection();
              setShowBag(false);
            }}
          >
            THEO GRACE
          </h1>
          <nav className="hidden md:flex gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
            <button 
              onClick={handleReturnToSelection}
              className={`transition-colors py-2 ${!state.selectedHolder ? 'text-black border-b-2 border-black' : 'hover:text-black'}`}
            >
              1. Base Configuration
            </button>
            <span className="text-gray-200 self-center">/</span>
            <button 
              disabled={!state.selectedHolder}
              className={`transition-colors py-2 ${state.selectedHolder ? 'text-black border-b-2 border-black' : 'text-gray-200 pointer-events-none'}`}
            >
              2. Story-Builder
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-2 md:gap-4 text-[10px] md:text-xs text-gray-400 font-medium tracking-widest">
          {lastSaved && (
            <span className="hidden sm:flex italic items-center gap-1.5 bg-[#CBE4F9] px-3 py-1 rounded-full text-[9px] text-blue-800">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              Autosaved
            </span>
          )}
          <button 
            onClick={() => state.selectedHolder && setShowBag(true)}
            className={`hover:text-black uppercase transition-colors ${bagCount > 0 ? 'text-black font-bold' : ''}`}
          >
            BAG ({bagCount})
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        {!state.selectedHolder ? (
          <div className="flex-1 overflow-hidden animate-in fade-in duration-500">
            <HolderSelection 
              onSelect={handleHolderSelect} 
              selectedMetal={state.metal}
              onMetalChange={(m) => setState(prev => ({...prev, metal: m}))}
              selectedLength={state.length}
              onLengthChange={(l) => setState(prev => ({...prev, length: l}))}
              currentHolderId={state.selectedHolder?.id}
            />
          </div>
        ) : (
          <main className="flex-1 flex relative flex-col md:flex-row animate-in fade-in duration-500">
            <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-12 overflow-hidden relative bg-[#CBE4F9]/30 transition-colors duration-700">
              
              {/* Floating Return Button */}
              <button 
                onClick={handleReturnToSelection}
                className="absolute top-4 left-4 z-40 bg-white/90 backdrop-blur-sm p-2 rounded-full border border-gray-100 shadow-md md:hidden"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>

              {/* Tool Toolbar */}
              <div className="absolute top-4 md:top-8 right-4 md:right-10 flex flex-col gap-3 z-[60]">
                <div className="bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-gray-100 shadow-xl flex flex-col gap-2 min-w-[48px] md:min-w-[140px]">
                  <p className="hidden md:block text-[9px] uppercase tracking-[0.2em] font-black text-gray-400 text-center mb-1">Tools</p>
                  
                  <button 
                    onClick={() => setTool('ADD')}
                    className={`w-10 h-10 md:w-full md:h-12 md:px-4 rounded-xl flex items-center justify-center md:justify-start gap-3 transition-all ${state.activeTool === 'ADD' ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-700'}`}
                  >
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                    <span className="hidden md:block text-[10px] font-bold uppercase tracking-widest">Add Charm</span>
                  </button>

                  <button 
                    onClick={() => setTool('REMOVE')}
                    className={`w-10 h-10 md:w-full md:h-12 md:px-4 rounded-xl flex items-center justify-center md:justify-start gap-3 transition-all ${state.activeTool === 'REMOVE' ? 'bg-red-500 text-white' : 'hover:bg-red-50 text-red-500'}`}
                  >
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4" /></svg>
                    <span className="hidden md:block text-[10px] font-bold uppercase tracking-widest">Remove</span>
                  </button>

                  <div className="w-full h-[1px] bg-gray-100 my-0.5" />

                  <button 
                    onClick={() => setTool('NONE')}
                    className={`w-10 h-10 md:w-full md:h-12 md:px-4 rounded-xl flex items-center justify-center md:justify-start gap-3 transition-all ${state.activeTool === 'NONE' ? 'bg-gray-100 text-black' : 'hover:bg-gray-50 text-gray-400'}`}
                  >
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" /></svg>
                    <span className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-left">Select</span>
                  </button>
                </div>
              </div>

              {/* Interaction Guide */}
              <div className={`absolute bottom-4 left-4 md:bottom-10 md:left-10 text-left transition-all duration-700 ease-in-out z-10 ${state.activeSlotId !== null || state.isSwapMode ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
                 <div className="flex flex-col gap-1 border-l-2 border-black/5 pl-4 max-w-[200px] md:max-w-none">
                    {state.activeTool === 'ADD' ? (
                      <p className="text-[9px] md:text-[10px] uppercase tracking-[0.25em] font-black text-black">Tap on chain to place slot</p>
                    ) : state.activeTool === 'REMOVE' ? (
                      <p className="text-[9px] md:text-[10px] uppercase tracking-[0.25em] font-black text-red-600">Tap items to remove</p>
                    ) : (
                      <p className="text-[9px] md:text-[10px] uppercase tracking-[0.25em] font-black text-gray-900/80">Select slot to build</p>
                    )}
                 </div>
              </div>

              {/* Necklace Visualization */}
              <NecklaceCanvas 
                holderId={state.selectedHolder.id}
                metal={state.metal}
                slots={state.slots}
                activeSlotId={state.activeSlotId}
                onSlotClick={handleSlotClick}
                onAddSlot={handleAddSlot}
                onRemoveSlot={handleRemoveSlot}
                onSwapInitiate={handleSwapInitiate}
                isSwapMode={state.isSwapMode}
                swapSourceSlotId={state.swapSourceSlotId}
                isSplitView={state.activeSlotId !== null}
                activeTool={state.activeTool}
              />
            </div>

            {/* Side Selection Drawer */}
            {state.activeSlotId !== null && (
              <div className="absolute inset-0 z-[100] md:relative md:inset-auto md:w-1/2 md:h-full">
                <SelectionPanel 
                  onSelect={handleCharmSelect}
                  onClose={() => setState(prev => ({ ...prev, activeSlotId: null }))}
                  initialCategory={state.slots.find(s => s.id === state.activeSlotId)?.charm?.category}
                />
              </div>
            )}
          </main>
        )}
      </div>

      {/* Footer Summary */}
      <footer className="h-20 md:h-24 border-t border-gray-100 flex items-center justify-between px-6 md:px-10 bg-white shrink-0 shadow-2xl z-50">
        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex flex-col">
            <span className="hidden sm:block text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Total Selection</span>
            <div className="flex items-baseline gap-1 md:gap-2 mt-0.5 md:mt-1">
              <span className="text-xl md:text-2xl font-medium tracking-tight">£{totalPrice}</span>
              {state.selectedHolder && (
                <span className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                   {state.slots.filter(s => !!s.charm).length} Items
                </span>
              )}
            </div>
          </div>
        </div>

        <button 
          onClick={() => state.selectedHolder && setShowBag(true)}
          disabled={!state.selectedHolder}
          className={`px-8 md:px-16 py-4 md:py-5 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] transition-all active:scale-95 shadow-xl ${
            state.selectedHolder 
            ? 'bg-black text-white hover:bg-gray-800' 
            : 'bg-gray-100 text-gray-300 cursor-not-allowed'
          }`}
        >
          Add To Bag
        </button>
      </footer>
    </div>
  );
};

export default App;
