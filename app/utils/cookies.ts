// Function to get cookie value by name
// Function to get cookie value by name
export function getCookie(name: string): string | null {
  if (typeof window !== "undefined") {  // Check if running on the client
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

// Function to set cookie value
export function setCookie(name: string, value: string, days: number) {
  if (typeof window !== "undefined") {  // Check if running on the client
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }
}


// Function to store user search (Ensuring unique values & limiting to 10)
export function storeUserSearch(searchQuery: string) {
  let previousSearches: string[] = [];

  try {
    const cookieData = getCookie("user_searches");
    previousSearches = cookieData ? JSON.parse(cookieData) : [];
  } catch (e) {
    console.error("Error parsing previous searches:", e);
  }

  // Ensure uniqueness and limit to 10
  const uniqueSearches = Array.from(new Set([searchQuery, ...previousSearches])).slice(0, 10);

  setCookie("user_searches", JSON.stringify(uniqueSearches), 30);
}

// Function to store product view (Ensuring uniqueness)
export function storeProductView(productId: string) {
  let viewedProducts: string[] = [];

  try {
    const cookieData = getCookie("user_product_views");
    viewedProducts = cookieData ? JSON.parse(cookieData) : [];
  } catch (e) {
    console.error("Error parsing viewed products:", e);
  }

  // Ensure uniqueness
  const uniqueViews = Array.from(new Set([productId, ...viewedProducts])).slice(0, 20); // Limit to last 20 views

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

  // Add item without duplication (or update quantity if exists)
  const existingIndex = cartItems.findIndex((item) => item.productId === productId && item.sizeId === sizeId);
  if (existingIndex !== -1) {
    cartItems[existingIndex].quantity += quantity; // Update quantity
  } else {
    cartItems.push({ productId, sizeId, quantity });
  }

  setCookie("user_cart", JSON.stringify(cartItems), 30);
}
