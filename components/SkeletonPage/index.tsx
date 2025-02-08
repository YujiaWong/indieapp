import React, { memo } from 'react';
import { Skeleton, Card } from '@nextui-org/react';

export default memo(() => {
  return (
    <Card className='w-4/5 rounded-lg'>
      <div className='w-full p-5'>
        <Skeleton className='w-full h-[260px] mb-4 rounded-lg' />
        <div className='flex flex-row item-center'>
          <div className='flex-1 items-center mr-10'>
            <Skeleton className='w-3/5 h-[20px] rounded-lg mb-2' />
            <Skeleton className='w-full h-[20px] rounded-lg' />
          </div>
          <Skeleton className='flex-1 h-[50px] rounded-[50px]' />
        </div>
      </div>

      <Skeleton className='w-full h-1' />
    
      <div className='w-full p-5'>
        <div className='flex flex-row item-center'>
          <div className='flex-1 items-center mr-10'>
            <Skeleton className='w-full h-[30px] rounded-lg rounded-[50px]' />
            <Skeleton className='w-full h-[30px] rounded-lg my-3 rounded-[50px]' />
            <Skeleton className='w-full h-[30px] rounded-lg rounded-[50px]' />
          </div>
          <div className='flex-1 h-[50px] rounded-[50px]'>
            <Skeleton className='w-full h-[30px] rounded-lg rounded-[50px]' />
            <Skeleton className='w-full h-[30px] rounded-lg my-3 rounded-[50px]' />
            <Skeleton className='w-full h-[30px] rounded-lg rounded-[50px]' />
          </div>
        </div>
      </div>

      <Skeleton className='w-full h-1' />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-4 space-y-4">
          {/* 卡片图片 */}
          <Skeleton className="w-full h-48 rounded-lg" />

          {/* 卡片标题 */}
          <Skeleton className="w-3/4 h-6" />

          {/* 卡片描述 */}
          <Skeleton className="w-full h-4" />

          {/* 卡片底部区域 */}
          <div className="flex justify-between items-center">
            <Skeleton className="w-1/3 h-6" />
            <Skeleton className="w-1/2 h-8 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  </Card>
)});