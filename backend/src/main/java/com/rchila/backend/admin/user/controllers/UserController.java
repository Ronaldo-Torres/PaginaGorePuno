package com.rchila.backend.admin.user.controllers;

import com.rchila.backend.admin.config.exceptions.ErrorResponse;
import com.rchila.backend.admin.role.dto.RoleResponse;
import com.rchila.backend.admin.role.mapper.RoleMapper;
import com.rchila.backend.admin.role.services.RoleService;
import com.rchila.backend.admin.storage.StorageService;
import com.rchila.backend.admin.user.controllers.dtos.UserDetailedResponse;
import com.rchila.backend.admin.user.controllers.dtos.UserResponse;
import com.rchila.backend.admin.user.controllers.dtos.ChangePasswordRequest;
import com.rchila.backend.admin.user.controllers.dtos.SetPasswordRequest;
import com.rchila.backend.admin.user.services.UserService;
import com.rchila.backend.admin.user.services.dtos.UserDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/v1/users")
@Tag(name = "Usuarios", description = "API para la gestión de usuarios autenticados")
@SecurityRequirement(name = "Bearer Authentication")
@RequiredArgsConstructor
public class UserController {

        private final UserService userService;
        private final RoleService roleService;
        private final RoleMapper roleMapper;
        private final StorageService storageService;

        @Operation(summary = "Obtener perfil propio", description = "Obtiene el perfil del usuario autenticado")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Perfil obtenido exitosamente"),
                        @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "404", description = "Usuario no encontrado", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class)))
        })
        @GetMapping("/me")
        public ResponseEntity<UserDetailedResponse> getCurrentProfile() {
                UUID currentUserId = getCurrentUserId();
                UserDTO userDTO = userService.getUserByUuid(currentUserId);

                // Obtener detalles de roles
                Set<RoleResponse> roleDetails = userDTO.roles().stream()
                                .map(roleMap -> roleService.findByName((String) roleMap.get("name"))
                                                .map(roleMapper::toResponse)
                                                .orElse(null))
                                .filter(Objects::nonNull)
                                .collect(Collectors.toSet());

                UserDetailedResponse response = new UserDetailedResponse(
                                userDTO.uuid().toString(),
                                userDTO.firstName(),
                                userDTO.lastName(),
                                userDTO.email(),
                                userDTO.phone(),
                                userDTO.roles(),
                                userDTO.enabled(),
                                userDTO.createdAt(),
                                userDTO.avatar(),
                                roleDetails);

                return ResponseEntity.ok(response);
        }

        @Operation(summary = "Actualizar perfil propio", description = "Actualiza el perfil del usuario autenticado")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Perfil actualizado exitosamente"),
                        @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "404", description = "Usuario no encontrado", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class)))
        })
        @PutMapping(value = "/me", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<UserResponse> updateCurrentProfile(
                        @RequestParam("firstName") String firstName,
                        @RequestParam("lastName") String lastName,
                        @RequestParam(value = "phone", required = false) String phone,
                        @RequestParam(value = "avatar", required = false) MultipartFile avatar) {

                try {
                        UUID currentUserId = getCurrentUserId();
                        String avatarPath = null;

                        // Procesar archivo de avatar si se proporciona
                        if (avatar != null && !avatar.isEmpty()) {
                                if (!storageService.isValidImage(avatar)) {
                                        return ResponseEntity.badRequest().build();
                                }
                                avatarPath = storageService.saveImage(avatar);
                        }

                        UserDTO updatedUser = userService.updateUserWithAvatar(
                                        currentUserId,
                                        firstName,
                                        lastName,
                                        phone,
                                        avatarPath);

                        UserResponse response = new UserResponse(
                                        updatedUser.uuid().toString(),
                                        updatedUser.firstName(),
                                        updatedUser.lastName(),
                                        updatedUser.email(),
                                        updatedUser.phone(),
                                        updatedUser.roles(),
                                        updatedUser.enabled(),
                                        updatedUser.createdAt(),
                                        updatedUser.avatar());

                        return ResponseEntity.ok(response);
                } catch (IOException e) {
                        return ResponseEntity.badRequest().build();
                }
        }

        @Operation(summary = "Cambiar contraseña", description = "Cambia la contraseña del usuario autenticado")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Contraseña cambiada exitosamente"),
                        @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "403", description = "Contraseña actual incorrecta", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class)))
        })
        @PutMapping("/me/password")
        public ResponseEntity<Map<String, String>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
                UUID currentUserId = getCurrentUserId();

                userService.changePassword(currentUserId, request.currentPassword(), request.newPassword());

                return ResponseEntity.ok(Map.of("message", "Contraseña cambiada correctamente"));
        }

        @Operation(summary = "Establecer contraseña", description = "Establece la contraseña del usuario autenticado (para primer login)")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Contraseña establecida exitosamente"),
                        @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class)))
        })
        @PostMapping("/me/set-password")
        public ResponseEntity<Map<String, String>> setPassword(@Valid @RequestBody SetPasswordRequest request) {
                // Verificar que las contraseñas coincidan
                if (!request.newPassword().equals(request.confirmPassword())) {
                        return ResponseEntity.badRequest()
                                        .body(Map.of("error", "Las contraseñas no coinciden"));
                }

                try {
                        UUID currentUserId = getCurrentUserId();
                        boolean changed = userService.setPassword(currentUserId, request.newPassword());

                        if (changed) {
                                return ResponseEntity.ok(Map.of("message", "Contraseña establecida correctamente"));
                        } else {
                                return ResponseEntity.badRequest()
                                                .body(Map.of("error", "No se pudo establecer la contraseña"));
                        }
                } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .body(Map.of("error", e.getMessage()));
                }
        }

        @Operation(summary = "Eliminar avatar", description = "Elimina el avatar del usuario autenticado")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Avatar eliminado exitosamente"),
                        @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "404", description = "Usuario no encontrado", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class)))
        })
        @DeleteMapping("/me/avatar")
        public ResponseEntity<UserResponse> removeAvatar() {
                UUID currentUserId = getCurrentUserId();
                UserDTO updatedUser = userService.removeAvatar(currentUserId);

                UserResponse response = new UserResponse(
                                updatedUser.uuid().toString(),
                                updatedUser.firstName(),
                                updatedUser.lastName(),
                                updatedUser.email(),
                                updatedUser.phone(),
                                updatedUser.roles(),
                                updatedUser.enabled(),
                                updatedUser.createdAt(),
                                updatedUser.avatar());

                return ResponseEntity.ok(response);
        }

        private UUID getCurrentUserId() {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                return UUID.fromString(authentication.getName());
        }
}
