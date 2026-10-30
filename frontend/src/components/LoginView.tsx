import React from 'react';
import { Account } from '../types/bank';
import { ShieldCheck, ArrowRight, Building2, Lock, CheckCircle2 } from 'lucide-react';

interface LoginViewProps {
  accounts: Account[];
  loading: boolean;
  onSelectUser: (account: Account) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ accounts, loading, onSelectUser }) => {
  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-between antialiased selection:bg-stone-200 selection:text-ink-pure">
      {/* Top institution bar */}
      <header className="border-b border-ink-border/60 bg-white/70 backdrop-blur-md px-6 py-4 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-ink text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-sm">
              T
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight text-ink block">
                Banco TdeA
              </span>
              <span className="text-[10px] text-stone-500 tracking-wider uppercase block font-medium">
                Institución Financiera
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs text-stone-600 bg-stone-100/80 px-3 py-1.5 rounded-full border border-stone-200">
            <Lock className="w-3.5 h-3.5 text-stone-700" />
            <span className="font-medium">Entorno Seguro • 2026</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20 w-full flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Brand & Editorial Statement */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-800 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>Tecnológico de Antioquia — Laboratorio 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-ink leading-[1.1]">
              Plataforma Bancaria de Alta Precisión
            </h1>

            <p className="text-stone-600 text-base leading-relaxed">
              Sistema financiero de traslados inmediatos con control transaccional atómico,
              auditoría inmutable de movimientos y expedición digital de comprobantes con código QR.
            </p>

            {/* Value Props / Architecture badges */}
            <div className="space-y-3 pt-2 text-xs text-stone-600">
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>Precisión monetaria exacta en pesos colombianos con <code className="font-mono text-stone-900 bg-stone-100 px-1 py-0.5 rounded">BigDecimal</code></span>
              </div>
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>Base de datos transaccional con PostgreSQL 18 & Spring Data JPA</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>Emisión instantánea de comprobantes con QR bidimensional codificado</span>
              </div>
            </div>
          </div>

          {/* Right Column: Account Selection Deck */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-ink-border rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-ink">Acceso a Banca en Línea</h2>
                  <p className="text-xs text-stone-500">
                    Selecciona tu cuenta autorizada para ingresar al panel de operaciones
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-stone-700" />
                </div>
              </div>

              {/* 4 States handling */}
              {/* 1. Loading State */}
              {loading && (
                <div className="space-y-3 py-2">
                  <div className="h-20 bg-stone-100 animate-pulse rounded-xl" />
                  <div className="h-20 bg-stone-100 animate-pulse rounded-xl" />
                  <div className="h-20 bg-stone-100 animate-pulse rounded-xl" />
                </div>
              )}

              {/* 2. Empty State */}
              {!loading && accounts.length === 0 && (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-semibold text-stone-900">
                    No se detectaron cuentas activas
                  </h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Verifica que el servicio backend Spring Boot esté ejecutándose en http://localhost:8080
                    y que la base de datos PostgreSQL contenga las cuentas sembradas.
                  </p>
                </div>
              )}

              {/* 3. Ideal State (Deck of Cards) */}
              {!loading && accounts.length > 0 && (
                <div className="space-y-3">
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-stone-600 block">
                    Cuentas de Prueba Disponibles
                  </span>

                  <div className="space-y-3">
                    {accounts.map((acc) => {
                      const isSavings = acc.accountType === 'SAVINGS';
                      const formatted = new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: acc.currency || 'COP',
                        minimumFractionDigits: 2,
                      }).format(acc.balance);

                      return (
                        <button
                          key={acc.id}
                          onClick={() => onSelectUser(acc)}
                          className="w-full text-left p-4 sm:p-5 rounded-xl border border-stone-200 hover:border-stone-400 bg-stone-50/60 hover:bg-stone-50 transition-all duration-200 group flex items-center justify-between shadow-subtle active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-ink"
                        >
                          <div className="flex items-center space-x-4">
                            {/* Card badge icon */}
                            <div
                              className={`w-11 h-8 rounded-md flex items-center justify-center font-mono text-[9px] font-bold shadow-sm transition-transform group-hover:scale-105 ${
                                isSavings
                                  ? 'bg-zinc-900 text-amber-300 border border-zinc-700'
                                  : 'bg-white text-stone-800 border border-stone-300'
                              }`}
                            >
                              EMV
                            </div>

                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-sm text-ink group-hover:text-black">
                                  {acc.holderName}
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-stone-200 text-stone-600 font-medium">
                                  {acc.accountNumber}
                                </span>
                              </div>
                              <span className="text-xs text-stone-500 block capitalize mt-0.5">
                                {acc.accountType === 'SAVINGS' ? 'Cuenta de Ahorros' : 'Cuenta Corriente'}
                              </span>
                            </div>
                          </div>

                          <div className="text-right flex items-center space-x-3">
                            <div>
                              <span className="block text-[10px] uppercase tracking-wider text-stone-600 font-medium">
                                Saldo Disponible
                              </span>
                              <span className="block font-mono text-sm sm:text-base font-bold text-ink tabular-nums">
                                {formatted}
                              </span>
                            </div>

                            <div className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-400 group-hover:text-ink group-hover:border-stone-400 group-hover:translate-x-0.5 transition-all">
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Security Footnote */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-600">
                <span>Conexión protegida con TLS local</span>
                <span className="font-mono">PostgreSQL 18 • JPA</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-ink-border/60 py-6 text-center text-xs text-stone-500 bg-white/40">
        <div className="max-w-6xl mx-auto px-4">
          <p>© 2026 Tecnológico de Antioquia — Laboratorio Spring Boot Banco con Antigravity & OmniSpec</p>
        </div>
      </footer>
    </div>
  );
};
