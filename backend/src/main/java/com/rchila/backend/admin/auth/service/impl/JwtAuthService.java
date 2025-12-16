package com.rchila.backend.admin.auth.service.impl;

import com.rchila.backend.admin.auth.controllers.dtos.AuthResponse;
import com.rchila.backend.admin.auth.controllers.dtos.LoginRequest;
import com.rchila.backend.admin.auth.controllers.dtos.RegisterRequest;
import com.rchila.backend.admin.auth.service.AuthService;
import com.rchila.backend.admin.auth.service.JwtService;
import com.rchila.backend.admin.config.exceptions.InvalidTokenException;
import com.rchila.backend.admin.config.exceptions.NotFoundException;
import com.rchila.backend.admin.email.service.EmailService;
import com.rchila.backend.admin.role.repositories.RoleRepository;
import com.rchila.backend.admin.role.repositories.models.Role;
import com.rchila.backend.admin.user.mappers.UserMapper;
import com.rchila.backend.admin.user.repositories.UserRepository;
import com.rchila.backend.admin.user.repositories.models.User;
import com.rchila.backend.admin.user.services.UserTokenService;
import com.rchila.backend.admin.user.services.dtos.UserDTO;
import jakarta.transaction.Transactional;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Service
public class JwtAuthService implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserTokenService userTokenService;
    private final EmailService emailService;

    public JwtAuthService(final AuthenticationManager authenticationManager, final JwtService jwtService,
            final UserRepository userRepository, final RoleRepository roleRepository,
            final PasswordEncoder passwordEncoder, final UserTokenService userTokenService,
            final EmailService emailService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.userTokenService = userTokenService;
        this.emailService = emailService;
    }

    @Override
    public AuthResponse login(final LoginRequest loginRequest) throws AuthenticationException {
        final Authentication authenticationToken = new UsernamePasswordAuthenticationToken(loginRequest.email(),
                loginRequest.password());
        final Authentication authentication = authenticationManager.authenticate(authenticationToken);
        final User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new NotFoundException("User not found by email"));

        // Verificar que la cuenta esté activada
        if (!user.isEnabled()) {
            throw new AuthenticationException("User account is not activated") {
            };
        }

        final UserDTO userDTO = UserMapper.toDTO(user);

        final String accessToken = jwtService.generateAccessToken(userDTO);
        final String refreshToken = jwtService.generateRefreshToken(userDTO);

        // Incluir si se requiere cambio de contraseña en la respuesta
        boolean passwordChangeRequired = user.isPasswordChangeRequired();

        return new AuthResponse(accessToken, refreshToken, passwordChangeRequired);
    }

    @Transactional
    @Override
    public AuthResponse register(final RegisterRequest registerRequest) {

        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new NotFoundException("Role not found"));

        Set<Role> roles = new HashSet<>();
        roles.add(userRole);

        final User user = User.builder()
                .email(registerRequest.email())
                .firstName(registerRequest.firstName())
                .lastName(registerRequest.lastName())
                .phone(registerRequest.phone())
                .roles(roles)
                .password(passwordEncoder.encode(registerRequest.password()))
                .enabled(false) // La cuenta inicia desactivada
                .locked(false)
                .passwordChangeRequired(false) // No requiere cambio de contraseña ya que el usuario la eligió
                .build();

        User userSaved = userRepository.save(user);

        // Generar token de activación y enviar correo
        String activationToken = userTokenService.generateActivationToken(userSaved);
        emailService.sendActivationEmail(userSaved, activationToken);

        final UserDTO userDTO = UserMapper.toDTO(userSaved);

        final String accessToken = jwtService.generateAccessToken(userDTO);
        final String refreshToken = jwtService.generateRefreshToken(userDTO);

        return new AuthResponse(accessToken, refreshToken, false);
    }

    public AuthResponse refreshToken(final String refreshToken) {
        boolean isTokenValid = jwtService.isTokenValid(refreshToken);
        if (!isTokenValid) {
            throw new InvalidTokenException("Refresh Token not valid");
        }

        final String uuid = jwtService.getSubjectByToken(refreshToken);
        final UUID userUUID = UUID.fromString(uuid);

        final User userFound = userRepository.findByUuid(userUUID)
                .orElseThrow(() -> new NotFoundException("User not found by UUID"));

        final UserDTO userDTO = UserMapper.toDTO(userFound);

        final String accessToken = jwtService.generateAccessToken(userDTO);
        final String newRefreshToken = jwtService.generateRefreshToken(userDTO);

        // Incluir si se requiere cambio de contraseña en la respuesta
        boolean passwordChangeRequired = userFound.isPasswordChangeRequired();

        return new AuthResponse(accessToken, newRefreshToken, passwordChangeRequired);
    }
}