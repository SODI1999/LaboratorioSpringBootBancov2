import React, { useState } from 'react';
import { Account, Transaction, TransferResponse } from '../types/bank';
import { BankCard3D } from './BankCard3D';
import { TransactionHistory } from './TransactionHistory';
import { TransferModal } from './TransferModal';
import { ReceiptModal } from './ReceiptModal';
import { LogOut, Send, RefreshCw, ShieldCheck } from 'lucide-react';

interface DashboardProps {
  currentAccount: Account;
  availableAccounts: Account[];
  transactions: Transaction[];
  loadingTransactions: boolean;
  historyError: string | null;
  onRefreshAll: () => void;
  onLogout: () => void;
  onTransferCompleted: (response: TransferResponse) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentAccount,
  availableAccounts,
  transactions,
  loadingTransactions,
  historyError,
  onRefreshAll,
  onLogout,
  onTransferCompleted,
}) => {
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<TransferResponse | null>(null);

  const handleTransferSuccess = (response: TransferResponse) => {
    onTransferCompleted(response);
    setActiveReceipt(response);
  };

  const handleViewPastQr = (t: Transaction) => {
    setActiveReceipt({
      transactionId: t.transactionId,
      sourceAccountNumber: t.sourceAccountNumber,
      destinationAccountNumber: t.destinationAccountNumber,
      amount: t.amount,
      sourceNewBalance: currentAccount.balance,
      timestamp: t.timestamp,
      status: t.status,
      qrPayload: t.qrPayload,
    });
  };

  const formattedBalance = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currentAccount.currency || 'COP',
    minimumFractionDigits: 2,
  }).format(currentAccount.balance);

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col antialiased selection:bg-stone-200 selection:text-ink-pure">
      {/* Top Navigation */}
      <header className="border-b border-ink-border/60 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-ink text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-sm">
              T
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight text-ink block">
                Banco TdeA
              </span>
              <span className="text-[10px] text-stone-500 tracking-wider uppercase block font-medium">
                Banca Institucional
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-xs bg-stone-100/80 px-3 py-1.5 rounded-full border border-stone-200">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="font-semibold text-stone-800">{currentAccount.holderName}</span>
              <span className="text-stone-400">({currentAccount.accountNumber})</span>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors border border-transparent hover:border-stone-200"
              title="Cerrar sesión actual"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 flex-1 space-y-8 w-full">
        {/* Hero Section: Account Overview & 3D Tactile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Greeting, Balance & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-600 text-[11px] font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Banca en Línea Protegida • Cuenta de Ahorros Principal</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
                Hola, {currentAccount.holderName.split(' ')[0]}
              </h1>
              <p className="text-stone-600 text-sm max-w-lg">
                Realiza traslados instantáneos a cuentas bancarias registradas y genera comprobantes digitales con código QR escaneable.
              </p>
            </div>

            {/* Account Balance Widget */}
            <div className="p-6 rounded-2xl bg-white border border-ink-border shadow-card space-y-4">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-stone-600 uppercase font-semibold block">
                    Saldo Disponible
                  </span>
                  <div className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-ink tabular-nums mt-1">
                    {formattedBalance}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono tracking-widest text-stone-600 uppercase font-semibold block">
                    Cuentas Registradas
                  </span>
                  <p className="text-lg sm:text-xl font-mono font-bold text-stone-800 tabular-nums mt-0.5">
                    {availableAccounts.length} activas
                  </p>
                </div>
              </div>

              {/* Action Buttons: Single filled primary action */}
              <div className="pt-2 flex flex-wrap gap-3 border-t border-stone-100">
                <button
                  onClick={() => setIsTransferModalOpen(true)}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-ink hover:bg-black text-white font-semibold text-xs shadow-sm transition-all active:scale-[0.98] focus:ring-2 focus:ring-ink"
                >
                  <Send className="w-3.5 h-3.5 text-stone-200" />
                  <span>Transferir Dinero Ahora</span>
                </button>

                <button
                  onClick={onRefreshAll}
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 hover:text-ink border border-stone-200 text-xs font-semibold transition-colors shadow-subtle"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
                  <span>Actualizar Saldos</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Physical 3D Bank Card Display */}
          <div className="lg:col-span-5 flex justify-center">
            <BankCard3D
              account={currentAccount}
              cardType={currentAccount.accountType === 'SAVINGS' ? 'DEBIT' : 'CREDIT'}
            />
          </div>
        </div>

        {/* Transaction History Section */}
        <section className="space-y-4">
          <TransactionHistory
            transactions={transactions}
            loading={loadingTransactions}
            error={historyError}
            currentAccountNumber={currentAccount.accountNumber}
            onRefresh={onRefreshAll}
            onNewTransfer={() => setIsTransferModalOpen(true)}
            onViewQr={handleViewPastQr}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-ink-border/60 py-6 text-center text-xs text-stone-500 bg-white/40">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p>© 2026 Tecnológico de Antioquia — Laboratorio Spring Boot Banco con Antigravity & OmniSpec</p>
          <p className="text-[11px] text-stone-400 font-mono">
            Stack: Java 25 • Spring Boot 3.4 • Spring Data JPA • PostgreSQL 18 • React • Vite • Tailwind CSS
          </p>
        </div>
      </footer>

      {/* Modals */}
      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        currentAccount={currentAccount}
        availableAccounts={availableAccounts}
        onTransferSuccess={handleTransferSuccess}
      />

      <ReceiptModal
        receipt={activeReceipt}
        onClose={() => setActiveReceipt(null)}
      />
    </div>
  );
};
