import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className='w-full bg-gray-900 text-white mt-auto'>
      <div className='container mx-auto px-4 py-8'>
        <Link
          href='/'
          className='flex items-center justify-center hover:opacity-80 transition-opacity'
        >
          <Image
            src='/Logo/apply-digita-logo.svg'
            alt='Apply Digital'
            width={170}
            height={45}
            className='h-auto'
            priority
          />
        </Link>
      </div>
    </footer>
  );
}
