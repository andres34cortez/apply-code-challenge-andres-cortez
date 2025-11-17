"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

export function Header() {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <header className='w-full border-b border-gray-200 bg-[#EEEEEE]'>
      <div className='container mx-auto px-4 py-4'>
        <div className='flex items-center justify-between'>
          <Link
            href='/'
            className='text-2xl font-bold text-[#585660] hover:text-gray-700 transition-colors'
          >
            GamerShop
          </Link>

          <Link
            href='/cart'
            className='relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors'
            aria-label='Shopping cart'
          >
            <svg
              className='w-6 h-6 text-gray-900'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
              />
            </svg>
            {totalItems > 0 && (
              <span className='absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-gray-900 rounded-full'>
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
