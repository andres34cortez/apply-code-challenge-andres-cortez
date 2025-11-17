import { renderHook, waitFor, act } from "@testing-library/react";
import { useGames } from "../useGames";
import { gamesService } from "@/services/games.service";
import type { GamesResponse } from "@/types";

jest.mock("@/services/games.service");

describe("useGames", () => {
  const mockGamesResponse: GamesResponse = {
    games: [
      {
        id: "1",
        name: "Test Game 1",
        genre: "Action",
        image: "/test1.jpg",
        description: "Test description 1",
        price: 29.99,
        isNew: true,
      },
      {
        id: "2",
        name: "Test Game 2",
        genre: "RPG",
        image: "/test2.jpg",
        description: "Test description 2",
        price: 39.99,
        isNew: false,
      },
    ],
    availableFilters: ["Action", "RPG"],
    totalPages: 2,
    currentPage: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch games on mount", async () => {
    (gamesService.getGames as jest.Mock).mockResolvedValueOnce(
      mockGamesResponse
    );

    const { result } = renderHook(() => useGames());

    expect(result.current.isLoading).toBe(true);
    expect(gamesService.getGames).toHaveBeenCalledWith({});

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.games).toEqual(mockGamesResponse.games);
    expect(result.current.availableFilters).toEqual(
      mockGamesResponse.availableFilters
    );
    expect(result.current.totalPages).toBe(mockGamesResponse.totalPages);
    expect(result.current.currentPage).toBe(mockGamesResponse.currentPage);
  });

  it("should fetch games with genre filter", async () => {
    (gamesService.getGames as jest.Mock).mockResolvedValueOnce(
      mockGamesResponse
    );

    const { result } = renderHook(() => useGames({ genre: "Action" }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(gamesService.getGames).toHaveBeenCalledWith({ genre: "Action" });
  });

  it("should fetch games with page parameter", async () => {
    (gamesService.getGames as jest.Mock).mockResolvedValueOnce(
      mockGamesResponse
    );

    const { result } = renderHook(() => useGames({ page: 2 }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(gamesService.getGames).toHaveBeenCalledWith({ page: 2 });
  });

  it("should handle errors", async () => {
    const error = new Error("Failed to fetch");
    (gamesService.getGames as jest.Mock).mockRejectedValueOnce(error);

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { result } = renderHook(() => useGames());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toEqual(error);
    expect(result.current.games).toEqual([]);

    consoleSpy.mockRestore();
  });

  it("should refetch games when refetch is called", async () => {
    (gamesService.getGames as jest.Mock).mockResolvedValue(mockGamesResponse);

    const { result } = renderHook(() => useGames());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(gamesService.getGames).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(gamesService.getGames).toHaveBeenCalledTimes(2);
  });

  it("should update when params change", async () => {
    (gamesService.getGames as jest.Mock).mockResolvedValue(mockGamesResponse);

    const { result, rerender } = renderHook(
      ({ genre }) => useGames({ genre }),
      {
        initialProps: { genre: undefined as string | undefined },
      }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(gamesService.getGames).toHaveBeenCalledWith({});

    rerender({ genre: "Action" });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(gamesService.getGames).toHaveBeenCalledWith({ genre: "Action" });
  });
});
