export interface Game {
  id: string;
  genre: string;
  image: string;
  name: string;
  description: string;
  price: number;
  isNew: boolean;
}

export interface GamesResponse {
  games: Game[];
  availableFilters: string[];
  totalPages: number;
  currentPage: number;
}

export interface CartItem extends Game {
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (game: Game) => void;
  removeItem: (gameId: string) => void;
  isInCart: (gameId: string) => boolean;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  clearCart: () => void;
}

export interface UseGamesParams {
  genre?: string;
  page?: number;
}

export interface UseGamesReturn {
  games: Game[];
  availableFilters: string[];
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

