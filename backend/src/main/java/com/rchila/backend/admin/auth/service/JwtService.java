package com.rchila.backend.admin.auth.service;

import com.rchila.backend.admin.user.services.dtos.UserDTO;

/**
 * Interfaz que define los servicios relacionados con la gestión de tokens JWT.
 * Proporciona operaciones para generar, validar y extraer información de tokens JWT.
 * <p>
 * Esta interfaz maneja dos tipos de tokens:
 * <ul>
 *   <li>Token de acceso: Para autenticación de solicitudes</li>
 *   <li>Token de actualización: Para obtener nuevos tokens de acceso</li>
 * </ul>
 * </p>
 */
public interface JwtService {

    /**
     * Genera un token de acceso para el usuario especificado.
     * El token de acceso se utiliza para autenticar las solicitudes del usuario.
     *
     * @param user el usuario para el cual se generará el token de acceso
     * @return el token de acceso generado
     */
    String generateAccessToken(UserDTO user);

    /**
     * Genera un token de actualización para el usuario especificado.
     * El token de actualización se utiliza para obtener nuevos tokens de acceso
     * cuando estos expiran.
     *
     * @param user el usuario para el cual se generará el token de actualización
     * @return el token de actualización generado
     */
    String generateRefreshToken(UserDTO user);

    /**
     * Recupera el identificador del usuario (subject) del token especificado.
     * Este método extrae y decodifica la información del usuario contenida en el token.
     *
     * @param token el token del cual se extraerá el identificador del usuario
     * @return el identificador del usuario extraído del token
     */
    String getSubjectByToken(String token);

    /**
     * Valida un token de autenticación.
     * Verifica la firma del token y su fecha de expiración.
     *
     * @param authToken el token de autenticación a validar
     * @return true si el token es válido, false en caso contrario
     */
    boolean isTokenValid(String authToken);
}