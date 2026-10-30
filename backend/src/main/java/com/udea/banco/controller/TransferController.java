package com.udea.banco.controller;

import com.udea.banco.dto.TransferRequest;
import com.udea.banco.dto.TransferResponse;
import com.udea.banco.service.TransferService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller exposing endpoints for money transfer operations.
 */
@RestController
@RequestMapping("/api/transfers")
@Tag(name = "Transfers", description = "Endpoints for bank money transfers and QR receipts")
public class TransferController {

    private final TransferService transferService;

    /**
     * Constructor injection.
     *
     * @param transferService transfer domain service
     */
    public TransferController(TransferService transferService) {
        this.transferService = transferService;
    }

    /**
     * Executes a transfer between two registered bank accounts.
     *
     * @param request transfer payload
     * @return transfer result and QR code receipt
     */
    @PostMapping
    @Operation(summary = "Transfer money between accounts", description = "Debits source account and credits destination account with atomic validation")
    @ApiResponse(responseCode = "201", description = "Transfer executed successfully")
    @ApiResponse(responseCode = "400", description = "Insufficient funds or invalid transfer input")
    @ApiResponse(responseCode = "404", description = "Source or destination account not found")
    public ResponseEntity<TransferResponse> transfer(@Valid @RequestBody TransferRequest request) {
        TransferResponse response = transferService.executeTransfer(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
