package com.rchila.backend.admin.user.services.impl;

import com.rchila.backend.admin.email.service.EmailService;
import com.rchila.backend.admin.user.repositories.UserRepository;
import com.rchila.backend.admin.user.repositories.models.User;
import com.rchila.backend.admin.user.services.UserTokenService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;

@Service
public class DefaultUserTokenService implements UserTokenService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private static final SecureRandom secureRandom = new SecureRandom();
    private static final Base64.Encoder base64Encoder = Base64.getUrlEncoder();

    // Duración de los tokens en horas
    private static final int ACTIVATION_TOKEN_EXPIRY_HOURS = 24;
    private static final int RESET_PASSWORD_TOKEN_EXPIRY_HOURS = 1;

    public DefaultUserTokenService(UserRepository userRepository, PasswordEncoder passwordEncoder,
            EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Transactional
    @Override
    public String generateActivationToken(User user) {
        String token = generateRandomToken();

        user.setActivationToken(token);
        user.setActivationTokenExpiresAt(LocalDateTime.now().plusHours(ACTIVATION_TOKEN_EXPIRY_HOURS));
        userRepository.save(user);

        return token;
    }

    @Transactional
    @Override
    public boolean activateAccount(String token) {
        Optional<User> optionalUser = userRepository.findByActivationToken(token);

        if (optionalUser.isEmpty()) {
            return false;
        }

        User user = optionalUser.get();

        // Verificar si el token ha expirado
        if (user.getActivationTokenExpiresAt().isBefore(LocalDateTime.now())) {
            return false;
        }

        // Activar la cuenta
        user.setEnabled(true);
        user.setActivationToken(null);
        user.setActivationTokenExpiresAt(null);
        userRepository.save(user);

        // Enviar correo de bienvenida después de la activación exitosa
        emailService.sendWelcomeEmail(user);

        return true;
    }

    @Transactional
    @Override
    public String generateResetPasswordToken(User user) {
        String token = generateRandomToken();

        user.setResetPasswordToken(token);
        user.setResetPasswordTokenExpiresAt(LocalDateTime.now().plusHours(RESET_PASSWORD_TOKEN_EXPIRY_HOURS));
        userRepository.save(user);

        return token;
    }

    @Override
    public User validateResetPasswordToken(String token) {
        Optional<User> optionalUser = userRepository.findByResetPasswordToken(token);

        if (optionalUser.isEmpty()) {
            return null;
        }

        User user = optionalUser.get();

        // Verificar si el token ha expirado
        if (user.getResetPasswordTokenExpiresAt().isBefore(LocalDateTime.now())) {
            return null;
        }

        return user;
    }

    @Transactional
    @Override
    public boolean resetPassword(String token, String newPassword) {
        User user = validateResetPasswordToken(token);

        if (user == null) {
            return false;
        }

        // Actualizar la contraseña
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiresAt(null);
        user.setLastPasswordChangeAt(LocalDateTime.now());
        userRepository.save(user);

        // Enviar correo de confirmación
        emailService.sendPasswordChangedEmail(user);

        return true;
    }

    private String generateRandomToken() {
        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);
        return base64Encoder.encodeToString(randomBytes);
    }
}