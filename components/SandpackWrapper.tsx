// @/components/SandpackWrapper.tsx
import React, { useEffect } from 'react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  useSandpack,
  useActiveCode
} from "@codesandbox/sandpack-react";
import { useTheme } from 'next-themes'; // 导入 useTheme

const SandpackContent = ({ code, isGenerating, id, selectedId }) => {
  const { sandpack } = useSandpack();
  const { code: activeCode, updateCode } = useActiveCode();

  useEffect(() => {
    if (code !== activeCode) {
      updateCode(code);
      sandpack.updateFile("/App.js", code);
    }
  }, [code, activeCode, updateCode, sandpack]);

  return (
    <SandpackLayout>
      <SandpackPreview style={{ height: '1000px' }} />
      {/* <SandpackCodeEditor 
        showLineNumbers
        style={{ height: '1000px' }}
        // readOnly={isGenerating && id === selectedId} 
        readOnly={false} 
      /> */}
    </SandpackLayout>
  );
};

export const SandpackWrapper = ({ code, isGenerating, id, selectedId }) => {

  return (
    <SandpackProvider
      key={code} // 添加 key 属性
      template="react"
      theme={'dark'} // 应用主题
      files={{
        "/App.js": {
          code: code,
          active: true,
        },
      }}
      customSetup={{
        dependencies: {
          "react": "^18.0.0",
          "react-dom": "^18.0.0",
          // 状态管理
          "redux": "^4.2.1",
          "react-redux": "^8.1.2",
          "mobx": "^6.10.2",
          "mobx-react": "^7.6.0",
          "recoil": "^0.7.7",
          "zustand": "^4.3.8",
          // 路由
          "react-router-dom": "^6.14.2",
          "next": "^13.4.12",
          "@reach/router": "^1.3.4",
          // UI组件和样式
          "@mui/material": "^5.14.3",
          "@emotion/react": "^11.11.1",
          "@emotion/styled": "^11.11.0",
          "antd": "^5.8.6",
          "react-bootstrap": "^2.8.0",
          "bootstrap": "^5.3.1",
          "styled-components": "^5.3.11",
          "@chakra-ui/react": "^2.6.1",
          "@chakra-ui/icons": "^2.1.1",
          "lucide-react": "^0.274.0",
          // 数据获取和API
          "axios": "^1.4.0",
          "@tanstack/react-query": "^4.32.6",
          "swr": "^2.2.0",
          "@apollo/client": "^3.7.17",
          "graphql": "^16.7.1",
          // 表单处理和验证
          "formik": "^2.4.3",
          "react-hook-form": "^7.45.4",
          "yup": "^1.2.0",
          "joi": "^17.9.2",
          // 国际化
          "react-intl": "^6.4.4",
          "react-i18next": "^13.0.3",
          "i18next": "^23.4.4",
          "@lingui/core": "^4.3.0",
          "@lingui/react": "^4.3.0",
          // "tailwindcss/tailwind.css"
          // Tailwind CSS
          "tailwindcss": "^3.3.3",
          "postcss": "^8.4.27",
          "autoprefixer": "^10.4.14",
          "@tailwindcss/forms": "^0.5.4",
          "@tailwindcss/typography": "^0.5.9",
          "@tailwindcss/aspect-ratio": "^0.4.2",
          // 地图和地理位置
          "@react-google-maps/api": "^2.19.2",
          "leaflet": "^1.9.4",
          "react-leaflet": "^4.2.1",
          "mapbox-gl": "^2.15.0",
          "react-map-gl": "^7.1.3",
          // 图表和数据可视化
          "d3": "^7.8.5",
          "chart.js": "^4.4.0",
          "react-chartjs-2": "^5.2.0",
          "recharts": "^2.7.2",
          "victory": "^36.6.11",
          // 3D图形和动画
          "three": "^0.156.1",
          "@react-three/fiber": "^8.13.6",
          "gsap": "^3.12.2",
          "animejs": "^3.2.1",
          // 音频和视频处理
          "howler": "^2.2.3",
          "tone": "^14.7.77",
          "video.js": "^8.5.2",
          // 认证
          "firebase": "^10.1.0",
          "@auth0/auth0-react": "^2.2.0",
          "passport": "^0.6.0",
          // 实时通信
          "socket.io-client": "^4.7.2",
          "pusher-js": "^8.3.0",
          // 工具库
          "lodash": "^4.17.21",
          "ramda": "^0.29.0",
          "immutable": "^4.3.1",
          // 日期和时间处理
          "date-fns": "^2.30.0",
          "dayjs": "^1.11.9",
          "moment": "^2.29.4",
          // 编辑器和富文本组件
          "draft-js": "^0.11.7",
          "slate": "^0.94.1",
          "slate-react": "^0.97.2",
          "react-quill": "^2.0.0",
          // 动画库
          "framer-motion": "^10.15.1",
          "react-spring": "^9.7.2",
          "react-transition-group": "^4.4.5",
          "lottie-web": "^5.12.2",
          "react-lottie": "^1.2.3",
          "velocity-animate": "^1.5.2",
          "popmotion": "^11.0.5",
          "react-move": "^6.5.0",
          "react-reveal": "^1.2.2"
        }
      }}
    >
      <SandpackContent 
        code={code} 
        isGenerating={isGenerating} 
        id={id} 
        selectedId={selectedId} 
      />
    </SandpackProvider>
  );
};
