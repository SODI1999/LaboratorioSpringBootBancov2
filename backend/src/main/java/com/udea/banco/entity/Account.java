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
 * JPA entity representing a bank account in the system.
 */
@Entity
@Table(name = "accounts")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "account_number", nullable = false, unique = true, length = 30)
    private String accountNumber;

    @Column(name = "holder_name", nullable = false, length = 100)
    private String holderName;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal balance;

    @Column(name = "account_type", nullable = false, length = 20)
    private String accountType;

    @Column(nullable = false, length = 10)
    private String currency;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /**
     * Default constructor required by JPA.
     */
    public Account() {
    }

    /**
     * Parameterized constructor.
     *
     * @param accountNumber unique account number
     * @param holderName    name of the account holder
     * @param balance       initial account balance
     * @param accountType   type of account (SAVINGS, CHECKING)
     * @param currency      account currency (COP)
     * @param createdAt     creation timestamp
     */
    public Account(String accountNumber, String holderName, BigDecimal balance, String accountType, String currency, LocalDateTime createdAt) {
        this.accountNumber = accountNumber;
        this.holderName = holderName;
        this.balance = balance;
        this.accountType = accountType;
        this.currency = currency;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getHolderName() {
        return holderName;
    }

    public void setHolderName(String holderName) {
        this.holderName = holderName;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    /**
     * Deducts funds from the account balance.
     *
     * @param amount amount to deduct
     */
    public void debit(BigDecimal amount) {
        this.balance = this.balance.subtract(amount);
    }

    /**
     * Adds funds to the account balance.
     *
     * @param amount amount to credit
     */
    public void credit(BigDecimal amount) {
        this.balance = this.balance.add(amount);
    }
}
