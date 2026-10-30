package com.udea.banco.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Immutable DTO record representing historical transaction entries.
 *
 * @param id                       internal primary key
 * @param transactionId            unique UUID identifier
 * @param sourceAccountNumber      source account
 * @param destinationAccountNumber destination account
 * @param amount                   transferred amount
 * @param currency                 currency code
 * @param timestamp                transaction timestamp
 * @param status                   status outcome
 * @param qrPayload                Base64 encoded QR code
 */
public record TransactionDto(
        Long id,
        String transactionId,
        String sourceAccountNumber,
        String destinationAccountNumber,
        BigDecimal amount,
        String currency,
        LocalDateTime timestamp,
        String status,
        String qrPayload
) {
}
