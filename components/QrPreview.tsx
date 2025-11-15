import React from 'react';
import { TWITTER_HANDLE, TWITTER_SHARE_URL } from '../constants';
import { DownloadIcon, ShareIcon } from './icons';

interface QrPreviewProps {
  qrRef: React.RefObject<HTMLDivElement>;
  isGenerated: boolean;
  isLoading: boolean;
  onDownload: () => void;
}

export const QrPreview: React.FC<QrPreviewProps> = ({ qrRef, isGenerated, isLoading, onDownload }) => {
  const handleShare = () => {
    const text = `Just created a custom crypto payment QR on @${TWITTER_HANDLE}'s new tool! 🧡\n\nGenerate your own:`;
    const url = 'https://www.slowbeardigger.dev/qr';
    const shareUrl = `${TWITTER_SHARE_URL}?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full h-full flex items-center justify-center lg:sticky lg:top-0">
      <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 flex flex-col items-center justify-center w-full min-h-[450px] lg:min-h-[550px]">
        {!isGenerated && !isLoading && (
          <div className="flex flex-col items-center justify-center text-center text-gray-500">
            <div className="border-2 border-dashed border-gray-700 w-48 h-48 rounded-lg flex items-center justify-center mb-4">
              <span className="text-sm">PREVIEW AREA</span>
            </div>
            <p>Your QR code will appear here once generated.</p>
          </div>
        )}
        {isLoading && <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#F7B731]"></div>}
        <div ref={qrRef} className={`transition-opacity duration-300 ${isGenerated && !isLoading ? 'opacity-100' : 'opacity-0'}`} style={{ display: isGenerated && !isLoading ? 'block' : 'none' }} />
        {isGenerated && !isLoading && (
          <div className="mt-6 w-full text-center">
            <div className="bg-red-900/50 border border-red-700 text-red-300 text-xs rounded-lg p-3 mb-4">
              <p className="font-bold text-sm mb-1">⚠️ IMPORTANT SECURITY NOTICE</p>
              <p>Always double-check the first and last few characters of the address. Send a small test transaction before sending a large amount.</p>
            </div>
            <p className="text-sm text-gray-400 mb-4">Scan to pay.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={onDownload} className="flex items-center justify-center px-4 py-2 text-sm font-semibold border-2 border-[#F7B731] text-[#F7B731] rounded-md hover:bg-[#F7B731] hover:text-black transition-colors btn-glow"><DownloadIcon /><span className="ml-2">Download</span></button>
              <button onClick={handleShare} className="flex items-center justify-center px-4 py-2 text-sm font-semibold border-2 border-gray-600 text-gray-300 rounded-md hover:border-[#F7B731] hover:text-white transition-colors btn-glow"><ShareIcon /><span className="ml-2">Share on X</span></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};