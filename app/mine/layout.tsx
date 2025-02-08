'use client'
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/icons';
import SideBar from './components/SideBar';

export default function Layout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(!token || token === 'undefined') {
      router.replace('/');
    }
  }, []);

  return (
    <div className='h-screen flex flex-col'>
      <div className='w-full bg-white flex items-center justify-between py-3 px-6 sticky top-0 z-10 border-b border-gray-100'>
        <Link href='/' className='text-gray-800 flex items-center'>
          <Logo className='mr-4' size={24}/>
          <div className='text-lg font-medium'>Indieapp</div>
        </Link>
      </div>
      <div className='h-0 flex flex-1'>
        <SideBar />
        <div className='w-full h-full flex-col overflow-y-auto bg-[#f4f4f5]'>
          {children}
        </div>
      </div>
    </div>
  );
}
