"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface GenreFilterProps {
  availableFilters: string[];
}

/**
 * Genre Filter Component
 * Handles genre filtering via URL parameters
 */
export function GenreFilter({ availableFilters }: GenreFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentGenre = searchParams.get("genre") || "All";

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const genre = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (genre === "All") {
      params.delete("genre");
    } else {
      params.set("genre", genre);
    }

    params.delete("page");

    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="genre-filter" className="text-sm font-medium text-gray-700">
        Genre:
      </label>
      <select
        id="genre-filter"
        value={currentGenre}
        onChange={handleGenreChange}
        className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
      >
        <option value="All">All</option>
        {availableFilters.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
    </div>
  );
}

