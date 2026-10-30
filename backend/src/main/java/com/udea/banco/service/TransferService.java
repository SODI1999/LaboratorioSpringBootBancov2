package com.udea.banco.service;

import com.udea.banco.dto.AccountDto;
import com.udea.banco.dto.TransactionDto;
import com.udea.banco.dto.TransferRequest;
import com.udea.banco.dto.TransferResponse;
import com.udea.banco.entity.Account;
import com.udea.banco.entity.Transaction;
import com.udea.banco.exception.AccountNotFoundException;
import com.udea.banco.exception.InsufficientFundsException;
import com.udea.banco.exception.InvalidTransferException;
import com.udea.banco.repository.AccountRepository;
import com.udea.banco.repository.TransactionRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service managing transactional money transfers and account ledger operations.
 */
@Service
public class TransferService {

    private static final Logger log = LoggerFactory.getLogger(TransferService.class);

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final QrCodeService qrCodeService;

    /**
     * Constructor injection.
     *
     * @param accountRepository     repository for account entities
     * @param transactionRepository repository for transaction entities
     * @param qrCodeService         service for QR code generation
     */
    public TransferService(AccountRepository accountRepository,
                           TransactionRepository transactionRepository,
                           QrCodeService qrCodeService) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.qrCodeService = qrCodeService;
    }

    /**
     * Executes an atomic transfer of funds between two accounts.
     *
     * @param request transfer details containing source, destination, and amount
     * @return transfer outcome response including updated source balance and QR code
     * @throws InvalidTransferException   if source and destination match or amount is non-positive
     * @throws AccountNotFoundException   if either account does not exist
     * @throws InsufficientFundsException if source account lacks available funds
     */
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public TransferResponse executeTransfer(TransferRequest request) {
        String sourceNumber = request.sourceAccountNumber().trim();
        String destinationNumber = request.destinationAccountNumber().trim();
        BigDecimal amount = request.amount();

        if (sourceNumber.equalsIgnoreCase(destinationNumber)) {
            throw new InvalidTransferException("Source account and destination account cannot be identical.");
        }

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidTransferException("Transfer amount must be strictly greater than zero.");
        }

        Account sourceAccount = accountRepository.findByAccountNumber(sourceNumber)
                .orElseThrow(() -> new AccountNotFoundException("Source account " + sourceNumber + " does not exist."));

        Account destinationAccount = accountRepository.findByAccountNumber(destinationNumber)
                .orElseThrow(() -> new AccountNotFoundException("Destination account " + destinationNumber + " does not exist."));

        if (sourceAccount.getBalance().compareTo(amount) < 0) {
            log.warn("Transfer rejected: Account {} has insufficient funds. Balance: {}, Requested: {}",
                    sourceNumber, sourceAccount.getBalance(), amount);
            throw new InsufficientFundsException(
                    "Account " + sourceNumber + " has insufficient funds. Available: "
                            + sourceAccount.getBalance() + ", Requested: " + amount
            );
        }

        // Atomic balance mutation
        sourceAccount.debit(amount);
        destinationAccount.credit(amount);

        accountRepository.save(sourceAccount);
        accountRepository.save(destinationAccount);

        LocalDateTime now = LocalDateTime.now();
        String transactionId = UUID.randomUUID().toString();

        // Encode QR Code metadata
        String qrContent = String.format(
                "Banco TdeA | Txn: %s | De: %s (%s) | Para: %s (%s) | Monto: %s %s | Fecha: %s",
                transactionId,
                sourceNumber,
                sourceAccount.getHolderName(),
                destinationNumber,
                destinationAccount.getHolderName(),
                amount,
                sourceAccount.getCurrency(),
                now
        );
        String qrPayload = qrCodeService.generateQrCodeBase64(qrContent);

        // Record immutable transaction entry
        Transaction transaction = new Transaction(
                transactionId,
                sourceNumber,
                destinationNumber,
                amount,
                sourceAccount.getCurrency(),
                now,
                "SUCCESS",
                qrPayload
        );
        transactionRepository.save(transaction);

        log.info("Transfer completed successfully: Txn ID {}, Amount {}, Source {}, Destination {}",
                transactionId, amount, sourceNumber, destinationNumber);

        return new TransferResponse(
                transactionId,
                sourceNumber,
                destinationNumber,
                amount,
                sourceAccount.getBalance(),
                now,
                "SUCCESS",
                qrPayload
        );
    }

    /**
     * Lists all registered bank accounts with their holder information and balances.
     *
     * @return list of account DTOs
     */
    @Transactional(readOnly = true)
    public List<AccountDto> getAllAccounts() {
        return accountRepository.findAll().stream()
                .map(acc -> new AccountDto(
                        acc.getId(),
                        acc.getAccountNumber(),
                        acc.getHolderName(),
                        acc.getBalance(),
                        acc.getAccountType(),
                        acc.getCurrency()
                ))
                .toList();
    }

    /**
     * Retrieves account information for a specific account number.
     *
     * @param accountNumber public account identifier
     * @return account DTO
     * @throws AccountNotFoundException if account does not exist
     */
    @Transactional(readOnly = true)
    public AccountDto getAccountByNumber(String accountNumber) {
        Account acc = accountRepository.findByAccountNumber(accountNumber.trim())
                .orElseThrow(() -> new AccountNotFoundException("Account " + accountNumber + " not found."));
        return new AccountDto(
                acc.getId(),
                acc.getAccountNumber(),
                acc.getHolderName(),
                acc.getBalance(),
                acc.getAccountType(),
                acc.getCurrency()
        );
    }

    /**
     * Lists all historical transactions sorted by date descending.
     *
     * @return list of transaction DTOs
     */
    @Transactional(readOnly = true)
    public List<TransactionDto> getAllTransactions() {
        return transactionRepository.findAllByOrderByTimestampDesc().stream()
                .map(t -> new TransactionDto(
                        t.getId(),
                        t.getTransactionId(),
                        t.getSourceAccountNumber(),
                        t.getDestinationAccountNumber(),
                        t.getAmount(),
                        t.getCurrency(),
                        t.getTimestamp(),
                        t.getStatus(),
                        t.getQrPayload()
                ))
                .toList();
    }
}
