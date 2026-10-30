import { useState, useEffect, useCallback } from 'react';
import { Account, Transaction, TransferResponse } from './types/bank';
import { bankApi, extractErrorMessage } from './services/bankApi';
import { LoginView } from './components/LoginView';
import { Dashboard } from './components/Dashboard';

export function App() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState<boolean>(true);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState<boolean>(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    setLoadingAccounts(true);
    try {
      const data = await bankApi.getAccounts();
      setAccounts(data);
      setSelectedAccount((prev) => {
        if (!prev) return null;
        const updated = data.find((a) => a.accountNumber === prev.accountNumber);
        return updated || prev;
      });
    } catch {
      // Background / initial poll error handled silently or with fallback
    } finally {
      setLoadingAccounts(false);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    setLoadingTransactions(true);
    setHistoryError(null);
    try {
      const data = await bankApi.getTransactions();
      setTransactions(data);
    } catch (err) {
      setHistoryError(extractErrorMessage(err));
    } finally {
      setLoadingTransactions(false);
    }
  }, []);

  const handleRefreshAll = () => {
    fetchAccounts();
    fetchTransactions();
  };

  useEffect(() => {
    fetchAccounts();
    fetchTransactions();
  }, [fetchAccounts, fetchTransactions]);

  const handleTransferCompleted = (response: TransferResponse) => {
    // Optimistically update account balance in view
    if (selectedAccount && selectedAccount.accountNumber === response.sourceAccountNumber) {
      setSelectedAccount({
        ...selectedAccount,
        balance: response.sourceNewBalance,
      });
    }
    // Refresh accounts and transaction ledger from server
    handleRefreshAll();
  };

  if (!selectedAccount) {
    return (
      <LoginView
        accounts={accounts}
        loading={loadingAccounts}
        onSelectUser={(acc) => setSelectedAccount(acc)}
      />
    );
  }

  return (
    <Dashboard
      currentAccount={selectedAccount}
      availableAccounts={accounts}
      transactions={transactions}
      loadingTransactions={loadingTransactions}
      historyError={historyError}
      onRefreshAll={handleRefreshAll}
      onLogout={() => setSelectedAccount(null)}
      onTransferCompleted={handleTransferCompleted}
    />
  );
}

export default App;
