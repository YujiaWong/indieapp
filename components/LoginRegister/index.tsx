'use client';
import { useState, useEffect } from 'react';
import API from '@/services';
import { useRouter } from 'next/navigation';
import { useGlobalState } from '@/contexts/GlobalStateContext';
import LoginModal from '@/components/LoginModal';
import RegisterModal from '@/components/RegisterModal';

export default () => {
  const router = useRouter();
  const { setUserInfo } = useGlobalState();

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || token === 'undefined') {
      return;
    } 
    getUserInfo();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setShowLogin(true);
    };

    // 监听 localStorage 的变化
    window.addEventListener('SkipLogin', handleStorageChange);
    // 清理事件监听
    return () => {
      window.removeEventListener('SkipLogin', handleStorageChange);
    };
  }, []);

  const getUserInfo = async () => {
    const { suc, data } = await API.user.infos() || {};
    if (!suc) {
      localStorage.removeItem('token');
      router.replace('/');
      return;
    }
    setUserInfo(data);
  }

  const hanldeChangeShowSignIn = () => {
    setShowLogin(!showLogin);
    setShowRegister(false);
  };

  const hanldeChangeShowSignUp = () => {
   setShowLogin(false);
   setShowRegister(!showRegister);
  };

  return (
    <>
     {showLogin && (
        <LoginModal onClose={hanldeChangeShowSignIn} onSignUp={hanldeChangeShowSignUp} />
      )}
      {showRegister && (
        <RegisterModal onClose={hanldeChangeShowSignUp} onSignIn={hanldeChangeShowSignIn} />
      )}
    </>
  );
}
