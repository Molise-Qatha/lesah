// Featured providers shown in the Marketplace discovery layer
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
  // Add Thapelo when ready:
  // {
  //   id: 'thapelo',
  //   name: 'Thapelo Thoo',
  //   category: 'Groceries',
  //   status: 'NUL Student',
  //   course: 'BSc',
  //   location: 'Roma',
  //   image: '/assets/providers/thapelo/profile.jpg',
  //   profileUrl: '/provider/thapelo',
  //   services: ['Eggs', 'Groceries'],
  //   featured: false,
  // },
];

// Food discovery items
export const foodItems = [
  {
    name: 'Papa + Minced Meat',
    price: 'M60',
    provider: 'Maseeiso Thaanyane',
    providerId: 'maseeiso',
    image: '/images/maseeiso/food/1.png',
    profileUrl: '/provider/maseeiso',
  },
  {
    name: 'Fried Rice + Chicken',
    price: 'M60',
    provider: 'Maseeiso Thaanyane',
    providerId: 'maseeiso',
    image: '/images/maseeiso/food/2.png',
    profileUrl: '/provider/maseeiso',
  },
  {
    name: 'Rice + Chicken Strips',
    price: 'M60',
    provider: 'Maseeiso Thaanyane',
    providerId: 'maseeiso',
    image: '/images/maseeiso/food/3.png',
    profileUrl: '/provider/maseeiso',
  },
  {
    name: 'Papa + Wors',
    price: 'M60',
    provider: 'Maseeiso Thaanyane',
    providerId: 'maseeiso',
    image: '/images/maseeiso/food/4.png',
    profileUrl: '/provider/maseeiso',
  },
  {
    name: 'Papa + Chakalaka + Pork',
    price: 'M60',
    provider: 'Maseeiso Thaanyane',
    providerId: 'maseeiso',
    image: '/images/maseeiso/food/5.png',
    profileUrl: '/provider/maseeiso',
  },
];

// Categories for the horizontal scroller
export const categories = [
  { id: 'all', icon: '🏪', label: 'All' },
  { id: 'food', icon: '🍲', label: 'Food' },
  { id: 'laundry', icon: '🧺', label: 'Laundry' },
  { id: 'groceries', icon: '🥚', label: 'Groceries' },
  { id: 'beauty', icon: '💇', label: 'Hair & Beauty' },
  { id: 'accommodation', icon: '🏠', label: 'Accommodation' },
  { id: 'delivery', icon: '🚚', label: 'Delivery' },
  { id: 'digital', icon: '💻', label: 'Digital Services' },
];

// Services around you
export const servicesList = [
  { id: 'laundry', icon: '🧺', label: 'Laundry', hasProviders: true },
  { id: 'haircuts', icon: '💇', label: 'Haircuts', hasProviders: false },
  { id: 'delivery', icon: '🚚', label: 'Delivery', hasProviders: false },
  { id: 'printing', icon: '🖨️', label: 'Printing', hasProviders: false },
  { id: 'tutoring', icon: '📚', label: 'Tutoring', hasProviders: false },
  { id: 'repairs', icon: '🔧', label: 'Repairs', hasProviders: false },
  { id: 'digital', icon: '💻', label: 'Digital Services', hasProviders: false },
];