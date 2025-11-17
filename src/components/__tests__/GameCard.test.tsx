import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GameCard } from "../GameCard";
import { CartProvider } from "@/contexts/CartContext";
import type { Game } from "@/types";

const mockGame: Game = {
  id: "1",
  name: "Test Game",
  genre: "Action",
  image: "/test.jpg",
  description: "Test description",
  price: 29.99,
  isNew: true,
};

describe("GameCard", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  );

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });
  it("should render game information", () => {
    render(<GameCard game={mockGame} />, { wrapper });

    expect(screen.getByText("Test Game")).toBeInTheDocument();
    expect(screen.getByText(/action/i)).toBeInTheDocument();
    expect(screen.getByText("$29.99")).toBeInTheDocument();
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("should not show New label when isNew is false", () => {
    const gameWithoutNew = { ...mockGame, isNew: false };
    render(<GameCard game={gameWithoutNew} />, { wrapper });

    expect(screen.queryByText("New")).not.toBeInTheDocument();
  });

  it("should show Add to Cart button when game is not in cart", () => {
    render(<GameCard game={mockGame} />, { wrapper });

    expect(
      screen.getByRole("button", { name: /add test game to cart/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /remove test game from cart/i })
    ).not.toBeInTheDocument();
  });

  it("should show Remove button when game is in cart", async () => {
    const user = userEvent.setup();
    render(<GameCard game={mockGame} />, { wrapper });

    const addButton = screen.getByRole("button", {
      name: /add test game to cart/i,
    });
    await user.click(addButton);

    expect(
      await screen.findByRole("button", { name: /remove test game from cart/i })
    ).toBeInTheDocument();
  });

  it("should add game to cart when Add to Cart is clicked", async () => {
    const user = userEvent.setup();
    render(<GameCard game={mockGame} />, { wrapper });

    const addButton = screen.getByRole("button", {
      name: /add test game to cart/i,
    });
    await user.click(addButton);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /remove test game from cart/i })
      ).toBeInTheDocument();
    });
  });

  it("should remove game from cart when Remove is clicked", async () => {
    const user = userEvent.setup();
    render(<GameCard game={mockGame} />, { wrapper });

    // Add to cart first
    const addButton = screen.getByRole("button", {
      name: /add test game to cart/i,
    });
    await user.click(addButton);

    // Wait for remove button to appear
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /remove test game from cart/i })
      ).toBeInTheDocument();
    });

    // Then remove
    const removeButton = screen.getByRole("button", {
      name: /remove test game from cart/i,
    });
    await user.click(removeButton);

    // Wait for add button to appear again
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /add test game to cart/i })
      ).toBeInTheDocument();
    });
  });

  it("should render game image with correct alt text", () => {
    render(<GameCard game={mockGame} />, { wrapper });

    const image = screen.getByAltText("Test Game");
    expect(image).toBeInTheDocument();
  });
});
