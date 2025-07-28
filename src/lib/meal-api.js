const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export const mealApi = {
  // Search meals by name
  searchByName: async (name) => {
    try {
      const response = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(name)}`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("Error searching meals by name:", error);
      return [];
    }
  },

  // Search meals by ingredient
  searchByIngredient: async (ingredient) => {
    try {
      const response = await fetch(`${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("Error searching meals by ingredient:", error);
      return [];
    }
  },

  // Get meal details by ID
  getMealById: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
      const data = await response.json();
      return data.meals?.[0] || null;
    } catch (error) {
      console.error("Error getting meal by ID:", error);
      return null;
    }
  },

  // Get random meal
  getRandomMeal: async () => {
    try {
      const response = await fetch(`${BASE_URL}/random.php`);
      const data = await response.json();
      return data.meals?.[0] || null;
    } catch (error) {
      console.error("Error getting random meal:", error);
      return null;
    }
  },

  // Get all categories
  getCategories: async () => {
    try {
      const response = await fetch(`${BASE_URL}/categories.php`);
      const data = await response.json();
      return data.categories || [];
    } catch (error) {
      console.error("Error getting categories:", error);
      return [];
    }
  },

  // Filter meals by category
  filterByCategory: async (category) => {
    try {
      const response = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("Error filtering meals by category:", error);
      return [];
    }
  },

  // Filter meals by area
  filterByArea: async (area) => {
    try {
      const response = await fetch(`${BASE_URL}/filter.php?a=${encodeURIComponent(area)}`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("Error filtering meals by area:", error);
      return [];
    }
  },

  // Get all areas/countries
  getAreas: async () => {
    try {
      const response = await fetch(`${BASE_URL}/list.php?a=list`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("Error getting areas:", error);
      return [];
    }
  },

  // Get all ingredients
  getIngredients: async () => {
    try {
      const response = await fetch(`${BASE_URL}/list.php?i=list`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("Error getting ingredients:", error);
      return [];
    }
  },
};
