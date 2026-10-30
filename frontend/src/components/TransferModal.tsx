import React, { useState } from 'react';
import { Account, TransferResponse } from '../types/bank';
import { bankApi, extractErrorMessage } from '../services/bankApi';
import { X, Send, AlertCircle, Loader2, ArrowRightLeft } from 'lucide-react';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAccount: Account;
  availableAccounts: Account[];
  onTransferSuccess: (result: TransferResponse) => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  onClose,
  currentAccount,
  availableAccounts,
  onTransferSuccess,
}) => {
  const otherAccounts = availableAccounts.filter(
    (acc) => acc.accountNumber !== currentAccount.accountNumber
  );

  const [destinationAccount, setDestinationAccount] = useState<string>(
    otherAccounts.length > 0 ? otherAccounts[0].accountNumber : ''
  );
  const [amountStr, setAmountStr] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const numericAmount = parseFloat(amountStr) || 0;
  const isOverdraft = numericAmount > currentAccount.balance;
  const isInvalid = numericAmount <= 0 || isOverdraft || !destinationAccount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isInvalid) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await bankApi.executeTransfer({
        sourceAccountNumber: currentAccount.accountNumber,
        destinationAccountNumber: destinationAccount,
        amount: numericAmount,
      });
      onTransferSuccess(response);
      onClose();
    } catch (err) {
      setErrorMessage(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = (amount: number) => {
    const current = parseFloat(amountStr) || 0;
    const nextVal = current + amount;
    setAmountStr(nextVal.toString());
  };

  const formattedBalance = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currentAccount.currency || 'COP',
    minimumFractionDigits: 2,
  }).format(currentAccount.balance);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div
        className="w-full max-w-lg bg-white border border-stone-200 rounded-2xl sm:rounded-3xl shadow-modal focus:outline-none text-ink relative my-auto max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="transfer-dialog-title"
      >
        {/* Header */}
        <div className="px-5 sm:px-8 pt-5 pb-4 border-b border-stone-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5 text-stone-800" />
            </div>
            <div>
              <h2 id="transfer-dialog-title" className="text-lg font-bold text-ink">
                Nueva Transferencia de Dinero
              </h2>
              <p className="text-xs text-stone-500">
                Traslado inmediato de fondos entre cuentas del Banco TdeA
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="mx-6 sm:mx-8 mt-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2.5 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">No se pudo procesar la transferencia</p>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-5 overflow-y-auto flex-1">
          {/* Source Account Info Box */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
            <div>
              <span className="block text-[10px] font-mono tracking-widest text-stone-600 uppercase font-medium">
                Cuenta de Origen
              </span>
              <span className="font-semibold text-sm text-ink block mt-0.5">
                {currentAccount.holderName}
              </span>
              <span className="text-xs font-mono text-stone-500 block">
                {currentAccount.accountNumber}
              </span>
            </div>

            <div className="text-right">
              <span className="block text-[10px] font-mono tracking-widest text-stone-600 uppercase font-medium">
                Saldo Actual
              </span>
              <span className="font-mono text-sm sm:text-base font-bold text-ink tabular-nums block mt-0.5">
                {formattedBalance}
              </span>
            </div>
          </div>

          {/* Destination Account Selection */}
          <div className="space-y-1.5">
            <label
              htmlFor="destinationAccount"
              className="block text-xs font-semibold text-stone-700"
            >
              Cuenta de Destino
            </label>
            <select
              id="destinationAccount"
              aria-label="Cuenta de Destino"
              value={destinationAccount}
              onChange={(e) => setDestinationAccount(e.target.value)}
              disabled={loading}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-ink text-sm font-medium focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-ink focus:outline-none transition-colors"
            >
              {otherAccounts.map((acc) => (
                <option key={acc.id} value={acc.accountNumber}>
                  {acc.holderName} — {acc.accountNumber} ({acc.accountType})
                </option>
              ))}
            </select>
          </div>

          {/* Amount Input with Live Overdraft Check */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="transferAmount"
                className="block text-xs font-semibold text-stone-700"
              >
                Monto a Transferir (COP)
              </label>
              {isOverdraft && (
                <span className="text-xs text-red-600 font-medium flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5 inline" />
                  <span>Saldo insuficiente para este monto</span>
                </span>
              )}
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-mono text-lg font-bold">
                $
              </span>
              <input
                id="transferAmount"
                type="number"
                min="1"
                step="any"
                placeholder="0"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                disabled={loading}
                className={`w-full pl-9 pr-4 py-3 rounded-xl bg-stone-50 border text-xl font-mono font-bold tabular-nums text-ink focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  isOverdraft
                    ? 'border-red-400 focus:ring-red-400 text-red-700'
                    : 'border-stone-200 focus:border-stone-400 focus:ring-ink'
                }`}
              />
            </div>

            {/* Quick Amount Preset Buttons */}
            <div className="flex items-center space-x-2 pt-1">
              {[50000, 100000, 200000, 500000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleQuickAdd(preset)}
                  disabled={loading}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono text-[11px] font-medium transition-colors border border-stone-200 active:scale-95"
                >
                  +${preset >= 1000000 ? `${preset / 1000000}M` : `${preset / 1000}.000`}
                </button>
              ))}
            </div>
          </div>

          {/* Dialog Action Buttons */}
          <div className="pt-4 flex items-center justify-end space-x-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isInvalid || loading}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-ink hover:bg-black text-white text-xs font-semibold tracking-wide shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-stone-200" />
                  <span>Confirmar Traslado</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
