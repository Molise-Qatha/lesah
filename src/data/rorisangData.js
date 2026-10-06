// src/data/rorisangData.js
export const rorisangData = {
  id: 'rorisang',
  name: 'Rorisang Mojarane',
  businessName: 'Shein Runner',
  education: 'NUL Alumni • Law Graduate',
  location: 'Roma & Maseru',
  bio: 'Shein runner — order anything from Shein and I will get it to you. Rathoto oa pageant King 👑.',
  profileImage: '/assets/providers/rorisang/profile.jpg',
  badge: 'LeSAH Service Provider • NUL Alumni',

  contact: {
    type: 'whatsapp',
    whatsapp: '26663048401',
    defaultMessage:
      'Hello Rorisang, I found your Shein runner service on LeSAH and would like to place an order.',
  },

  email: 'majoronerorisang@yahoo.com',
  phoneNumbers: ['+266 57278051', '+266 63048401'],

  pricingModel: {
    title: 'How pricing works',
    rules: [
      { label: 'Base rule', value: 'Original Shein price + 40% runner fee' },
      { label: 'Small order rule', value: 'M70 flat runner fee for orders below M150' },
    ],
    note: 'Confirm exact totals with Rorisang on WhatsApp before paying.',
  },

  highlights: [
    'Shein orders',
    '40% runner fee',
    'M70 flat fee on small orders',
    'Roma & Maseru delivery',
  ],
};

export default rorisangData;