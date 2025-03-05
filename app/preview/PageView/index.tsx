import React, { memo, useEffect } from 'react';
import { Background, ReactFlow, useReactFlow, BackgroundVariant } from '@xyflow/react';
import SkeletonPage from '@/components/SkeletonPage';
import SandpackRender from '@/components/SandpackRender';
import { SandpackProvider } from '@codesandbox/sandpack-react';

import '@xyflow/react/dist/style.css';

const CustomNodeComponent = memo(({ data }: any) => {
  const { loading, codeString } = data;
  return (
    <div className='custom-node' style={{ width: '1440px', maxWidth: '100%', boxSizing: 'border-box' }}>
      {loading ? (
        <SkeletonPage />
      ): (
        <SandpackProvider>
           <SandpackRender code={codeString} />
        </SandpackProvider>
       
      )}
    </div>
  );
})

const nodeTypes = {
  customNode: CustomNodeComponent,
};

export default memo((props: any) => {
  const { codeString, loading } = props;
  const { getZoom, zoomTo } = useReactFlow();

  useEffect(() => {
    zoomTo(1)
  }, [])

  const getCurrentZoom = () => {
    return getZoom();
  };

  console.log(getCurrentZoom())

  const nodes = [
    {
      id: '1',
      type: 'customNode', // 节点类型，与 nodeTypes 中的 key 对应
      position: { x: 0, y: 0 },
      data: {
        codeString,
        loading
      }
    },
  ];
 
  return (
    <div className='w-full h-full relative'>
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        minZoom={0.5}
        maxZoom={2}
        fitView
      >
        <Background 
          gap={20} 
          size={1.5}
          color='#c6c6c6'
          variant={BackgroundVariant.Dots}
        />
        </ReactFlow>
    </div>
  );
})
