package com.rchila.backend.admin.auth.service;

/**
 * Interfaz para el servicio de gestión de cuentas de usuario.
 * Proporciona métodos para la activación de cuentas y el restablecimiento de
 * contraseñas.
 */
public interface AccountService {

    /**
     * Activa la cuenta de usuario utilizando el token de activación.
     *
     * @param token el token de activación enviado al usuario
     * @return true si la cuenta se activó correctamente, false en caso contrario
     */
    boolean activateAccount(String token);

    /**
     * Inicia el proceso de restablecimiento de contraseña enviando
     * un correo electrónico con el token.
     *
     * @param email el correo electrónico del usuario
     */
    void requestPasswordReset(String email);

    /**
     * Restablece la contraseña del usuario utilizando el token.
     *
     * @param token       el token de restablecimiento
     * @param newPassword la nueva contraseña
     * @return true si la contraseña se restableció correctamente, false en caso
     *         contrario
     */
    boolean resetPassword(String token, String newPassword);

    /**
     * Solicita un nuevo token de activación para una cuenta no activada.
     * Envía un correo electrónico con el nuevo token de activación.
     * 
     * @param email el correo electrónico del usuario
     * @return true si se envió el correo correctamente, false si la cuenta no
     *         existe o ya está activada
     */
    boolean requestActivationToken(String email);
}