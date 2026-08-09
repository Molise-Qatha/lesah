export const maseeisoData = {
  name: "Maseeiso Thaanyane",
  education: "NUL Alumni • LLB Graduate",
  location: "Roma",
  whatsapp: "26656208144",
  bio: "Student-focused food and laundry services in Roma.",
  profileImage: "/assets/providers/maseeiso/profile.jpg",
  
  food: {
    images: [
      { src: "/images/maseeiso/food/meal-1.jpg", alt: "Meal 1" },
      { src: "/images/maseeiso/food/meal-2.jpg", alt: "Meal 2" },
      { src: "/images/maseeiso/food/meal-3.jpg", alt: "Meal 3" },
      { src: "/images/maseeiso/food/meal-4.jpg", alt: "Meal 4" },
      { src: "/images/maseeiso/food/meal-5.jpg", alt: "Meal 5" },
    ],
    menuImage: "/images/maseeiso/food/food-menu.jpg",
    weeklyMenu: [
      { day: "MONDAY", meal: "Papa + Minced Meat" },
      { day: "TUESDAY", meal: "Fried Rice + Chicken" },
      { day: "WEDNESDAY", meal: "Rice + Chicken Strips" },
      { day: "THURSDAY", meal: "Papa + Wors" },
      { day: "FRIDAY", meal: "Papa + Chakalaka + Pork" },
    ],
    mealPlans: [
      { weeks: 1, meals: 5, price: 250 },
      { weeks: 2, meals: 10, price: 450 },
      { weeks: 3, meals: 15, price: 555 },
      { weeks: 4, meals: 20, price: 650 },
    ],
  },

  laundry: {
    images: [
      { src: "/images/maseeiso/laundry/laundry-1.jpg", alt: "Laundry service 1" },
      { src: "/images/maseeiso/laundry/laundry-2.jpg", alt: "Laundry service 2" },
      { src: "/images/maseeiso/laundry/laundry-3.jpg", alt: "Laundry service 3" },
      { src: "/images/maseeiso/laundry/laundry-4.jpg", alt: "Laundry service 4" },
    ],
    menuImage: "/images/maseeiso/laundry/laundry-menu.jpg",
    prices: [
      { size: "Small Basket", price: 60 },
      { size: "Medium Basket", price: 80 },
      { size: "Large Basket", price: 120 },
    ],
    monthlyPackages: [
      { size: "Small Basket", price: 220 },
      { size: "Medium Basket", price: 300 },
      { size: "Large Basket", price: 410 },
    ],
    included: ["Wash", "Dry", "Fold", "Fresh & clean results"],
  },
};