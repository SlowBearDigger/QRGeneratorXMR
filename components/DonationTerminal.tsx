import React, { useState, useEffect } from 'react';

const messages = [
  { lang: "English", text: "Thank you for your support!" },
  { lang: "Security", text: "Always verify QR codes before sending funds." },
  { lang: "Español", text: "¡Gracias por tu apoyo!" },
  { lang: "Français", text: "Merci pour votre soutien !" },
  { lang: "Deutsch", text: "Danke für Ihre Unterstützung!" },
  { lang: "Security", text: "Send a test transaction first for new addresses." },
  { lang: "Português", text: "Obrigado pelo seu apoio!" },
  { lang: "Русский", text: "Спасибо за вашу поддержку!" },
  { lang: "日本語", text: "ご支援ありがとうございます！" },
  { lang: "中文", text: "感谢您的支持！" },
  { lang: "Security", text: "Double-check the address matches your own." },
  { lang: "Italiano", text: "Grazie per il vostro supporto!" },
  { lang: "Nederlands", text: "Bedankt voor uw steun!" },
  { lang: "Polski", "text": "Dziękujemy za wsparcie!" },
  { lang: "Svenska", text: "Tack för ditt stöd!" },
];

export const DonationTerminal: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentMessage = messages[currentIndex];

  return (
    <div className="w-full bg-black/80 backdrop-blur-sm border border-gray-800 rounded-lg p-4 font-mono">
      <h3 className="text-sm text-green-400 font-bold mb-2"> INCOMING COMMUNITY TRANSMISSIONS...</h3>
      <div className="text-gray-300 h-8 flex items-center">
        <span className={`${currentMessage.lang === 'Security' ? 'text-red-500' : 'text-orange-400'} mr-2`}>{`[${currentMessage.lang}]`}</span>
        <p key={currentIndex} className="animate-fade-in">{currentMessage.text}</p>
        <span className="blinking-cursor ml-1 bg-green-400 w-2 h-4"></span>
      </div>
    </div>
  );
};