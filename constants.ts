
import { Category, Charm, NecklaceHolder } from './types';

export const CATEGORIES: Category[] = [
  { id: 'charms', name: 'Charms' },
  { id: 'beads', name: 'Beads' },
  { id: 'stones', name: 'Stones' },
  { id: 'letters', name: 'Letters' },
  { id: 'spacers', name: 'Spacers' }
];

export const MOCK_HOLDERS: NecklaceHolder[] = [
  {
    id: 'cable-chain',
    name: 'Cable Chain',
    basePrice: 85,
    imageUrl: 'https://images.clothes.com/b/67bd97ca465451e0419472ba/1740478411030_image.png',
    description: 'A classic and versatile chain with uniform oval links.'
  },
  {
    id: 'box-chain',
    name: 'Box Chain',
    basePrice: 95,
    imageUrl: 'https://picsum.photos/seed/box-chain/600/600',
    description: 'Square links that create a smooth, geometric look.'
  },
  {
    id: 'snake-chain',
    name: 'Snake Chain',
    basePrice: 110,
    imageUrl: 'https://picsum.photos/seed/snake-chain/600/600',
    description: 'Round, smooth metal plates with a slight curve like a snake.'
  },
  {
    id: 'rope-chain',
    name: 'Rope Chain',
    basePrice: 125,
    imageUrl: 'https://picsum.photos/seed/rope-chain/600/600',
    description: 'Several segments connected to resemble the twist of a rope.'
  },
  {
    id: 'bead-ball-chain',
    name: 'Bead Ball Chain',
    basePrice: 90,
    imageUrl: 'https://picsum.photos/seed/bead-ball/600/600',
    description: 'Spherical beads joined together for a modern, playful finish.'
  },
  {
    id: 'curb-chain',
    name: 'Curb Chain',
    basePrice: 115,
    imageUrl: 'https://picsum.photos/seed/curb-chain/600/600',
    description: 'Flat, interlocking links that lie comfortably against the skin.'
  },
  {
    id: 'figaro-chain',
    name: 'Figaro Chain',
    basePrice: 120,
    imageUrl: 'https://picsum.photos/seed/figaro-chain/600/600',
    description: 'A pattern of three small links followed by one elongated link.'
  },
  {
    id: 'wheat-chain',
    name: 'Wheat Chain',
    basePrice: 130,
    imageUrl: 'https://picsum.photos/seed/wheat-chain/600/600',
    description: 'Four strands of twisted oval links braided together.'
  },
  {
    id: 'singapore-chain',
    name: 'Singapore Chain',
    basePrice: 105,
    imageUrl: 'https://picsum.photos/seed/singapore-chain/600/600',
    description: 'A twisted chain with a delicate, diamond-cut sparkle.'
  },
  {
    id: 'hernithock-chain',
    name: 'Hernithock Chain',
    basePrice: 150,
    imageUrl: 'https://picsum.photos/seed/hernithock/600/600',
    description: 'A premium, bold herringbone-style flat weave.'
  }
];

export const MOCK_CHARMS: Charm[] = [
  {
    id: 'c1',
    sku: 'RQ-001',
    name: 'Rose Quartz',
    category: 'stones',
    meaning: 'For Unconditional Love and Peace',
    imageUrl: 'https://picsum.photos/seed/quartz/200/200',
    price: 15
  },
  {
    id: 'c2',
    sku: 'LA-001',
    name: 'Lapis Lazuli',
    category: 'stones',
    meaning: 'For Wisdom and Truth',
    imageUrl: 'https://picsum.photos/seed/lapis/200/200',
    price: 18
  },
  {
    id: 'c3',
    sku: 'GI-A',
    name: 'Gold Initial A',
    category: 'letters',
    meaning: 'Celebrating your unique identity',
    imageUrl: 'https://picsum.photos/seed/initialA/200/200',
    price: 25
  },
  {
    id: 'c4',
    sku: 'GI-M',
    name: 'Gold Initial M',
    category: 'letters',
    meaning: 'A tribute to someone special',
    imageUrl: 'https://picsum.photos/seed/initialM/200/200',
    price: 25
  },
  {
    id: 'c5',
    sku: 'H-001',
    name: 'Solid Heart',
    category: 'charms',
    meaning: 'A symbol of enduring affection',
    imageUrl: 'https://picsum.photos/seed/heart/200/200',
    price: 30
  },
  {
    id: 'c6',
    sku: 'S-001',
    name: 'Star Beam',
    category: 'charms',
    meaning: 'Follow your inner light',
    imageUrl: 'https://picsum.photos/seed/star/200/200',
    price: 22
  },
  {
    id: 'c7',
    sku: 'B-001',
    name: 'Pearl Bead',
    category: 'beads',
    meaning: 'Purity and new beginnings',
    imageUrl: 'https://picsum.photos/seed/pearl/200/200',
    price: 12
  },
  {
    id: 'c8',
    sku: 'SP-001',
    name: 'Gold Spacer',
    category: 'spacers',
    meaning: 'Creating space for reflection',
    imageUrl: 'https://picsum.photos/seed/spacer/200/200',
    price: 8
  }
];

export const TOTAL_SLOTS = 10;
