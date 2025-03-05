import React, { memo, useMemo, Suspense } from 'react';
import { SandpackProvider, SandpackLayout, SandpackPreview, useSandpack } from '@codesandbox/sandpack-react';
import '@/styles/globals.css';

const extractUsedPackages = (codeStr: string) => {
  const importRegex = /import\s+.*\s+from\s+['']([^'']+)['']/g;
  const matches = [];
  let match: any;
  while ((match = importRegex.exec(codeStr)) !== null) {
    const packageName = match[1];
    if (packageName !== 'react' && packageName !== 'react-dom') {
      matches.push(packageName);
    }
  }
  return matches;
};

const getDependencies = (codelist: string[]) => {
  const result = { '@heroui/react': 'latest' };

  codelist.forEach(code => {
    extractUsedPackages(code).forEach(item => {
      result[item] = 'latest';
    });
  })
  return result;
};

const indexCodeStr = `
  import React, { StrictMode, useEffect} from 'react';
  import { createRoot } from 'react-dom/client';
  import App from './App';
  import Common from "./Common";

  const root = createRoot(document.getElementById('root'));
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
`

export default memo((props: any) => {
  const { code } = props;
  
  const dependencies = useMemo(() => getDependencies([code]), [code]);
  const a = useSandpack();
  console.log(a.sandpack.status);

  if (!code) {
    return;
  }
  return (
    <Suspense fallback={null}>
      <div className='w-full mx-auto'>
        <SandpackProvider
          template='static'
          files={{
            '/index.html': {
              code: code || '// Generating code...',
              active: true
            }, 
            // '/Common.js': {
            //   code: reactComponentTemplate
            // },
            // 'index.js': {
            //   code: indexCodeStr,
            // },
            // 'index.js': {
            //   code: `
            //                   import React, { StrictMode } from "react";
            //   import { createRoot } from "react-dom/client";
            //   import "./styles.css";

            //   import App from "./App";
            //   import Common from "./Common"

            //   document.addEventListener('DOMContentLoaded', () => {
            //         document.addEventListener('click', (event) => {
            //           const target = event.target;
            //           console.log('Clicked element:', target);
            //           alert('11')
            //         });
            //       });
            //   const root = createRoot(document.getElementById("root"));
            //   root.render(
            //     <StrictMode>
            //       <Common />
            //       <App />
            //     </StrictMode>
            //   );
            //   `
            // }
          }}
          customSetup={{
            dependencies
          }}
          options={{
            externalResources: ["https://cdn.tailwindcss.com"],
            classes: {
              "sp-layout": "!bg-transparent",
              "sp-editor": "!border !rounded-md !overflow-hidden",
              "sp-preview": "!overflow-hidden",
              "sp-preview-actions": "!hidden",
            }
          }}
        >
          <SandpackLayout>
            <SandpackPreview
              style={{ height: '100vh', width: '100%' }}
              showOpenInCodeSandbox={true}
              showRestartButton={true}
            />
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </Suspense>
  );
});
