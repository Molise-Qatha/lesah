// src/data/marketplaceData.js

// ── Featured providers shown in the Marketplace grid ───────
export const featuredProviders = [
  {
    id: 'maseeiso',
    name: 'Maseeiso Thaanyane',
    category: 'Laundry & Food',
    status: 'NUL Alumni',
    course: 'LLB',
    location: 'Roma',
    image: '/assets/providers/maseeiso/profile.jpg',
    profileUrl: '/provider/maseeiso',
    services: ['Food & Meals', 'Laundry'],
    featured: true,
  },
  {
    id: 'easylearn',
    name: 'Kananelo Mats\'oele',
    category: 'Tutoring',
    status: 'Engineering background',
    course: 'Maths • Physics • Biology',
    location: 'Online (Lesotho & SA)',
    image: '/assets/providers/easylearn/profile.jpg',
    profileUrl: '/provider/easylearn',
    services: ['Matric Maths', 'Physics', 'Biology'],
    featured: false,
  },
  {
    id: 'hairvendor',                    // TODO: rename if you pick a real id
    name: 'TODO: Stylist Name',
    category: 'Hair & Beauty',
    status: 'Student Stylist',            // adjust freely
    course: '',                           // leave empty for non-NUL
    location: 'Roma',                     // TODO
    image: '/assets/providers/hairvendor/profile.jpg',
    profileUrl: '/provider/hairvendor',
    services: ['Braiding', 'Essence', 'Knotless'],
    featured: false,
  },
];

// ── Food discovery (unchanged) ─────────────────────────────
export const foodItems = [
  { name: 'Papa + Minced Meat',        price: 'M40', provider: 'Maseeiso Thaanyane', providerId: 'maseeiso', image: '/images/maseeiso/food/1.png', profileUrl: '/provider/maseeiso' },
  { name: 'Fried Rice + Chicken',      price: 'M60', provider: 'Maseeiso Thaanyane', providerId: 'maseeiso', image: '/images/maseeiso/food/2.png', profileUrl: '/provider/maseeiso' },
  { name: 'Rice + Chicken Strips',     price: 'M40', provider: 'Maseeiso Thaanyane', providerId: 'maseeiso', image: '/images/maseeiso/food/3.png', profileUrl: '/provider/maseeiso' },
  { name: 'Papa + Wors',               price: 'M55', provider: 'Maseeiso Thaanyane', providerId: 'maseeiso', image: '/images/maseeiso/food/4.png', profileUrl: '/provider/maseeiso' },
  { name: 'Papa + Chakalaka + Pork',   price: 'M85', provider: 'Maseeiso Thaanyane', providerId: 'maseeiso', image: '/images/maseeiso/food/5.png', profileUrl: '/provider/maseeiso' },
];

// ── Category chips ─────────────────────────────────────────
export const categories = [
  { id: 'all',           icon: '🏪', label: 'All' },
  { id: 'food',          icon: '🍲', label: 'Food' },
  { id: 'laundry',       icon: '🧺', label: 'Laundry' },
  { id: 'groceries',     icon: '🥚', label: 'Groceries' },
  { id: 'beauty',        icon: '💇', label: 'Hair & Beauty' },
  { id: 'tutoring',      icon: '📚', label: 'Tutoring' },   // ← NEW
  { id: 'accommodation', icon: '🏠', label: 'Accommodation' },
  { id: 'delivery',      icon: '🚚', label: 'Delivery' },
  { id: 'digital',       icon: '💻', label: 'Digital Services' },
];

// ── Services around you ────────────────────────────────────
export const servicesList = [
  { id: 'laundry',   icon: '🧺', label: 'Laundry',   hasProviders: true },
  { id: 'haircuts',  icon: '💇', label: 'Haircuts',  hasProviders: true },   // ← flip to true
  { id: 'tutoring',  icon: '📚', label: 'Tutoring',  hasProviders: true },   // ← flip to true
  { id: 'delivery',  icon: '🚚', label: 'Delivery',  hasProviders: false },
  { id: 'printing',  icon: '🖨️', label: 'Printing',  hasProviders: false },
  { id: 'repairs',   icon: '🔧', label: 'Repairs',   hasProviders: false },
  { id: 'digital',   icon: '💻', label: 'Digital',   hasProviders: false },
];