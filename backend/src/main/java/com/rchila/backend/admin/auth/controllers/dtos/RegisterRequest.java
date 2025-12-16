package com.rchila.backend.admin.auth.controllers.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(
                @Email @NotBlank String email,
                @NotBlank String password,
                @NotBlank String firstName,
                @NotBlank String lastName,
                String phone) {
}
