// src/data/thapeloData.js
export const thapeloData = {
  id: 'thapelo',
  name: 'Thapelo Thoo',
  businessName: 'Gold Garden Poultry',
  education: 'NUL Student • Bachelor of Education (Year 3)',
  location: 'Roma',
  bio: 'Fresh eggs, pullets and slaughtered chickens straight from the farm. Supporting student nutrition one tray at a time.',
  profileImage: '/assets/providers/thapelo/profile.jpg',
  posterImage: '/assets/providers/thapelo/poster.jpg',
  badge: 'LeSAH Service Provider • NUL Student',

  contact: {
    type: 'whatsapp',
    whatsapp: '26662572519',
    defaultMessage:
      'Hello Thapelo, I found Gold Garden Poultry on LeSAH and would like to place an order.',
  },

  currency: 'M',

  priceList: [
    { label: 'Tsuonyana (chicks, 7–14 days old)', amount: 30 },
    { label: 'Fertilized Egg Tray', amount: 150 },
    { label: 'Unfertilized Egg Tray', amount: 120 },
    { label: 'Point-of-Lay Pullet Chicken', amount: 350 },
    { label: 'Slaughtered Chicken', amount: 120 },
  ],

  gallery: [
    { src: '/assets/providers/thapelo/gallery-01.jpg', alt: 'Free-range chickens in the yard' },
    { src: '/assets/providers/thapelo/gallery-02.jpg', alt: 'Fresh egg tray' },
    { src: '/assets/providers/thapelo/gallery-03.jpg', alt: 'Hen on roost' },
    { src: '/assets/providers/thapelo/gallery-04.jpg', alt: 'Chicken coop' },
  ],
};

export default thapeloData;