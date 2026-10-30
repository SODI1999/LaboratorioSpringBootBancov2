package com.udea.banco.controller;

import com.udea.banco.dto.AccountDto;
import com.udea.banco.service.TransferService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for account inquiries and balances.
 */
@RestController
@RequestMapping("/api/accounts")
@Tag(name = "Accounts", description = "Endpoints for bank account consultation")
public class AccountController {

    private final TransferService transferService;

    /**
     * Constructor injection.
     *
     * @param transferService transfer domain service
     */
    public AccountController(TransferService transferService) {
        this.transferService = transferService;
    }

    /**
     * Retrieves the list of all registered bank accounts.
     *
     * @return list of account DTOs
     */
    @GetMapping
    @Operation(summary = "List all accounts", description = "Retrieves all registered bank accounts with balances")
    @ApiResponse(responseCode = "200", description = "List of accounts retrieved successfully")
    public ResponseEntity<List<AccountDto>> listAccounts() {
        return ResponseEntity.ok(transferService.getAllAccounts());
    }

    /**
     * Retrieves account details by account number.
     *
     * @param accountNumber public account identifier
     * @return account DTO
     */
    @GetMapping("/{accountNumber}")
    @Operation(summary = "Get account details", description = "Retrieves account by account number")
    @ApiResponse(responseCode = "200", description = "Account details found")
    @ApiResponse(responseCode = "404", description = "Account not found")
    public ResponseEntity<AccountDto> getAccount(@PathVariable String accountNumber) {
        return ResponseEntity.ok(transferService.getAccountByNumber(accountNumber));
    }
}
