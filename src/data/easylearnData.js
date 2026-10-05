// src/data/easylearnData.js
export const easylearnData = {
  id: 'easylearn',
  name: "Kananelo Mats'oele",
  education: 'Engineering background • NUL',
  location: 'Online — Lesotho & South Africa',
  bio: 'Live evening lessons in Maths, Physics and Biology — combined with proven study techniques from Learning How to Learn by Barbara Oakley.',
  profileImage: '/assets/providers/easylearn/profile.jpg',
  badge: 'LeSAH Verified Partner',

  contact: {
    type: 'website',
    url: 'https://easylearn.co.ls',
    label: 'Visit Easy Learn',
  },

  services: [
    {
      id: 'maths',
      name: 'Matric Mathematics',
      icon: '∑',
      description: 'First-principles tutoring with a 94% pass rate.',
    },
    {
      id: 'physics',
      name: 'Matric Physics',
      icon: '⚛',
      description: 'Deep understanding — not just memorising formulas.',
    },
    {
      id: 'biology',
      name: 'Matric Biology',
      icon: '🧬',
      description: 'Cognitive-science backed study frameworks.',
    },
  ],

  highlights: [
    '20+ matric students',
    '3 core subjects',
    '94% pass rate',
    'Live evening Zoom classes',
  ],

  testimonial: {
    quote: 'Engineering a better way to study.',
    subtext:
      'Combining technical mastery with proven cognitive strategies so students retain more, stress less, and walk into exams with genuine confidence.',
  },
};

export default easylearnData;