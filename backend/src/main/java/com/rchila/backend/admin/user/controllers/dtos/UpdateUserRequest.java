package com.rchila.backend.admin.user.controllers.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UpdateUserRequest(
        @NotBlank(message = "El nombre es obligatorio") String firstName,

        @NotBlank(message = "El apellido es obligatorio") String lastName,

        @NotBlank(message = "El correo electrónico es obligatorio") @Email(message = "El formato del correo electrónico no es válido") String email) {
}