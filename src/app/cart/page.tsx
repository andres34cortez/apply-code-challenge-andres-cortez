"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/utils/format";

export default function CartPage() {
  const { items, removeItem, getTotalItems, getTotalPrice } = useCart();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  if (items.length === 0) {
    return (
      <main className='min-h-screen'>
        <div className='container mx-auto px-4 py-8'>
          <div className='text-center py-12'>
            <h1 className='text-3xl font-bold text-gray-900 mb-4'>
              Your Cart is Empty
            </h1>
            <p className='text-gray-600 mb-6'>
              Add some games to your cart to get started!
            </p>
            <Link
              href='/'
              className='inline-block px-6 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors'
            >
              Browse Games
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-8'>
        <Link
          href='/'
          className='inline-flex items-center text-gray-600 hover:text-gray-900 mb-6'
        >
          <svg
            className='w-5 h-5 mr-2'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 19l-7-7 7-7'
            />
          </svg>
          Back to Catalog
        </Link>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-lg  p-6'>
              <h2 className='text-2xl font-bold text-[#3B3B3B] mb-2'>
                Your Cart
              </h2>
              <p className='text-gray-600 text-xl font-normal mb-6'>
                {totalItems} items
              </p>

              <div className='space-y-6'>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className='flex flex-col gap-4 pb-6 border-b border-gray-200 last:border-0'
                  >
                  
                    <div className='flex flex-col md:flex-row md:items-start gap-3 md:gap-4'>
                      
                      <div className='flex items-start gap-3 md:gap-4 flex-shrink-0'>
                        <div className='relative w-2xl h-24 md:w-48 md:h-32 rounded overflow-hidden'>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className='object-cover'
                            sizes='(max-width: 768px) 128px, 192px'
                          />
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.id)}
                          className='text-gray-400 hover:text-gray-900 transition-colors mt-2 md:hidden'
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <svg
                            className='w-6 h-6'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M6 18L18 6M6 6l12 12'
                            />
                          </svg>
                        </button>
                      </div>

                      <div className='flex-1 min-w-0'>
                        <p className='text-xs text-gray-500 uppercase tracking-wide mb-1'>
                          {item.genre}
                        </p>
                        <h3 className='text-lg font-semibold text-gray-900 mb-1'>
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className='text-sm text-gray-600 mb-2 line-clamp-2'>
                            {item.description}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className='hidden md:flex text-gray-400 hover:text-gray-900 transition-colors flex-shrink-0'
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <svg
                          className='w-6 h-6'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M6 18L18 6M6 6l12 12'
                          />
                        </svg>
                      </button>
                    </div>

                    <div className='flex items-start justify-end md:justify-end w-full'>
                      <span className='text-lg font-semibold text-gray-900 whitespace-nowrap'>
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          
          <div className='lg:col-span-1  rounded-lg h-fit self-start'>
            <div className=' border-[0.5px] p-4 mb-5 border-[#8F8F8F] rounded-lg top-4'>

              <h2 className='text-xl font-bold text-[#3B3B3B] mb-2  '>
                Order Summary
              </h2>
              <p className='text-gray-600 mb-6'>{totalItems} items</p>

              <div className='space-y-4 mb-6'>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className='flex justify-between text-sm text-gray-600'
                  >
                    <span className='truncate mr-2'>{item.name}</span>
                    <span className='flex-shrink-0'>
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className='border-t border-gray-200 pt-4 mb-6'>
                <div className='flex justify-between items-center'>
                  <span className='text-lg font-bold text-gray-900'>
                    Order Total
                  </span>
                  <span className='text-lg font-bold text-gray-900'>
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>
</div>
              <button
                className='w-full py-2 px-4 bg-[#585660] text-white  text-[16px] rounded-lg hover:bg-gray-800 transition-colors font-semibold'
                aria-label='Proceed to checkout'
              >
                Checkout
              </button>
            
          </div>
        </div>
      </div>
    </main>
  );
}
