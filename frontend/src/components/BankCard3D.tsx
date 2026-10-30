import React, { useState, useRef } from 'react';
import { Account } from '../types/bank';
import { Wifi, RotateCw, ShieldCheck } from 'lucide-react';

interface BankCard3DProps {
  account: Account;
  cardType?: 'DEBIT' | 'CREDIT';
}

export const BankCard3D: React.FC<BankCard3DProps> = ({ account, cardType = 'DEBIT' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });
  const [isFlipped, setIsFlipped] = useState(false);

  const isSavings = account.accountType === 'SAVINGS';

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate rotation clamped to +/- 12 degrees
    const rX = -(((y - rect.height / 2) / (rect.height / 2)) * 12);
    const rY = (((x - rect.width / 2) / (rect.width / 2)) * 12);

    setRotateX(rX);
    setRotateY(rY);

    // Calculate glare percentage
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.35,
    });
  };

  const handlePointerLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  // Mask card number nicely based on account number
  const lastFour = account.accountNumber.replace(/\D/g, '').padEnd(4, '0').slice(-4);
  const formattedCardNumber = `4532  ••••  ••••  ${lastFour}`;

  // Formatter for balance
  const formattedBalance = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: account.currency || 'COP',
    minimumFractionDigits: 2,
  }).format(account.balance);

  return (
    <div className="flex flex-col items-center w-full max-w-sm sm:max-w-md mx-auto select-none">
      {/* 3D Viewport */}
      <div
        className="perspective-1200 w-full aspect-[1.586/1] relative cursor-pointer"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={() => setIsFlipped(!isFlipped)}
        title="Haz clic para voltear la tarjeta"
      >
        <div
          ref={cardRef}
          className="w-full h-full preserve-3d transition-transform duration-500 ease-out card-3d-tilt"
          style={{
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY + (isFlipped ? 180 : 0)}deg)`,
          }}
        >
          {/* ================= FRONT FACE ================= */}
          <div
            className={`absolute inset-0 w-full h-full rounded-2xl p-6 sm:p-7 backface-hidden flex flex-col justify-between overflow-hidden transition-all duration-300 ${
              isSavings
                ? 'bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white shadow-card-3d border border-zinc-700/60'
                : 'bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200 text-stone-900 shadow-card-white-3d border border-stone-300/80'
            }`}
          >
            {/* Specular glare overlay */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-2xl"
              style={{
                opacity: glarePosition.opacity,
                background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, ${
                  isSavings ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.6)'
                } 0%, transparent 60%)`,
              }}
            />

            {/* Subtle background guilloche texture */}
            <div
              className={`absolute inset-0 pointer-events-none opacity-[0.035] ${
                isSavings ? 'invert' : ''
              }`}
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                backgroundSize: '16px 16px',
              }}
            />

            {/* Top row: Bank Insignia & Contactless Icon */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs tracking-tighter ${
                    isSavings
                      ? 'bg-gradient-to-b from-amber-200 to-amber-400 text-zinc-950 shadow-sm'
                      : 'bg-zinc-900 text-stone-100 shadow-sm'
                  }`}
                >
                  T
                </div>
                <div>
                  <span className="text-xs font-semibold tracking-wider uppercase block">
                    Banco TdeA
                  </span>
                  <span
                    className={`text-[9px] uppercase tracking-widest block font-medium ${
                      isSavings ? 'text-zinc-400' : 'text-stone-500'
                    }`}
                  >
                    Banca Privada
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span
                  className={`text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded border ${
                    isSavings
                      ? 'border-zinc-700/80 text-zinc-300 bg-zinc-900/60'
                      : 'border-stone-300 text-stone-600 bg-stone-100/80'
                  }`}
                >
                  {cardType === 'CREDIT' ? 'Crédito' : isSavings ? 'Ahorros' : 'Corriente'}
                </span>
                <Wifi
                  className={`w-4 h-4 transform rotate-90 ${
                    isSavings ? 'text-zinc-400' : 'text-stone-500'
                  }`}
                />
              </div>
            </div>

            {/* Middle: EMV Chip SVG */}
            <div className="relative z-10 flex items-center space-x-3 my-1">
              <svg
                className="w-12 h-9 rounded-md shadow-inner"
                viewBox="0 0 50 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="50"
                  height="36"
                  rx="4"
                  fill={isSavings ? '#D4AF37' : '#C5CCD6'}
                />
                <rect
                  x="1"
                  y="1"
                  width="48"
                  height="34"
                  rx="3"
                  fill={isSavings ? '#E5C158' : '#D9E0EC'}
                />
                <path
                  d="M0 18H18M32 18H50M18 0V36M32 0V36M18 10H32M18 26H32"
                  stroke={isSavings ? '#997A15' : '#8A94A6'}
                  strokeWidth="1.2"
                />
                <rect
                  x="18"
                  y="10"
                  width="14"
                  height="16"
                  rx="2"
                  fill={isSavings ? '#D4AF37' : '#B8C2D1'}
                />
              </svg>
            </div>

            {/* Bottom Section: Number, Name & Tabular Balance */}
            <div className="relative z-10 space-y-2">
              <div
                className={`font-mono text-base sm:text-lg tracking-[0.16em] tabular-nums font-semibold ${
                  isSavings
                    ? 'text-zinc-100 [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]'
                    : 'text-stone-900 [text-shadow:0_1px_1px_rgba(255,255,255,0.9)]'
                }`}
              >
                {formattedCardNumber}
              </div>

              <div className="flex items-end justify-between pt-1">
                <div>
                  <span
                    className={`block text-[8px] uppercase tracking-widest font-medium ${
                      isSavings ? 'text-zinc-400' : 'text-stone-500'
                    }`}
                  >
                    Titular Autorizado
                  </span>
                  <span className="block text-xs sm:text-sm font-semibold tracking-wide uppercase truncate max-w-[170px]">
                    {account.holderName}
                  </span>
                </div>

                <div className="text-right">
                  <span
                    className={`block text-[8px] uppercase tracking-widest font-medium ${
                      isSavings ? 'text-zinc-400' : 'text-stone-500'
                    }`}
                  >
                    Saldo Disponible
                  </span>
                  <span className="block font-mono text-xs sm:text-sm font-bold tabular-nums">
                    {formattedBalance}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= BACK FACE (180 deg) ================= */}
          <div
            className={`absolute inset-0 w-full h-full rounded-2xl backface-hidden rotate-y-180 flex flex-col justify-between overflow-hidden transition-all duration-300 ${
              isSavings
                ? 'bg-zinc-950 text-white shadow-card-3d border border-zinc-800'
                : 'bg-stone-100 text-stone-900 shadow-card-white-3d border border-stone-300'
            }`}
          >
            {/* Magnetic Stripe */}
            <div className="w-full h-11 bg-zinc-900 mt-5 border-y border-black" />

            {/* Signature Block & CVV */}
            <div className="px-6 py-2 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="flex-1 h-8 bg-stone-200 rounded px-2.5 flex items-center justify-between border border-stone-300 shadow-inner">
                  <span className="text-[9px] font-mono tracking-wider text-stone-500 italic select-none">
                    Firma autorizada
                  </span>
                  <span className="text-[10px] font-mono tracking-widest text-stone-800 font-bold">
                    {account.accountNumber}
                  </span>
                </div>
                <div className="w-12 h-8 bg-white border border-stone-300 rounded flex items-center justify-center shadow-inner">
                  <span className="font-mono text-xs font-bold text-stone-900 tracking-wider">
                    842
                  </span>
                </div>
              </div>

              {/* Legal disclaimer & Hologram badge */}
              <div className="flex items-center justify-between text-[8px] text-stone-400 leading-tight space-x-4">
                <p className="flex-1">
                  Esta tarjeta es de uso personal e intransferible. Respaldada por el fondo de
                  garantías bancarias y emitida por Banco TdeA para el laboratorio 2026.
                </p>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 via-rose-300 to-teal-400 flex items-center justify-center shadow-sm opacity-90 flex-shrink-0">
                  <ShieldCheck className="w-4 h-4 text-zinc-950" />
                </div>
              </div>
            </div>

            {/* Bottom Support line */}
            <div
              className={`px-6 py-2.5 border-t text-[9px] font-mono flex items-center justify-between ${
                isSavings
                  ? 'border-zinc-800 text-zinc-500 bg-zinc-900/40'
                  : 'border-stone-200 text-stone-500 bg-stone-200/50'
              }`}
            >
              <span>Línea Nacional: 01 8000 112 400</span>
              <span className="font-semibold">bancotdea.edu.co</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tactile Flip Button */}
      <button
        type="button"
        onClick={() => setIsFlipped(!isFlipped)}
        className="mt-3.5 inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-200/80 transition-all active:scale-95"
      >
        <RotateCw className="w-3.5 h-3.5" />
        <span>{isFlipped ? 'Ver Frontal de Tarjeta' : 'Voltear Tarjeta (Ver CVV / Reverso)'}</span>
      </button>
    </div>
  );
};
