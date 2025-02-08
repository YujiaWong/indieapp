import { memo } from 'react';
import { Skeleton } from '@nextui-org/react';

const MessageItem = () => {
  const randomNum = Math.floor(Math.random() * 2) + 1;

  return (
    <div className='w-full flex items-center gap-3 pb-4'>
      <div>
        <Skeleton className='flex rounded-full w-8 h-8' />
      </div>
      <div className='w-full flex flex-col gap-2'>
        <Skeleton className='h-4 w-5/5 rounded-lg' />
        {randomNum > 1 ? <Skeleton className='h-4 w-5/5 rounded-lg' /> :  <Skeleton className='h-3 w-4/5 rounded-lg' />}
        {randomNum > 1 && <Skeleton className={`h-4 w-3/5 rounded-lg`} />}
      </div>
    </div>
  );
}

export default memo((props: any) => {
  const { size = 8 } = props;
  const list = Array(size).fill(0);

  return (
    <>
      {list.map((_, index: number) => <MessageItem key={index} />)}
    </>
  );
})
