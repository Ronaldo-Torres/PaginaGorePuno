package com.rchila.backend.admin.email.controller;

import com.rchila.backend.admin.email.service.MarketingEmailService;
import com.rchila.backend.admin.email.service.dtos.BulkEmailRequest;
import com.rchila.backend.admin.email.service.dtos.CustomEmailRequest;
import com.rchila.backend.admin.email.service.dtos.EmailSendResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/marketing/emails")
@Tag(name = "Marketing Email", description = "Gestión de correos personalizados y masivos")
public class MarketingEmailController {

    private final MarketingEmailService marketingEmailService;

    public MarketingEmailController(MarketingEmailService marketingEmailService) {
        this.marketingEmailService = marketingEmailService;
    }

    @PostMapping("/send-custom")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Enviar correo personalizado", description = "Envía un correo personalizado a un destinatario específico")
    public ResponseEntity<EmailSendResult> sendCustomEmail(@Valid @RequestBody CustomEmailRequest request) {
        EmailSendResult result = marketingEmailService.sendCustomEmail(request);
        return ResponseEntity.ok(result);
    }


    @PostMapping("/send-bulk")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Enviar correos masivos", description = "Envía correos masivos a múltiples destinatarios según criterios específicos")
    public ResponseEntity<EmailSendResult> sendBulkEmails(@Valid @RequestBody BulkEmailRequest request) {
        EmailSendResult result = marketingEmailService.sendBulkEmails(request);
        return ResponseEntity.ok(result);
    }


    @PostMapping("/send-to-all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Enviar a todos los usuarios", description = "Envía un correo a todos los usuarios registrados en el sistema")
    public ResponseEntity<EmailSendResult> sendEmailToAllUsers(
            @RequestParam String subject,
            @RequestParam String message,
            @RequestParam(defaultValue = "false") boolean isHtml) {

        EmailSendResult result = marketingEmailService.sendEmailToAllUsers(subject, message, isHtml);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/send-to-roles")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Enviar a usuarios por roles", description = "Envía correos a usuarios que tienen roles específicos")
    public ResponseEntity<EmailSendResult> sendEmailToUsersWithRoles(
            @RequestParam List<String> roleNames,
            @RequestParam String subject,
            @RequestParam String message,
            @RequestParam(defaultValue = "false") boolean isHtml) {

        EmailSendResult result = marketingEmailService.sendEmailToUsersWithRoles(roleNames, subject, message, isHtml);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/send-to-users")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Enviar a usuarios específicos", description = "Envía correos a usuarios específicos identificados por sus UUIDs")
    public ResponseEntity<EmailSendResult> sendEmailToSpecificUsers(
            @RequestParam List<UUID> userIds,
            @RequestParam String subject,
            @RequestParam String message,
            @RequestParam(defaultValue = "false") boolean isHtml) {

        EmailSendResult result = marketingEmailService.sendEmailToSpecificUsers(userIds, subject, message, isHtml);
        return ResponseEntity.ok(result);
    }
}