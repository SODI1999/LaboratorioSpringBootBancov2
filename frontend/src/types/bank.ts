export interface Account {
  id: number;
  accountNumber: string;
  holderName: string;
  balance: number;
  accountType: 'SAVINGS' | 'CHECKING' | string;
  currency: string;
}

export interface Transaction {
  id: number;
  transactionId: string;
  sourceAccountNumber: string;
  destinationAccountNumber: string;
  amount: number;
  currency: string;
  timestamp: string;
  status: string;
  qrPayload: string;
}

export interface TransferRequest {
  sourceAccountNumber: string;
  destinationAccountNumber: string;
  amount: number;
}

export interface TransferResponse {
  transactionId: string;
  sourceAccountNumber: string;
  destinationAccountNumber: string;
  amount: number;
  sourceNewBalance: number;
  timestamp: string;
  status: string;
  qrPayload: string;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
}
