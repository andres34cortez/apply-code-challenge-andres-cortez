"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGames } from "@/hooks/useGames";
import { GameCard } from "@/components/GameCard";
import { GenreFilter } from "@/components/GenreFilter";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import Link from "next/link";
import type { Game } from "@/types";

function CatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const genre = searchParams.get("genre") || undefined;
  const page = Number.parseInt(searchParams.get("page") || "1", 10);

  const [allGames, setAllGames] = useState<Game[]>([]);
  const [currentPageState, setCurrentPageState] = useState(page);
  const [lastGenre, setLastGenre] = useState<string | undefined>(genre);

  const { games, availableFilters, totalPages, currentPage, isLoading, error } =
    useGames({ genre, page: currentPageState });

  useEffect(() => {
    if (lastGenre !== genre) {
      setAllGames([]);
      setCurrentPageState(1);
      setLastGenre(genre);
    }
  }, [genre, lastGenre]);

  useEffect(() => {
    if (games.length > 0 && !isLoading) {
      if (currentPageState === 1) {
        setAllGames(games);
      } else {
        setAllGames((prev) => {
          const existingIds = new Set(prev.map((g) => g.id));
          const newGames = games.filter((g) => !existingIds.has(g.id));
          return [...prev, ...newGames];
        });
      }
    }
  }, [games, isLoading, currentPageState]);

  const handleSeeMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPageState(nextPage);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", nextPage.toString());
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            Error loading games
          </h2>
          <p className='text-gray-600 mb-4'>{error.message}</p>
          <button
            onClick={() => globalThis.location.reload()}
            className='px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-8 flex items-center justify-between'>
          <h1 className='text-3xl font-bold text-gray-900 mb-6'>
            {genre || "Top Sellers"}
          </h1>
          <div className='flex items-center justify-between flex-wrap gap-4'>
            <GenreFilter availableFilters={availableFilters} />
          </div>
        </div>

        {isLoading && <LoadingSpinner />}

        {!isLoading && allGames.length > 0 && (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-8'>
              {allGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>

            {currentPage < totalPages && (
              <div className='flex justify-center'>
                <button
                  onClick={handleSeeMore}
                  disabled={isLoading}
                  className='px-8 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isLoading ? "Loading..." : "See More"}
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && allGames.length === 0 && !error && (
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

export default function CatalogPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CatalogContent />
    </Suspense>
  );
}
