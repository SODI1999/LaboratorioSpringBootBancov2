import React, { useState } from 'react';
import { TransferResponse } from '../types/bank';
import { CheckCircle2, Copy, Check, X, ShieldCheck, Printer } from 'lucide-react';

interface ReceiptModalProps {
  receipt: TransferResponse | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ receipt, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!receipt) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(receipt.transactionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedAmount = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 2,
  }).format(receipt.amount);

  const formattedNewBalance = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 2,
  }).format(receipt.sourceNewBalance);

  const formattedDate = new Date(receipt.timestamp).toLocaleString('es-CO', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-sm sm:max-w-md bg-[#FAF9F5] border border-stone-300 rounded-2xl sm:rounded-3xl shadow-modal text-ink relative p-4 sm:p-5 flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="receipt-dialog-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors z-10"
          aria-label="Cerrar comprobante"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Voucher Header (Compact) */}
        <div className="text-center mb-3">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 mb-1.5 shadow-subtle">
            <CheckCircle2 className="w-4 h-4" />
          </div>

          <div className="block">
            <span className="inline-block px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[9px] font-mono tracking-wider uppercase mb-1">
              Recibo Oficial de Traslado
            </span>
          </div>

          <h2 id="receipt-dialog-title" className="text-base sm:text-lg font-bold tracking-tight text-ink leading-tight">
            ¡Transferencia Exitosa!
          </h2>

          <p className="text-[11px] text-stone-500 mt-0.5">
            Fondos acreditados de forma inmediata en la cuenta destino.
          </p>
        </div>

        {/* QR Code Container (Crisp & Compact) */}
        <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-stone-200/80 shadow-subtle flex flex-col items-center justify-center mb-3">
          {receipt.qrPayload ? (
            <img
              src={receipt.qrPayload}
              alt="Código QR del Comprobante"
              className="w-28 h-28 sm:w-32 sm:h-32 object-contain rounded-lg"
            />
          ) : (
            <div className="w-28 h-28 sm:w-32 sm:h-32 bg-stone-100 rounded-lg flex items-center justify-center text-xs text-stone-400 font-mono">
              QR No Disponible
            </div>
          )}
          <span className="text-[9px] text-stone-600 font-mono mt-1.5 uppercase tracking-wider flex items-center space-x-1">
            <ShieldCheck className="w-3 h-3 text-emerald-700" />
            <span>Código QR con datos básicos codificados</span>
          </span>
        </div>

        {/* Metadata Details (Compact Ledger) */}
        <div className="space-y-1 text-xs mb-3.5 px-0.5">
          <div className="flex items-center justify-between py-0.5 border-b border-stone-200/60">
            <span className="text-stone-500 text-[11px]">ID Transacción</span>
            <div className="flex items-center space-x-1.5">
              <span className="font-mono text-stone-800 font-medium text-[11px]">
                {receipt.transactionId.slice(0, 12)}...
              </span>
              <button
                onClick={handleCopyId}
                className="p-0.5 rounded hover:bg-stone-200 text-stone-500 hover:text-ink transition-colors"
                title="Copiar ID completo"
                aria-label={copied ? "ID de transacción copiado" : "Copiar ID de transacción"}
              >
                {copied ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between py-0.5 border-b border-stone-200/60">
            <span className="text-stone-500 text-[11px]">Cuentas</span>
            <span className="font-mono text-stone-800 text-[11px] font-semibold">
              {receipt.sourceAccountNumber} → {receipt.destinationAccountNumber}
            </span>
          </div>

          <div className="flex items-center justify-between py-0.5 border-b border-stone-200/60">
            <span className="text-stone-500 text-[11px]">Monto Transferido</span>
            <span className="font-mono font-bold text-ink text-xs sm:text-sm tabular-nums">
              {formattedAmount}
            </span>
          </div>

          <div className="flex items-center justify-between py-0.5 border-b border-stone-200/60">
            <span className="text-stone-500 text-[11px]">Nuevo Saldo</span>
            <span className="font-mono font-bold text-emerald-800 text-xs sm:text-sm tabular-nums">
              {formattedNewBalance}
            </span>
          </div>

          <div className="flex items-center justify-between py-0.5">
            <span className="text-stone-500 text-[11px]">Fecha y Hora</span>
            <span className="font-mono text-[10px] text-stone-600">{formattedDate}</span>
          </div>
        </div>

        {/* Action Buttons (Side by Side - Compact) */}
        <div className="flex items-center space-x-2 pt-1 border-t border-stone-200/80">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-3 rounded-xl bg-ink hover:bg-black text-white text-xs font-semibold tracking-wide shadow-sm transition-all active:scale-[0.98] text-center"
          >
            Aceptar y Volver
          </button>
          <button
            onClick={() => window.print()}
            className="py-2 px-3 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-medium tracking-wide transition-colors flex items-center justify-center space-x-1.5 active:scale-[0.98]"
            title="Imprimir Comprobante"
          >
            <Printer className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline">Imprimir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
