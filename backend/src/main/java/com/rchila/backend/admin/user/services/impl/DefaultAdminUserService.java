package com.rchila.backend.admin.user.services.impl;

import com.rchila.backend.admin.config.exceptions.NotFoundException;
import com.rchila.backend.admin.email.service.EmailService;
import com.rchila.backend.admin.role.repositories.RoleRepository;
import com.rchila.backend.admin.role.repositories.models.Role;
import com.rchila.backend.admin.storage.StorageService;
import com.rchila.backend.admin.user.mappers.UserMapper;
import com.rchila.backend.admin.user.repositories.UserRepository;
import com.rchila.backend.admin.user.repositories.models.User;
import com.rchila.backend.admin.user.services.AdminUserService;
import com.rchila.backend.admin.user.services.UserTokenService;
import com.rchila.backend.admin.user.services.dtos.UserDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.UUID;

@Service
public class DefaultAdminUserService implements AdminUserService {

    private static final Logger logger = LoggerFactory.getLogger(DefaultAdminUserService.class);
    private static final SecureRandom secureRandom = new SecureRandom();
    private static final String CHAR_POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    private static final int PASSWORD_LENGTH = 12;

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final UserTokenService userTokenService;
    private final StorageService storageService;

    public DefaultAdminUserService(UserRepository userRepository, RoleRepository roleRepository,
            PasswordEncoder passwordEncoder, EmailService emailService,
            UserTokenService userTokenService, StorageService storageService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.userTokenService = userTokenService;
        this.storageService = storageService;
    }

    @Override
    @Transactional
    public UserDTO createUser(String firstName, String lastName, String email, Set<Long> roleIds) {
        // Delegamos al nuevo método con los valores por defecto
        return createUser(firstName, lastName, email, roleIds, true, null, false);
    }

    @Override
    @Transactional
    public UserDTO createUser(String firstName, String lastName, String email, Set<Long> roleIds,
            boolean sendActivationEmail, String password, boolean enabled) {
        logger.info("Creando usuario administrativamente: {}", email);
        String plainPassword;

        // Obtener roles
        Set<Role> roles = getRolesByIds(roleIds);

        // Crear el constructor del usuario
        User.UserBuilder userBuilder = User.builder()
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .roles(roles)
                .locked(false);

        if (sendActivationEmail) {
            // Generar contraseña aleatoria si se envía email
            plainPassword = generateRandomPassword();
            userBuilder.enabled(false) // La cuenta inicia desactivada
                    .passwordChangeRequired(true); // Requerirá cambio de contraseña al primer inicio de sesión
        } else {
            // Usar la contraseña proporcionada
            if (password == null || password.isEmpty()) {
                throw new IllegalArgumentException("Se requiere una contraseña cuando no se envía email de activación");
            }
            plainPassword = password;
            userBuilder.enabled(enabled) // La cuenta inicia con el estado especificado
                    .passwordChangeRequired(true); // Requerirá cambio de contraseña al primer inicio de sesión incluso
                                                   // con contraseña especificada
        }

        // Codificar contraseña y construir usuario
        userBuilder.password(passwordEncoder.encode(plainPassword));
        User user = userBuilder.build();

        User savedUser = userRepository.save(user);
        logger.info("Usuario creado: {}", savedUser.getEmail());

        if (sendActivationEmail) {
            // Generar token de activación
            String activationToken = userTokenService.generateActivationToken(savedUser);

            // Enviar correo con credenciales y token de activación
            emailService.sendAccountCreatedByAdminEmail(savedUser, plainPassword, activationToken);
            logger.info("Correo enviado a: {}", savedUser.getEmail());
        } else {
            logger.info("Usuario creado sin envío de correo de activación. Acceso inmediato: {}", enabled);

            // Si el usuario está habilitado inmediatamente, enviar correo de bienvenida
            if (enabled) {
                emailService.sendWelcomeEmail(savedUser);
                logger.info("Correo de bienvenida enviado a: {}", savedUser.getEmail());
            }
        }

        return UserMapper.toDTO(savedUser);
    }

