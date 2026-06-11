package com.security.authX_backend.dto;

import org.springframework.http.HttpStatus;
import java.time.LocalDateTime;

public record ErrorResponse(
        String message,
        HttpStatus status,
        String error,
        LocalDateTime timestamp,
        String path
) {

}
