import React, { useState, useRef, useCallback, useEffect } from 'react';
import QRCodeStyling, { Options, CornerDotType, CornerSquareType, DotType } from 'qr-code-styling';
import { Header } from './components/Header';
import { QrForm } from './components/QrForm';
import { QrPreview } from './components/QrPreview';
import { DonationTerminal } from './components/DonationTerminal';
import { Footer } from './components/Footer';
import InteractiveBackground from './components/InteractiveBackground';
import { ConfirmationModal } from './components/ConfirmationModal';
import type { ShapeType, CornerType, GradientType, Preset, CryptoType } from './types';
import { MONERO_ORANGE } from './constants';

const cryptoOptions: { id: CryptoType; label: string; placeholder: string; uri: string; regex: RegExp }[] = [
  { id: 'monero', label: 'Monero (XMR)', placeholder: 'Enter your Monero address', uri: 'monero', regex: /^[48][1-9A-HJ-NP-Za-km-z]{94}$/ },
  { id: 'bitcoin', label: 'Bitcoin (BTC)', placeholder: 'Enter your Bitcoin address', uri: 'bitcoin', regex: /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/ },
  { id: 'ethereum', label: 'Ethereum (ETH)', placeholder: 'Enter your Ethereum address', uri: 'ethereum', regex: /^0x[a-fA-F0-9]{40}$/ }
];

const shapeOptions: ShapeType[] = ['square', 'dots', 'rounded', 'extra-rounded', 'classy', 'classy-rounded'];
const cornerOptions: CornerType[] = ['square', 'dot', 'extra-rounded'];
const presets: Preset[] = [
  {
    name: 'Monero',
    options: {
      color: MONERO_ORANGE, useGradient: false, gradientColor: '#000000', gradientType: 'linear', backgroundColor: '#FFFFFF',
      shape: 'square', cornerType: 'square'
    }
  },
  {
    name: 'Cypherpunk',
    options: {
      color: '#33FF00', useGradient: false, gradientColor: '#000000', gradientType: 'linear', backgroundColor: '#000000',
      shape: 'dots', cornerType: 'dot'
    },
    randomColors: ['#33FF00', '#00FF00', '#00DD00', '#22FF22', '#11BB11']
  },
  {
    name: 'Cyberpunk',
    options: {
      color: '#FF00FF', useGradient: true, gradientColor: '#00FFFF', gradientType: 'linear', backgroundColor: '#1A1A2E',
      shape: 'classy-rounded', cornerType: 'extra-rounded'
    },
    randomColors: ['#FF00FF', '#00FFFF', '#7B00E0', '#FF4E00', '#00FF7F']
  },
  {
    name: 'Synthwave',
    options: {
      color: '#F7B731', useGradient: true, gradientColor: '#9C27B0', gradientType: 'linear', backgroundColor: '#0D0221',
      shape: 'rounded', cornerType: 'square'
    },
    randomColors: ['#F7B731', '#9C27B0', '#FF0054', '#00F2FF', '#F9F871']
  }
];

