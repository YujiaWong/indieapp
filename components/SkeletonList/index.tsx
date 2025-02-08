import { Card, Skeleton } from '@nextui-org/react';
const dataSource = new Array(20).fill(1);

/**
 * 通用 loading 组件，适合 list 列表场景
 * 
 * 默认 4 * 5 展示
 * 
 * 
 */
export default () => {
  return (
    <div className='gap-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4'>
      {dataSource.map((_: any, index: number) => (
        <Card className='space-y-5 p-4' radius='lg' key={index}>
          <Skeleton className='rounded-lg'>
            <div className='h-40 rounded-lg bg-default-300'></div>
          </Skeleton>
          <div className='space-y-3'>
            <Skeleton className='w-3/5 rounded-lg'>
              <div className='h-3 w-3/5 rounded-lg bg-default-200'></div>
            </Skeleton>
            <Skeleton className='w-4/5 rounded-lg'>
              <div className='h-3 w-4/5 rounded-lg bg-default-200'></div>
            </Skeleton>
          </div>
        </Card>
      ))}
    </div>
  );
}