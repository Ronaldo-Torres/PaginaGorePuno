package com.rchila.backend.admin.auth.controllers;

import com.rchila.backend.admin.auth.controllers.dtos.ActivationRequest;
import com.rchila.backend.admin.auth.controllers.dtos.ForgotPasswordRequest;
import com.rchila.backend.admin.auth.controllers.dtos.RequestActivationTokenRequest;
import com.rchila.backend.admin.auth.controllers.dtos.ResetPasswordRequest;
import com.rchila.backend.admin.auth.service.AccountService;
import com.rchila.backend.admin.config.exceptions.ErrorResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.executable.ValidateOnExecution;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/v1/account")
@ValidateOnExecution
@Tag(name = "Cuenta", description = "API para gestión de cuentas de usuario")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @Operation(summary = "Activar cuenta", description = "Activa la cuenta de usuario usando el token enviado por correo")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cuenta activada exitosamente"),
            @ApiResponse(responseCode = "400", description = "Token inválido o expirado", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/activate")
    public ResponseEntity<Map<String, String>> activateAccount(@Valid @RequestBody ActivationRequest request) {
        boolean activated = accountService.activateAccount(request.token());

        if (activated) {
            return ResponseEntity.ok(Map.of("message", "Cuenta activada correctamente"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Token inválido o expirado"));
        }
    }

    @Operation(summary = "Solicitar nuevo token de activación", description = "Envía un nuevo correo con el token de activación si la cuenta existe y no está activada")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Correo enviado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Email inválido o cuenta ya activada", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/request-activation")
    public ResponseEntity<Map<String, String>> requestActivationToken(
            @Valid @RequestBody RequestActivationTokenRequest request) {
        accountService.requestActivationToken(request.email());

        // Por seguridad, siempre devolvemos un mensaje positivo
        return ResponseEntity
                .ok(Map.of("message",
                        "Si el correo existe y la cuenta no está activada, se ha enviado un nuevo enlace de activación"));
    }

    @Operation(summary = "Solicitar restablecimiento de contraseña", description = "Envía un correo con instrucciones para restablecer la contraseña")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Correo enviado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Email inválido", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        accountService.requestPasswordReset(request.email());

        // Siempre devolvemos una respuesta positiva por seguridad
        return ResponseEntity
                .ok(Map.of("message", "Si el correo existe, se ha enviado un enlace para restablecer la contraseña"));
    }

    @Operation(summary = "Restablecer contraseña", description = "Restablece la contraseña del usuario usando el token enviado por correo")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Contraseña restablecida exitosamente"),
            @ApiResponse(responseCode = "400", description = "Token inválido o expirado", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        boolean reset = accountService.resetPassword(request.token(), request.newPassword());

        if (reset) {
            return ResponseEntity.ok(Map.of("message", "Contraseña restablecida correctamente"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Token inválido o expirado"));
        }
    }
}