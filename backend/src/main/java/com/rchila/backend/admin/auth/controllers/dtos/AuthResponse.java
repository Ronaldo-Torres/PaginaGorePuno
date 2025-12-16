package com.rchila.backend.admin.auth.controllers.dtos;

import jakarta.validation.constraints.NotBlank;

public record AuthResponse(@NotBlank String accessToken,
        @NotBlank String refreshToken,
        boolean passwordChangeRequired) {
}