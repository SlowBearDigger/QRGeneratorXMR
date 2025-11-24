import React, { useState } from 'react';
import type { ShapeType, CornerType, GradientType, Preset, CryptoType, CustomField } from '../types';
import { UploadIcon, ChevronDownIcon } from './icons';
import { CodeSnippet } from './CodeSnippet';

interface QrFormProps {
  content: string; onContentChange: (v: string) => void;
  label: string; onLabelChange: (v: string) => void;
  message: string; onMessageChange: (v: string) => void;
  amount: string; onAmountChange: (v: string) => void;
  
  businessName: string; onBusinessNameChange: (v: string) => void;
  invoiceNumber: string; onInvoiceNumberChange: (v: string) => void;
  invoiceNotes: string; onInvoiceNotesChange: (v: string) => void;
  customFields: CustomField[]; onCustomFieldsChange: (v: CustomField[]) => void;
  invoiceMode: boolean; onInvoiceModeChange: (v: boolean) => void;

  onLogoChange: (f: File | null) => void;
  color: string; onColorChange: (v: string) => void;
  shape: ShapeType; onShapeChange: (v: ShapeType) => void;
  cornerType: CornerType; onCornerChange: (v: CornerType) => void;
  backgroundColor: string; onBackgroundColorChange: (v: string) => void;
  useGradient: boolean; onUseGradientChange: (v: boolean) => void;
  gradientColor: string; onGradientColorChange: (v: string) => void;
  gradientType: GradientType; onGradientTypeChange: (v: GradientType) => void;
  
  isLoading: boolean;
  isGenerated: boolean;
  onVerifyClick: () => void;
  
  presets: Preset[];
  onApplyPreset: (preset: Preset) => void;
  onRandomize: () => void;
  activePreset: string | null;
  cryptoOptions: { id: CryptoType; label: string; placeholder: string; supportsMessage: boolean; labelParam?: string }[];
  selectedCrypto: CryptoType;
  onCryptoChange: (crypto: CryptoType) => void;
  codeSnippet: string;
  qrSize: number; onQrSizeChange: (v: number) => void;
  onDetectAndSetCrypto: (text: string) => string | null;
  isDisposable: boolean; onIsDisposableChange: (v: boolean) => void;
  disposableTimeout: number; onDisposableTimeoutChange: (v: number) => void;
}

const AccordionSection: React.FC<{ title: string; children: React.ReactNode; isOpen: boolean; onToggle: () => void; }> = ({ title, children, isOpen, onToggle }) => (
  <div className="border border-gray-700 rounded-lg overflow-hidden transition-all">
    <button onClick={onToggle} className="w-full flex justify-between items-center p-3 text-left bg-[#0f0f0f] hover:bg-[#1a1a1a]">
      <span className="font-bold text-white text-sm">{title}</span>
      <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
    </button>
    {isOpen && <div className="p-4 border-t border-gray-700 bg-black/20">{children}</div>}
  </div>
);

