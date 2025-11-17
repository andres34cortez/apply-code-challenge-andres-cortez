import { allGames, availableFilters, delay } from "@/utils/endpoint";

const ITEMS_PER_PAGE = 12;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const genre = searchParams.get("genre");
  let page = Number.parseInt(searchParams.get("page") ?? "1", 10);

  let games = allGames;

  if (genre) {
    games = games.filter(
      (game) => game.genre.toLowerCase() === genre.toLowerCase()
    );
  }

  if (page < 1 || Number.isNaN(page)) page = 1;

  // Mock a delay to simulate a real API
  await delay(2000);

  // Calculate total pages based on filtered games (before pagination)
  const totalPages = Math.ceil(games.length / ITEMS_PER_PAGE);
  const currentPage = page;

  // Apply pagination
  const fromIndex = (page - 1) * ITEMS_PER_PAGE;
  const toIndex = page * ITEMS_PER_PAGE;
  games = games.slice(fromIndex, toIndex);

  return Response.json({ games, availableFilters, totalPages, currentPage });
}
