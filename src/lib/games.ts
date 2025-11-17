import { allGames, availableFilters } from "@/utils/endpoint";
import type { GamesResponse } from "@/types";

const ITEMS_PER_PAGE = 12;

export async function getGames(params: {
  genre?: string;
  page?: number;
}): Promise<GamesResponse> {
  const { genre, page = 1 } = params;

  let games = allGames;

  if (genre) {
    games = games.filter(
      (game) => game.genre.toLowerCase() === genre.toLowerCase()
    );
  }

  const currentPage = page < 1 || Number.isNaN(page) ? 1 : page;
  const totalPages = Math.ceil(games.length / ITEMS_PER_PAGE);

  const fromIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const toIndex = currentPage * ITEMS_PER_PAGE;
  const paginatedGames = games.slice(fromIndex, toIndex);

  return {
    games: paginatedGames,
    availableFilters,
    totalPages,
    currentPage,
  };
}

