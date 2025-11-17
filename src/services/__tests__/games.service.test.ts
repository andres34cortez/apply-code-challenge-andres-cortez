import { gamesService } from '../games.service'
import type { GamesResponse } from '@/types'

global.fetch = jest.fn()

describe('GamesService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000'
  })

  describe('getGames', () => {
    const mockGamesResponse: GamesResponse = {
      games: [
        {
          id: '1',
          name: 'Test Game',
          genre: 'Action',
          image: '/test.jpg',
          description: 'Test description',
          price: 29.99,
          isNew: true,
        },
      ],
      availableFilters: ['Action', 'RPG'],
      totalPages: 1,
      currentPage: 1,
    }

    it('should fetch games without filters', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockGamesResponse,
      })

      const result = await gamesService.getGames()

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/games?page=1',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      )
      expect(result).toEqual(mockGamesResponse)
    })

    it('should fetch games with genre filter', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockGamesResponse,
      })

      const result = await gamesService.getGames({ genre: 'Action' })

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/games?genre=Action&page=1',
        expect.any(Object)
      )
      expect(result).toEqual(mockGamesResponse)
    })

    it('should fetch games with page parameter', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockGamesResponse,
      })

      const result = await gamesService.getGames({ page: 2 })

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/games?page=2',
        expect.any(Object)
      )
      expect(result).toEqual(mockGamesResponse)
    })

    it('should fetch games with both genre and page', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockGamesResponse,
      })

      const result = await gamesService.getGames({ genre: 'RPG', page: 2 })

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/games?genre=RPG&page=2',
        expect.any(Object)
      )
      expect(result).toEqual(mockGamesResponse)
    })

    it('should throw error when fetch fails', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      await expect(gamesService.getGames()).rejects.toThrow(
        'Failed to fetch games: 500 Internal Server Error'
      )
    })

    it('should throw error when network fails', async () => {
      ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      await expect(gamesService.getGames()).rejects.toThrow(
        'GamesService.getGames: Network error'
      )
    })

    it('should use relative URL when apiUrl is empty', async () => {
      // Temporarily override the service's baseUrl
      const originalEnv = process.env.NEXT_PUBLIC_API_URL
      delete process.env.NEXT_PUBLIC_API_URL

      // Re-import to get new instance with updated env
      jest.resetModules()
      const { gamesService: newService } = require('../games.service')

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockGamesResponse,
      })

      await newService.getGames()

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/games'),
        expect.any(Object)
      )

      process.env.NEXT_PUBLIC_API_URL = originalEnv
    })
  })
})

