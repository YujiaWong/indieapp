import React, { memo } from 'react';
import { Button, Image } from '@heroui/react';

export default memo((props: any) => {
  const { description, onRest } = props;
  return (
    <div className='flex flex-col items-center'>
      <Image 
        src='/assets/失败.png'
        width={240}
      />
      <div>{description}</div>
      <Button color='danger' size='sm' radius='full' className='mt-4  w-[100px]' onPress={onRest}>
        重新获取
      </Button>
    </div>
  )
})