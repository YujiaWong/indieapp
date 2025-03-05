import React from 'react'

export default function NoResult() {
  return (
    <div className='flex flex-col justify-center items-center gap-6'>
      <img src='/assets/no_result.png' alt='Community' width={'12%'} />
      <p className='text-[20px] text-black'>Nothing Here Yet</p>
      <div className='w-[40%] text-center'>
        <p className='text-[16px] text-[#71717A]'>
          We searched everywhere but couldn&apos;t find what you&apos;re looking for.
          Maybe try different keywords, browse other tabs or explore some
          popular topics instead?
        </p>
      </div>
    </div>
  );
}
