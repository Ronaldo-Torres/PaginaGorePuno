package com.rchila.backend.admin.email.service.dtos;

import java.util.List;

/**
 * DTO para respuestas de envío de correos con estadísticas.
 */
public record EmailSendResult(
        int totalEmails,
        int successfulSends,
        int failedSends,
        List<String> errors,
        String message) {

    /**
     * Crea un resultado exitoso para un solo envío.
     */
    public static EmailSendResult success(String message) {
        return new EmailSendResult(1, 1, 0, List.of(), message);
    }

    /**
     * Crea un resultado fallido para un solo envío.
     */
    public static EmailSendResult failure(String error) {
        return new EmailSendResult(1, 0, 1, List.of(error), "Error al enviar correo");
    }

    /**
     * Crea un resultado para envío masivo.
     */
    public static EmailSendResult bulk(int total, int successful, int failed, List<String> errors) {
        String message = String.format("Envío masivo completado: %d exitosos, %d fallidos de %d total",
                successful, failed, total);
        return new EmailSendResult(total, successful, failed, errors, message);
    }
}