const App: React.FC = () => {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoType>('monero');
  const [address, setAddress] = useState<string>('');
  const [logo, setLogo] = useState<string | null>(null);
  const [color, setColor] = useState<string>(MONERO_ORANGE);
  const [shape, setShape] = useState<ShapeType>('square');
  const [cornerType, setCornerType] = useState<CornerType>('square');
  const [backgroundColor, setBackgroundColor] = useState<string>('#FFFFFF');
  const [useGradient, setUseGradient] = useState<boolean>(false);
  const [gradientColor, setGradientColor] = useState<string>('#000000');
  const [gradientType, setGradientType] = useState<GradientType>('linear');
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [qrInstance, setQrInstance] = useState<QRCodeStyling | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);
  const [codeSnippet, setCodeSnippet] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const currentCryptoInfo = cryptoOptions.find(c => c.id === selectedCrypto);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const buildQrOptions = useCallback(() => {
    const qrData = `${currentCryptoInfo?.uri}:${address || 'YOUR_ADDRESS_HERE'}`;
    const dotsOptions = {
      type: shape as DotType,
      ...(useGradient
        ? { gradient: { type: gradientType, colorStops: [{ offset: 0, color: color }, { offset: 1, color: gradientColor }] } }
        : { color: color }),
    };
    return {
      width: 250, height: 250, data: qrData, image: logo ?? undefined,
      dotsOptions, cornersSquareOptions: { type: cornerType as CornerSquareType, color: color },
      cornersDotOptions: { type: 'dot' as CornerDotType, color: color }, backgroundOptions: { color: backgroundColor },
      imageOptions: { crossOrigin: 'anonymous', margin: 5, imageSize: 0.4, hideBackgroundDots: true },
    };
  }, [address, logo, color, shape, cornerType, backgroundColor, useGradient, gradientColor, gradientType, currentCryptoInfo]);
  
  useEffect(() => {
    const options = buildQrOptions();
    const optionsString = JSON.stringify(options, (key, value) => {
      if (key === 'image' && value) return "your_logo_as_data_url.png";
      return value;
    }, 2);
    const fullSnippet = `import QRCodeStyling from 'qr-code-styling';\n\nconst options = ${optionsString};\n\nconst qrCode = new QRCodeStyling(options);\nqrCode.append(document.getElementById("your-element-id"));`;
    setCodeSnippet(fullSnippet);
  }, [buildQrOptions]);

  const validateAddress = (addr: string): boolean => {
    return currentCryptoInfo ? currentCryptoInfo.regex.test(addr) : false;
  };

  const generateOrUpdateQr = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      if (!qrRef.current) {
        setIsLoading(false);
        return;
      }
      try {
        const options: Options = buildQrOptions();
        if(qrRef.current) qrRef.current.innerHTML = '';
        const qr = new QRCodeStyling(options);
        qr.append(qrRef.current);
        setQrInstance(qr);
        if (!isGenerated) setIsGenerated(true);
      } catch (error) {
        console.error("Error generating QR code:", error);
      } finally {
        setIsLoading(false);
      }
    }, 50);
  }, [isGenerated, buildQrOptions]);
  
  const handleGenerateClick = () => {
    if (!validateAddress(address)) {
      alert(`Invalid ${currentCryptoInfo?.label} address. Please check and try again.`);
      return;
    }
    setIsModalOpen(true);
  };
  
  const handleModalConfirm = () => {
    setIsModalOpen(false);
    generateOrUpdateQr();
  };
  
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

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

  const handleRandomize = useCallback(async () => {
    const randomShape = shapeOptions[Math.floor(Math.random() * shapeOptions.length)];
    const randomCorner = cornerOptions[Math.floor(Math.random() * cornerOptions.length)];
    const randomColor1 = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    const randomColor2 = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    const randomBg = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    setShape(randomShape); setCornerType(randomCorner); setColor(randomColor1);
    setGradientColor(randomColor2); setBackgroundColor(randomBg); setUseGradient(Math.random() > 0.5);
    setGradientType(Math.random() > 0.5 ? 'linear' : 'radial'); setActivePreset(null);
    if (isGenerated && validateAddress(address)) {
      await new Promise(resolve => setTimeout(resolve, 100));
      generateOrUpdateQr();
    }
  }, [isGenerated, address, generateOrUpdateQr, validateAddress]);

  const applyPreset = useCallback((preset: Preset) => {
    const { options, randomColors } = preset;
    setColor(randomColors ? randomColors[Math.floor(Math.random() * randomColors.length)] : options.color);
    setUseGradient(options.useGradient);
    setGradientColor(randomColors ? randomColors[Math.floor(Math.random() * randomColors.length)] : options.gradientColor);
    setGradientType(options.gradientType); setBackgroundColor(options.backgroundColor);
    setShape(options.shape); setCornerType(options.cornerType); setActivePreset(preset.name);
    if (isGenerated && validateAddress(address)) {
      setTimeout(() => generateOrUpdateQr(), 100);
    }
  }, [isGenerated, address, generateOrUpdateQr, validateAddress]);

  const handleDownload = () => {
    if (qrInstance) qrInstance.download({ name: `${selectedCrypto}-payment-qr`, extension: 'png' });
  };

  const handleCryptoChange = (crypto: CryptoType) => {
    setSelectedCrypto(crypto); setAddress(''); setIsGenerated(false);
    if(qrRef.current) qrRef.current.innerHTML = '';
  }

  return (
    <>
      {isDesktop && <InteractiveBackground />}
      <div className="relative z-10 min-h-screen p-4 flex flex-col bg-transparent">
        <div className="flex-shrink-0"><Header /></div>
        <main className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 my-8 flex-grow min-h-0">
          <QrForm
            address={address} onAddressChange={setAddress} onLogoChange={handleLogoChange}
            color={color} onColorChange={setColor} shape={shape} onShapeChange={setShape}
            cornerType={cornerType} onCornerChange={setCornerType} backgroundColor={backgroundColor}
            onBackgroundColorChange={setBackgroundColor} useGradient={useGradient}
            onUseGradientChange={setUseGradient} gradientColor={gradientColor}
            onGradientColorChange={setGradientColor} gradientType={gradientType}
            onGradientTypeChange={setGradientType} onGenerateClick={handleGenerateClick}
            isLoading={isLoading} isGenerated={isGenerated}
            presets={presets} onApplyPreset={applyPreset} onRandomize={handleRandomize}
            activePreset={activePreset}
            cryptoOptions={cryptoOptions}
            selectedCrypto={selectedCrypto}
            onCryptoChange={handleCryptoChange}
            codeSnippet={codeSnippet}
          />
          <QrPreview qrRef={qrRef} isGenerated={isGenerated} isLoading={isLoading} onDownload={handleDownload} />
        </main>
        <div className="w-full max-w-6xl mx-auto flex-shrink-0">
          <DonationTerminal />
          <Footer />
        </div>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        address={address}
        cryptoLabel={currentCryptoInfo?.label || 'Crypto'}
      />
    </>
  );
};

export default App;