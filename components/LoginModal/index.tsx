'use client';
import React from 'react';
import { Modal, ModalContent, ModalBody, Button, Input, Link } from '@heroui/react';
import API from '@/services';
import { useSet } from '@/utils/hooks';
import { Logo } from '@/components/icons';
import MailIcon from '@/components/svg/MailIcon';
import LockIcon from '@/components/svg/LockIcon';
import GoogleIcon from '@/components/svg/GoogleIcon';
import GithubIcon from '@/components/svg/GithubIcon';
import Toast from '@/components/base/toast';

export default (props: any) => {
  const { onClose, onSignUp } = props;

  const [state, setState] = useSet({
    username: '',
    password: '',
    loading: false,
    googleAuthorize: false,
    githubAuthorize: false,
  });

  const { username, password, loading, googleAuthorize, githubAuthorize } = state;

  const submitLogin = async () => {
    try {
      setState({ loading: true });
      const { suc, msg } = await API.user.login({
        username,
        password,
      });
      if (!suc) {
        Toast.notify({
          type: 'error',
          message: msg,
        });
        return;
      }
      localStorage.setItem('userInfo', JSON.stringify({ username }));
      window.location.reload();
    } catch (error) {
      setState({ loading: false });
    }
  };

  const githubLogin = async () => {
    setState({ githubAuthorize: true });
    localStorage.setItem('LoginSuccessCall', location.href);
    location.replace('https://api.indieapp.ai/oauth2/authorization/github');
   
  };

  const googleLogin = async () => {
    setState({ googleAuthorize: true });
    localStorage.setItem('LoginSuccessCall', location.href);
    location.replace('https://api.indieapp.ai/oauth2/authorization/google');
  };

  return (
    <Modal isOpen={true} onClose={onClose} hideCloseButton={true}>
      <ModalContent>
        {() => (
          <ModalBody>
             <div className='flex justify-center items-center '>
              <div className='flex flex-col items-center'>
                <div className='w-full mt-2 text-center'>
                  <div className='w-full flex justify-center my-2'><Logo size={28}/></div>
                  <div className='font-medium'>Continue with Indieapp</div>
                </div>
                <div className='flex justify-center items-center flex-wrap mt-8'>
                  <Input
                    type='email'
                    placeholder='Enter your email'
                    className='w-full'
                    endContent={
                      <MailIcon className='text-2xl text-default-400 pointer-events-none flex-shrink-0' />
                    }
                    onValueChange={(value) => setState({ username: value })}
                  />
                  <Input
                    type='password'
                    placeholder='Enter your password'
                    className='w-full mt-6 mb-8'
                    endContent={
                      <LockIcon className='text-2xl text-default-400 pointer-events-none flex-shrink-0' />
                    }
                    onValueChange={(value) => setState({ password: value })}
                  />
                  <Button
                    color='primary'
                    className='text-sm w-full rounded-lg bg-black'
                    onPress={submitLogin}
                    isLoading={loading}
                    isDisabled={githubAuthorize || googleAuthorize}
                  >
                    Sign in
                  </Button>
                  <div className='flex w-full items-center'>
                    <div className=' h-px w-full gray-300 my-7 mr-4' />
                    <div className='absolate mt-1 text-xs text-gray-600'>OR</div>
                    <div className=' h-px w-full bg-gray-300 my-7 ml-4' />
                  </div>
                  <Button
                    variant='bordered'
                    className='rounded-lg  w-full h-10 border-gray-300 border bg-white bg-opacity-10'
                    onPress={googleLogin}
                    isLoading={googleAuthorize}
                    isDisabled={loading || githubAuthorize}
                  >
                    <GoogleIcon />
                    Sign in with Google
                  </Button>
                  <Button
                    variant='bordered'
                    className='rounded-lg w-full mt-5 h-10 border-gray-300 border bg-white bg-opacity-10'
                    onPress={githubLogin}
                    isLoading={githubAuthorize}
                    isDisabled={loading || googleAuthorize}
                  >
                    <GithubIcon />
                    Sign in with GitHub
                  </Button>
                </div>
                <div className='flex mt-5 mb-6'>
                  <span className='text-sm mr-1 text-gray-600'>
                    Don&apos;t have an account?&nbsp;
                  </span>
                  <Link
                    className='text-sm cursor-pointer'
                    onPress={onSignUp}
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </div>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
}