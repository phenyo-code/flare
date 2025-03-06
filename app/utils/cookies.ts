// utils/cookies.ts

// Function to get cookie value by name
export function getCookie(name: string): string | null {
  if (typeof window !== "undefined") { // Check if running on the client
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

// Function to set cookie value
export function setCookie(name: string, value: string, days: number) {
  if (typeof window !== "undefined") { // Check if running on the client
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }
}

// Function to store user search with timestamp (limiting to 10)
export function storeUserSearch(searchQuery: string) {
  let previousSearches: { query: string; timestamp: number }[] = [];

  try {
    const cookieData = getCookie("user_searches");
    previousSearches = cookieData ? JSON.parse(cookieData) : [];
  } catch (e) {
    console.error("Error parsing previous searches:", e);
  }

  const newSearch = { query: searchQuery.toLowerCase(), timestamp: Date.now() };
  const uniqueSearches = [
    newSearch,
    ...previousSearches.filter((s) => s.query !== newSearch.query),
  ].slice(0, 10);
  setCookie("user_searches", JSON.stringify(uniqueSearches), 30);
}

// Function to store product view with timestamp (limiting to 20)
export function storeProductView(filter: string) {
  let viewedProducts: { filter: string; timestamp: number }[] = [];

  try {
    const cookieData = getCookie("user_product_views");
    viewedProducts = cookieData ? JSON.parse(cookieData) : [];
  } catch (e) {
    console.error("Error parsing viewed products:", e);
  }

  const newView = { filter: filter.toLowerCase(), timestamp: Date.now() };
  const uniqueViews = [newView, ...viewedProducts.filter((v) => v.filter !== newView.filter)].slice(0, 20);
  setCookie("user_product_views", JSON.stringify(uniqueViews), 30);
}

// Function to store cart item
export function storeCartItem(productId: string, sizeId: string, quantity: number) {
  let cartItems: { productId: string; sizeId: string; quantity: number }[] = [];

  try {
    const cookieData = getCookie("user_cart");
    cartItems = cookieData ? JSON.parse(cookieData) : [];
  } catch (e) {
    console.error("Error parsing cart items:", e);
  }

  const existingIndex = cartItems.findIndex((item) => item.productId === productId && item.sizeId === sizeId);
  if (existingIndex !== -1) {
    cartItems[existingIndex].quantity += quantity;
  } else {
    cartItems.push({ productId, sizeId, quantity });
  }

  setCookie("user_cart", JSON.stringify(cartItems), 30);
}

// Function to store user interaction
export function storeUserInteraction() {
  setCookie("user_interaction", "true", 30);
}

// Function to store category view with timestamp (tracking frequency and recency)
export function storeCategoryView(category: string) {
  let viewedCategories: { category: string; timestamp: number }[] = [];

  try {
    const cookieData = getCookie("user_category_views");
    viewedCategories = cookieData ? JSON.parse(cookieData) : [];
  } catch (e) {
    console.error("Error parsing viewed categories:", e);
  }

  const newView = { category: category.toUpperCase(), timestamp: Date.now() };
  viewedCategories = [newView, ...viewedCategories.filter((v) => v.category !== newView.category)].slice(0, 20);
  setCookie("user_category_views", JSON.stringify(viewedCategories), 30);
}

// Function to infer gender based on category views
export function inferGenderFromCategoryViews(): "WOMEN" | "MEN" | "UNKNOWN" {
  let viewedCategories: { category: string; timestamp: number }[] = [];

  try {
    const cookieData = getCookie("user_category_views");
    viewedCategories = cookieData ? JSON.parse(cookieData) : [];
  } catch (e) {
    console.error("Error parsing viewed categories for gender inference:", e);
    return "UNKNOWN";
  }

  if (viewedCategories.length === 0) {
    return "UNKNOWN";
  }

  const categoryCounts = viewedCategories.reduce(
    (acc: { WOMEN: number; MEN: number }, view) => {
      if (view.category === "WOMEN") acc.WOMEN += 1;
      if (view.category === "MEN") acc.MEN += 1;
      return acc;
    },
    { WOMEN: 0, MEN: 0 }
  );

  return categoryCounts.WOMEN > categoryCounts.MEN ? "WOMEN" : categoryCounts.MEN > categoryCounts.WOMEN ? "MEN" : "UNKNOWN";
}