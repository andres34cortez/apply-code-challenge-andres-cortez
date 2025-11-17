import { Suspense } from "react";
import { getGames } from "@/lib/games";
import { CatalogContent } from "@/components/CatalogContent";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface PageProps {
  searchParams: Promise<{
    genre?: string;
    page?: string;
  }>;
}

async function CatalogPageContent({ searchParams }: PageProps) {
  const params = await searchParams;
  const genre = params.genre;
  const page = Number.parseInt(params.page || "1", 10);

  const gamesData = await getGames({ genre, page });

  return <CatalogContent initialData={gamesData} genre={genre} />;
}

export default function CatalogPage(props: PageProps) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CatalogPageContent {...props} />
    </Suspense>
  );
}
