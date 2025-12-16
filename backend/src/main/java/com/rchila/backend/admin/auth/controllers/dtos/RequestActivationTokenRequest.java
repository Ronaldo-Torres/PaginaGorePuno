package com.rchila.backend.admin.auth.controllers.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RequestActivationTokenRequest(
        @Email @NotBlank String email) {
}