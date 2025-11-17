import { env } from "@/config/env";
import type { GamesResponse, UseGamesParams } from "@/types";

/**
 * Games Service
 * Handles all API calls related to games
 * Follows separation of concerns principle
 */

class GamesService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = env.apiUrl;
  }

  /**
   * Fetches games from the API with optional filters
   * @param params - Query parameters for filtering and pagination
   * @returns Promise with games response
   * @throws Error if the request fails
   */
  async getGames(params: UseGamesParams = {}): Promise<GamesResponse> {
    const { genre, page = 1 } = params;

    const searchParams = new URLSearchParams();
    if (genre) {
      searchParams.append("genre", genre);
    }
    searchParams.append("page", page.toString());

    // Use relative URL if baseUrl is empty (production without env var)
    const basePath = this.baseUrl || "";
    const url = `${basePath}/api/games?${searchParams.toString()}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", // Always fetch fresh data for client-side calls
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch games: ${response.status} ${response.statusText}`
        );
      }

      const data: GamesResponse = await response.json();
      return data;
    } catch (error) {
      // Enhanced error handling
      if (error instanceof Error) {
        throw new Error(`GamesService.getGames: ${error.message}`);
      }
      throw new Error("GamesService.getGames: Unknown error occurred");
    }
  }
}

// Export singleton instance
export const gamesService = new GamesService();

