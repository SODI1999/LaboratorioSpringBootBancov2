package com.udea.banco.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

/**
 * Immutable DTO record for transfer execution requests.
 *
 * @param sourceAccountNumber      account to deduct funds from
 * @param destinationAccountNumber account to credit funds to
 * @param amount                   positive monetary amount to transfer
 */
public record TransferRequest(
        @NotBlank(message = "Source account number is required")
        String sourceAccountNumber,

        @NotBlank(message = "Destination account number is required")
        String destinationAccountNumber,

        @NotNull(message = "Transfer amount is required")
        @Positive(message = "Transfer amount must be strictly greater than zero")
        BigDecimal amount
) {
}
