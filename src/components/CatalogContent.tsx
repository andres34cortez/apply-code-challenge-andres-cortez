"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GameCard } from "@/components/GameCard";
import { GenreFilter } from "@/components/GenreFilter";
import Link from "next/link";
import type { Game, GamesResponse } from "@/types";

interface CatalogContentProps {
  initialData: GamesResponse;
  genre?: string;
}

export function CatalogContent({ initialData, genre }: CatalogContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number.parseInt(searchParams.get("page") || "1", 10);

  const [allGames, setAllGames] = useState<Game[]>(initialData.games);
  const [currentPageState, setCurrentPageState] = useState(currentPage);
  const [lastGenre, setLastGenre] = useState<string | undefined>(genre);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    if (lastGenre !== genre) {
      setAllGames(initialData.games);
      setCurrentPageState(1);
      setLastGenre(genre);
    } else if (currentPageState === 1) {
      setAllGames(initialData.games);
    }
  }, [genre, lastGenre, initialData.games, currentPageState]);

  const handleSeeMore = async () => {
    const nextPage = currentPageState + 1;
    setIsLoadingMore(true);

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", nextPage.toString());
    router.push(`/?${params.toString()}`, { scroll: false });

    try {
      const response = await fetch(`/api/games?${params.toString()}`);
      const data: GamesResponse = await response.json();

      setAllGames((prev) => {
        const existingIds = new Set(prev.map((g) => g.id));
        const newGames = data.games.filter((g) => !existingIds.has(g.id));
        return [...prev, ...newGames];
      });
      setCurrentPageState(nextPage);
    } catch (error) {
      console.error("Error loading more games:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

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

            {currentPageState < initialData.totalPages && (
              <div className='flex justify-center'>
                <button
                  onClick={handleSeeMore}
                  disabled={isLoadingMore}
                  className='px-8 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isLoadingMore ? "Loading..." : "See More"}
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
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
