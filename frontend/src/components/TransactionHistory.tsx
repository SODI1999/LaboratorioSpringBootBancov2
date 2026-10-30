import React from 'react';
import { Transaction } from '../types/bank';
import { History, ArrowUpRight, ArrowDownLeft, QrCode, AlertTriangle, RefreshCw, PlusCircle } from 'lucide-react';

interface TransactionHistoryProps {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  currentAccountNumber: string;
  onRefresh: () => void;
  onNewTransfer: () => void;
  onViewQr: (transaction: Transaction) => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  loading,
  error,
  currentAccountNumber,
  onRefresh,
  onNewTransfer,
  onViewQr,
}) => {
  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-card text-ink">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center">
            <History className="w-5 h-5 text-stone-700" />
          </div>
          <div>
            <h3 className="text-base font-bold text-ink">Histórico de Transacciones</h3>
            <p className="text-xs text-stone-500">Auditoría inmutable de movimientos bancarios</p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:text-ink bg-white hover:bg-stone-100 border border-stone-200 transition-colors focus:ring-2 focus:ring-ink"
          title="Refrescar transacciones"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin motion-reduce:animate-none text-stone-900' : 'text-stone-500'}`} />
          <span>Actualizar</span>
        </button>
      </div>

      {/* 4 States Handling */}

      {/* 1. Loading State (Contextual Skeletons with CLS = 0) */}
      {loading && (
        <div className="divide-y divide-stone-100 p-4 space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="flex items-center justify-between py-3.5 animate-pulse">
              <div className="flex items-center space-x-3.5">
                <div className="w-9 h-9 rounded-full bg-stone-100" />
                <div className="space-y-1.5">
                  <div className="w-36 h-3.5 bg-stone-200 rounded" />
                  <div className="w-24 h-2.5 bg-stone-100 rounded" />
                </div>
              </div>
              <div className="space-y-1.5 text-right">
                <div className="w-24 h-3.5 bg-stone-200 rounded ml-auto" />
                <div className="w-16 h-2.5 bg-stone-100 rounded ml-auto" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Error State */}
      {!loading && error && (
        <div className="p-8 text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 border border-red-200 text-red-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-stone-900">Error al cargar el histórico</h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">{error}</p>
          <button
            onClick={onRefresh}
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-800 border border-stone-200 transition-colors"
          >
            Reintentar carga
          </button>
        </div>
      )}

      {/* 3. Empty State */}
      {!loading && !error && transactions.length === 0 && (
        <div className="p-10 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-stone-100 border border-stone-200 text-stone-500">
            <History className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-stone-900">Sin transacciones registradas</h4>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              Aún no se han ejecutado traslados de fondos en el sistema.
            </p>
          </div>
          <button
            onClick={onNewTransfer}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-ink hover:bg-black text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4 text-stone-200" />
            <span>Realizar Primera Transferencia</span>
          </button>
        </div>
      )}

      {/* 4. Ideal State (Transactions List Table) */}
      {!loading && !error && transactions.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 text-stone-500 border-b border-stone-100 uppercase tracking-wider text-[10px] font-semibold">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Movimiento</th>
                <th className="py-3.5 px-4">Cuenta / Detalle</th>
                <th className="py-3.5 px-4 text-right">Monto</th>
                <th className="py-3.5 px-4">Fecha y Hora</th>
                <th className="py-3.5 px-4 text-center">Estado</th>
                <th className="py-3.5 px-4 sm:px-6 text-center">Comprobante QR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {transactions.map((t) => {
                const isDebit = t.sourceAccountNumber === currentAccountNumber;
                const formattedDate = new Date(t.timestamp).toLocaleString('es-CO', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });
                const formattedAmount = new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: t.currency || 'COP',
                  minimumFractionDigits: 2,
                }).format(t.amount);

                return (
                  <tr
                    key={t.id || t.transactionId}
                    className="hover:bg-stone-50/60 transition-colors group"
                  >
                    {/* Movimiento type */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isDebit
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {isDebit ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownLeft className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <span className="font-semibold text-stone-900 block">
                            {isDebit ? 'Transferencia Enviada' : 'Transferencia Recibida'}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            {t.transactionId.slice(0, 8)}...
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Cuenta / Detalle */}
                    <td className="py-4 px-4">
                      <div className="font-mono text-xs text-stone-700">
                        {isDebit ? (
                          <span>Para: <strong className="text-stone-900">{t.destinationAccountNumber}</strong></span>
                        ) : (
                          <span>De: <strong className="text-stone-900">{t.sourceAccountNumber}</strong></span>
                        )}
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono block">
                        Cuentas Banco TdeA
                      </span>
                    </td>

                    {/* Monto */}
                    <td className="py-4 px-4 text-right">
                      <span
                        className={`font-mono text-sm font-bold tabular-nums ${
                          isDebit ? 'text-stone-900' : 'text-emerald-800'
                        }`}
                      >
                        {isDebit ? `- ${formattedAmount}` : `+ ${formattedAmount}`}
                      </span>
                    </td>

                    {/* Fecha y Hora */}
                    <td className="py-4 px-4 text-stone-600 font-mono text-[11px]">
                      {formattedDate}
                    </td>

                    {/* Estado */}
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium tracking-wide bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {t.status}
                      </span>
                    </td>

                    {/* Comprobante QR Button */}
                    <td className="py-4 px-4 sm:px-6 text-center">
                      <button
                        onClick={() => onViewQr(t)}
                        className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 text-[11px] font-semibold transition-colors focus:ring-2 focus:ring-ink"
                        title="Ver comprobante con código QR"
                        aria-label={`Ver comprobante QR de la transacción ${t.transactionId}`}
                      >
                        <QrCode className="w-3.5 h-3.5 text-stone-600" />
                        <span>QR</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
