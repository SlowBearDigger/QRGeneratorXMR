import React, { forwardRef } from 'react';
import { CustomField } from '../types';

interface InvoicePreviewProps {
  businessName: string;
  invoiceNumber: string;
  date: string;
  customFields: CustomField[];
  amount: string;
  currency: string;
  qrRef: React.RefObject<HTMLDivElement>;
  logo: string | null;
  notes: string;
}

export const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>((props, ref) => {
  const { businessName, invoiceNumber, date, customFields, amount, currency, qrRef, logo, notes } = props;

  return (
    <div className="w-full flex justify-center p-4">
      <div 
        ref={ref} 
        className="w-full max-w-md shadow-2xl rounded-sm overflow-hidden relative flex flex-col"
        style={{ minHeight: '600px', backgroundColor: '#ffffff', color: '#000000' }}
      >
        <div style={{ height: '8px', width: '100%', backgroundColor: '#F7B731' }}></div>
        
        <div className="p-8 flex-grow flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <div className="flex-1">
              <h1 
                className="text-2xl font-bold uppercase tracking-wider break-words" 
                style={{ color: '#111827' }}
              >
                {businessName || 'BUSINESS NAME'}
              </h1>
              <p className="text-sm mt-1" style={{ color: '#6B7280' }}>INVOICE / RECEIPT</p>
            </div>
            {logo && (
              <div className="ml-4">
                <img src={logo} alt="Logo" className="w-16 h-16 object-contain" />
              </div>
            )}
          </div>

          <div className="flex justify-between text-sm mb-8 pb-4" style={{ borderBottom: '1px solid #E5E7EB' }}>
            <div>
              <p className="text-xs uppercase" style={{ color: '#6B7280' }}>Date</p>
              <p className="font-mono font-bold" style={{ color: '#000000' }}>{date || new Date().toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase" style={{ color: '#6B7280' }}>Invoice #</p>
              <p className="font-mono font-bold" style={{ color: '#000000' }}>{invoiceNumber || '0001'}</p>
            </div>
          </div>

          <div className="space-y-3 mb-8 flex-grow">
            {customFields.length > 0 ? customFields.map((field) => (
              <div key={field.id} className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid #F3F4F6' }}>
                <span className="font-medium" style={{ color: '#4B5563' }}>{field.label}</span>
                <span className="font-mono font-bold" style={{ color: '#111827' }}>{field.value}</span>
              </div>
            )) : (
              <div className="text-center text-xs italic py-4" style={{ color: '#9CA3AF' }}>
                No line items added
              </div>
            )}
            
            {amount && (
              <div className="flex justify-between items-center pt-4 mt-4" style={{ borderTop: '2px solid #111827' }}>
                <span className="text-lg font-bold uppercase" style={{ color: '#000000' }}>Total</span>
                <span className="text-2xl font-bold px-2 rounded-sm font-mono" style={{ color: '#F7B731', backgroundColor: '#000000' }}>
                  {amount} <span className="text-sm">{currency}</span>
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center justify-center mt-auto pt-6" style={{ borderTop: '1px dashed #E5E7EB' }}>
            <p className="text-xs mb-3 uppercase tracking-widest" style={{ color: '#6B7280' }}>Scan to Pay</p>
            
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#ffffff', border: '2px solid #000000' }}>
                <div ref={qrRef} className="flex items-center justify-center min-w-[150px] min-h-[150px]"></div>
            </div>
            
            {notes && (
                <p className="text-center text-xs mt-4 italic max-w-[90%] break-words" style={{ color: '#6B7280' }}>
                    "{notes}"
                </p>
            )}
          </div>
        </div>
        
        <div className="p-3 text-center" style={{ backgroundColor: '#F3F4F6' }}>
            <p className="text-[10px] font-mono" style={{ color: '#9CA3AF' }}>Generated securely by Monero PayQR</p>
        </div>
      </div>
    </div>
  );
});

InvoicePreview.displayName = 'InvoicePreview';