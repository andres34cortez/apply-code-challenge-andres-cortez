/**
 * LocalStorage utilities
 * Provides type-safe localStorage operations with error handling
 */

const STORAGE_KEYS = {
  CART: "gamerShop_cart",
} as const;

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StorageError";
  }
}

/**
 * Safely get item from localStorage
 */
export function getStorageItem<T>(key: string): T | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const item = window.localStorage.getItem(key);
    if (!item) {
      return null;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return null;
  }
}

/**
 * Safely set item to localStorage
 */
export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
    throw new StorageError(`Failed to save to localStorage: ${key}`);
  }
}

/**
 * Safely remove item from localStorage
 */
export function removeStorageItem(key: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
  }
}

/**
 * Get cart from localStorage
 */
export function getCartFromStorage<T>() {
  return getStorageItem<T>(STORAGE_KEYS.CART);
}

/**
 * Save cart to localStorage
 */
export function saveCartToStorage<T>(items: T): void {
  setStorageItem(STORAGE_KEYS.CART, items);
}

/**
 * Clear cart from localStorage
 */
export function clearCartFromStorage(): void {
  removeStorageItem(STORAGE_KEYS.CART);
}

