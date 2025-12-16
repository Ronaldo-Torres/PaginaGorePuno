package com.rchila.backend.admin.auth.controllers;

import com.rchila.backend.admin.auth.controllers.dtos.AuthResponse;
import com.rchila.backend.admin.auth.controllers.dtos.LoginRequest;
import com.rchila.backend.admin.auth.controllers.dtos.RefreshTokenRequest;
import com.rchila.backend.admin.auth.controllers.dtos.RegisterRequest;
import com.rchila.backend.admin.auth.service.impl.JwtAuthService;
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
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/auth")
@ValidateOnExecution
@Tag(name = "Autenticación", description = "API para la gestión de autenticación de usuarios")
public class AuthController {

        private final JwtAuthService jwtAuthService;

        public AuthController(final JwtAuthService jwtAuthService) {
                this.jwtAuthService = jwtAuthService;
        }

        @Operation(summary = "Iniciar sesión", description = "Autentica un usuario y devuelve los tokens de acceso")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Autenticación exitosa"),
                        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "401", description = "Credenciales inválidas", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "403", description = "No autorizado", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class)))
        })
        @PostMapping("/login")
        public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
                AuthResponse result = jwtAuthService.login(loginRequest);
                return ResponseEntity.ok(result);
        }

        @Operation(summary = "Registrar usuario", description = "Registra un nuevo usuario en el sistema")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Usuario registrado exitosamente"),
                        @ApiResponse(responseCode = "400", description = "Datos de registro inválidos o validación fallida", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "403", description = "No autorizado", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class)))
        })
        @PostMapping("/register")
        public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
                AuthResponse result = jwtAuthService.register(registerRequest);
                return ResponseEntity.ok(result);
        }

        @Operation(summary = "Renovar token", description = "Genera un nuevo token de acceso usando el token de actualización")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Token renovado exitosamente"),
                        @ApiResponse(responseCode = "400", description = "Token de actualización inválido o malformado", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "401", description = "Token de actualización expirado", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "403", description = "No autorizado", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class)))
        })
        @PostMapping("/refresh-token")
        public ResponseEntity<AuthResponse> refresh(@RequestBody RefreshTokenRequest request) {
                AuthResponse result = jwtAuthService.refreshToken(request.refreshToken());
                return ResponseEntity.ok(result);
        }

        @Operation(summary = "Validar token", description = "Verifica si el token de acceso actual es válido")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Token válido"),
                        @ApiResponse(responseCode = "401", description = "Token inválido o expirado", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "403", description = "No autorizado", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class)))
        })
        @GetMapping("/validate")
        public ResponseEntity<Void> validateToken(Authentication authentication) {
                // Si llegamos aquí, significa que el token es válido (Spring Security ya lo
                // validó)
                return ResponseEntity.ok().build();
        }
}