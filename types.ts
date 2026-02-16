
export type MetalType = 'sterling-silver' | 'gold-vermeil';
export type NecklaceLength = '16' | '18' | '20';
export type BuilderTool = 'NONE' | 'ADD' | 'REMOVE';

export interface NecklaceHolder {
  id: string;
  name: string;
  basePrice: number;
  imageUrl: string;
  description: string;
}

export interface Charm {
  id: string;
  sku: string;
  name: string;
  category: string;
  meaning: string;
  imageUrl: string;
  price: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface SlotInstance {
  id: string;
  angle: number;
  charm: Charm | null;
}

export interface BuilderState {
  selectedHolder: NecklaceHolder | null;
  metal: MetalType;
  length: NecklaceLength;
  slots: SlotInstance[];
  activeSlotId: string | null;
  isSwapMode: boolean;
  swapSourceSlotId: string | null;
  activeTool: BuilderTool;
}
