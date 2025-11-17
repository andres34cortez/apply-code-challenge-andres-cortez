"use client";

import { useState, useEffect, useCallback } from "react";
import { GameCard } from "@/components/GameCard";
import { GenreFilter } from "@/components/GenreFilter";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import Link from "next/link";
import type { Game, GamesResponse } from "@/types";

interface CatalogContentProps {
  initialData: GamesResponse;
  genre?: string;
}

export function CatalogContent({ initialData, genre }: CatalogContentProps) {
  const [allGames, setAllGames] = useState<Game[]>(initialData.games);
  const [currentPageState, setCurrentPageState] = useState(
    initialData.currentPage
  );
  const [lastGenre, setLastGenre] = useState<string | undefined>(genre);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(
    currentPageState < initialData.totalPages
  );

  useEffect(() => {
    if (lastGenre !== genre) {
      setAllGames(initialData.games);
      setCurrentPageState(initialData.currentPage);
      setLastGenre(genre);
      setHasMore(initialData.currentPage < initialData.totalPages);
    }
  }, [
    genre,
    lastGenre,
    initialData.games,
    initialData.currentPage,
    initialData.totalPages,
  ]);

  const loadMoreGames = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    const nextPage = currentPageState + 1;
    setIsLoadingMore(true);

    try {
      const params = new URLSearchParams();
      if (genre) {
        params.set("genre", genre);
      }
      params.set("page", nextPage.toString());

      const response = await fetch(`/api/games?${params.toString()}`);
      const data: GamesResponse = await response.json();

      setAllGames((prev) => {
        const existingIds = new Set(prev.map((g) => g.id));
        const newGames = data.games.filter((g) => !existingIds.has(g.id));
        return [...prev, ...newGames];
      });

      setCurrentPageState(nextPage);
      setHasMore(nextPage < data.totalPages);
    } catch (error) {
      console.error("Error loading more games:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, currentPageState, genre]);

  const targetRef = useInfiniteScroll({
    onLoadMore: loadMoreGames,
    enabled: hasMore && !isLoadingMore,
  });

  return (
    <main className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-8 flex items-center justify-between'>
          <h1 className='text-3xl font-bold text-gray-900 mb-6'>
            {genre || "Top Sellers"}
          </h1>
          <div className='flex items-center justify-between flex-wrap gap-4'>
            <GenreFilter availableFilters={initialData.availableFilters} />
          </div>
        </div>

        {allGames.length > 0 && (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-8'>
              {allGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>

            {hasMore && (
              <>
                <div
                  ref={targetRef}
                  className='flex flex-col items-center justify-center py-8'
                >
                  {isLoadingMore && <LoadingSpinner />}
                </div>

                <div className='flex justify-center py-4'>
                  <button
                    onClick={loadMoreGames}
                    disabled={isLoadingMore}
                    className='px-8 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    See more
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {allGames.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-gray-600 text-lg'>No games found.</p>
            <Link
              href='/'
              className='mt-4 inline-block text-gray-900 hover:underline'
            >
              Clear filters
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
