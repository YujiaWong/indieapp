import { Pagination } from '@nextui-org/react';

export default function App(props: any) {
  const { total, pageSize, pageNum, ...rest } = props;
  const _total = Math.ceil(total/pageSize);

  if (_total === 1) {
    return;
  }

  return (
    <Pagination 
      size='sm'
      showControls
      {...rest}
      initialPage={1} 
      total={_total}
      page={pageNum}
    />
  );
}