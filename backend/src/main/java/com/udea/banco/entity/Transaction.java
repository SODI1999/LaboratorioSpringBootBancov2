package com.udea.banco.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * JPA entity representing an immutable record in the transaction history ledger.
 */
@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transaction_id", nullable = false, unique = true, length = 64)
    private String transactionId;

    @Column(name = "source_account_number", nullable = false, length = 30)
    private String sourceAccountNumber;

    @Column(name = "destination_account_number", nullable = false, length = 30)
    private String destinationAccountNumber;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 10)
    private String currency;

    @Column(name = "transaction_timestamp", nullable = false)
    private LocalDateTime timestamp;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "qr_payload", columnDefinition = "TEXT", nullable = false)
    private String qrPayload;

    /**
     * Default constructor required by JPA.
     */
    public Transaction() {
    }

    /**
     * Parameterized constructor.
     *
     * @param transactionId            unique UUID identifier for the transaction
     * @param sourceAccountNumber      source account number
     * @param destinationAccountNumber destination account number
     * @param amount                   transferred amount
     * @param currency                 currency code (COP)
     * @param timestamp                transaction execution timestamp
     * @param status                   transaction status (e.g. SUCCESS)
     * @param qrPayload                Base64 encoded QR image data URI
     */
    public Transaction(String transactionId, String sourceAccountNumber, String destinationAccountNumber,
                       BigDecimal amount, String currency, LocalDateTime timestamp, String status, String qrPayload) {
        this.transactionId = transactionId;
        this.sourceAccountNumber = sourceAccountNumber;
        this.destinationAccountNumber = destinationAccountNumber;
        this.amount = amount;
        this.currency = currency;
        this.timestamp = timestamp;
        this.status = status;
        this.qrPayload = qrPayload;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getSourceAccountNumber() {
        return sourceAccountNumber;
    }

    public void setSourceAccountNumber(String sourceAccountNumber) {
        this.sourceAccountNumber = sourceAccountNumber;
    }

    public String getDestinationAccountNumber() {
        return destinationAccountNumber;
    }

    public void setDestinationAccountNumber(String destinationAccountNumber) {
        this.destinationAccountNumber = destinationAccountNumber;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getQrPayload() {
        return qrPayload;
    }

    public void setQrPayload(String qrPayload) {
        this.qrPayload = qrPayload;
    }
}
