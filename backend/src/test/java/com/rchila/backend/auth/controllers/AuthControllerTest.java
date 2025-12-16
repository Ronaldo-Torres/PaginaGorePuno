package com.rchila.backend.auth.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rchila.backend.admin.auth.controllers.AuthController;
import com.rchila.backend.admin.auth.controllers.dtos.LoginRequest;
import com.rchila.backend.admin.auth.controllers.dtos.RefreshTokenRequest;
import com.rchila.backend.admin.auth.controllers.dtos.RegisterRequest;
import com.rchila.backend.admin.auth.service.JwtService;
import com.rchila.backend.admin.auth.service.impl.CustomUserDetailsService;
import com.rchila.backend.admin.auth.service.impl.JwtAuthService;
import com.rchila.backend.admin.auth.service.impl.JwtTokenService;
import com.rchila.backend.admin.config.SecurityConfig;
import com.rchila.backend.admin.role.repositories.RoleRepository;
import com.rchila.backend.admin.role.repositories.models.Role;
import com.rchila.backend.admin.user.repositories.UserRepository;
import com.rchila.backend.admin.user.repositories.models.User;
import com.rchila.backend.admin.user.services.dtos.UserDTO;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.atMostOnce;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@Import({ SecurityConfig.class, JwtAuthService.class, JwtTokenService.class,
                CustomUserDetailsService.class, })
@ActiveProfiles("test")
public class AuthControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @MockitoBean
        private UserRepository userRepository;

        @MockitoBean
        private RoleRepository roleRepository;

        @Autowired
        private ObjectMapper objectMapper;

        @Autowired
        private PasswordEncoder passwordEncoder;

        @Autowired
        private JwtService jwtService;

        @Test
        @DisplayName("GIVEN valid login credentials WHEN logging in THEN return access and refresh tokens")
        void login() throws Exception {
                LoginRequest loginRequest = new LoginRequest("test@example.com", "123456");
                User user = new User();
                user.setId(1L);
                user.setUuid(UUID.randomUUID());
                user.setEmail(loginRequest.email());
                user.setPassword(passwordEncoder.encode(loginRequest.password()));
                user.setFirstName("John");
                user.setLastName("Doe");

                when(userRepository.findByEmail(loginRequest.email()))
                                .thenReturn(Optional.of(user))
                                .thenReturn(Optional.of(user));

                mockMvc.perform(post("/v1/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(loginRequest)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.accessToken").exists())
                                .andExpect(jsonPath("$.refreshToken").exists());

                verify(userRepository, times(2)).findByEmail("test@example.com");
        }

        @Test
        @DisplayName("GIVEN valid registration details WHEN registering THEN return access and refresh tokens")
        void register() throws Exception {
                RegisterRequest registerRequest = new RegisterRequest("test@example.com",
                                "password", "John", "Doe", null);
                User user = new User();
                user.setId(1L);
                user.setUuid(UUID.randomUUID());
                user.setEmail(registerRequest.email());
                user.setFirstName(registerRequest.firstName());
                user.setLastName(registerRequest.lastName());

                Role role = Role.builder()
                                .name("USER")
                                .build();

                when(userRepository.save(any(User.class)))
                                .thenReturn(user);
                when(roleRepository.findByName("USER"))
                                .thenReturn(Optional.of(role));

                mockMvc.perform(post("/v1/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(registerRequest)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.accessToken").exists())
                                .andExpect(jsonPath("$.refreshToken").exists());

                verify(userRepository, atMostOnce()).save(any(User.class));
                verify(roleRepository, atMostOnce()).findByName("USER");
        }

        @Test
        @DisplayName("GIVEN valid refresh token WHEN refreshing THEN return new access and refresh tokens")
        void refresh() throws Exception {

                final UUID userUUID = UUID.randomUUID();
                final UserDTO userDTO = new UserDTO(userUUID, "AuthTest",
                                "AuthTest", "auth.test@example.com", null,
                                List.of(Map.of("name", "USER")), true, false,
                                java.time.LocalDateTime.now(), null);
                final String refreshToken = jwtService.generateAccessToken(userDTO);

                when(userRepository.findByUuid(userDTO.uuid()))
                                .thenReturn(Optional.of(User.builder()
                                                .id(1L)
                                                .uuid(userUUID)
                                                .firstName("AuthTest")
                                                .lastName("AuthTest")
                                                .email("auth.test@example.com")
                                                .password("123456")
                                                .build()));

                mockMvc.perform(post("/v1/auth/refresh-token")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(new RefreshTokenRequest(refreshToken))))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.accessToken").exists())
                                .andExpect(jsonPath("$.refreshToken").exists());

        }
}
