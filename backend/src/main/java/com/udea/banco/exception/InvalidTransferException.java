package com.udea.banco.exception;

/**
 * Thrown when transfer input parameters violate business invariants (e.g. self-transfer or non-positive amount).
 */
public class InvalidTransferException extends RuntimeException {

    /**
     * Constructor with descriptive error message.
     *
     * @param message explanation of the invalid transfer parameter
     */
    public InvalidTransferException(String message) {
        super(message);
    }
}
