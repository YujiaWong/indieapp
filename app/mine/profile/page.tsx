'use client';
import React, { useEffect } from 'react';
import {Card, CardHeader, Input, Button } from  '@nextui-org/react';
import { Upload, Avatar, Button as AButton } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import API from '@/services';
import { useSet } from '@/utils/hooks';
import { useGlobalState } from '@/contexts/GlobalStateContext';
import { getCurrUserAvatarUrl } from '@/utils';
import Toast from '@/components/base/toast';

export default function App() {
  const { userInfo, setUserInfo } = useGlobalState();
 
  const [state, setState] = useSet({
    saveLoading: false,
    uploadLoading: false,
    nickName: '',
  });
  const { saveLoading, uploadLoading, nickName } = state;

  useEffect(() => {
    setState({ nickName: userInfo?.nickname });
  }, [userInfo?.nickname]);

  const updateUserInfo = async (params: any) => {
    setState({ saveLoading: true });
    try {
      const { suc, msg } = await API.user.update(params);
      setState({ saveLoading: false });
      if (!suc) {
        Toast.notify({ type: 'error', message: msg });
        return;
      }
      setUserInfo(params);
      Toast.notify({ type: 'success', message: 'update info success.' });
    } catch (error) {
      setState({ saveLoading: false });
    }
  };

  const beforeUpload = async (file: any) => {
    setState({ uploadLoading: true });
    // 文件校验
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      Toast.notify({ type: 'error', message: 'You can only upload JPG/PNG file!' });
      setState({ uploadLoading: false });
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      Toast.notify({ type: 'error', message: 'Image must smaller than 2MB!' });
      setState({ uploadLoading: false });
      return false;
    }

    // 获取文件上传路径
    const { suc, msg, data } = await API.file.presignedUrl({
      mimeType: file.type
    });

    if (!suc) {
      Toast.notify({ type: 'error', message: msg });
      setState({ uploadLoading: false });
      return false;
    }

    // 上传文件
    const formData = new FormData();
    formData.append('file', file);
    fetch(data.presignedUrl, {
      method: 'PUT',
      body: file  // PUT 请求直接传文件数据
    }).then(response => {
      if (response.ok) {
        updateUserInfo({ avatarUrl: data.assetUrl });
      } else {
        Toast.notify({ type: 'error', message: 'Image upload failed.' });
      }
    })
    .catch(error => {
      Toast.notify({ type: 'error', message: 'Image upload failed.' });
      console.error('上传时出错', error);
    }).finally(() => {
      setState({ uploadLoading: false });
    });
    return isJpgOrPng && isLt2M;
  };

  return (
    <div className='p-6'>
      <div className='font-medium text-[20px] leading-[24px] mb-12'>My Profile</div>
      <Card className='p-6'>
        <CardHeader className='p-0 flex-col items-start'>
          <p className='font-medium text-[16px]'>Profile Image</p>
        </CardHeader>
        <div className='flex items-center pt-6'>
          <Avatar
            size={72}
            src={getCurrUserAvatarUrl(userInfo)}
            className='cursor-pointer' // 鼠标指针样式
          />
          <Upload
            className=''
            name='avatar'
            showUploadList={false}
            beforeUpload={beforeUpload}
          >
            <AButton
              className='border ml-8' 
              icon={<UploadOutlined />}
              variant='filled'
              color='default'
              loading={uploadLoading}
              size='large'
            >
              Upload
            </AButton>
          </Upload>
        </div>
      </Card>
      <Card className='p-6 mt-8'>
        <CardHeader className='p-0 mb-7 flex-col items-start'>
          <p className='font-medium text-[16px]'>Basic Info</p>
        </CardHeader>
        <div className='flex w-ful flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-6'>
          <div className='w-full'>
            <div className='text-sm p-1 font-medium'>Nickname</div>
            <Input
              size='lg'
              fullWidth
              name='nickname'
              value={nickName}
              onChange={ev => setState({ nickName: ev.target.value })}
            />
          </div>
          <div className='w-full'>
            <div className='text-sm p-1 font-medium'>User name</div>
            <Input
              size='lg'
              fullWidth
              name='username'
              value={userInfo?.username}
              disabled
            />
          </div>
        </div>
        <div  className='flex w-full mt-8 flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-6'>
          <div className='w-full'>
            <div className='text-sm p-1 font-medium'>Email</div>
            <Input
              fullWidth
              size='lg'
              name='email'
              value={userInfo?.email}
              disabled
            />
          </div>
          <div className='w-full'/>
        </div>
      </Card>
      <Button 
        color='primary' 
        className='bg-black mt-8 w-[100px]' 
        onPress={() => updateUserInfo({nickname: nickName })}
        isLoading={saveLoading}
      >
        Save
      </Button>
    </div>
  );
}
