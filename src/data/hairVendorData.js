// src/data/hairVendorData.js
export const hairVendorData = {
  id: 'pontso',
  name: "Pont'so Mary Mokonyana",
  education: 'NUL Alumni • LLB Graduate',
  location: 'Roma',
  bio: 'Student-friendly hair styling — Essence, braids, knotless, bohemian, French curls and more. Message on WhatsApp to book.',
  profileImage: '/assets/providers/pontso/profile.jpg',
  badge: 'LeSAH Service Provider • NUL Alumni',

  contact: {
    type: 'whatsapp',
    whatsapp: '26651439005',
    defaultMessage:
      "Hello Pont'so, I found your hair services on LeSAH and would like to book.",
  },

  currency: 'M',
  currencyNote: 'LSL and ZAR accepted at par',

  priceList: [
    {
      category: 'Essence',
      items: [
        { label: 'Backline', amount: 100 },
        { label: 'Puff', amount: 140 },
        { label: 'Extended Essence', amount: 140 },
        { label: 'Extended Essence (Long)', amount: 180 },
      ],
    },
    {
      category: 'Braiding',
      items: [
        { label: 'Backline', amount: 200 },
        { label: 'Puff', amount: 250 },
      ],
    },
    {
      category: 'Knotless Braids',
      items: [{ label: 'Standard', amount: 250 }],
    },
    {
      category: 'Bohemian Braids',
      items: [{ label: 'Standard', amount: 280 }],
    },
    {
      category: 'Short Curly Knotless',
      items: [{ label: 'Standard', amount: 220 }],
    },
    {
      category: 'Short Curly Boho',
      items: [{ label: 'Standard', amount: 250 }],
    },
    {
      category: 'Fulani Braids',
      items: [
        { label: 'Standard', amount: 280 },
        { label: 'With Beads', amount: 300 },
      ],
    },
    {
      category: 'French Curls',
      items: [
        { label: 'Standard', amount: 250 },
        { label: 'Long', amount: 280 },
      ],
    },
  ],
};

export default hairVendorData;