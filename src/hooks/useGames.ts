"use client";

import { useState, useEffect, useCallback } from "react";
import { gamesService } from "@/services/games.service";
import type { UseGamesParams, UseGamesReturn } from "@/types";

export function useGames(params: UseGamesParams = {}): UseGamesReturn {
  const [games, setGames] = useState<UseGamesReturn["games"]>([]);
  const [availableFilters, setAvailableFilters] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchGames = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await gamesService.getGames(params);
      setGames(response.games);
      setAvailableFilters(response.availableFilters);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      console.error("Error fetching games:", error);
    } finally {
      setIsLoading(false);
    }
  }, [params.genre, params.page]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  return {
    games,
    availableFilters,
    totalPages,
    currentPage,
    isLoading,
    error,
    refetch: fetchGames,
  };
}

