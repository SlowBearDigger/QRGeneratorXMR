import React, { useState } from 'react';
import { CopyIcon } from './icons';

interface CodeSnippetProps {
  code: string;
}

export const CodeSnippet: React.FC<CodeSnippetProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 text-sm text-gray-300">
      <p>
        This tool is fully open-source and operates entirely in your browser. Nothing is ever sent to a server. We use the powerful <a href="https://www.npmjs.com/package/qr-code-styling" target="_blank" rel="noopener noreferrer" className="text-[#F7B731] hover:underline">qr-code-styling</a> library to generate the QR code based on the options you select.
      </p>
      
      <p className="font-bold text-white">Live Configuration Code:</p>
      <p className="text-xs text-gray-400">
        Below is the exact JavaScript code generated from your settings. This object is passed to the library to create the QR image you see in the preview. It updates in real-time as you make changes.
      </p>

      <div className="relative bg-[#0a0a0a] border border-gray-700 rounded-lg">
        <button 
          onClick={handleCopy} 
          className="absolute top-2 right-2 px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 text-xs flex items-center"
          aria-label="Copy code"
        >
          {copied ? 'Copied!' : <CopyIcon className="w-4 h-4" />}
          <span className="ml-1 hidden sm:inline">{copied ? '' : 'Copy'}</span>
        </button>
        <pre className="p-4 text-xs overflow-x-auto">
          <code className="language-javascript whitespace-pre-wrap">
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
};

