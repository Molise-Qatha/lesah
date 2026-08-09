export const providers = {
  maseeiso: {
    id: 'maseeiso',
    name: 'Maseeiso Thaanyane',
    education: 'NUL Alumni • Law',
    badge: 'LeSAH Service Provider',
    bio: 'Providing convenient laundry and food services to students.',
    whatsapp: '26656208144',
    profileImage: '/assets/providers/maseeiso/profile.jpg',
    services: [
      {
        id: 'laundry',
        name: 'Laundry Services',
        icon: '🧺',
        description: 'Quality laundry services for students. Save time and focus on your studies while your clothes are professionally cleaned.',
        image: '/assets/providers/maseeiso/laundry.jpg',
        whatsappMessage: 'Hello Maseeiso, I found your laundry service on LeSAH and would like to enquire about your services.',
      },
      {
        id: 'food',
        name: 'Food / Meal Services',
        icon: '🍲',
        description: 'Delicious meals prepared with care for students. Contact Maseeiso to find out what\'s available today.',
        image: '/assets/providers/maseeiso/food.jpg',
        whatsappMessage: 'Hello Maseeiso, I found your food service on LeSAH and would like to enquire about your services.',
      },
    ],
  },
};

export const openProviderWhatsApp = (whatsappNumber, message) => {
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};