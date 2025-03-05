'use client';
import React from 'react';
import { Modal, ModalContent, ModalBody, Button, Input, Link } from '@heroui/react';
import { useSet } from '@/utils/hooks';
import API from '@/services';
import { Logo } from '@/components/icons';
import MailIcon from '@/components/svg/MailIcon';
import LockIcon from '@/components/svg/LockIcon';
import Toast from '@/components/base/toast';

export default (props: any) => {
  const { onClose, onSignIn } = props;
  const [state, setState] = useSet({
    loading: false,
    username: '',
    password: '',
  });
  const { username, password, loading } = state;

  const submitRegister = async () => {
    try {
      setState({ loading: true });
      const params = {
        username,
        password,
        email: username,
      };
      const { suc, msg } = await API.user.register(params);
      setState({ loading: false });
      if (!suc) {
        Toast.notify({
          type: 'error',
          message: msg,
        });
        return;
      }
      Toast.notify({
        type: 'success',
        message: msg,
      });
      onSignIn();
    } catch (error) {
      setState({ loading: false });
    }
  };
  
  return (
    <Modal isOpen={true} onClose={onClose} hideCloseButton={true}>
       <ModalContent>
        {() => (
          <ModalBody>
            <div className='flex justify-center items-center pb-10'>
              <div className='flex flex-col items-center justify-center'>
                <div className='w-full text-center'>
                  <div className='w-full flex justify-center my-4'><Logo size={28}/></div>
                  <div className='font-medium'>Get started with Indieapp</div>
                </div>
                <div className='text-gray-600'>
                  Enter your email below to create your account
                </div>
                <div className='flex justify-center items-center flex-wrap w-full mb-4'>
                  <Input
                    type='email'
                    placeholder='Enter your email'
                    className='rounded mt-10'
                    endContent={
                      <MailIcon className='text-2xl text-default-400 pointer-events-none flex-shrink-0' />
                    }
                    onValueChange={(value) => setState({ username: value })}
                  />
                  <Input
                    type='password'
                    placeholder='Enter your password'
                    className='rounded mt-6'
                    endContent={
                      <LockIcon className='text-2xl text-default-400 pointer-events-none flex-shrink-0' />
                    }
                    onValueChange={(value) => setState({ password: value })}
                  />
                </div>
                <Button
                  color='primary'
                  className='w-full my-8 bg-black'
                  onPress={submitRegister}
                  isLoading={loading}
                >
                  Sign Up
                </Button>
                <div className='flex'>
                  <div className='text-sm text-gray-600'>
                    Already have an account? &nbsp;
                  </div>
                  <Link
                    className='text-sm cursor-pointer'
                    onPress={onSignIn}
                  >
                    Sign in
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