import axios, { AxiosError } from 'axios';
import { Account, Transaction, TransferRequest, TransferResponse, ApiError } from '../types/bank';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const bankApi = {
  /**
   * Retrieves all bank accounts.
   */
  async getAccounts(): Promise<Account[]> {
    const response = await api.get<Account[]>('/accounts');
    return response.data;
  },

  /**
   * Retrieves a single account by its account number.
   */
  async getAccount(accountNumber: string): Promise<Account> {
    const response = await api.get<Account>(`/accounts/${encodeURIComponent(accountNumber)}`);
    return response.data;
  },

  /**
   * Retrieves full transaction history log.
   */
  async getTransactions(): Promise<Transaction[]> {
    const response = await api.get<Transaction[]>('/transactions');
    return response.data;
  },

  /**
   * Executes an atomic transfer between accounts.
   */
  async executeTransfer(payload: TransferRequest): Promise<TransferResponse> {
    const response = await api.post<TransferResponse>('/transfers', payload);
    return response.data;
  },
};

/**
 * Extracts a clean error message from an API exception.
 */
export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    if (axiosError.code === 'ECONNABORTED' || axiosError.message.includes('Network Error')) {
      return 'No fue posible conectar con el servidor backend en http://localhost:8080. Verifica que el servicio esté activo.';
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Ocurrió un error inesperado al procesar la solicitud.';
}
