package com.rchila.backend.admin.auth.service;

import com.rchila.backend.admin.auth.controllers.dtos.AuthResponse;
import com.rchila.backend.admin.auth.controllers.dtos.LoginRequest;
import com.rchila.backend.admin.auth.controllers.dtos.RegisterRequest;
import org.springframework.security.core.AuthenticationException;

/**
 * Service interface for handling authentication operations.
 */
public interface AuthService {

    /**
     * Authenticates a user based on their login credentials.
     *
     * @param loginRequest the login request containing user credentials
     * @return an AuthResponse containing authentication tokens
     * @throws AuthenticationException if authentication fails
     */
    AuthResponse login(LoginRequest loginRequest) throws AuthenticationException;

    /**
     * Registers a new user in the system.
     *
     * @param registerRequest the registration request containing user details
     * @return an AuthResponse containing authentication tokens for the new user
     */
    AuthResponse register(RegisterRequest registerRequest);
}
