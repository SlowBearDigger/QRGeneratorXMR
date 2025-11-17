import React, { useState } from 'react';
import type { ShapeType, CornerType, GradientType, Preset, CryptoType } from '../types';
import { UploadIcon, ChevronDownIcon } from './icons';
import { CodeSnippet } from './CodeSnippet';

interface QrFormProps {
  address: string; onAddressChange: (v: string) => void;
  message: string; onMessageChange: (v: string) => void;
  onLogoChange: (f: File | null) => void;
  color: string; onColorChange: (v: string) => void;
  shape: ShapeType; onShapeChange: (v: ShapeType) => void;
  cornerType: CornerType; onCornerChange: (v: CornerType) => void;
  backgroundColor: string; onBackgroundColorChange: (v: string) => void;
  useGradient: boolean; onUseGradientChange: (v: boolean) => void;
  gradientColor: string; onGradientColorChange: (v: string) => void;
  gradientType: GradientType; onGradientTypeChange: (v: GradientType) => void;
  onGenerateClick: () => void;
  isLoading: boolean;
  isGenerated: boolean;
  presets: Preset[];
  onApplyPreset: (preset: Preset) => void;
  onRandomize: () => void;
  activePreset: string | null;
  cryptoOptions: { id: CryptoType; label: string; placeholder: string; supportsMessage: boolean; }[];
  selectedCrypto: CryptoType;
  onCryptoChange: (crypto: CryptoType) => void;
  codeSnippet: string;
}

const AccordionSection: React.FC<{ title: string; children: React.ReactNode; isOpen: boolean; onToggle: () => void; }> = ({ title, children, isOpen, onToggle }) => (
  <div className="border border-gray-700 rounded-lg">
    <button onClick={onToggle} className="w-full flex justify-between items-center p-3 text-left">
      <span className="font-bold text-white">{title}</span>
      <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
    </button>
    {isOpen && <div className="p-4 border-t border-gray-700">{children}</div>}
  </div>
);