export const QrForm: React.FC<QrFormProps> = (props) => {
  const [openSection, setOpenSection] = useState<number>(0);
  const [detectedCrypto, setDetectedCrypto] = useState<string | null>(null);

  const handleToggle = (index: number) => setOpenSection(openSection === index ? -1 : index);
  
  const { 
    content, onContentChange, label, onLabelChange, message, onMessageChange, amount, onAmountChange,
    businessName, onBusinessNameChange, invoiceNumber, onInvoiceNumberChange, invoiceNotes, onInvoiceNotesChange,
    customFields, onCustomFieldsChange, invoiceMode, onInvoiceModeChange,
    onLogoChange, color, onColorChange, shape, onShapeChange, cornerType, onCornerChange, 
    backgroundColor, onBackgroundColorChange, useGradient, onUseGradientChange, gradientColor, onGradientColorChange, gradientType, onGradientTypeChange,
    presets, onApplyPreset, onRandomize, activePreset, cryptoOptions, selectedCrypto, onCryptoChange, 
    codeSnippet, qrSize, onQrSizeChange, onDetectAndSetCrypto, onVerifyClick,
    isDisposable, onIsDisposableChange, disposableTimeout, onDisposableTimeoutChange
  } = props;

  const currentCrypto = cryptoOptions.find(c => c.id === selectedCrypto);
  const isCustom = selectedCrypto === 'custom';

  const handleAutodetectChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const detected = onDetectAndSetCrypto(text);
    setDetectedCrypto(detected);
  };

  const addCustomField = () => {
    onCustomFieldsChange([...customFields, { id: crypto.randomUUID(), label: '', value: '' }]);
  };

  const updateCustomField = (id: string, key: 'label' | 'value', value: string) => {
    const newFields = customFields.map(f => f.id === id ? { ...f, [key]: value } : f);
    onCustomFieldsChange(newFields);
  };

  const removeCustomField = (id: string) => {
    onCustomFieldsChange(customFields.filter(f => f.id !== id));
  };

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
    <div className="w-full bg-black/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4 space-y-4 shadow-xl">
      
      <div className="space-y-4">
        <h2 className="text-white font-bold text-lg border-b border-gray-700 pb-2">1. Configuration</h2>
        
        <div className="flex flex-wrap gap-2 mb-2">
            {cryptoOptions.map(c => (
                <button key={c.id} onClick={() => onCryptoChange(c.id)} className={`px-3 py-1 text-xs rounded-full border transition-all ${selectedCrypto === c.id ? 'bg-[#F7B731] text-black border-[#F7B731] font-bold' : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-500'}`}>
                    {c.label}
                </button>
            ))}
        </div>

        <div className="flex flex-col space-y-2">
            <label className="block text-sm font-medium text-gray-300">{isCustom ? 'Content' : 'Address'}</label>
            <textarea 
              value={content} 
              onChange={handleAutodetectChange} 
              className="w-full form-input p-3 rounded-md text-sm h-24 font-mono shadow-inner bg-[#050505]" 
              placeholder={currentCrypto?.placeholder} 
            />
            
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                {detectedCrypto && content && (
                  <span className="text-xs text-green-400 bg-green-900/20 px-2 py-1 rounded border border-green-900/50">
                    Detected: {detectedCrypto}
                  </span>
                )}
                {!isCustom && detectedCrypto && (
                  <button onClick={() => onDetectAndSetCrypto(content)} className="text-xs text-[#F7B731] hover:underline">
                    Reset Mode
                  </button>
                )}
              </div>

              {!isCustom && content && (
                <button 
                  onClick={onVerifyClick} 
                  className="ml-auto w-full sm:w-auto bg-red-900/40 hover:bg-red-800 text-red-200 text-xs px-4 py-2 rounded border border-red-500/30 flex items-center justify-center transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verify Address
                </button>
              )}
            </div>
        </div>

        <div className="pt-2 bg-gray-900/30 p-3 rounded-lg border border-gray-800 transition-all">
            <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => onInvoiceModeChange(!invoiceMode)}>
                <span className="text-sm font-bold text-white flex items-center">
                  <span className="bg-[#F7B731] w-2 h-2 rounded-full mr-2 animate-pulse"></span>
                  Invoice Mode
                </span>
                <div className={`w-10 h-5 flex items-center rounded-full p-1 duration-300 ease-in-out ${invoiceMode ? 'bg-[#F7B731]' : 'bg-gray-700'}`}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${invoiceMode ? 'translate-x-5' : ''}`}></div>
                </div>
            </div>

            {invoiceMode && (
                <div className="space-y-3 animate-fade-in">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Amount</label>
                            <input type="number" value={amount} onChange={(e) => onAmountChange(e.target.value)} className="w-full form-input p-2 rounded text-sm" placeholder="0.00" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Invoice #</label>
                            <input type="text" value={invoiceNumber} onChange={(e) => onInvoiceNumberChange(e.target.value)} className="w-full form-input p-2 rounded text-sm" placeholder="#001" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Business Name / Title</label>
                        <input type="text" value={businessName} onChange={(e) => onBusinessNameChange(e.target.value)} className="w-full form-input p-2 rounded text-sm" placeholder="My Store Inc." />
                    </div>
                    
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Line Items</label>
                        <div className="space-y-2">
                            {customFields.map(field => (
                                <div key={field.id} className="flex gap-2">
                                    <input type="text" value={field.label} onChange={(e) => updateCustomField(field.id, 'label', e.target.value)} className="w-2/3 form-input p-2 rounded text-xs" placeholder="Description" />
                                    <input type="text" value={field.value} onChange={(e) => updateCustomField(field.id, 'value', e.target.value)} className="w-1/3 form-input p-2 rounded text-xs text-right" placeholder="Price" />
                                    <button onClick={() => removeCustomField(field.id)} className="text-red-500 hover:text-red-400 px-2 hover:bg-red-900/20 rounded">✕</button>
                                </div>
                            ))}
                            <button onClick={addCustomField} className="w-full py-2 text-xs text-[#F7B731] border border-dashed border-[#F7B731]/30 rounded hover:bg-[#F7B731]/10 transition-colors">
                              + Add Item Row
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Footer Notes</label>
                        <textarea value={invoiceNotes} onChange={(e) => onInvoiceNotesChange(e.target.value)} className="w-full form-input p-2 rounded text-sm h-16 resize-none" placeholder="Thank you for your business!" />
                    </div>
                </div>
            )}
        </div>
      </div>

      <AccordionSection title="2. Design & Branding" isOpen={openSection === 0} onToggle={() => handleToggle(0)}>
        <div className="space-y-5">
            <div>
                <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">Quick Presets</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {presets.map(p => (
                        <button key={p.name} onClick={() => onApplyPreset(p)} className={`p-2 text-xs rounded transition-all ${activePreset === p.name ? 'bg-[#F7B731] text-black font-bold' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
                            {p.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800 space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-xs text-gray-300 font-bold uppercase">Dot Colors</label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <span className="text-xs text-gray-400">Use Gradient</span>
                        <input type="checkbox" checked={useGradient} onChange={(e) => onUseGradientChange(e.target.checked)} className="form-checkbox h-4 w-4 rounded bg-gray-800 border-gray-600 text-[#F7B731] focus:ring-[#F7B731] accent-[#F7B731]" />
                    </label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Primary Color</label>
                        <div className="flex items-center space-x-2">
                            <input type="color" value={color} onChange={(e) => onColorChange(e.target.value)} className="h-8 w-full rounded cursor-pointer border-none bg-transparent" />
                        </div>
                    </div>
                    <div className={`transition-opacity duration-300 ${useGradient ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                        <label className="block text-xs text-gray-500 mb-1">Gradient End</label>
                        <div className="flex items-center space-x-2">
                            <input type="color" value={gradientColor} onChange={(e) => onGradientColorChange(e.target.value)} className="h-8 w-full rounded cursor-pointer border-none bg-transparent" disabled={!useGradient} />
                        </div>
                    </div>
                </div>
                {useGradient && (
                    <div className="animate-fade-in pt-1">
                        <label className="block text-xs text-gray-500 mb-1">Gradient Type</label>
                        <div className="grid grid-cols-2 gap-2">
                            {gradOptions.map(o => (
                                <button key={o.id} onClick={() => onGradientTypeChange(o.id)} className={`py-1 text-xs rounded border ${gradientType === o.id ? 'border-[#F7B731] text-[#F7B731] bg-[#F7B731]/10' : 'border-gray-700 text-gray-400 hover:bg-gray-800'}`}>{o.label}</button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div>
                <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">Background</label>
                <div className="flex items-center space-x-3 p-2 bg-gray-900/50 rounded border border-gray-800">
                    <input type="color" value={backgroundColor} onChange={(e) => onBackgroundColorChange(e.target.value)} className="h-8 w-12 rounded cursor-pointer border-none bg-transparent" />
                    <span className="text-xs font-mono text-gray-400">{backgroundColor}</span>
                </div>
            </div>

            <div>
                 <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">Pattern Style</label>
                 <div className="grid grid-cols-3 gap-2">
                    {shapeOptions.map(s => (
                        <button key={s.id} onClick={() => onShapeChange(s.id)} className={`py-2 px-2 text-xs rounded border transition-all ${shape === s.id ? 'bg-white text-black border-white font-bold' : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}>{s.label}</button>
                    ))}
                 </div>
            </div>

            <div>
                 <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">Corner Style</label>
                 <div className="grid grid-cols-3 gap-2">
                    {cornerOptions.map(c => (
                        <button key={c.id} onClick={() => onCornerChange(c.id)} className={`py-2 px-2 text-xs rounded border transition-all ${cornerType === c.id ? 'bg-white text-black border-white font-bold' : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}>{c.label}</button>
                    ))}
                 </div>
            </div>

            <div>
                <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">Center Logo</label>
                <label className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-[#F7B731] hover:bg-gray-800 transition-colors group">
                    <UploadIcon />
                    <span className="ml-2 text-sm text-gray-300 group-hover:text-[#F7B731]">Upload PNG/SVG</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => onLogoChange(e.target.files ? e.target.files[0] : null)} />
                </label>
            </div>

             <div>
                <label className="flex justify-between text-xs text-gray-400 mb-1 uppercase tracking-wide">
                    <span>Resolution</span>
                    <span>{qrSize}px</span>
                </label>
                <input type="range" min="200" max="1000" step="50" value={qrSize} onChange={(e) => onQrSizeChange(Number(e.target.value))} className="w-full accent-[#F7B731] h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
            </div>

            <div className="pt-2 border-t border-gray-800">
                <label className="flex items-center justify-between text-sm font-medium text-gray-300 cursor-pointer">
                    <div className="flex items-center">
                        <input type="checkbox" checked={isDisposable} onChange={(e) => onIsDisposableChange(e.target.checked)} className="form-checkbox h-4 w-4 rounded bg-gray-800 border-gray-600 text-[#F7B731] focus:ring-[#F7B731] accent-[#F7B731] mr-2" />
                        <span>Disposable QR</span>
                    </div>
                    {isDisposable && (
                        <div className="flex items-center bg-gray-900 rounded px-2">
                            <input type="number" min="10" max="300" value={disposableTimeout} onChange={(e) => onDisposableTimeoutChange(parseInt(e.target.value))} className="bg-transparent text-right w-12 text-sm outline-none text-[#F7B731]" />
                            <span className="text-xs text-gray-500 ml-1">sec</span>
                        </div>
                    )}
                </label>
            </div>
        </div>
      </AccordionSection>

      <AccordionSection title="3. Developer Code" isOpen={openSection === 1} onToggle={() => handleToggle(1)}>
        <CodeSnippet code={codeSnippet} />
      </AccordionSection>

      <div className="pt-2">
        <button onClick={onRandomize} className="w-full py-3 text-sm font-semibold text-gray-400 border border-dashed border-gray-700 rounded hover:text-[#F7B731] hover:border-[#F7B731] transition-colors flex items-center justify-center">
            🎲 Randomize Design
        </button>
      </div>
    </div>
  );
};