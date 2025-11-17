"use client";

import Image from "next/image";
import type { Game } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/utils/format";

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const { isInCart, addItem, removeItem } = useCart();
  const inCart = isInCart(game.id);

  const handleCartToggle = () => {
    if (inCart) {
      removeItem(game.id);
    } else {
      addItem(game);
    }
  };

  return (
    <div className='p-6 rounded-3xl bg-[#FFFFFF] border-[0.5px] border-[#8F8F8F] hover:border-2 duration-200'>
      <div className='relative aspect-square w-full overflow-hidden'>
        <Image
          src={game.image}
          alt={game.name}
          fill
          className='object-cover group-hover:scale-105 transition-transform duration-200 rounded-t-2xl '
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
        {game.isNew && (
          <div className='absolute top-2 left-2 bg-[#F5F5F4] text-black text-md font-normal px-2 py-1 rounded'>
            New
          </div>
        )}
      </div>

      <div className='mt-4'>
        <p className='text-xs text-[#737373] font-bold uppercase tracking-wide mb-1'>
          {game.genre}
        </p>

        <div
          className='flex items-center justify-between mb-4 text-[#3B3B3B] text-lg
         font-bold'
        >
          <h3 className='line-clamp-1'>{game.name}</h3>
          <span className=''>{formatCurrency(game.price)}</span>
        </div>
        <button
          onClick={handleCartToggle}
          className={`w-full py-2 px-4 rounded border transition-colors duration-200 ${
            inCart
              ? "bg-gray-900 text-white border-gray-900 hover:bg-gray-800"
              : "bg-white text-gray-900 border-gray-300 hover:border-gray-900"
          }`}
          aria-label={
            inCart
              ? `Remove ${game.name} from cart`
              : `Add ${game.name} to cart`
          }
        >
          {inCart ? "Remove" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
