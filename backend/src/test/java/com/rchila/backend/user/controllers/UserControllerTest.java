package com.rchila.backend.user.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rchila.backend.admin.user.controllers.UserController;
import com.rchila.backend.admin.auth.service.JwtService;
import com.rchila.backend.admin.auth.service.impl.CustomUserDetailsService;
import com.rchila.backend.admin.auth.service.impl.JwtTokenService;
import com.rchila.backend.admin.config.SecurityConfig;
import com.rchila.backend.admin.user.repositories.UserRepository;
import com.rchila.backend.admin.user.repositories.models.User;
import com.rchila.backend.admin.user.services.dtos.UserDTO;
import com.rchila.backend.admin.user.services.impl.DefaultUserService;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
@Import({ SecurityConfig.class, DefaultUserService.class, JwtTokenService.class, CustomUserDetailsService.class, })
@ActiveProfiles("test")
public class UserControllerTest {

        private final UUID userUuid = UUID.randomUUID();

        @Autowired
        private MockMvc mockMvc;

        @MockitoBean
        private UserRepository userRepository;

        @Autowired
        private ObjectMapper objectMapper;

        @Autowired
        private JwtService JwtService;

        private String jwtToken;

        private UserDTO userDTO;

        @BeforeEach
        void setUp() {
                userDTO = new UserDTO(userUuid, "John", "Doe", "john.doe@example.com", null,
                                List.of(Map.of("name", "USER")), true,
                                false,
                                LocalDateTime.now(), null);
                jwtToken = JwtService.generateAccessToken(userDTO);

                // This mock is used by UserDetailsServiceImpl
                when(userRepository.findByEmail(userDTO.email()))
                                .thenReturn(Optional.of(User.builder()
                                                .id(1L)
                                                .firstName("John")
                                                .lastName("Doe")
                                                .email("john.doe@example.com")
                                                .password("123456")
                                                .build()));
        }

        @Test
        @DisplayName("GIVEN a valid JWT token WHEN requesting user details THEN return user details")
        void getUserMe() throws Exception {
                when(userRepository.findByUuid(userUuid))
                                .thenReturn(Optional.of(User.builder()
                                                .id(1L)
                                                .uuid(userUuid)
                                                .firstName("John")
                                                .lastName("Doe")
                                                .email("john.doe@example.com")
                                                .password("123456")
                                                .build()));

                mockMvc.perform(get("/v1/users/me")
                                .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken)
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id").value(userDTO.uuid().toString()))
                                .andExpect(jsonPath("$.firstName").value(userDTO.firstName()))
                                .andExpect(jsonPath("$.email").value(userDTO.email()));

                verify(userRepository).findByUuid(userUuid);
        }

        @Test
        @DisplayName("GIVEN a valid JWT token and user data WHEN updating user THEN return updated user details")
        void updateUser() throws Exception {
                when(userRepository.findByUuid(userUuid))
                                .thenReturn(Optional.of(User.builder()
                                                .id(1L)
                                                .uuid(userUuid)
                                                .firstName("John")
                                                .lastName("Doe")
                                                .email("john.doe@example.com")
                                                .password("123456")
                                                .build()));
                when(userRepository.save(any(User.class)))
                                .thenReturn(User.builder()
                                                .id(1L)
                                                .uuid(userUuid)
                                                .firstName("John")
                                                .lastName("Doe")
                                                .email("john.doe@example.com")
                                                .password("123456")
                                                .build());

                mockMvc.perform(put("/v1/users/me")
                                .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(userDTO)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id").value(userDTO.uuid().toString()))
                                .andExpect(jsonPath("$.firstName").value(userDTO.firstName()))
                                .andExpect(jsonPath("$.email").value(userDTO.email()));

                verify(userRepository).findByUuid(userUuid);
                verify(userRepository).save(any(User.class));
        }

        @Test
        @DisplayName("GIVEN a valid JWT token WHEN deleting user THEN user is deleted successfully")
        void deleteUser() throws Exception {

                when(userRepository.findByUuid(userUuid))
                                .thenReturn(Optional.of(User.builder()
                                                .id(1L)
                                                .uuid(userUuid)
                                                .firstName("John")
                                                .lastName("Doe")
                                                .email("john.doe@example.com")
                                                .password("123456")
                                                .build()));

                mockMvc.perform(delete("/v1/users/me")
                                .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken)
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().isOk());

                verify(userRepository).deleteByUuid(userUuid);
        }

        @Test
        @DisplayName("GIVEN invalid email WHEN updating user THEN return 400 bad request")
        void updateUserInvalidEmail() throws Exception {
                var invalidUserDTO = new UserDTO(userUuid, "John", "Doe", "invalid-email", null,
                                List.of(Map.of("name", "USER")), true,
                                false,
                                LocalDateTime.now(), null);

                mockMvc.perform(put("/v1/users/me")
                                .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(invalidUserDTO)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors")
                                                .value(Matchers.containsInAnyOrder("El email debe ser válido")));
        }

        @Test
        @DisplayName("GIVEN blank firstName WHEN updating user THEN return 400 bad request")
        void updateUserBlankFirstName() throws Exception {
                var invalidUserDTO = new UserDTO(userUuid, "", "Doe", "john.doe@example.com", null,
                                List.of(Map.of("name", "USER")), true,
                                false, LocalDateTime.now(), null);

                mockMvc.perform(put("/v1/users/me")
                                .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(invalidUserDTO)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors")
                                                .value(Matchers.containsInAnyOrder("El nombre es obligatorio",
                                                                "El nombre debe tener entre 2 y 50 caracteres")));
        }

        @Test
        @DisplayName("GIVEN too short firstName WHEN updating user THEN return 400 bad request")
        void updateUserShortFirstName() throws Exception {
                var invalidUserDTO = new UserDTO(userUuid, "J", "Doe", "john.doe@example.com", null,
                                List.of(Map.of("name", "USER")), true,
                                false, LocalDateTime.now(), null);

                mockMvc.perform(put("/v1/users/me")
                                .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(invalidUserDTO)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors")
                                                .value(Matchers.containsInAnyOrder(
                                                                "El nombre debe tener entre 2 y 50 caracteres")));
        }

        @Test
        @DisplayName("GIVEN blank lastName WHEN updating user THEN return 400 bad request")
        void updateUserBlankLastName() throws Exception {
                var invalidUserDTO = new UserDTO(userUuid, "John", "", "john.doe@example.com", null,
                                List.of(Map.of("name", "USER")), true,
                                false, LocalDateTime.now(), null);

                mockMvc.perform(put("/v1/users/me")
                                .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(invalidUserDTO)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors")
                                                .value(Matchers.containsInAnyOrder("El apellido es obligatorio",
                                                                "El apellido debe tener entre 2 y 50 caracteres")));
        }
}
