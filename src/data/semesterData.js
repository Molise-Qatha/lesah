export const playerData = {
  name: "Molise Qatha",
  avatar: "/images/avatar.png",          // replace with actual avatar path
  faculty: "BSc Computer Science",
  week: 3,
  day: "Monday",
  semesterProgress: 25,
};

export const stats = [
  { id: "knowledge", label: "Knowledge", value: 62, icon: "📚" },
  { id: "money", label: "Money", value: 48, icon: "💰" },
  { id: "health", label: "Health", value: 75, icon: "❤️" },
  { id: "energy", label: "Energy", value: 40, icon: "⚡" },
  { id: "happiness", label: "Happiness", value: 55, icon: "😊" },
];

export const actions = [
  { id: "library", title: "📚 Go to Library", desc: "Study for exams" },
  { id: "class", title: "🏫 Attend Class", desc: "Gain knowledge" },
  { id: "sidehustle", title: "💼 Side Hustle", desc: "Earn extra cash" },
  { id: "group", title: "👥 Study Group", desc: "Learn with friends" },
  { id: "rest", title: "😴 Rest", desc: "Recharge energy" },
  { id: "cook", title: "🍲 Cook", desc: "Save money, eat well" },
  { id: "read", title: "📖 Read a Book", desc: "Improve yourself" },
  { id: "exercise", title: "🏃 Exercise", desc: "Stay healthy" },
  { id: "relax", title: "🎮 Relax", desc: "Boost happiness" },
];

export const moneyTips = [
  "Preparing your own meals can save more than M600 each month.",
  "Buying second‑hand books can cut costs by half.",
  "Walking instead of using taxis saves money and keeps you fit.",
  "Share accommodation to split rent and utilities.",
  "Use the library for free internet and study resources.",
];

export const randomEvent = {
  title: "Rent is due today!",
  description: "You need M500 to pay your rent. What will you do?",
  options: [
    { id: "pay", label: "Pay M500", cost: 500 },
    { id: "ask", label: "Ask for More Time" },
    { id: "call", label: "Call Home" },
    { id: "find", label: "Find another room on LeSAH" },
  ],
};