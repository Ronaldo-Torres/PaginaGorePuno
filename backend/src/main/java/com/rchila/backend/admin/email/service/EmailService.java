package com.rchila.backend.admin.email.service;

import com.rchila.backend.admin.user.repositories.models.User;

/**
 * Interfaz para el servicio de envío de correos electrónicos.
 * Proporciona métodos para enviar diferentes tipos de correos a los usuarios.
 */
public interface EmailService {

    /**
     * Envía un correo de bienvenida y activación al usuario.
     *
     * @param user  el usuario al que se le enviará el correo
     * @param token el token de activación
     */
    void sendActivationEmail(User user, String token);

    /**
     * Envía un correo para restablecer la contraseña.
     *
     * @param user  el usuario que ha solicitado restablecer su contraseña
     * @param token el token para restablecer la contraseña
     */
    void sendResetPasswordEmail(User user, String token);

    /**
     * Envía un correo de confirmación después de cambiar la contraseña.
     *
     * @param user el usuario que ha cambiado su contraseña
     */
    void sendPasswordChangedEmail(User user);

    /**
     * Envía un correo informando al usuario que su cuenta ha sido creada por un
     * administrador.
     *
     * @param user          el usuario cuya cuenta ha sido creada
     * @param plainPassword la contraseña temporal generada para el usuario
     * @param token         el token de activación
     */
    void sendAccountCreatedByAdminEmail(User user, String plainPassword, String token);

    /**
     * Envía un correo de bienvenida al usuario después de su registro exitoso.
     * Este correo se envía cuando el usuario se registra exitosamente sin necesidad
     * de activación.
     *
     * @param user el usuario que se ha registrado exitosamente
     */
    void sendWelcomeEmail(User user);

    /**
     * Envía un correo cuando un administrador resetea la contraseña de un usuario.
     *
     * @param user          el usuario cuya contraseña ha sido reseteada
     * @param plainPassword la nueva contraseña temporal generada
     * @param token         el token de activación para primer login
     */
    void sendPasswordResetByAdminEmail(User user, String plainPassword, String token);
}