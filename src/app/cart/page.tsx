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
          {/* Cart Items */}
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-lg shadow-sm p-6'>
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                Your Cart
              </h2>
              <p className='text-gray-600 mb-6'>{totalItems} items</p>

              <div className='space-y-6'>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className='flex gap-4 pb-6 border-b border-gray-200 last:border-0'
                  >
                    {/* Image */}
                    <div className='relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden'>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className='object-cover'
                        sizes='96px'
                      />
                      {item.isNew && (
                        <div className='absolute top-1 left-1 bg-gray-900 text-white text-xs font-semibold px-1.5 py-0.5 rounded'>
                          New
                        </div>
                      )}
                    </div>

                    {/* Details */}
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
                      <div className='flex items-center justify-between'>
                        <span className='text-lg font-semibold text-gray-900'>
                          {formatCurrency(item.price)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className='text-gray-400 hover:text-gray-900 transition-colors'
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg shadow-sm p-6 sticky top-4'>
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>
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

              <button
                className='w-full py-3 px-4 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors font-semibold'
                aria-label='Proceed to checkout'
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
