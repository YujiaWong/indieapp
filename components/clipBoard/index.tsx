import { useState } from 'react';
import { FiCopy } from 'react-icons/fi';

const CopyButton = ({ text }: { text: string }) => {
  const [copySuccess, setCopySuccess] = useState('');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text); // 使用 Clipboard API 写入文本
      setCopySuccess('Copied!'); // 复制成功的反馈
    } catch (err) {
      setCopySuccess('Failed to copy'); // 复制失败的反馈
    }
  };

  return (
    <div>
      <button onClick={handleCopy} aria-label="Copy">
        <FiCopy color='black' size={18} />
      </button>
      {copySuccess && <span>{copySuccess}</span>}{' '}
      {/* 显示复制成功或失败的消息 */}
    </div>
  );
};

export default CopyButton;
