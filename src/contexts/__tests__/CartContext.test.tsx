import { renderHook, act, waitFor } from '@testing-library/react'
import { CartProvider, useCart } from '../CartContext'
import { getCartFromStorage, saveCartToStorage, clearCartFromStorage } from '@/utils/storage'
import type { Game } from '@/types'

jest.mock('@/utils/storage')

const mockGame1: Game = {
  id: '1',
  name: 'Test Game 1',
  genre: 'Action',
  image: '/test1.jpg',
  description: 'Test description 1',
  price: 29.99,
  isNew: true,
}

const mockGame2: Game = {
  id: '2',
  name: 'Test Game 2',
  genre: 'RPG',
  image: '/test2.jpg',
  description: 'Test description 2',
  price: 39.99,
  isNew: false,
}

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
)

describe('CartContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(getCartFromStorage as jest.Mock).mockReturnValue(null)
  })

  describe('useCart', () => {
    it('should throw error when used outside CartProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        renderHook(() => useCart())
      }).toThrow('useCart must be used within a CartProvider')

      consoleSpy.mockRestore()
    })

    it('should initialize with empty cart', async () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      await waitFor(() => {
        expect(result.current.items).toEqual([])
      })

      expect(result.current.getTotalItems()).toBe(0)
      expect(result.current.getTotalPrice()).toBe(0)
    })

    it('should load cart from localStorage on mount', async () => {
      const storedCart = [
        { ...mockGame1, quantity: 1 },
        { ...mockGame2, quantity: 2 },
      ]
      ;(getCartFromStorage as jest.Mock).mockReturnValue(storedCart)

      const { result } = renderHook(() => useCart(), { wrapper })

      await waitFor(() => {
        expect(result.current.items.length).toBe(2)
      })

      expect(result.current.items).toEqual(storedCart)
      expect(getCartFromStorage).toHaveBeenCalled()
    })
  })

  describe('addItem', () => {
    it('should add a new item to cart', async () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      await waitFor(() => {
        expect(result.current.items).toEqual([])
      })

      act(() => {
        result.current.addItem(mockGame1)
      })

      await waitFor(() => {
        expect(result.current.items).toHaveLength(1)
      })

      expect(result.current.items[0]).toEqual({
        ...mockGame1,
        quantity: 1,
      })
      expect(result.current.isInCart(mockGame1.id)).toBe(true)
      expect(saveCartToStorage).toHaveBeenCalled()
    })

    it('should increment quantity if item already exists', async () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      await waitFor(() => {
        expect(result.current.items).toEqual([])
      })

      act(() => {
        result.current.addItem(mockGame1)
      })

      await waitFor(() => {
        expect(result.current.items[0].quantity).toBe(1)
      })

      act(() => {
        result.current.addItem(mockGame1)
      })

      await waitFor(() => {
        expect(result.current.items[0].quantity).toBe(2)
      })

      expect(result.current.items).toHaveLength(1)
    })

    it('should add multiple different items', async () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      await waitFor(() => {
        expect(result.current.items).toEqual([])
      })

      act(() => {
        result.current.addItem(mockGame1)
        result.current.addItem(mockGame2)
      })

      await waitFor(() => {
        expect(result.current.items).toHaveLength(2)
      })

      expect(result.current.items[0].id).toBe(mockGame1.id)
      expect(result.current.items[1].id).toBe(mockGame2.id)
    })
  })

  describe('removeItem', () => {
    it('should remove an item from cart', async () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      await waitFor(() => {
        expect(result.current.items).toEqual([])
      })

      act(() => {
        result.current.addItem(mockGame1)
        result.current.addItem(mockGame2)
      })

      await waitFor(() => {
        expect(result.current.items).toHaveLength(2)
      })

      act(() => {
        result.current.removeItem(mockGame1.id)
      })

      await waitFor(() => {
        expect(result.current.items).toHaveLength(1)
      })

      expect(result.current.items[0].id).toBe(mockGame2.id)
      expect(result.current.isInCart(mockGame1.id)).toBe(false)
      expect(result.current.isInCart(mockGame2.id)).toBe(true)
    })

    it('should clear localStorage when cart is empty', async () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      await waitFor(() => {
        expect(result.current.items).toEqual([])
      })

      act(() => {
        result.current.addItem(mockGame1)
      })

      await waitFor(() => {
        expect(result.current.items).toHaveLength(1)
      })

      act(() => {
        result.current.removeItem(mockGame1.id)
      })

      await waitFor(() => {
        expect(result.current.items).toHaveLength(0)
      })

      expect(clearCartFromStorage).toHaveBeenCalled()
    })
  })

  describe('isInCart', () => {
    it('should return true if item is in cart', async () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      await waitFor(() => {
        expect(result.current.items).toEqual([])
      })

      act(() => {
        result.current.addItem(mockGame1)
      })

      await waitFor(() => {
        expect(result.current.isInCart(mockGame1.id)).toBe(true)
      })
    })

    it('should return false if item is not in cart', async () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      await waitFor(() => {
        expect(result.current.isInCart(mockGame1.id)).toBe(false)
      })
    })
  })

  describe('getTotalItems', () => {
    it('should return correct total quantity', async () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      await waitFor(() => {
        expect(result.current.items).toEqual([])
      })

      act(() => {
        result.current.addItem(mockGame1)
        result.current.addItem(mockGame1) // quantity = 2
        result.current.addItem(mockGame2) // quantity = 1
      })

      await waitFor(() => {
        expect(result.current.getTotalItems()).toBe(3)
      })
    })

    it('should return 0 for empty cart', async () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      await waitFor(() => {
        expect(result.current.getTotalItems()).toBe(0)
      })
    })
  })

  describe('getTotalPrice', () => {
    it('should return correct total price', async () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      await waitFor(() => {
        expect(result.current.items).toEqual([])
      })

      act(() => {
        result.current.addItem(mockGame1) // 29.99
        result.current.addItem(mockGame1) // 29.99 * 2 = 59.98
        result.current.addItem(mockGame2) // 39.99
      })

      await waitFor(() => {
        const expectedTotal = 29.99 * 2 + 39.99
        expect(result.current.getTotalPrice()).toBeCloseTo(expectedTotal, 2)
      })
    })

    it('should return 0 for empty cart', async () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      await waitFor(() => {
        expect(result.current.getTotalPrice()).toBe(0)
      })
    })
  })

  describe('clearCart', () => {
    it('should remove all items from cart', async () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      await waitFor(() => {
        expect(result.current.items).toEqual([])
      })

      act(() => {
        result.current.addItem(mockGame1)
        result.current.addItem(mockGame2)
      })

      await waitFor(() => {
        expect(result.current.items).toHaveLength(2)
      })

      act(() => {
        result.current.clearCart()
      })

      await waitFor(() => {
        expect(result.current.items).toHaveLength(0)
      })

      expect(clearCartFromStorage).toHaveBeenCalled()
    })
  })
})

