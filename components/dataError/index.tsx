import React from 'react'

export default function DataError() {
  return (
    <div className='flex flex-col justify-center items-center gap-6'>
      <img src='/assets/Data_error.png' alt='Community' width={'15%'} />
      <p className='text-[20px] text-black'>Oops, Having a Moment...</p>
      <div className='w-[35%] text-center'>
        <p className='text-[16px] text-[#71717A]'>
          We couldn&apos;t load this content, but it&apos;s just a temporary hiccup. Try
          refreshing the page – good things are worth waiting for!
        </p>
      </div>
    </div>
  );
}
