package com.rchila.backend.admin.auth.service.impl;

import com.rchila.backend.admin.auth.service.AccountService;
import com.rchila.backend.admin.email.service.EmailService;
import com.rchila.backend.admin.user.repositories.UserRepository;
import com.rchila.backend.admin.user.repositories.models.User;
import com.rchila.backend.admin.user.services.UserTokenService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DefaultAccountService implements AccountService {

    private static final Logger logger = LoggerFactory.getLogger(DefaultAccountService.class);

    private final UserRepository userRepository;
    private final UserTokenService userTokenService;
    private final EmailService emailService;

    public DefaultAccountService(UserRepository userRepository, UserTokenService userTokenService,
            EmailService emailService) {
        this.userRepository = userRepository;
        this.userTokenService = userTokenService;
        this.emailService = emailService;
    }

    @Override
    @Transactional
    public boolean activateAccount(String token) {
        logger.info("Intentando activar cuenta con token");
        return userTokenService.activateAccount(token);
    }

    @Override
    @Transactional
    public void requestPasswordReset(String email) {
        logger.info("Solicitud de restablecimiento de contraseña para email: {}", email);

        // Buscamos al usuario por su correo electrónico
        User user = userRepository.findByEmail(email)
                .orElse(null);

        // Si el usuario no existe, no hacemos nada (por seguridad)
        if (user == null) {
            logger.info("Email no encontrado: {}", email);
            return;
        }

        // Verificamos que la cuenta esté activada
        if (!user.isEnabled()) {
            logger.info("La cuenta no está activada: {}", email);
            return;
        }

        // Generamos un token de restablecimiento
        String token = userTokenService.generateResetPasswordToken(user);

        // Enviamos el correo con el token
        emailService.sendResetPasswordEmail(user, token);

        logger.info("Correo de restablecimiento enviado a: {}", email);
    }

    @Override
    @Transactional
    public boolean resetPassword(String token, String newPassword) {
        logger.info("Intentando restablecer contraseña con token");
        return userTokenService.resetPassword(token, newPassword);
    }

    @Override
    @Transactional
    public boolean requestActivationToken(String email) {
        logger.info("Solicitud de nuevo token de activación para email: {}", email);
        
        // Buscamos al usuario por su correo electrónico
        User user = userRepository.findByEmail(email)
                .orElse(null);
                
        // Si el usuario no existe, retornamos false
        if (user == null) {
            logger.info("Email no encontrado: {}", email);
            return false;
        }
        
        // Verificamos que la cuenta NO esté activada
        if (user.isEnabled()) {
            logger.info("La cuenta ya está activada: {}", email);
            return false;
        }
        
        // Generamos un nuevo token de activación
        String activationToken = userTokenService.generateActivationToken(user);
        
        // Enviamos el correo con el nuevo token
        emailService.sendActivationEmail(user, activationToken);
        
        logger.info("Nuevo token de activación enviado a: {}", email);
        return true;
    }
}