export const QrForm: React.FC<QrFormProps> = (props) => {
  const [openSection, setOpenSection] = useState<number>(1);
  const handleToggle = (index: number) => setOpenSection(openSection === index ? 0 : index);
  const { presets, onApplyPreset, onRandomize, activePreset, cryptoOptions, selectedCrypto, onCryptoChange, codeSnippet, ...rest } = props;
  const { address, onAddressChange, message, onMessageChange, onLogoChange, color, onColorChange, shape, onShapeChange, cornerType, onCornerChange, backgroundColor, onBackgroundColorChange, useGradient, onUseGradientChange, gradientColor, onGradientColorChange, gradientType, onGradientTypeChange, onGenerateClick, isLoading, isGenerated } = rest;
  
  const currentCrypto = cryptoOptions.find(c => c.id === selectedCrypto);

  const shapeOptions: { id: ShapeType; label: string }[] = [
    { id: 'square', label: 'Squares' }, { id: 'dots', label: 'Dots' }, { id: 'rounded', label: 'Rounded' },
    { id: 'extra-rounded', label: 'Extra' }, { id: 'classy', label: 'Classy' }, { id: 'classy-rounded', label: 'Classy R.' }
  ];
  const cornerOptions: { id: CornerType; label: string }[] = [
    { id: 'square', label: 'Square' }, { id: 'dot', label: 'Dot' }, { id: 'extra-rounded', label: 'Rounded' }
  ];
  const gradOptions: { id: GradientType; label: string }[] = [
    { id: 'linear', label: 'Linear' }, { id: 'radial', label: 'Radial' }
  ];
  return (
    <div className="w-full bg-black/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4 space-y-4">
      <AccordionSection title="Step 1: Select Crypto & Address" isOpen={openSection === 1} onToggle={() => handleToggle(1)}>
        <div className="space-y-4">
          <div>
            <label className="block text-left text-sm font-medium text-gray-300 mb-2">Cryptocurrency</label>
            <div className="grid grid-cols-3 gap-2">
              {cryptoOptions.map(o => (
                <button key={o.id} onClick={() => onCryptoChange(o.id)} className={`p-2 text-sm rounded-md transition-colors ${o.id === selectedCrypto ? 'bg-[#F7B731] text-black font-bold' : 'border border-gray-600 text-gray-300 hover:border-[#F7B731]'}`}>{o.label}</button>
              ))}
            </div>
          </div>
          <input type="text" value={address} onChange={(e) => onAddressChange(e.target.value)} className="w-full form-input p-2 rounded-md text-sm" placeholder={currentCrypto?.placeholder} />
          {currentCrypto?.supportsMessage && (
            <div>
              <label htmlFor="message" className="block text-left text-sm font-medium text-gray-300 mb-2">Message / Memo (Optional)</label>
              <input
                type="text"
                id="message"
                value={message}
                onChange={(e) => onMessageChange(e.target.value)}
                className="w-full form-input p-2 rounded-md text-sm"
                placeholder="e.g., For invoice #123"
              />
            </div>
          )}
        </div>
      </AccordionSection>
      <AccordionSection title="Step 2: Customization" isOpen={openSection === 2} onToggle={() => handleToggle(2)}>
        <div className="space-y-4">
          <div>
            <label className="block text-left text-sm font-medium text-gray-300 mb-2">Logo (Optional)</label>
            <label htmlFor="logo-upload" className="w-full flex items-center justify-center p-2 form-input rounded-md cursor-pointer hover:border-[#F7B731]"><UploadIcon /><span className="ml-2 text-sm text-gray-300">Upload Image</span></label>
            <input id="logo-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/svg+xml" onChange={(e) => onLogoChange(e.target.files ? e.target.files[0] : null)} />
            <p className="text-xs text-gray-500 mt-2 text-center">Recommended: Square image (e.g., 200x200px) with transparent background.</p>
          </div>
          <div>
            <label className="block text-left text-sm font-medium text-gray-300 mb-2">QR Background Color</label>
            <input type="color" value={backgroundColor} onChange={(e) => onBackgroundColorChange(e.target.value)} className="w-full h-10 p-1 form-input rounded-md cursor-pointer" />
          </div>
        </div>
      </AccordionSection>
      <AccordionSection title="Step 3: Dot & Corner Style" isOpen={openSection === 3} onToggle={() => handleToggle(3)}>
        <div className="space-y-4">
          <div className="flex items-center justify-between"><label className="font-medium text-gray-300">Color</label><div className="flex items-center"><label className="text-sm text-gray-400 mr-2">Gradient</label><input type="checkbox" checked={useGradient} onChange={(e) => onUseGradientChange(e.target.checked)} className="form-checkbox h-4 w-4 rounded bg-gray-800 border-gray-600 text-[#F7B731] focus:ring-[#F7B731]" /></div></div>
          <div className="grid grid-cols-2 gap-4"><input type="color" value={color} onChange={(e) => onColorChange(e.target.value)} className="w-full h-10 p-1 form-input rounded-md" /><input type="color" value={gradientColor} onChange={(e) => onGradientColorChange(e.target.value)} className={`w-full h-10 p-1 form-input rounded-md ${!useGradient && 'opacity-50 cursor-not-allowed'}`} disabled={!useGradient} /></div>
          {useGradient && <div className="grid grid-cols-2 gap-2">{gradOptions.map(o => <button key={o.id} onClick={() => onGradientTypeChange(o.id)} className={`p-2 text-sm rounded-md transition-colors ${o.id === gradientType ? 'bg-[#F7B731] text-black font-bold' : 'border border-gray-600 text-gray-300 hover:border-[#F7B731]'}`}>{o.label}</button>)}</div>}
          <label className="block text-left font-medium text-gray-300 pt-2">Dot Style</label>
          <div className="grid grid-cols-3 gap-2">{shapeOptions.map(o => <button key={o.id} onClick={() => onShapeChange(o.id)} className={`p-2 text-xs rounded-md transition-colors ${o.id === shape ? 'bg-[#F7B731] text-black font-bold' : 'border border-gray-600 text-gray-300 hover:border-[#F7B731]'}`}>{o.label}</button>)}</div>
          <label className="block text-left font-medium text-gray-300 pt-4">Corner Style</label>
          <div className="grid grid-cols-3 gap-2">{cornerOptions.map(o => <button key={o.id} onClick={() => onCornerChange(o.id)} className={`p-2 text-sm rounded-md transition-colors ${o.id === cornerType ? 'bg-[#F7B731] text-black font-bold' : 'border border-gray-600 text-gray-300 hover:border-[#F7B731]'}`}>{o.label}</button>)}</div>
        </div>
      </AccordionSection>
       <AccordionSection title="How It Works (Transparency)" isOpen={openSection === 4} onToggle={() => handleToggle(4)}>
        <CodeSnippet code={codeSnippet} />
      </AccordionSection>
      <div className="space-y-4 pt-2">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Quick Styles</label>
          <p className="text-xs text-gray-500 mb-2">Click a style to apply it instantly. Some vary colors for variety!</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {presets.map(p => <button key={p.name} onClick={() => onApplyPreset(p)} className={`p-2 text-xs font-semibold rounded-md transition-colors ${activePreset === p.name ? 'bg-[#F7B731] text-black font-bold' : 'border border-gray-600 text-gray-300 hover:border-[#F7B731] hover:text-white'}`}>{p.name}</button>)}
          </div>
        </div>
        <button onClick={onRandomize} className="w-full p-2 text-sm font-semibold rounded-md border-2 border-dashed border-gray-600 text-gray-300 hover:border-[#F7B731] hover:text-white transition-colors">
          🎲 Randomize Styles
        </button>
        <p className="text-xs text-gray-500 text-center">Generates completely random colors, shapes, and more for a unique look.</p>
      </div>
      <div className="pt-4">
        <button onClick={onGenerateClick} disabled={isLoading || !address.trim()} className="w-full px-8 py-3 font-bold text-black bg-gradient-to-r from-[#F7B731] to-[#FFA500] rounded-md btn-glow disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? 'Processing...' : isGenerated ? 'Update QR' : 'Generate QR'}
        </button>
      </div>
    </div>
  );
};