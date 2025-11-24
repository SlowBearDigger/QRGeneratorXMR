import React, { useState, useRef, useCallback, useEffect } from 'react';
import QRCodeStyling, { CornerDotType, CornerSquareType, DotType } from 'qr-code-styling';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Header } from './components/Header';
import { QrForm } from './components/QrForm';
import { QrPreview } from './components/QrPreview';
import { InvoicePreview } from './components/InvoicePreview';
import { DonationTerminal } from './components/DonationTerminal';
import { Footer } from './components/Footer';
import InteractiveBackground from './components/InteractiveBackground';
import { ConfirmationModal } from './components/ConfirmationModal';
import { useDebounce } from './hooks/useDebounce';
import type { ShapeType, CornerType, GradientType, Preset, CryptoType, CustomField } from './types';
import { MONERO_ORANGE, cryptoOptions } from './constants';

const shapeOptions: ShapeType[] = ['square', 'dots', 'rounded', 'extra-rounded', 'classy', 'classy-rounded'];
const cornerOptions: CornerType[] = ['square', 'dot', 'extra-rounded'];

const presets: Preset[] = [
  {
    name: 'Monero',
    options: { color: MONERO_ORANGE, useGradient: false, gradientColor: '#000000', gradientType: 'linear', backgroundColor: '#FFFFFF', shape: 'square', cornerType: 'square' }
  },
  {
    name: 'Cypherpunk',
    options: { color: '#33FF00', useGradient: false, gradientColor: '#000000', gradientType: 'linear', backgroundColor: '#000000', shape: 'dots', cornerType: 'dot' },
    randomColors: ['#33FF00', '#00FF00', '#00DD00', '#22FF22', '#11BB11']
  },
  {
    name: 'Cyberpunk',
    options: { color: '#FF00FF', useGradient: true, gradientColor: '#00FFFF', gradientType: 'linear', backgroundColor: '#1A1A2E', shape: 'classy-rounded', cornerType: 'extra-rounded' },
    randomColors: ['#FF00FF', '#00FFFF', '#7B00E0', '#FF4E00', '#00FF7F']
  },
  {
    name: 'Synthwave',
    options: { color: '#F7B731', useGradient: true, gradientColor: '#9C27B0', gradientType: 'linear', backgroundColor: '#0D0221', shape: 'rounded', cornerType: 'square' },
    randomColors: ['#F7B731', '#9C27B0', '#FF0054', '#00F2FF', '#F9F871']
  }
];

