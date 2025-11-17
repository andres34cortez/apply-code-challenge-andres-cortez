import { formatCurrency, formatNumber } from '../format'

describe('format utilities', () => {
  describe('formatCurrency', () => {
    it('should format a number as USD currency', () => {
      expect(formatCurrency(100)).toBe('$100.00')
      expect(formatCurrency(99.99)).toBe('$99.99')
      expect(formatCurrency(0)).toBe('$0.00')
      expect(formatCurrency(1000)).toBe('$1,000.00')
    })

    it('should format with custom currency', () => {
      expect(formatCurrency(100, 'EUR')).toBe('€100.00')
      expect(formatCurrency(100, 'GBP')).toBe('£100.00')
    })

    it('should handle decimal values correctly', () => {
      expect(formatCurrency(10.5)).toBe('$10.50')
      expect(formatCurrency(10.555)).toBe('$10.56') // rounds to 2 decimals
    })

    it('should handle negative values', () => {
      expect(formatCurrency(-100)).toBe('-$100.00')
    })
  })

  describe('formatNumber', () => {
    it('should format a number with commas', () => {
      expect(formatNumber(1000)).toBe('1,000')
      expect(formatNumber(1000000)).toBe('1,000,000')
      expect(formatNumber(123)).toBe('123')
    })

    it('should handle zero', () => {
      expect(formatNumber(0)).toBe('0')
    })

    it('should handle negative numbers', () => {
      expect(formatNumber(-1000)).toBe('-1,000')
    })
  })
})

