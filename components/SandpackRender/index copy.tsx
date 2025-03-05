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

const reactComponentTemplate = `
import React, { useffect } from 'react';
import { Card, Input, Button, Descriptions, Row, Col, Image, Tag } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import ReactDOM from 'react-dom';

const App = () => {
  const [overlayStyle, setOverlayStyle] = useState({});
  const [inputStyle, setInputStyle] = useState({ display: 'none' });
  const [inputValue, setInputValue] = useState('');
  const [currentElement, setCurrentElement] = useState(null);
  const [labels, setLabels] = useState(new Map());

  useEffect(() => {
  window.addEventListener('message', function(event) {
    // 你可以选择验证 event.origin 来确保消息来自可信源
    debugger;
    // if (event.origin !== 'https://trusted-origin.com') return;

    console.log('Received message: ', event.data);
}, false);
  }, [])

  const handleMouseEnter = (element, rect) => {
    setOverlayStyle({
      position: 'absolute',
      border: '2px dashed rgba(0, 0, 255, 0.5)',
      pointerEvents: 'none',
      zIndex: '9999',
      left: \`\${rect.left}px\`,
      top: \`\${rect.top}px\`,
      width: \`\${rect.width}px\`,
      height: \`\${rect.height}px\`,
    });
  };

  const handleMouseLeave = () => {
    setOverlayStyle({ display: 'none' });
  };

  const handleClick = (element, rect) => {
    setCurrentElement(element);
    setInputStyle({
      display: 'block',
      position: 'absolute',
      left: \`\${rect.right + 5}px\`,
      top: \`\${rect.top}px\`,
      zIndex: '10000',
    });
    setInputValue(labels.get(element) || '');
  };

  const handleSave = () => {
    if (!currentElement) return;

    setLabels(new Map(labels.set(currentElement, inputValue)));

    // Hide the input after saving
    setInputStyle({ display: 'none' });
  };

  useEffect(() => {
    const elements = document.querySelectorAll('*:not(script):not(style)');

    elements.forEach(element => {
      element.addEventListener('mouseenter', e => {
        if (e.target !== currentElement) {
          e.stopPropagation();
          const rect = e.target.getBoundingClientRect();
          handleMouseEnter(e.target, rect);
        }
      });

      element.addEventListener('mouseleave', e => {
        e.stopPropagation();
        handleMouseLeave();
      });

      element.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        const rect = e.target.getBoundingClientRect();
        handleClick(e.target, rect);
      });
    });

    return () => {
      elements.forEach(element => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
        element.removeEventListener('click', handleClick);
      });
    };
  }, [currentElement]);

  return (
    <>
      <div id="overlay" style={overlayStyle}></div>

      {Array.from(labels).map(([element, label], index) => (
        <span
          key={index}
          style={{
            color: 'blue',
            cursor: 'pointer',
            position: 'absolute',
            left: element.getBoundingClientRect().right + 'px',
            top: element.getBoundingClientRect().top + 'px',
          }}
          onClick={() => {
            setCurrentElement(element);
            setInputValue(label);
            setInputStyle({
              display: 'block',
              position: 'absolute',
              left: \`\${element.getBoundingClientRect().right + 5}px\`,
              top: \`\${element.getBoundingClientRect().top}px\`,
              zIndex: '10000',
            });
          }}
        >
          ✎
        </span>
      ))}

      <div style={{ ...inputStyle, width: '100px', heigth: '200px', backgrouond: '#fff' }}>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
         
        />
        <Button onClick={handleSave} style={{ ...inputStyle, left: parseFloat(inputStyle.left) + 50 }}>
          保存
        </Button>
      </div>
      
    </>
  );
};

export default App;

`;

// console.log(reactComponentTemplate);


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
  
  const dependencies = useMemo(() => getDependencies([code, reactComponentTemplate]), [code]);
  const a = useSandpack();
  console.log(a.sandpack.status);

  if (!code) {
    return;
  }
  return (
    <Suspense fallback={null}>
      <div className='w-full mx-auto'>
        <SandpackProvider
          template='react'
          files={{
            '/App.js': {
              code: code || '// Generating code...',
              active: true
            }, 
            '/Common.js': {
              code: reactComponentTemplate
            },
            'index.js': {
              code: indexCodeStr,
            },
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
