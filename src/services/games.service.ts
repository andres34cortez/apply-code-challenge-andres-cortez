import { env } from "@/config/env";
import type { GamesResponse, UseGamesParams } from "@/types";

class GamesService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = env.apiUrl;
  }

  async getGames(params: UseGamesParams = {}): Promise<GamesResponse> {
    const { genre, page = 1 } = params;

    const searchParams = new URLSearchParams();
    if (genre) {
      searchParams.append("genre", genre);
    }
    searchParams.append("page", page.toString());

    const basePath = this.baseUrl || "";
    const url = `${basePath}/api/games?${searchParams.toString()}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch games: ${response.status} ${response.statusText}`
        );
      }

      const data: GamesResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`GamesService.getGames: ${error.message}`);
      }
      throw new Error("GamesService.getGames: Unknown error occurred");
    }
  }
}

// Export singleton instance
export const gamesService = new GamesService();

