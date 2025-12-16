package com.rchila.backend.admin.user.services.impl;

import com.rchila.backend.admin.config.exceptions.NotFoundException;
import com.rchila.backend.admin.email.service.EmailService;
import com.rchila.backend.admin.storage.StorageService;
import com.rchila.backend.admin.user.mappers.UserMapper;
import com.rchila.backend.admin.user.repositories.UserRepository;
import com.rchila.backend.admin.user.repositories.models.User;
import com.rchila.backend.admin.user.services.UserService;
import com.rchila.backend.admin.user.services.dtos.UserDTO;
import com.rchila.backend.admin.user.services.dtos.UserUpdateDTO;
import jakarta.validation.constraints.NotNull;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Service
public class DefaultUserService implements UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final EmailService emailService;

    private final StorageService storageService;

    public DefaultUserService(final UserRepository userRepository,
            final PasswordEncoder passwordEncoder,
            final EmailService emailService,
            final StorageService storageService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.storageService = storageService;
    }

    @Override
    public UserDTO getUserByUuid(@NotNull final UUID uuid) {
        Objects.requireNonNull(uuid, "El UUID del usuario no puede ser nulo");
        final User user = userRepository.findByUuid(uuid)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado con UUID: " + uuid));
        return UserMapper.toDTO(user);
    }

    @Override
    public UserDTO updateUser(@NotNull final UUID uuid, @NotNull final UserUpdateDTO userDTO) {
        Objects.requireNonNull(uuid, "El UUID no puede ser nulo");
        Objects.requireNonNull(userDTO, "El DTO del usuario no puede ser nulo");
        final User user = userRepository.findByUuid(uuid)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado con UUID: " + uuid));
        user.setFirstName(userDTO.firstName());
        user.setLastName(userDTO.lastName());
        user.setEmail(userDTO.email());
        final User updatedUser = userRepository.save(user);
        return UserMapper.toDTO(updatedUser);
    }

    @Override
    @Transactional
    public UserDTO updateUserWithAvatar(@NotNull UUID uuid, @NotNull String firstName,
            @NotNull String lastName, String phone, String avatarPath) {
        Objects.requireNonNull(uuid, "El UUID no puede ser nulo");
        Objects.requireNonNull(firstName, "El nombre no puede ser nulo");
        Objects.requireNonNull(lastName, "El apellido no puede ser nulo");

        final User user = userRepository.findByUuid(uuid)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado con UUID: " + uuid));

        // Guardar el avatar anterior para eliminarlo si es necesario
        String oldAvatarPath = user.getAvatar();

        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPhone(phone); // Actualizar teléfono

        // Si se proporciona un nuevo avatar, actualizar y eliminar el anterior
        if (avatarPath != null) {
            user.setAvatar(avatarPath);

            // Eliminar avatar anterior si existe y es diferente al nuevo
            if (oldAvatarPath != null && !oldAvatarPath.equals(avatarPath)) {
                try {
                    storageService.deleteFile(oldAvatarPath);
                } catch (Exception e) {
                    // Log del error pero no fallar la transacción
                    System.err.println("Error al eliminar avatar anterior: " + e.getMessage());
                }
            }
        }

        final User updatedUser = userRepository.save(user);
        return UserMapper.toDTO(updatedUser);
    }

    @Override
    @Transactional
    public UserDTO removeAvatar(@NotNull UUID uuid) {
        Objects.requireNonNull(uuid, "El UUID no puede ser nulo");

        final User user = userRepository.findByUuid(uuid)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado con UUID: " + uuid));

        // Guardar el avatar actual para eliminarlo
        String currentAvatarPath = user.getAvatar();

        // Remover avatar del usuario
        user.setAvatar(null);

        // Eliminar archivo del storage si existe
        if (currentAvatarPath != null) {
            try {
                storageService.deleteFile(currentAvatarPath);
            } catch (Exception e) {
                // Log del error pero no fallar la transacción
                System.err.println("Error al eliminar archivo de avatar: " + e.getMessage());
            }
        }

        final User updatedUser = userRepository.save(user);
        return UserMapper.toDTO(updatedUser);
    }

    @Override
    @Transactional
    public void deleteUserByUuid(@NotNull final UUID uuid) {
        Objects.requireNonNull(uuid, "El UUID del usuario no puede ser nulo");
        userRepository.deleteByUuid(uuid);
    }

    @Override
    @Transactional
    public void changePassword(@NotNull UUID uuid, @NotNull String currentPassword, @NotNull String newPassword) {
        // Validar parámetros
        Objects.requireNonNull(uuid, "El UUID del usuario no puede ser nulo");
        Objects.requireNonNull(currentPassword, "La contraseña actual no puede ser nula");
        Objects.requireNonNull(newPassword, "La nueva contraseña no puede ser nula");

        if (currentPassword.isBlank() || newPassword.isBlank()) {
            throw new IllegalArgumentException("Las contraseñas no pueden estar vacías");
        }

        // Buscar el usuario
        final User user = userRepository.findByUuid(uuid)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado con UUID: " + uuid));

        // Verificar que la contraseña actual sea correcta
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new SecurityException("La contraseña actual es incorrecta");
        }

        // Actualizar la contraseña
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setLastPasswordChangeAt(LocalDateTime.now());
        userRepository.save(user);

        // Enviar correo de confirmación
        emailService.sendPasswordChangedEmail(user);
    }

    @Override
    @Transactional
    public boolean setPassword(@NotNull UUID uuid, @NotNull String newPassword) {
        // Validar parámetros
        Objects.requireNonNull(uuid, "El UUID del usuario no puede ser nulo");
        Objects.requireNonNull(newPassword, "La nueva contraseña no puede ser nula");

        if (newPassword.isBlank()) {
            throw new IllegalArgumentException("La nueva contraseña no puede estar vacía");
        }

        // Buscar el usuario
        final User user = userRepository.findByUuid(uuid)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado con UUID: " + uuid));

        // Actualizar la contraseña
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setLastPasswordChangeAt(LocalDateTime.now());
        user.setPasswordChangeRequired(false); // Ya no se requiere cambio de contraseña
        userRepository.save(user);

        // Enviar correo de confirmación
        emailService.sendPasswordChangedEmail(user);

        return true;
    }
}
