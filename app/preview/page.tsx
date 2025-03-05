'use client';
import { useEffect } from 'react';
import API from '@/services';
import { useSet } from '@/utils/hooks';
import { useRouter } from 'next/navigation';
import Toast from '@/components/base/toast';
import { getUrlParams } from '@/utils';
import { SandpackProvider } from '@codesandbox/sandpack-react';
import SandpackRender from '@/components/SandpackRender';

export default () => {
  const router = useRouter();

  const [state, setState] = useSet({
    loading: true,
    projectCode: null,
    codeString: ''
  });

  const { projectCode, codeString, loading } = state;

  useEffect(() => {
    const params = getUrlParams();
    const _projectCode = params.get('projectCode');
    if (!_projectCode) {
      Toast.notify({
        type: 'error',
        message: 'Invalid access path',
      });
      router.replace('/');
      return;
    }

    setState({ projectCode: _projectCode });
  }, []);

  useEffect(() => {
    if (!projectCode) {
      return;
    }
    getArtifacts();
  }, [projectCode]);

  const getArtifacts = async () => {
    setState({ loading: true });
    try {
      const { suc, msg, data } = await API.project.publicArtifacts({ projectCode });
      setState({ loading: false });
      if (!suc) {
        Toast.notify({
          type: 'error',
          message: msg,
        });
        return;
      }

      let codeString = '';
      (data?.artifacts || []).forEach((item: any) => {
        if (item.type === 'DEMO') {
          codeString = item.content;
        }
      });
      setState({ codeString });
        
    } catch (error) {
      
    }
  };

  return (
    <div className='h-screen flex flex-col'>
      <SandpackProvider>
        <SandpackRender code={codeString} />
      </SandpackProvider>
    </div>
  );
}
