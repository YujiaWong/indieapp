'use client';
import React from 'react';
import { Textarea, Button } from '@nextui-org/react';
import StartIcon from '@/components/svg/StartIcon';
import { useSet } from '@/utils/hooks';
import API from '@/services';
import Toast from '@/components/base/toast';

export default (props: any) => {
  const { textareaRef } = props;

  const [state, setState] = useSet({
    visible: false,
    inputValue: '',
    loading: false
  });

  const { inputValue, loading } = state;

  const handleSend = async () => {
    // 检查是否登录
    const token = localStorage.getItem('token');
    if (!token || token === 'undefined') {
      window.dispatchEvent(new CustomEvent('SkipLogin'));
      return;
    } 

    // 检查填写内容是否为空
    const userPrompt = inputValue ? inputValue.trim() : null;
    if (!userPrompt) {
      Toast.notify({
        type: 'info',
        message: 'Please state your needs'
      });
      return;
    }
    setState({ loading: true });

    // 创建项目
    try {
      const { data, msg } = await API.project.create();
      setState({ loading: false });

      if (!data?.projectCode) {
        Toast.notify({
          type: 'error',
          message: msg || 'Project creation failure'
        });
        return;
      }

      // 进入需求搜集页面
      const { projectCode } = data;
      localStorage.setItem(`${projectCode}-prompt-create`, userPrompt);
      location.href = `/demand?projectCode=${projectCode}`;
    } catch (error) {
      setState({ loading: false });
      console.error('project creation failure：', error);
    }
  };

  const handleTextareaChange = (ev: any) => {
    const value = ev.target.value;
    setState({ inputValue: value });
  };

  return (
    <div className='w-full relative'>
      <div className='w-full rounded-xl p-[1px] bg-gradient-to-r from-[#69DAF9] to-[#016fee] shadow-lg shadow-[0px_0px_36px_0px_rgba(105,_218,_249,_0.20)]'>
        <Textarea
          ref={textareaRef}
          className='w-full rounded-xl border border-transparent bg-white resize-none'
          classNames={{
            inputWrapper: '!bg-transparent',
          }}
          placeholder='Tell me what you want to build today...'
          minRows={30}
          value={inputValue}
          onChange={handleTextareaChange}
          maxLength={10000}
        />
      </div>
      <div className='absolute bottom-2.5 z-10 right-1 px-4'>
        <Button
          color='primary'
          size='sm'
          startContent={loading ? null : <StartIcon size={18} />}
          isLoading={loading}
          onPress={handleSend}
        >
          Generate
        </Button>
      </div>
    </div>
  );
}