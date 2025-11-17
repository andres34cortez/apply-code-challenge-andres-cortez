"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import type { CartItem, CartContextType, Game } from "@/types";
import {
  getCartFromStorage,
  saveCartToStorage,
  clearCartFromStorage,
} from "@/utils/storage";

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: React.ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedCart = getCartFromStorage<CartItem[]>();
    if (storedCart && storedCart.length > 0) {
      setItems(storedCart);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    if (items.length === 0) {
      clearCartFromStorage();
    } else {
      saveCartToStorage<CartItem[]>(items);
    }
  }, [items, isInitialized]);

  const addItem = useCallback((game: Game) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === game.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === game.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...prevItems, { ...game, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((gameId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== gameId));
  }, []);

  const isInCart = useCallback(
    (gameId: string): boolean => {
      return items.some((item) => item.id === gameId);
    },
    [items]
  );

  const getTotalItems = useCallback((): number => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const getTotalPrice = useCallback((): number => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const value: CartContextType = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      isInCart,
      getTotalItems,
      getTotalPrice,
      clearCart,
    }),
    [
      items,
      addItem,
      removeItem,
      isInCart,
      getTotalItems,
      getTotalPrice,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
