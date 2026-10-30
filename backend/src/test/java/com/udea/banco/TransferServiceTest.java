package com.udea.banco;

import com.udea.banco.dto.TransferRequest;
import com.udea.banco.dto.TransferResponse;
import com.udea.banco.entity.Account;
import com.udea.banco.entity.Transaction;
import com.udea.banco.exception.AccountNotFoundException;
import com.udea.banco.exception.InsufficientFundsException;
import com.udea.banco.exception.InvalidTransferException;
import com.udea.banco.repository.AccountRepository;
import com.udea.banco.repository.TransactionRepository;
import com.udea.banco.service.QrCodeService;
import com.udea.banco.service.TransferService;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TransferServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private QrCodeService qrCodeService;

    private TransferService transferService;

    private Account sourceAccount;
    private Account destinationAccount;

    @BeforeEach
    void setUp() {
        transferService = new TransferService(accountRepository, transactionRepository, qrCodeService);

        sourceAccount = new Account(
                "CTA-1001",
                "Diego Ramirez",
                new BigDecimal("1000000.00"),
                "SAVINGS",
                "COP",
                LocalDateTime.now()
        );

        destinationAccount = new Account(
                "CTA-1002",
                "Pedro Gomez",
                new BigDecimal("200000.00"),
                "SAVINGS",
                "COP",
                LocalDateTime.now()
        );
    }

    @Test
    @DisplayName("AC-01 & AC-04: Successful transfer debits source and credits destination atomically")
    void testSuccessfulTransfer() {
        when(accountRepository.findByAccountNumber("CTA-1001")).thenReturn(Optional.of(sourceAccount));
        when(accountRepository.findByAccountNumber("CTA-1002")).thenReturn(Optional.of(destinationAccount));
        when(qrCodeService.generateQrCodeBase64(anyString())).thenReturn("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...");

        TransferRequest request = new TransferRequest("CTA-1001", "CTA-1002", new BigDecimal("300000.00"));
        TransferResponse response = transferService.executeTransfer(request);

        assertNotNull(response);
        assertEquals("SUCCESS", response.status());
        assertEquals(new BigDecimal("700000.00"), sourceAccount.getBalance());
        assertEquals(new BigDecimal("500000.00"), destinationAccount.getBalance());
        assertEquals(new BigDecimal("700000.00"), response.sourceNewBalance());
        assertTrue(response.qrPayload().startsWith("data:image/png;base64,"));

        ArgumentCaptor<Transaction> txnCaptor = ArgumentCaptor.forClass(Transaction.class);
        verify(transactionRepository).save(txnCaptor.capture());
        Transaction savedTxn = txnCaptor.getValue();
        assertEquals("CTA-1001", savedTxn.getSourceAccountNumber());
        assertEquals("CTA-1002", savedTxn.getDestinationAccountNumber());
        assertEquals(new BigDecimal("300000.00"), savedTxn.getAmount());
    }

    @Test
    @DisplayName("AC-07: Transfer rejected when source has insufficient funds")
    void testInsufficientFunds() {
        when(accountRepository.findByAccountNumber("CTA-1001")).thenReturn(Optional.of(sourceAccount));
        when(accountRepository.findByAccountNumber("CTA-1002")).thenReturn(Optional.of(destinationAccount));

        TransferRequest request = new TransferRequest("CTA-1001", "CTA-1002", new BigDecimal("1500000.00"));

        InsufficientFundsException ex = assertThrows(InsufficientFundsException.class, () ->
                transferService.executeTransfer(request)
        );

        assertTrue(ex.getMessage().contains("insufficient funds"));
        assertEquals(new BigDecimal("1000000.00"), sourceAccount.getBalance());
        assertEquals(new BigDecimal("200000.00"), destinationAccount.getBalance());
        verify(transactionRepository, never()).save(any());
    }

    @Test
    @DisplayName("AC-08: Transfer rejected when source or destination account not found")
    void testAccountNotFound() {
        when(accountRepository.findByAccountNumber("CTA-1001")).thenReturn(Optional.empty());

        TransferRequest request = new TransferRequest("CTA-1001", "CTA-1002", new BigDecimal("50000.00"));

        AccountNotFoundException ex = assertThrows(AccountNotFoundException.class, () ->
                transferService.executeTransfer(request)
        );

        assertTrue(ex.getMessage().contains("does not exist"));
        verify(transactionRepository, never()).save(any());
    }

    @Test
    @DisplayName("AC-09: Transfer rejected when source and destination are identical")
    void testSameAccountTransfer() {
        TransferRequest request = new TransferRequest("CTA-1001", "CTA-1001", new BigDecimal("50000.00"));

        InvalidTransferException ex = assertThrows(InvalidTransferException.class, () ->
                transferService.executeTransfer(request)
        );

        assertTrue(ex.getMessage().contains("cannot be identical"));
        verify(accountRepository, never()).findByAccountNumber(anyString());
    }

    @Test
    @DisplayName("AC-09: Transfer rejected when amount is non-positive")
    void testNonPositiveAmount() {
        TransferRequest request = new TransferRequest("CTA-1001", "CTA-1002", new BigDecimal("-100.00"));

        InvalidTransferException ex = assertThrows(InvalidTransferException.class, () ->
                transferService.executeTransfer(request)
        );

        assertTrue(ex.getMessage().contains("greater than zero"));
        verify(accountRepository, never()).findByAccountNumber(anyString());
    }
}
