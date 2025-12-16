package com.rchila.backend.admin.email.service.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO para solicitudes de envío de correos personalizados.
 */
public record CustomEmailRequest(
        @NotBlank(message = "El asunto es obligatorio") @Size(max = 200, message = "El asunto no puede exceder 200 caracteres") String subject,

        @NotBlank(message = "El mensaje es obligatorio") @Size(max = 10000, message = "El mensaje no puede exceder 10,000 caracteres") String message,

        @Email(message = "El formato del email no es válido") String recipientEmail,

        String recipientName,

        boolean isHtml) {
}