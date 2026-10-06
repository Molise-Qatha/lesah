// src/data/services.js
// The service catalog — the primary discovery layer.
// Each service maps to one or more providers by id (see marketplaceData.js).

export const services = [
  // ── Services WITH providers ─────────────────────────────
  {
    id: 'food',
    name: 'Food & Meals',
    icon: '🍲',
    tagline: 'Home-cooked meals from student cooks',
    providerIds: ['maseeiso'],
  },
  {
    id: 'laundry',
    name: 'Laundry',
    icon: '🧺',
    tagline: 'Wash, dry and fold — pickup available',
    providerIds: ['maseeiso'],
  },
  {
    id: 'eggs',
    name: 'Eggs & Poultry',
    icon: '🥚',
    tagline: 'Fresh eggs, pullets and chickens',
    providerIds: ['thapelo'],
  },
  {
    id: 'hair',
    name: 'Hair & Beauty',
    icon: '💇',
    tagline: 'Braids, essence, knotless and more',
    providerIds: ['pontso'],
  },
  {
    id: 'tutoring',
    name: 'Tutoring',
    icon: '📚',
    tagline: 'Matric Maths, Physics and Biology',
    providerIds: ['easylearn'],
  },
  {
    id: 'shein',
    name: 'Shein Orders',
    icon: '🛍️',
    tagline: 'Order from Shein — we handle the running',
    providerIds: ['rorisang'],
  },

  // ── Services COMING SOON (no providers yet) ─────────────
  {
    id: 'accommodation',
    name: 'Accommodation',
    icon: '🏠',
    tagline: 'Student housing around campus',
    providerIds: [],
  },
  {
    id: 'printing',
    name: 'Printing',
    icon: '🖨️',
    tagline: 'Print, copy and scan',
    providerIds: [],
  },
  {
    id: 'repairs',
    name: 'Repairs',
    icon: '🔧',
    tagline: 'Phone, laptop and general repairs',
    providerIds: [],
  },
];

export const getServiceById = (id) => services.find((s) => s.id === id) || null;
export const getAvailableServices = () => services.filter((s) => s.providerIds.length > 0);