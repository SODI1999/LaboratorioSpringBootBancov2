package com.udea.banco.dto;

import java.math.BigDecimal;

/**
 * Immutable DTO record representing account information exposed via API.
 *
 * @param id            internal account ID
 * @param accountNumber public account identifier
 * @param holderName    account owner name
 * @param balance       current available balance
 * @param accountType   account type (SAVINGS, CHECKING)
 * @param currency      account currency code
 */
public record AccountDto(
        Long id,
        String accountNumber,
        String holderName,
        BigDecimal balance,
        String accountType,
        String currency
) {
}
