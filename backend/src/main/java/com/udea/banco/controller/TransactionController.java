package com.udea.banco.controller;

import com.udea.banco.dto.TransactionDto;
import com.udea.banco.service.TransferService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for transaction history inquiries.
 */
@RestController
@RequestMapping("/api/transactions")
@Tag(name = "Transactions", description = "Endpoints for historical transaction ledger inquiries")
public class TransactionController {

    private final TransferService transferService;

    /**
     * Constructor injection.
     *
     * @param transferService transfer domain service
     */
    public TransactionController(TransferService transferService) {
        this.transferService = transferService;
    }

    /**
     * Retrieves all recorded transactions ordered by date descending.
     *
     * @return list of transaction DTOs
     */
    @GetMapping
    @Operation(summary = "List transaction history", description = "Retrieves all completed bank transactions ordered chronologically")
    @ApiResponse(responseCode = "200", description = "Transaction history retrieved successfully")
    public ResponseEntity<List<TransactionDto>> listTransactions() {
        return ResponseEntity.ok(transferService.getAllTransactions());
    }
}
