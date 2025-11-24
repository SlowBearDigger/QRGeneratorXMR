import React, { useState, useEffect } from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
  cryptoLabel: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, address, cryptoLabel }) => {
  const [verificationAddress, setVerificationAddress] = useState('');
  const [isMatch, setIsMatch] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVerificationAddress('');
      setIsMatch(false);
    }
  }, [isOpen]);

  useEffect(() => {
    setIsMatch(address.trim() === verificationAddress.trim());
  }, [verificationAddress, address]);

  if (!isOpen) return null;

  const renderPreview = (addr: string) => {
    if (addr.length < 20) return addr;
    return <>{addr.substring(0, 10)}<span className="text-gray-500">...</span>{addr.substring(addr.length - 10)}</>;
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-[#101010] border border-red-600/50 rounded-xl p-6 w-full max-w-lg shadow-[0_0_50px_rgba(220,38,38,0.2)]">
        <div className="flex items-center mb-4 text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <h2 className="text-2xl font-bold">Security Check</h2>
        </div>
        
        <p className="text-gray-300 mb-6 text-sm">
          To prevent loss of funds due to clipboard malware or errors, please verify the destination address manually.
        </p>

        <div className="space-y-6">
          <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Generated for {cryptoLabel}</p>
            <p className="font-mono text-sm text-white break-all border-l-2 border-[#F7B731] pl-3">
              {address}
            </p>
          </div>

          <div>
            <label htmlFor="verification" className="block text-sm font-bold text-white mb-2">
              Paste Address Again to Confirm:
            </label>
            <textarea
              id="verification"
              value={verificationAddress}
              onChange={(e) => setVerificationAddress(e.target.value)}
              className="w-full form-input p-3 rounded-lg text-sm h-24 font-mono resize-none focus:border-red-500 focus:ring-red-500/20"
              placeholder="Paste address here..."
              autoFocus
            />
          </div>

          <div className={`p-3 rounded-lg flex items-center justify-center font-bold transition-all duration-300 ${verificationAddress ? (isMatch ? 'bg-green-900/30 text-green-400 border border-green-500/30' : 'bg-red-900/30 text-red-400 border border-red-500/30') : 'opacity-0'}`}>
            {isMatch ? (
              <><svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> MATCH CONFIRMED</>
            ) : (
              <><svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> MISMATCH DETECTED</>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button onClick={onClose} className="px-5 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Cancel
          </button>
          <button 
            onClick={onClose} 
            disabled={!isMatch}
            className="px-6 py-2 font-bold text-black bg-[#F7B731] rounded hover:bg-[#FFA500] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(247,183,49,0.3)] hover:shadow-[0_0_25px_rgba(247,183,49,0.5)]"
          >
            Confirm & Close
          </button>
        </div>
      </div>
    </div>
  );
};