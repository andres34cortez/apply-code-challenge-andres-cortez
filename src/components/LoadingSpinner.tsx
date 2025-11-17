export function LoadingSpinner() {
  return (
    <div className='flex items-center justify-center min-h-[400px]'>
      <div className='relative'>
        <div className='w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin'></div>
      </div>
    </div>
  );
}
