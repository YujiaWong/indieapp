'use client';
import { useEffect } from 'react';
export default () => {
  useEffect(() => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const  token = params.get('token')
    localStorage.setItem('token', token);
    const newurl = localStorage.getItem('LoginSuccessCall');
    location.replace(newurl);
  }, []);

  return null;
}