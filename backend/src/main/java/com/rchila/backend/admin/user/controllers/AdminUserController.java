package com.rchila.backend.admin.user.controllers;

import com.rchila.backend.admin.config.exceptions.ErrorResponse;
import com.rchila.backend.admin.storage.StorageService;
import com.rchila.backend.admin.user.controllers.dtos.PageResponse;
import com.rchila.backend.admin.user.controllers.dtos.UserResponse;
import com.rchila.backend.admin.user.controllers.dtos.ToggleStatusRequest;
import com.rchila.backend.admin.user.services.AdminUserService;
import com.rchila.backend.admin.user.services.dtos.UserDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/v1/admin/users")
@Tag(name = "Administración de Usuarios", description = "API para la gestión administrativa de usuarios")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminUserController {

        private final AdminUserService adminUserService;
        private final StorageService storageService;

        public AdminUserController(AdminUserService adminUserService, StorageService storageService) {
                this.adminUserService = adminUserService;
                this.storageService = storageService;
        }

        @Operation(summary = "Obtener usuarios", description = "Obtiene todos los usuarios del sistema (requiere privilegio USER_READ)")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida exitosamente"),
                        @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "403", description = "Prohibido - no tiene permisos de administrador", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class)))
        })
        @GetMapping
        @PreAuthorize("hasAuthority('USER_READ')")
        public ResponseEntity<List<UserResponse>> getAllUsers() {
                List<UserDTO> users = adminUserService.getAllUsers();
                List<UserResponse> userResponses = users.stream()
                                .map(userDTO -> new UserResponse(
                                                userDTO.uuid().toString(),
                                                userDTO.firstName(),
                                                userDTO.lastName(),
                                                userDTO.email(),
                                                userDTO.phone(),
                                                userDTO.roles(),
                                                userDTO.enabled(),
                                                userDTO.createdAt(),
                                                userDTO.avatar()))
                                .collect(Collectors.toList());

                return ResponseEntity.ok(userResponses);
        }

        @Operation(summary = "Actualizar usuario", description = "Actualiza un usuario existente (requiere privilegio USER_UPDATE)")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Usuario actualizado exitosamente"),
                        @ApiResponse(responseCode = "400", description = "Datos de actualización inválidos", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "403", description = "Prohibido - no tiene permisos de administrador", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "404", description = "Usuario no encontrado", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class)))
        })
        @PutMapping(value = "/{userId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        @PreAuthorize("hasAuthority('USER_UPDATE')")
        public ResponseEntity<UserResponse> updateUser(
                        @PathVariable String userId,
                        @RequestParam("firstName") String firstName,
                        @RequestParam("lastName") String lastName,
                        @RequestParam("email") String email,
                        @RequestParam(value = "phone", required = false) String phone,
                        @RequestParam(value = "roleIds", required = false) String roleIds,
                        @RequestParam(value = "avatar", required = false) MultipartFile avatar) {

                try {
                        String avatarPath = null;
                        Set<Long> roleIdSet = null;

                        // Procesar roleIds si se proporcionan (formato: "1,2")
                        if (roleIds != null && !roleIds.trim().isEmpty()) {
                                roleIdSet = Arrays.stream(roleIds.split(","))
                                                .map(String::trim)
                                                .map(Long::parseLong)
                                                .collect(Collectors.toSet());
                        }

                        // Procesar archivo de avatar si se proporciona
                        if (avatar != null && !avatar.isEmpty()) {
                                if (!storageService.isValidImage(avatar)) {
                                        return ResponseEntity.badRequest().build();
                                }
                                avatarPath = storageService.saveImage(avatar);
                        }

                        UserDTO updatedUser = adminUserService.updateUserWithAvatar(
                                        UUID.fromString(userId),
                                        firstName,
                                        lastName,
                                        email,
                                        phone,
                                        roleIdSet,
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
                } catch (NumberFormatException e) {
                        return ResponseEntity.badRequest()
                                        .body(null); // Invalid role IDs format
                }
        }

        @Operation(summary = "Eliminar usuario", description = "Elimina un usuario del sistema (requiere privilegio USER_DELETE)")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Usuario eliminado exitosamente"),
                        @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "403", description = "Prohibido - no tiene permisos de administrador", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "404", description = "Usuario no encontrado", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class)))
        })
        @DeleteMapping("/{userId}")
        @PreAuthorize("hasAuthority('USER_DELETE')")
        public ResponseEntity<Map<String, String>> deleteUser(@PathVariable String userId) {
                adminUserService.deleteUser(UUID.fromString(userId));
                return ResponseEntity.ok(Map.of("message", "Usuario eliminado correctamente"));
        }

        @Operation(summary = "Cambiar estado de usuario", description = "Activa o desactiva un usuario (requiere privilegio USER_TOGGLE_STATUS)")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Estado cambiado exitosamente"),
                        @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "403", description = "Prohibido - no tiene permisos de administrador", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "404", description = "Usuario no encontrado", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class)))
        })
        @PatchMapping("/{userId}/status")
        @PreAuthorize("hasAuthority('USER_TOGGLE_STATUS')")
        public ResponseEntity<UserResponse> toggleUserStatus(
                        @PathVariable String userId,
                        @Valid @RequestBody ToggleStatusRequest request) {

                UserDTO updatedUser = adminUserService.toggleUserStatus(
                                UUID.fromString(userId),
                                request.enabled());

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

        @Operation(summary = "Crear usuario", description = "Crea un nuevo usuario (requiere privilegio USER_CREATE)")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Usuario creado exitosamente"),
                        @ApiResponse(responseCode = "400", description = "Datos de creación inválidos", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "403", description = "Prohibido - no tiene permisos de administrador", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class)))
        })
        @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        @PreAuthorize("hasAuthority('USER_CREATE')")
        public ResponseEntity<Map<String, String>> createUser(
                        @RequestParam("firstName") String firstName,
                        @RequestParam("lastName") String lastName,
                        @RequestParam("email") String email,
                        @RequestParam(value = "phone", required = false) String phone,
                        @RequestParam("roleIds") String roleIds,
                        @RequestParam(value = "sendActivationEmail", defaultValue = "true") Boolean sendActivationEmail,
                        @RequestParam(value = "password", required = false) String password,
                        @RequestParam(value = "enabled", defaultValue = "false") Boolean enabled,
                        @RequestParam(value = "avatar", required = false) MultipartFile avatar) {

                try {
                        // Procesar roleIds (formato: "1,2")
                        Set<Long> roleIdSet = Arrays.stream(roleIds.split(","))
                                        .map(String::trim)
                                        .map(Long::parseLong)
                                        .collect(Collectors.toSet());

                        String avatarPath = null;

                        // Procesar archivo de avatar si se proporciona
                        if (avatar != null && !avatar.isEmpty()) {
                                if (!storageService.isValidImage(avatar)) {
                                        return ResponseEntity.badRequest()
                                                        .body(Map.of("error", "Archivo de imagen inválido"));
                                }
                                avatarPath = storageService.saveImage(avatar);
                        }

                        // Usar el nuevo método con todos los parámetros
                        UserDTO createdUser = adminUserService.createUserWithAvatar(
                                        firstName,
                                        lastName,
                                        email,
                                        phone,
                                        roleIdSet,
                                        sendActivationEmail,
                                        password,
                                        enabled,
                                        avatarPath);

                        String message = sendActivationEmail
                                        ? "Usuario creado correctamente. Se ha enviado un correo con las credenciales."
                                        : "Usuario creado correctamente" + (enabled ? " con acceso inmediato." : ".");

                        return ResponseEntity.ok(Map.of(
                                        "message", message,
                                        "userId", createdUser.uuid().toString()));
                } catch (IOException e) {
                        return ResponseEntity.badRequest()
                                        .body(Map.of("error", "Error al procesar la imagen"));
                } catch (NumberFormatException e) {
                        return ResponseEntity.badRequest()
                                        .body(Map.of("error", "IDs de roles inválidos"));
                }
        }

        @Operation(summary = "Obtener usuarios paginados", description = "Obtiene usuarios de manera paginada (requiere privilegio USER_READ)")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Página de usuarios obtenida exitosamente"),
                        @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "403", description = "Prohibido - no tiene permisos de administrador", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class)))
        })
        @GetMapping("/page")
        @PreAuthorize("hasAuthority('USER_READ')")
        public ResponseEntity<PageResponse<UserResponse>> getUsersPage(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size,
                        @RequestParam(defaultValue = "id") String sort,
                        @RequestParam(defaultValue = "desc") String order,
                        @RequestParam(required = false) String search,
                        @RequestParam(defaultValue = "all") String role) {

                // Verificar si el sort es "createdAt" y cambiarlo a "id" para evitar el error
                if ("createdAt".equals(sort)) {
                        sort = "id";
                }

                // Crear objeto de paginación con ordenación
                Pageable pageable = PageRequest.of(
                                page,
                                size,
                                Sort.by(order.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,
                                                sort));

                // Obtener la página de usuarios con filtros
                Page<UserDTO> usersPage = adminUserService.getUsersPageWithFilters(pageable, search, role);

                // Mapear los DTOs a objetos de respuesta
                Page<UserResponse> userResponsePage = usersPage.map(userDTO -> new UserResponse(
                                userDTO.uuid().toString(),
                                userDTO.firstName(),
                                userDTO.lastName(),
                                userDTO.email(),
                                userDTO.phone(),
                                userDTO.roles(),
                                userDTO.enabled(),
                                userDTO.createdAt(),
                                userDTO.avatar()));

                // Crear respuesta paginada
                PageResponse<UserResponse> response = new PageResponse<>(
                                userResponsePage.getContent(),
                                userResponsePage.getTotalElements(),
                                userResponsePage.getTotalPages(),
                                userResponsePage.getNumber(),
                                userResponsePage.getSize());

                return ResponseEntity.ok(response);
        }

        @Operation(summary = "Eliminar avatar de usuario", description = "Elimina el avatar de un usuario específico (requiere privilegio USER_MANAGE_AVATAR)")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Avatar eliminado exitosamente"),
                        @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "403", description = "Prohibido - no tiene permisos de administrador", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "404", description = "Usuario no encontrado", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class)))
        })
        @DeleteMapping("/{userId}/avatar")
        @PreAuthorize("hasAuthority('USER_MANAGE_AVATAR')")
        public ResponseEntity<UserResponse> removeUserAvatar(@PathVariable String userId) {
                UserDTO updatedUser = adminUserService.removeUserAvatar(UUID.fromString(userId));

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

        @Operation(summary = "Resetear contraseña de usuario", description = "Resetea la contraseña de un usuario y envía las nuevas credenciales por email (requiere privilegio USER_RESET_PASSWORD)")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Contraseña reseteada exitosamente"),
                        @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "403", description = "Prohibido - no tiene permisos de administrador", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "404", description = "Usuario no encontrado", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))),
                        @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class)))
        })
        @PostMapping("/{userId}/reset-password")
        @PreAuthorize("hasAuthority('USER_RESET_PASSWORD')")
        public ResponseEntity<Map<String, String>> resetUserPassword(@PathVariable String userId) {
                UserDTO updatedUser = adminUserService.resetUserPassword(UUID.fromString(userId));

                return ResponseEntity.ok(Map.of(
                                "message", "Contraseña reseteada correctamente",
                                "email", "Se han enviado las nuevas credenciales a " + updatedUser.email()));
        }
}