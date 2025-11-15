import React from 'react';

const BearLogo: React.FC = () => (
    <div className="relative w-20 h-20 filter drop-shadow-[0_0_8px_#F7B731]">
        <svg viewBox="0 0 100 100" className="w-full h-full"><defs><linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style={{ stopColor: '#F7B731', stopOpacity: 1 }} /><stop offset="100%" style={{ stopColor: '#FFA500', stopOpacity: 1 }} /></linearGradient></defs><circle cx="50" cy="50" r="48" fill="none" stroke="url(#logoGradient)" strokeWidth="2" /><rect x="30" y="30" width="40" height="40" fill="#111827" /><rect x="35" y="45" width="10" height="10" fill="url(#logoGradient)" /><rect x="55" y="45" width="10" height="10" fill="url(#logoGradient)" /><rect x="40" y="60" width="20" height="5" fill="#e2e8f0" /><rect x="25" y="25" width="10" height="10" fill="#111827" /><rect x="65" y="25" width="10" height="10" fill="#111827" /><rect x="15" y="75" width="8" height="8" fill="url(#logoGradient)" /><rect x="80" y="20" width="5" height="5" fill="url(#logoGradient)" /></svg>
    </div>
);

export const Header: React.FC = () => {
  return (
    <header className="flex flex-col items-center text-center">
      <BearLogo />
      <h1 data-text="Monero PayQR" className="title-glitch text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F7B731] to-[#FFA500] pb-2">
        Monero PayQR
      </h1>
      <p className="text-gray-400 max-w-md" style={{ animation: 'text-flicker 4s infinite' }}>
        Generate custom QR codes for private payments. Privacy-first, as always.
      </p>
    </header>
  );
};