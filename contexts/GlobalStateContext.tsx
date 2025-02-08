import { createContext, useContext, useState } from 'react';

type GlobalStateContextType = {
  userInfo: any,
  setUserInfo: (newState: any) => void;
};

// 创建 Context
const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);


// 创建 Provider 组件
export const GlobalStateProvider = ({ children }) => {
  const [state, setState] = useState({
    userInfo: null,
  });

  // 更新状态的方法
  const setUserInfo = (newUserInfo: any) => setState((prevState) => ({ ...prevState, userInfo: { ...prevState.userInfo, ...newUserInfo } }));

  return (
    <GlobalStateContext.Provider value={{ ...state, setUserInfo }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

// 自定义 Hook 用来访问和更新全局状态
export const useGlobalState = () => {
  return useContext(GlobalStateContext);
};
