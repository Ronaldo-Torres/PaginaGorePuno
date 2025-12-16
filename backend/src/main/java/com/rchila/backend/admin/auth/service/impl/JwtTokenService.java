package com.rchila.backend.admin.auth.service.impl;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.rchila.backend.admin.auth.service.JwtService;
import com.rchila.backend.admin.config.exceptions.InvalidTokenException;
import com.rchila.backend.admin.user.services.dtos.UserDTO;
import jakarta.annotation.Nonnull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.Date;
import java.util.Objects;

/**
 * Implementación del servicio de gestión de tokens JWT.
 * Esta clase proporciona la funcionalidad para generar, validar y procesar tokens JWT
 * utilizando la biblioteca Nimbus JOSE+JWT.
 * <p>
 * Características principales:
 * <ul>
 *   <li>Generación de tokens de acceso y actualización</li>
 *   <li>Validación de firma y expiración de tokens</li>
 *   <li>Extracción de información del usuario del token</li>
 *   <li>Configuración flexible de tiempos de expiración</li>
 * </ul>
 * </p>
 */
@Service
public class JwtTokenService implements JwtService {

    /**
     * Emisor del token JWT, utilizado en los claims del token.
     */
    private final String jwtIssuer;

    /**
     * Clave secreta para firmar y verificar tokens JWT.
     */
    private final String jwtSecret;

    /**
     * Tiempo de expiración en milisegundos para tokens de acceso.
     */
    private final Integer jwtExpirationMs;

    /**
     * Tiempo de expiración en milisegundos para tokens de actualización.
     */
    private final Integer jwtRefreshExpirationMs;

    /**
     * Constructor que inicializa el servicio con los parámetros de configuración.
     *
     * @param jwtSecret              clave secreta para firmar tokens
     * @param jwtExpirationMs        tiempo de expiración de tokens de acceso
     * @param jwtRefreshExpirationMs tiempo de expiración de tokens de actualización
     * @param jwtIssuer              emisor de los tokens
     */
    public JwtTokenService(
            @Value("${spring.security.oauth2.resourceserver.jwt.secret-key}") final String jwtSecret,
            @Value("${app.jwt.expirationMs}") final Integer jwtExpirationMs,
            @Value("${app.jwt.jwtRefreshExpirationMs}") final Integer jwtRefreshExpirationMs,
            @Value("${app.jwt.issuer}") final String jwtIssuer
    ) {
        this.jwtSecret = jwtSecret;
        this.jwtExpirationMs = jwtExpirationMs;
        this.jwtRefreshExpirationMs = jwtRefreshExpirationMs;
        this.jwtIssuer = jwtIssuer;
    }

    /**
     * {@inheritDoc}
     * Genera un token de acceso con el tiempo de expiración configurado.
     *
     * @throws NullPointerException si el usuario es nulo
     * @throws RuntimeException si ocurre un error durante la generación del token
     */
    @Override
    @Nonnull
    public String generateAccessToken(@Nonnull final UserDTO user) {
        Objects.requireNonNull(user, "El usuario no puede ser nulo");
        return generateToken(user, jwtExpirationMs);
    }

    /**
     * {@inheritDoc}
     * Genera un token de actualización con un tiempo de expiración más largo.
     *
     * @throws NullPointerException si el usuario es nulo
     * @throws RuntimeException si ocurre un error durante la generación del token
     */
    @Nonnull
    public String generateRefreshToken(@Nonnull final UserDTO user) {
        Objects.requireNonNull(user, "El usuario no puede ser nulo");
        return generateToken(user, jwtRefreshExpirationMs);
    }

    /**
     * Método interno para generar tokens JWT.
     * Crea y firma un token con los claims especificados y tiempo de expiración.
     *
     * @param user         usuario para el cual se genera el token
     * @param expirationMs tiempo de expiración en milisegundos
     * @return token JWT firmado y serializado
     * @throws NullPointerException si el usuario es nulo
     * @throws RuntimeException si ocurre un error durante la generación del token
     */
    @Nonnull
    private String generateToken(@Nonnull final UserDTO user, final int expirationMs) {
        Objects.requireNonNull(user, "El usuario no puede ser nulo");
        try {
            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                    .subject(user.uuid().toString())
                    .issuer(jwtIssuer)
                    .expirationTime(new Date(System.currentTimeMillis() + expirationMs))
                    .build();

            SignedJWT signedJWT = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), claimsSet);
            signedJWT.sign(new MACSigner(jwtSecret.getBytes()));

            return signedJWT.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException("Error al generar el token", e);
        }
    }

    /**
     * {@inheritDoc}
     * Extrae el identificador del usuario del token JWT.
     *
     * @throws NullPointerException si el token es nulo
     * @throws InvalidTokenException si el token no puede ser parseado
     */
    @Override
    @Nonnull
    public String getSubjectByToken(@Nonnull final String token) {
        Objects.requireNonNull(token, "El token no puede ser nulo");
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            return signedJWT.getJWTClaimsSet().getSubject();
        } catch (ParseException e) {
            throw new InvalidTokenException("Error al parsear el token");
        }
    }

    /**
     * {@inheritDoc}
     * Verifica la firma del token y su fecha de expiración.
     *
     * @throws NullPointerException si el token es nulo
     */
    @Override
    public boolean isTokenValid(@Nonnull final String token) {
        Objects.requireNonNull(token, "El token no puede ser nulo");
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(jwtSecret.getBytes());
            return signedJWT.verify(verifier) && !isTokenExpired(signedJWT);
        } catch (JOSEException | ParseException e) {
            return false;
        }
    }

    /**
     * Verifica si un token JWT ha expirado.
     *
     * @param signedJWT token JWT firmado a verificar
     * @return true si el token ha expirado, false en caso contrario
     * @throws ParseException si hay un error al obtener la fecha de expiración
     * @throws NullPointerException si el token JWT es nulo
     */
    private boolean isTokenExpired(@Nonnull final SignedJWT signedJWT) throws ParseException {
        Objects.requireNonNull(signedJWT, "El token JWT firmado no puede ser nulo");
        final Date expiration = signedJWT.getJWTClaimsSet().getExpirationTime();
        return expiration != null && expiration.before(new Date());
    }
}