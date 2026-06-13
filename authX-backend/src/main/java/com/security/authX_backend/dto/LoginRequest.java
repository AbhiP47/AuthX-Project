package com.security.authX_backend.dto;

public record LoginRequest(
        String email,
        String password
) {
}
