package com.udea.banco.dto;

import java.time.LocalDateTime;

/**
 * Standard error response envelope returned on client and server exceptions.
 *
 * @param timestamp timestamp when the error occurred
 * @param status    HTTP status code
 * @param error     short error identifier / exception type
 * @param message   human-readable description of the error
 */
public record ErrorResponse(
        LocalDateTime timestamp,
        int status,
        String error,
        String message
) {
}
