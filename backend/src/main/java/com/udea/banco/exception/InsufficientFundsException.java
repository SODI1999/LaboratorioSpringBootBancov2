package com.udea.banco.exception;

/**
 * Thrown when an account does not hold sufficient balance to execute a transfer.
 */
public class InsufficientFundsException extends RuntimeException {

    /**
     * Constructor with descriptive error message.
     *
     * @param message explanation of the insufficient funds condition
     */
    public InsufficientFundsException(String message) {
        super(message);
    }
}
