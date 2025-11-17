import React, { useState, useEffect } from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  address: string;
  message: string;
  cryptoLabel: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, address, message, cryptoLabel }) => {
  const [verificationAddress, setVerificationAddress] = useState('');

  useEffect(() => {
    if (isOpen) {
      setVerificationAddress('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isMatch = address === verificationAddress;
  
  const renderAddress = (addr: string) => {
    if (addr.length < 20) return addr;
    return <>{addr.substring(0, 10)}<span className="text-gray-500">...</span>{addr.substring(addr.length - 10)}</>;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#101010] border border-red-700 rounded-lg p-6 w-full max-w-lg shadow-2xl shadow-red-900/50">
        <h2 className="text-2xl font-bold text-red-400 mb-3">⚠️ Confirm Your Address</h2>
        <p className="text-gray-300 mb-4">
          This is a critical security step. To prevent loss of funds, please verify that the address you entered is correct.
        </p>

        <div className="bg-gray-900 p-3 rounded-md border border-gray-700 mb-4">
          <p className="text-xs text-gray-400 mb-1">Your Entered {cryptoLabel} Address:</p>
          <p className="font-mono text-lg text-white break-all">{renderAddress(address)}</p>
        </div>
        
        {message && (
          <div className="bg-gray-800 p-3 rounded-md border border-gray-600 mb-4">
            <p className="text-xs text-gray-400 mb-1">Included Message:</p>
            <p className="font-mono text-md text-gray-200 break-all">{message}</p>
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="verification" className="block text-sm font-bold text-gray-300 mb-2">Paste the address again to confirm:</label>
          <textarea
            id="verification"
            value={verificationAddress}
            onChange={(e) => setVerificationAddress(e.target.value)}
            className="w-full form-input p-2 rounded-md text-sm h-24 resize-none"
            placeholder={`Paste your ${cryptoLabel} address here...`}
          />
        </div>

        {verificationAddress && (
          <div className={`p-2 rounded-md mb-4 text-center font-bold ${isMatch ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
            {isMatch ? '✅ Addresses Match' : '❌ Addresses Do Not Match'}
          </div>
        )}

        <p className="text-xs text-center text-yellow-400 mb-5">
          Reminder: Always send a small test transaction to a new QR code before sending large amounts.
        </p>

        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold border-2 border-gray-600 text-gray-300 rounded-md hover:border-gray-400 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={!isMatch} className="px-6 py-2 font-bold text-black bg-gradient-to-r from-[#F7B731] to-[#FFA500] rounded-md btn-glow disabled:opacity-50 disabled:cursor-not-allowed">
            Confirm & Generate
          </button>
        </div>
      </div>
    </div>
  );
};