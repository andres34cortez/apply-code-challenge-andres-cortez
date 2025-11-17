import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  getCartFromStorage,
  saveCartToStorage,
  clearCartFromStorage,
  StorageError,
} from "../storage";

const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("storage utilities", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe("getStorageItem", () => {
    it("should retrieve an item from localStorage", () => {
      const testData = { name: "test", value: 123 };
      localStorageMock.setItem("test-key", JSON.stringify(testData));

      const result = getStorageItem<typeof testData>("test-key");
      expect(result).toEqual(testData);
    });

    it("should return null if item does not exist", () => {
      const result = getStorageItem("non-existent-key");
      expect(result).toBeNull();
    });

    it("should return null for invalid JSON", () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      localStorageMock.setItem("invalid-key", "invalid-json{");
      const result = getStorageItem("invalid-key");
      expect(result).toBeNull();

      consoleSpy.mockRestore();
    });
  });

  describe("setStorageItem", () => {
    it("should save an item to localStorage", () => {
      const testData = { name: "test", value: 123 };
      setStorageItem("test-key", testData);

      const stored = localStorageMock.getItem("test-key");
      expect(stored).toBe(JSON.stringify(testData));
    });

    it("should handle complex objects", () => {
      const complexData = {
        array: [1, 2, 3],
        nested: { key: "value" },
      };
      setStorageItem("complex-key", complexData);

      const stored = getStorageItem<typeof complexData>("complex-key");
      expect(stored).toEqual(complexData);
    });
  });

  describe("removeStorageItem", () => {
    it("should remove an item from localStorage", () => {
      localStorageMock.setItem("test-key", "test-value");
      removeStorageItem("test-key");

      expect(localStorageMock.getItem("test-key")).toBeNull();
    });

    it("should not throw if item does not exist", () => {
      expect(() => removeStorageItem("non-existent-key")).not.toThrow();
    });
  });

  describe("getCartFromStorage", () => {
    it("should retrieve cart from localStorage", () => {
      const cart = [{ id: "1", name: "Game 1", quantity: 1 }];
      localStorageMock.setItem("gamerShop_cart", JSON.stringify(cart));

      const result = getCartFromStorage<typeof cart>();
      expect(result).toEqual(cart);
    });

    it("should return null if cart does not exist", () => {
      const result = getCartFromStorage();
      expect(result).toBeNull();
    });
  });

  describe("saveCartToStorage", () => {
    it("should save cart to localStorage", () => {
      const cart = [{ id: "1", name: "Game 1", quantity: 1 }];
      saveCartToStorage(cart);

      const stored = localStorageMock.getItem("gamerShop_cart");
      expect(stored).toBe(JSON.stringify(cart));
    });
  });

  describe("clearCartFromStorage", () => {
    it("should remove cart from localStorage", () => {
      localStorageMock.setItem("gamerShop_cart", "test-data");
      clearCartFromStorage();

      expect(localStorageMock.getItem("gamerShop_cart")).toBeNull();
    });
  });
});
