import React, { useState, useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { DONATION_XMR_ADDRESS } from '../constants';
import { CopyIcon, XIcon, TelegramIcon, StoreIcon } from './icons';

const AnimatedDonationQR: React.FC = () => {
    const qrRef = useRef<HTMLDivElement>(null);
    const [qrInstance] = useState<QRCodeStyling>(new QRCodeStyling({
        width: 150,
        height: 150,
        data: `monero:${DONATION_XMR_ADDRESS}`,
        dotsOptions: {
            color: '#F7B731',
            type: 'dots'
        },
        backgroundOptions: {
            color: '#000000',
        },
        imageOptions: {
            crossOrigin: 'anonymous',
            margin: 5
        }
    }));

    useEffect(() => {
        if (qrRef.current) {
            qrRef.current.innerHTML = '';
            qrInstance.append(qrRef.current);
        }
    }, [qrInstance]);

    useEffect(() => {
        const colors = ['#F7B731', '#FF6B00', '#FF8E00', '#FFA500'];
        let colorIndex = 0;
        const interval = setInterval(() => {
            colorIndex = (colorIndex + 1) % colors.length;
            qrInstance.update({
                dotsOptions: {
                    color: colors[colorIndex]
                }
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [qrInstance]);

    return <div ref={qrRef} />;
};


export const Footer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(DONATION_XMR_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="w-full text-center p-4 mt-8 text-xs text-gray-500">
        <div className="flex flex-col items-center mb-4">
            <p className="text-lg font-bold text-white mb-2">Enjoy this tool? Support its development!</p>
            <AnimatedDonationQR />
        </div>
      <p className="max-w-xl mx-auto mb-4">
        Your support fuels the development of more open-source privacy tools, community giveaways, and other initiatives.
      </p>
      <div className="mb-4">
        <div className="inline-flex items-center bg-gray-900 border border-gray-700 rounded-md p-1">
          <span className="text-gray-400 text-xs px-2 truncate hidden sm:inline">Donation Address: {DONATION_XMR_ADDRESS}</span>
          <span className="text-gray-400 text-xs px-2 truncate sm:hidden">Donate: {DONATION_XMR_ADDRESS.substring(0,12)}...</span>
          <button onClick={handleCopy} className="ml-2 px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600">
            {copied ? 'Copied!' : <CopyIcon className="w-4 h-4" />}
          </button>
        </div>
      </div>
       <div className="flex justify-center items-center space-x-6 mb-4">
        <a href="https://xmrbazaar.com/user/SlowBearDigger/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#F7B731] transition-colors"><StoreIcon className="w-6 h-6" /></a>
        <a href="https://x.com/SlowBearDigger" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#F7B731] transition-colors"><XIcon className="w-5 h-5" /></a>
        <a href="https://t.me/SlowBearDigger" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#F7B731] transition-colors"><TelegramIcon className="w-5 h-5" /></a>
      </div>
      <p>
        Powered by <a href="https://www.slowbeardigger.dev" target="_blank" rel="noopener noreferrer" className="text-[#F7B731] hover:underline">SlowBearDigger</a> | XMR-friendly
      </p>
    </footer>
  );
};