    @Override
    @Transactional
    public UserDTO createUserWithAvatar(String firstName, String lastName, String email, String phone,
            Set<Long> roleIds,
            boolean sendActivationEmail, String password, boolean enabled, String avatarPath) {
        logger.info("Creando usuario administrativamente con avatar: {}", email);
        String plainPassword;

        // Obtener roles
        Set<Role> roles = getRolesByIds(roleIds);

        // Crear el constructor del usuario
        User.UserBuilder userBuilder = User.builder()
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .phone(phone)
                .roles(roles)
                .locked(false)
                .avatar(avatarPath);

        if (sendActivationEmail) {
            // Generar contraseña aleatoria si se envía email
            plainPassword = generateRandomPassword();
            userBuilder.enabled(false) // La cuenta inicia desactivada
                    .passwordChangeRequired(true); // Requerirá cambio de contraseña al primer inicio de sesión
        } else {
            // Usar la contraseña proporcionada
            if (password == null || password.isEmpty()) {
                throw new IllegalArgumentException("Se requiere una contraseña cuando no se envía email de activación");
            }
            plainPassword = password;
            userBuilder.enabled(enabled) // La cuenta inicia con el estado especificado
                    .passwordChangeRequired(true); // Requerirá cambio de contraseña al primer inicio de sesión incluso
                                                   // con contraseña especificada
        }

        // Codificar contraseña y construir usuario
        userBuilder.password(passwordEncoder.encode(plainPassword));
        User user = userBuilder.build();

        User savedUser = userRepository.save(user);
        logger.info("Usuario creado con avatar: {}", savedUser.getEmail());

        if (sendActivationEmail) {
            // Generar token de activación
            String activationToken = userTokenService.generateActivationToken(savedUser);

            // Enviar correo con credenciales y token de activación
            emailService.sendAccountCreatedByAdminEmail(savedUser, plainPassword, activationToken);
            logger.info("Correo enviado a: {}", savedUser.getEmail());
        } else {
            logger.info("Usuario creado sin envío de correo de activación. Acceso inmediato: {}", enabled);

            // Si el usuario está habilitado inmediatamente, enviar correo de bienvenida
            if (enabled) {
                emailService.sendWelcomeEmail(savedUser);
                logger.info("Correo de bienvenida enviado a: {}", savedUser.getEmail());
            }
        }

        return UserMapper.toDTO(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers() {
        logger.info("Obteniendo todos los usuarios");

        List<User> users = userRepository.findAll();
        logger.info("Se encontraron {} usuarios", users.size());

        return users.stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserDTO updateUser(UUID userId, String firstName, String lastName, String email) {
        logger.info("Actualizando usuario con ID {}", userId);

        User user = userRepository.findByUuid(userId)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado con ID: " + userId));

        // Actualizar datos
        user.setFirstName(firstName);
        user.setLastName(lastName);

        // Verificar si el email ha cambiado
        if (!user.getEmail().equals(email)) {
            // Verificar que el nuevo email no esté en uso
            if (userRepository.findByEmail(email).isPresent()) {
                throw new IllegalArgumentException("El correo electrónico ya está en uso");
            }
            user.setEmail(email);
        }

        User updatedUser = userRepository.save(user);
        logger.info("Usuario actualizado: {}", updatedUser.getEmail());

        return UserMapper.toDTO(updatedUser);
    }

    @Override
    @Transactional
    public UserDTO updateUserWithAvatar(UUID userId, String firstName, String lastName, String email, String phone,
            Set<Long> roleIds, String avatarPath) {
        logger.info("Actualizando usuario con avatar con ID {}", userId);

        User user = userRepository.findByUuid(userId)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado con ID: " + userId));

        // Guardar el avatar anterior para eliminarlo si es necesario
        String oldAvatarPath = user.getAvatar();

        // Actualizar datos
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPhone(phone); // Actualizar teléfono

        // Si se proporcionan roles, actualizarlos
        if (roleIds != null && !roleIds.isEmpty()) {
            Set<Role> roles = getRolesByIds(roleIds);
            user.setRoles(roles);
        }

        // Si se proporciona un nuevo avatar, actualizar y eliminar el anterior
        if (avatarPath != null) {
            user.setAvatar(avatarPath);

            // Eliminar avatar anterior si existe y es diferente al nuevo
            if (oldAvatarPath != null && !oldAvatarPath.equals(avatarPath)) {
                try {
                    storageService.deleteFile(oldAvatarPath);
                    logger.info("Avatar anterior eliminado: {}", oldAvatarPath);
                } catch (Exception e) {
                    logger.error("Error al eliminar avatar anterior: {}", oldAvatarPath, e);
                }
            }
        }

        // Verificar si el email ha cambiado
        if (!user.getEmail().equals(email)) {
            // Verificar que el nuevo email no esté en uso
            if (userRepository.findByEmail(email).isPresent()) {
                throw new IllegalArgumentException("El correo electrónico ya está en uso");
            }
            user.setEmail(email);
        }

        User updatedUser = userRepository.save(user);
        logger.info("Usuario actualizado con avatar: {}", updatedUser.getEmail());

        return UserMapper.toDTO(updatedUser);
    }

    @Override
    @Transactional
    public void deleteUser(UUID userId) {
        logger.info("Eliminando usuario con ID {}", userId);

        User user = userRepository.findByUuid(userId)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado con ID: " + userId));

        // Eliminar avatar del storage si existe
        if (user.getAvatar() != null) {
            try {
                storageService.deleteFile(user.getAvatar());
                logger.info("Avatar eliminado junto con el usuario: {}", user.getAvatar());
            } catch (Exception e) {
                logger.error("Error al eliminar avatar del usuario: {}", user.getAvatar(), e);
            }
        }

        userRepository.delete(user);
        logger.info("Usuario eliminado: {}", user.getEmail());
    }

    @Override
    @Transactional
    public UserDTO toggleUserStatus(UUID userId, boolean enabled) {
        logger.info("Cambiando estado de activación del usuario con ID {} a {}", userId, enabled);

        User user = userRepository.findByUuid(userId)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado con ID: " + userId));

        user.setEnabled(enabled);
        User updatedUser = userRepository.save(user);

        logger.info("Estado de usuario actualizado: {} - {}", updatedUser.getEmail(), enabled);

        return UserMapper.toDTO(updatedUser);
    }

    private String generateRandomPassword() {
        StringBuilder password = new StringBuilder(PASSWORD_LENGTH);
        for (int i = 0; i < PASSWORD_LENGTH; i++) {
            int randomIndex = secureRandom.nextInt(CHAR_POOL.length());
            password.append(CHAR_POOL.charAt(randomIndex));
        }
        return password.toString();
    }

    private Set<Role> getRolesByIds(Set<Long> roleIds) {
        Set<Role> roles = new HashSet<>();

        for (Long roleId : roleIds) {
            Role role = roleRepository.findById(roleId)
                    .orElseThrow(() -> new NotFoundException("Rol no encontrado con ID: " + roleId));
            roles.add(role);
        }

        return roles;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserDTO> getUsersPage(Pageable pageable) {
        logger.info("Obteniendo página de usuarios: page={}, size={}",
                pageable.getPageNumber(), pageable.getPageSize());

        Page<User> usersPage = userRepository.findAll(pageable);
        logger.info("Se encontraron {} usuarios en la página {} de {}",
                usersPage.getNumberOfElements(), usersPage.getNumber() + 1, usersPage.getTotalPages());

        return usersPage.map(UserMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserDTO> getUsersPageWithFilters(Pageable pageable, String search, String role) {
        logger.info("Obteniendo página de usuarios con filtros: page={}, size={}, search='{}', role='{}'",
                pageable.getPageNumber(), pageable.getPageSize(), search, role);

        Page<User> usersPage;

        // Aplicar filtros según los parámetros
        if (search != null && !search.trim().isEmpty() && role != null && !"all".equalsIgnoreCase(role)) {
            // Filtrar por búsqueda Y rol
            usersPage = userRepository.findBySearchAndRole(search.trim(), role, pageable);
        } else if (search != null && !search.trim().isEmpty()) {
            // Solo filtrar por búsqueda
            usersPage = userRepository
                    .findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                            search.trim(), search.trim(), search.trim(), pageable);
        } else if (role != null && !"all".equalsIgnoreCase(role)) {
            // Solo filtrar por rol
            usersPage = userRepository.findByRole(role, pageable);
        } else {
            // Sin filtros
            usersPage = userRepository.findAll(pageable);
        }

        logger.info("Se encontraron {} usuarios en la página {} de {} con filtros aplicados",
                usersPage.getNumberOfElements(), usersPage.getNumber() + 1, usersPage.getTotalPages());

        return usersPage.map(UserMapper::toDTO);
    }

    @Override
    @Transactional
    public UserDTO removeUserAvatar(UUID userId) {
        logger.info("Eliminando avatar del usuario con ID {}", userId);

        User user = userRepository.findByUuid(userId)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado con ID: " + userId));

        String oldAvatarPath = user.getAvatar();

        if (oldAvatarPath != null) {
            // Eliminar avatar del storage
            try {
                storageService.deleteFile(oldAvatarPath);
                logger.info("Avatar eliminado del storage: {}", oldAvatarPath);
            } catch (Exception e) {
                logger.error("Error al eliminar avatar del storage: {}", oldAvatarPath, e);
            }

            // Eliminar referencia en la base de datos
            user.setAvatar(null);
            User updatedUser = userRepository.save(user);
            logger.info("Avatar eliminado del usuario: {}", updatedUser.getEmail());

            return UserMapper.toDTO(updatedUser);
        } else {
            logger.warn("El usuario {} no tiene avatar para eliminar", user.getEmail());
            return UserMapper.toDTO(user);
        }
    }

    @Override
    @Transactional
    public UserDTO resetUserPassword(UUID userId) {
        logger.info("Reseteando contraseña del usuario con ID {}", userId);

        User user = userRepository.findByUuid(userId)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado con ID: " + userId));

        // Generar nueva contraseña aleatoria
        String newPassword = generateRandomPassword();

        // Codificar la nueva contraseña
        user.setPassword(passwordEncoder.encode(newPassword));

        // Marcar que requiere cambio de contraseña en el primer login
        user.setPasswordChangeRequired(true);

        // Habilitar el usuario si estaba deshabilitado
        user.setEnabled(true);

        // Limpiar tokens de reset anteriores si existen
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiresAt(null);

        User updatedUser = userRepository.save(user);

        // Generar token de activación/primer login
        String activationToken = userTokenService.generateActivationToken(updatedUser);

        // Enviar email específico para reseteo de contraseña por admin
        emailService.sendPasswordResetByAdminEmail(updatedUser, newPassword, activationToken);

        logger.info("Contraseña reseteada y email de reseteo enviado para usuario: {}", updatedUser.getEmail());

        return UserMapper.toDTO(updatedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Role> getRoles() {
        logger.info("Obteniendo todos los roles");
        return roleRepository.findAll();
    }
}