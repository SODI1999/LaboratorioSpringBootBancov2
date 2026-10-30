package com.udea.banco.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Immutable DTO record returned after a successful money transfer.
 *
 * @param transactionId            unique UUID identifier for the transaction
 * @param sourceAccountNumber      source account
 * @param destinationAccountNumber destination account
 * @param amount                   amount transferred
 * @param sourceNewBalance         updated remaining balance of the source account
 * @param timestamp                execution timestamp
 * @param status                   status outcome (SUCCESS)
 * @param qrPayload                Base64 encoded QR code PNG data URI
 */
public record TransferResponse(
        String transactionId,
        String sourceAccountNumber,
        String destinationAccountNumber,
        BigDecimal amount,
        BigDecimal sourceNewBalance,
        LocalDateTime timestamp,
        String status,
        String qrPayload
) {
}
