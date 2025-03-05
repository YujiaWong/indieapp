import React, { memo } from 'react';
import { Background, ReactFlow, BackgroundVariant } from '@xyflow/react';
import SkeletonPage from '@/components/SkeletonPage';
import SandpackRender from '@/components/SandpackRender';
import { SandpackProvider } from '@codesandbox/sandpack-react';
import '@xyflow/react/dist/style.css';

const CustomNodeComponent = memo(({ data }: any) => {
  const { loading, codeString } = data;
  return (
    <div className='custom-node' style={{ width: '1440px', maxWidth: '100%', boxSizing: 'border-box', display: 'flex', justifyContent: 'center' }}>
      {loading ? (
        <SkeletonPage />
      ): (
        <div className='flex-1'>
          <SandpackProvider>
           <SandpackRender code={codeString} />
          </SandpackProvider>
        </div>
      )}
    </div>
  );
})

const nodeTypes = {
  customNode: CustomNodeComponent,
};

export default memo((props: any) => {
  const { codeString, loading } = props;
  const nodes = [
    {
      id: '1',
      type: 'customNode',
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
          size={2}
          color='#c6c6c6'
          variant={BackgroundVariant.Dots}
        />
      </ReactFlow>
    </div>
  );
})
