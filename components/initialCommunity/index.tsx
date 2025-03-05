import { Button } from '@heroui/react';
import React from 'react'
import { IoAddSharp } from 'react-icons/io5';
export default function InitialCommunity() {
  return (
    <div className='flex flex-col justify-center items-center gap-6'>
      <img src='/assets/initial_community.png' alt='Community' width={'40%'}/>
      <p className='text-[20px] text-black'>Welcome to IndieApp Community</p>
      <div className='w-[30%] text-center'>
        <p className='text-[16px] text-[#71717A]'>
          Community space is ready for great minds! Create your first project to
          start sharing inspiration and connecting with other creative thinkers
          in the community.
        </p>
      </div>
      <Button className='bg-black text-white'>
        <IoAddSharp size={16} /> New Project
      </Button>
    </div>
  );
}