const App: React.FC = () => {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoType>('custom');
  const [content, setContent] = useState<string>('');
  const [label, setLabel] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  
  const [invoiceMode, setInvoiceMode] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceNotes, setInvoiceNotes] = useState('');
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  const [logo, setLogo] = useState<string | null>(null);
  const [color, setColor] = useState<string>(MONERO_ORANGE);
  const [shape, setShape] = useState<ShapeType>('square');
  const [cornerType, setCornerType] = useState<CornerType>('square');
  const [backgroundColor, setBackgroundColor] = useState<string>('#FFFFFF');
  const [useGradient, setUseGradient] = useState<boolean>(false);
  const [gradientColor, setGradientColor] = useState<string>('#000000');
  const [gradientType, setGradientType] = useState<GradientType>('linear');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [qrInstance, setQrInstance] = useState<QRCodeStyling | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);
  const [codeSnippet, setCodeSnippet] = useState<string>('');
  const [qrSize, setQrSize] = useState<number>(300);
  const [isDisposable, setIsDisposable] = useState<boolean>(false);
  const [disposableTimeout, setDisposableTimeout] = useState<number>(60);
  const [countdown, setCountdown] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const qrRef = useRef<HTMLDivElement>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const currentCryptoInfo = cryptoOptions.find(c => c.id === selectedCrypto);

  const debouncedContent = useDebounce(content, 300);
  const debouncedStyle = useDebounce({
    color, shape, cornerType, backgroundColor, useGradient, gradientColor, gradientType, logo, label, message, amount, selectedCrypto, qrSize, invoiceMode
  }, 300);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (content && isDisposable && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && isDisposable && content) {
      if (qrRef.current) qrRef.current.innerHTML = '';
    }
    return () => clearTimeout(timer);
  }, [countdown, isDisposable, content]);

  const buildQrData = useCallback(() => {
    if (!content) return 'https://slowbeardigger.dev'; 

    if (selectedCrypto === 'custom') return content;

    const info = currentCryptoInfo;
    if (!info) return content;

    const baseUri = `${info.uri}:${content}`;
    const params = new URLSearchParams();

    if (amount) params.append('amount', amount);
    if (info.labelParam && label) params.append(info.labelParam, label);
    if (info.supportsMessage && message) params.append(info.messageParam, message);

    const queryString = params.toString();
    return queryString ? `${baseUri}?${queryString}` : baseUri;

  }, [content, amount, label, message, selectedCrypto, currentCryptoInfo]);

  const buildQrOptions = useCallback(() => {
    const qrData = buildQrData();
    
    const actualSize = invoiceMode ? 200 : qrSize; 

    const dotsOptions = {
      type: shape as DotType,
      ...(useGradient
        ? { gradient: { type: gradientType, colorStops: [{ offset: 0, color: color }, { offset: 1, color: gradientColor }] } }
        : { color: color }),
    };

    return {
      width: actualSize,
      height: actualSize,
      data: qrData,
      image: logo ?? undefined,
      dotsOptions,
      cornersSquareOptions: { type: cornerType as CornerSquareType, color: color },
      cornersDotOptions: { type: 'dot' as CornerDotType, color: color },
      backgroundOptions: { color: invoiceMode ? 'transparent' : backgroundColor },
      imageOptions: { crossOrigin: 'anonymous', margin: 5, imageSize: 0.4, hideBackgroundDots: true },
    };
  }, [buildQrData, logo, color, shape, cornerType, backgroundColor, useGradient, gradientColor, gradientType, qrSize, invoiceMode]);

  useEffect(() => {
    if (!qrRef.current) return;

    try {
      const options = buildQrOptions();
      
      setCodeSnippet(`const options = ${JSON.stringify(options, (k, v) => k === 'image' && v ? 'BASE64_IMAGE' : v, 2)};\nnew QRCodeStyling(options).append(document.getElementById("qr"));`);

      if (!qrInstance) {
        const newQr = new QRCodeStyling(options);
        newQr.append(qrRef.current);
        setQrInstance(newQr);
      } else {
        qrRef.current.innerHTML = ''; 
        qrInstance.update(options);
        qrInstance.append(qrRef.current);
      }
      
      if (isDisposable) setCountdown(disposableTimeout);

    } catch (err) {
      console.error("QR Gen Error", err);
    }
  }, [debouncedContent, debouncedStyle, buildQrOptions, qrInstance, isDisposable, disposableTimeout, invoiceMode]);

  const fileToDataUrl = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  
  const handleLogoChange = async (file: File | null) => {
    if (!file) { setLogo(null); return; }
    try {
      const dataUrl = await fileToDataUrl(file);
      setLogo(dataUrl);
    } catch (error) {
      console.error('Error reading file:', error);
      setLogo(null);
    }
  };

  const handleRandomize = useCallback(() => {
    const randomShape = shapeOptions[Math.floor(Math.random() * shapeOptions.length)];
    const randomCorner = cornerOptions[Math.floor(Math.random() * cornerOptions.length)];
    const rColor1 = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    const rColor2 = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    const rBg = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    
    setShape(randomShape);
    setCornerType(randomCorner);
    setColor(rColor1);
    setGradientColor(rColor2);
    setBackgroundColor(rBg);
    setUseGradient(Math.random() > 0.5);
    setActivePreset(null);
  }, []);

  const applyPreset = useCallback((preset: Preset) => {
    const { options, randomColors } = preset;
    setColor(randomColors ? randomColors[Math.floor(Math.random() * randomColors.length)] : options.color);
    setUseGradient(options.useGradient);
    setGradientColor(randomColors ? randomColors[Math.floor(Math.random() * randomColors.length)] : options.gradientColor);
    setGradientType(options.gradientType); 
    setBackgroundColor(options.backgroundColor);
    setShape(options.shape); 
    setCornerType(options.cornerType); 
    setActivePreset(preset.name);
  }, []);

  const handleDownload = async (extension: 'png' | 'svg' | 'pdf') => {
    if (!qrInstance && !invoiceMode) return;

    if (invoiceMode && invoiceRef.current) {
        try {
            const canvas = await html2canvas(invoiceRef.current, {
                backgroundColor: null,
                scale: 2,
                useCORS: true
            });
            
            const imgData = canvas.toDataURL('image/png');
            
            if (extension === 'pdf') {
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'px',
                    format: [canvas.width, canvas.height]
                });
                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                pdf.save(`Invoice-${invoiceNumber || 'Draft'}.pdf`);
            } else {
                const link = document.createElement('a');
                link.download = `Invoice-${invoiceNumber || 'Draft'}.png`;
                link.href = imgData;
                link.click();
            }
        } catch (e) {
            console.error("Invoice download failed", e);
            alert("Failed to download invoice. Please try again.");
        }
        return;
    }

    if (extension === 'pdf') {
       qrInstance?.getRawData('png').then(data => {
        if (!data) return;
        const blob = data instanceof Blob ? data : new Blob([data as any]);
        const reader = new FileReader();
        reader.onload = function(event) {
          const imgData = event.target?.result as string;
          const pdf = new jsPDF();
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth - 20, pdfHeight - 20);
          pdf.save(`payqr-${selectedCrypto}.pdf`);
        };
        reader.readAsDataURL(blob);
      });
    } else {
        qrInstance?.download({ name: `payqr-${selectedCrypto}`, extension });
    }
  };

  const detectAndSetCrypto = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
        setSelectedCrypto('custom');
        setContent('');
        return null;
    }

    for (const crypto of cryptoOptions) {
        if (crypto.regex && crypto.regex.test(trimmed)) {
            setSelectedCrypto(crypto.id);
            setContent(trimmed);
            return crypto.label;
        }
    }
    setSelectedCrypto('custom');
    setContent(trimmed);
    return 'Custom / Text';
  };

  const handleCryptoChange = (id: CryptoType) => {
      setSelectedCrypto(id);
  }

  const handleVerifyClick = () => {
    if (!content.trim()) return;
    if (currentCryptoInfo?.regex && !currentCryptoInfo.regex.test(content)) {
        alert(`Warning: This does not look like a valid ${currentCryptoInfo.label} address.`);
    }
    setIsModalOpen(true);
  };

  return (
    <>
      {isDesktop && <InteractiveBackground />}
      <div className="relative z-10 min-h-screen p-4 flex flex-col bg-black/50 md:bg-transparent">
        <div className="flex-shrink-0"><Header /></div>
        <main className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 my-8 flex-grow min-h-0">
          <QrForm
            content={content} onContentChange={setContent}
            label={label} onLabelChange={setLabel}
            message={message} onMessageChange={setMessage}
            amount={amount} onAmountChange={setAmount}
            businessName={businessName} onBusinessNameChange={setBusinessName}
            invoiceNumber={invoiceNumber} onInvoiceNumberChange={setInvoiceNumber}
            invoiceNotes={invoiceNotes} onInvoiceNotesChange={setInvoiceNotes}
            customFields={customFields} onCustomFieldsChange={setCustomFields}
            invoiceMode={invoiceMode} onInvoiceModeChange={setInvoiceMode}
            onLogoChange={handleLogoChange}
            color={color} onColorChange={setColor} 
            shape={shape} onShapeChange={setShape}
            cornerType={cornerType} onCornerChange={setCornerType} 
            backgroundColor={backgroundColor} onBackgroundColorChange={setBackgroundColor} 
            useGradient={useGradient} onUseGradientChange={setUseGradient} 
            gradientColor={gradientColor} onGradientColorChange={setGradientColor} 
            gradientType={gradientType} onGradientTypeChange={setGradientType} 
            isLoading={isLoading} 
            presets={presets} onApplyPreset={applyPreset} onRandomize={handleRandomize}
            activePreset={activePreset}
            cryptoOptions={cryptoOptions}
            selectedCrypto={selectedCrypto}
            onCryptoChange={handleCryptoChange}
            codeSnippet={codeSnippet}
            qrSize={qrSize} onQrSizeChange={setQrSize}
            onDetectAndSetCrypto={detectAndSetCrypto}
            onVerifyClick={handleVerifyClick}
            isGenerated={!!content}
            isDisposable={isDisposable}
            onIsDisposableChange={setIsDisposable}
            disposableTimeout={disposableTimeout}
            onDisposableTimeoutChange={setDisposableTimeout}
          />
          
          <div className="w-full h-full flex items-center justify-center lg:sticky lg:top-0">
            {invoiceMode ? (
                <div className="w-full flex flex-col items-center">
                    <div className="transform scale-90 md:scale-100 origin-top w-full flex justify-center">
                        <InvoicePreview 
                            ref={invoiceRef}
                            businessName={businessName}
                            invoiceNumber={invoiceNumber}
                            date={new Date().toLocaleDateString()}
                            customFields={customFields}
                            amount={amount}
                            currency={selectedCrypto === 'custom' ? 'UNITS' : currentCryptoInfo?.label.split(' ')[1] || ''}
                            qrRef={qrRef}
                            logo={logo}
                            notes={invoiceNotes}
                        />
                    </div>
                    <div className="flex gap-4 mt-4">
                        <button onClick={() => handleDownload('png')} className="px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-colors shadow-lg flex items-center">
                            <span className="mr-2">↓</span> Download PNG
                        </button>
                        <button onClick={() => handleDownload('pdf')} className="px-4 py-2 bg-[#F7B731] text-black font-bold rounded hover:bg-orange-500 transition-colors shadow-lg flex items-center">
                            <span className="mr-2">↓</span> Download PDF
                        </button>
                    </div>
                </div>
            ) : (
                <QrPreview 
                    qrRef={qrRef} 
                    isGenerated={!!content}
                    isLoading={isLoading} 
                    onDownload={handleDownload} 
                    qrInstance={qrInstance}
                    countdown={countdown}
                    isDisposable={isDisposable}
                />
            )}
          </div>
        </main>
        <div className="w-full max-w-6xl mx-auto flex-shrink-0">
          <DonationTerminal />
          <Footer />
        </div>
      </div>
      
      <ConfirmationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        address={content} 
        cryptoLabel={currentCryptoInfo?.label || 'Custom'}
      />
    </>
  );
};

export default App;