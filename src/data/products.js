// src/data/products.js
// Product catalog — mirrors what vendors actually offer at their actual prices.
// Products without a real photo use an `icon` fallback instead.

export const productCategories = [
  { id: 'all', icon: '🏪', label: 'All' },
  { id: 'food', icon: '🍲', label: 'Food' },
  { id: 'beauty', icon: '💇', label: 'Beauty' },
  { id: 'farming', icon: '🌾', label: 'Farming' },
  { id: 'laundry', icon: '🧺', label: 'Laundry' },
  { id: 'orders', icon: '📦', label: 'Orders' },
  { id: 'services', icon: '⚙️', label: 'Services' },
];

export const products = [
  // ══════════════════════════════════════════════════════
  // Thapelo Thoo — Gold Garden Poultry (real prices, real photos)
  // ══════════════════════════════════════════════════════
  {
    id: 'tsuonyana',
    name: 'Tsuonyana (chicks, 7–14 days)',
    price: 30,
    priceUnit: 'each',
    category: 'farming',
    vendorId: 'thapelo',
    image: '/assets/providers/thapelo/gallery-01.jpg',
    icon: null,
    location: 'Roma',
    verified: true,
    type: 'order',
    orderMessage:
      'Hello Thapelo, I found Gold Garden Poultry on LeSAH and would like to order Tsuonyana (chicks) — M30 each.',
    createdAt: '2026-10-01',
  },
  {
    id: 'fertilized-eggs',
    name: 'Fertilized Egg Tray',
    price: 150,
    priceUnit: 'tray',
    category: 'farming',
    vendorId: 'thapelo',
    image: '/assets/providers/thapelo/gallery-02.jpg',
    icon: null,
    location: 'Roma',
    verified: true,
    type: 'order',
    orderMessage:
      'Hello Thapelo, I found Gold Garden Poultry on LeSAH and would like to order a Fertilized Egg Tray — M150.',
    createdAt: '2026-10-01',
  },
  {
    id: 'unfertilized-eggs',
    name: 'Unfertilized Egg Tray',
    price: 120,
    priceUnit: 'tray',
    category: 'farming',
    vendorId: 'thapelo',
    image: '/assets/providers/thapelo/gallery-02.jpg',
    icon: null,
    location: 'Roma',
    verified: true,
    type: 'order',
    orderMessage:
      'Hello Thapelo, I found Gold Garden Poultry on LeSAH and would like to order an Unfertilized Egg Tray — M120.',
    createdAt: '2026-10-01',
  },
  {
    id: 'point-of-lay',
    name: 'Point-of-Lay Pullet Chicken',
    price: 350,
    priceUnit: 'each',
    category: 'farming',
    vendorId: 'thapelo',
    image: '/assets/providers/thapelo/gallery-03.jpg',
    icon: null,
    location: 'Roma',
    verified: true,
    type: 'order',
    orderMessage:
      'Hello Thapelo, I found Gold Garden Poultry on LeSAH and would like to order a Point-of-Lay Pullet — M350.',
    createdAt: '2026-10-01',
  },
  {
    id: 'slaughtered-chicken',
    name: 'Slaughtered Chicken',
    price: 120,
    priceUnit: 'each',
    category: 'farming',
    vendorId: 'thapelo',
    image: '/assets/providers/thapelo/gallery-04.jpg',
    icon: null,
    location: 'Roma',
    verified: true,
    type: 'order',
    orderMessage:
      'Hello Thapelo, I found Gold Garden Poultry on LeSAH and would like to order a Slaughtered Chicken — M120.',
    createdAt: '2026-10-01',
  },

  // ══════════════════════════════════════════════════════
  // Maseeiso Thaanyane — Food (real prices, real photos)
  // ══════════════════════════════════════════════════════
  {
    id: 'papa-minced-meat',
    name: 'Papa + Minced Meat',
    price: 40,
    priceUnit: 'meal',
    category: 'food',
    vendorId: 'maseeiso',
    image: '/images/maseeiso/food/1.png',
    icon: null,
    location: 'Roma',
    verified: true,
    type: 'order',
    orderMessage:
      'Hello Maseeiso, I found your meal on LeSAH and would like to order Papa + Minced Meat — M40.',
    createdAt: '2026-09-28',
  },
  {
    id: 'fried-rice-chicken',
    name: 'Fried Rice + Chicken',
    price: 60,
    priceUnit: 'meal',
    category: 'food',
    vendorId: 'maseeiso',
    image: '/images/maseeiso/food/2.png',
    icon: null,
    location: 'Roma',
    verified: true,
    type: 'order',
    orderMessage:
      'Hello Maseeiso, I found your meal on LeSAH and would like to order Fried Rice + Chicken — M60.',
    createdAt: '2026-09-28',
  },
  {
    id: 'rice-chicken-strips',
    name: 'Rice + Chicken Strips',
    price: 40,
    priceUnit: 'meal',
    category: 'food',
    vendorId: 'maseeiso',
    image: '/images/maseeiso/food/3.png',
    icon: null,
    location: 'Roma',
    verified: true,
    type: 'order',
    orderMessage:
      'Hello Maseeiso, I found your meal on LeSAH and would like to order Rice + Chicken Strips — M40.',
    createdAt: '2026-09-28',
  },
  {
    id: 'papa-wors',
    name: 'Papa + Wors',
    price: 55,
    priceUnit: 'meal',
    category: 'food',
    vendorId: 'maseeiso',
    image: '/images/maseeiso/food/4.png',
    icon: null,
    location: 'Roma',
    verified: true,
    type: 'order',
    orderMessage:
      'Hello Maseeiso, I found your meal on LeSAH and would like to order Papa + Wors — M55.',
    createdAt: '2026-09-28',
  },
  {
    id: 'papa-chakalaka-pork',
    name: 'Papa + Chakalaka + Pork',
    price: 85,
    priceUnit: 'meal',
    category: 'food',
    vendorId: 'maseeiso',
    image: '/images/maseeiso/food/5.png',
    icon: null,
    location: 'Roma',
    verified: true,
    type: 'order',
    orderMessage:
      'Hello Maseeiso, I found your meal on LeSAH and would like to order Papa + Chakalaka + Pork — M85.',
    createdAt: '2026-09-28',
  },

  // ══════════════════════════════════════════════════════
  // Maseeiso Thaanyane — Laundry (real prices, real photos)
  // ══════════════════════════════════════════════════════
  {
    id: 'laundry-small',
    name: 'Laundry — Small Basket',
    price: 60,
    priceUnit: 'basket',
    category: 'laundry',
    vendorId: 'maseeiso',
    image: '/images/maseeiso/laundry/1.png',
    icon: null,
    location: 'Roma',
    verified: true,
    type: 'order',
    orderMessage:
      'Hello Maseeiso, I would like to book Laundry — Small Basket — M60.',
    createdAt: '2026-09-27',
  },
  {
    id: 'laundry-medium',
    name: 'Laundry — Medium Basket',
    price: 80,
    priceUnit: 'basket',
    category: 'laundry',
    vendorId: 'maseeiso',
    image: '/images/maseeiso/laundry/2.png',
    icon: null,
    location: 'Roma',
    verified: true,
    type: 'order',
    orderMessage:
      'Hello Maseeiso, I would like to book Laundry — Medium Basket — M80.',
    createdAt: '2026-09-27',
  },
  {
    id: 'laundry-large',
    name: 'Laundry — Large Basket',
    price: 120,
    priceUnit: 'basket',
    category: 'laundry',
    vendorId: 'maseeiso',
    image: '/images/maseeiso/laundry/3.png',
    icon: null,
    location: 'Roma',
    verified: true,
    type: 'order',
    orderMessage:
      'Hello Maseeiso, I would like to book Laundry — Large Basket — M120.',
    createdAt: '2026-09-27',
  },
  {
    id: 'laundry-monthly-small',
    name: 'Laundry Monthly — Small Basket',
    price: 220,
    priceUnit: 'month',
    category: 'laundry',
    vendorId: 'maseeiso',
    image: '/images/maseeiso/laundry/4.png',
    icon: null,
    location: 'Roma',
    verified: true,
    type: 'order',
    orderMessage:
      'Hello Maseeiso, I would like to book the Monthly Laundry Package (Small) — M220.',
    createdAt: '2026-09-27',
  },
  {
    id: 'laundry-monthly-medium',
    name: 'Laundry Monthly — Medium Basket',
    price: 300,
    priceUnit: 'month',
    category: 'laundry',
    vendorId: 'maseeiso',
    image: '/images/maseeiso/laundry/5.png',
    icon: null,
    location: 'Roma',
    verified: true,
    type: 'order',
    orderMessage:
      'Hello Maseeiso, I would like to book the Monthly Laundry Package (Medium) — M300.',
    createdAt: '2026-09-27',
  },

  // ══════════════════════════════════════════════════════
  // Pont'so Mary Mokonyana — Hair (no product photos → icon cards)
  // ══════════════════════════════════════════════════════
  {
    id: 'braiding',
    name: 'Hair Braiding',
    price: 200,
    priceUnit: 'service',
    priceDisplay: 'From M200',
    category: 'beauty',
    vendorId: 'pontso',
    image: null,
    icon: '💇🏾‍♀️',
    location: 'Roma',
    verified: true,
    type: 'order',
    orderMessage:
      "Hello Pont'so, I would like to book Hair Braiding. Please confirm style and price.",
    createdAt: '2026-09-25',
  },
  {
    id: 'essence-style',
    name: 'Essence Style',
    price: 100,
    priceUnit: 'service',
    priceDisplay: 'From M100',
    category: 'beauty',
    vendorId: 'pontso',
    image: null,
    icon: '💇🏾‍♀️',
    location: 'Roma',
    verified: true,
    type: 'order',
    orderMessage:
      "Hello Pont'so, I would like to book an Essence style. Please confirm the options.",
    createdAt: '2026-09-24',
  },
  {
    id: 'knotless-braids',
    name: 'Knotless Braids',
    price: 250,
    priceUnit: 'service',
    category: 'beauty',
    vendorId: 'pontso',
    image: null,
    icon: '💇🏾‍♀️',
    location: 'Roma',
    verified: true,
    type: 'order',
    orderMessage:
      "Hello Pont'so, I would like to book Knotless Braids — M250.",
    createdAt: '2026-09-24',
  },
  {
    id: 'bohemian-braids',
    name: 'Bohemian Braids',
    price: 280,
    priceUnit: 'service',
    category: 'beauty',
    vendorId: 'pontso',
    image: null,
    icon: '💇🏾‍♀️',
    location: 'Roma',
    verified: true,
    type: 'order',
    orderMessage:
      "Hello Pont'so, I would like to book Bohemian Braids — M280.",
    createdAt: '2026-09-24',
  },
  {
    id: 'french-curls',
    name: 'French Curls',
    price: 250,
    priceUnit: 'service',
    priceDisplay: 'From M250',
    category: 'beauty',
    vendorId: 'pontso',
    image: null,
    icon: '💇🏾‍♀️',
    location: 'Roma',
    verified: true,
    type: 'order',
    orderMessage:
      "Hello Pont'so, I would like to book French Curls. Please confirm style and price.",
    createdAt: '2026-09-24',
  },

  // ══════════════════════════════════════════════════════
  // Kananelo Mats'oele — Tutoring (icon cards, like his profile page)
  // ══════════════════════════════════════════════════════
  {
    id: 'matric-maths',
    name: 'Matric Maths Tutoring',
    price: null,
    priceUnit: 'session',
    priceDisplay: 'See Easy Learn for pricing',
    category: 'services',
    vendorId: 'easylearn',
    image: null,
    icon: '∑',
    location: 'Online',
    verified: true,
    type: 'order',
    orderMessage:
      'Hello Kananelo, I am interested in Matric Maths tutoring with Easy Learn.',
    createdAt: '2026-09-10',
  },
  {
    id: 'matric-physics',
    name: 'Matric Physics Tutoring',
    price: null,
    priceUnit: 'session',
    priceDisplay: 'See Easy Learn for pricing',
    category: 'services',
    vendorId: 'easylearn',
    image: null,
    icon: '⚛️',
    location: 'Online',
    verified: true,
    type: 'order',
    orderMessage:
      'Hello Kananelo, I am interested in Matric Physics tutoring with Easy Learn.',
    createdAt: '2026-09-10',
  },
  {
    id: 'matric-biology',
    name: 'Matric Biology Tutoring',
    price: null,
    priceUnit: 'session',
    priceDisplay: 'See Easy Learn for pricing',
    category: 'services',
    vendorId: 'easylearn',
    image: null,
    icon: '🧬',
    location: 'Online',
    verified: true,
    type: 'order',
    orderMessage:
      'Hello Kananelo, I am interested in Matric Biology tutoring with Easy Learn.',
    createdAt: '2026-09-10',
  },

  // ══════════════════════════════════════════════════════
  // Rorisang Mojarane — Shein Runner (icon card)
  // ══════════════════════════════════════════════════════
  {
    id: 'shein-runner',
    name: 'Shein Order Running',
    price: null,
    priceUnit: 'order',
    priceDisplay: 'Original price + 40% runner fee',
    category: 'orders',
    vendorId: 'rorisang',
    image: null,
    icon: '🛍️',
    location: 'Roma & Maseru',
    verified: true,
    type: 'order',
    orderMessage:
      'Hello Rorisang, I would like to place a Shein order with your runner service.',
    createdAt: '2026-09-21',
  },
];

export const getProductById = (id) => products.find((p) => p.id === id) || null;

export const formatPrice = (product) => {
  if (product.priceDisplay) return product.priceDisplay;
  if (product.price === 0) return 'Free';
  if (product.price === null) return 'Contact for pricing';
  return `M${product.price} / ${product.priceUnit}`;
};