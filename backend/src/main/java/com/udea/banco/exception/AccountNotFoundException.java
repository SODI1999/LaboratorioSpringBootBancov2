package com.udea.banco.exception;

/**
 * Thrown when an account number does not match any registered account in the bank.
 */
public class AccountNotFoundException extends RuntimeException {

    /**
     * Constructor with descriptive error message.
     *
     * @param message explanation identifying the missing account
     */
    public AccountNotFoundException(String message) {
        super(message);
    }
}
