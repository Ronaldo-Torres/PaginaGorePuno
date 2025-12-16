package com.rchila.backend.admin.user.controllers.dtos;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;


public record UserResponse(
                String uuid,
                String firstName,
                String lastName,
                String email,
                String phone,
                List<Map<String, Object>> roles,
                boolean enabled,
                LocalDateTime createdAt,
                String avatar) {
        // Constructor sin avatar y teléfono para compatibilidad hacia atrás
        public UserResponse(String uuid, String firstName, String lastName, String email,
                        List<Map<String, Object>> roles, boolean enabled, LocalDateTime createdAt) {
                this(uuid, firstName, lastName, email, null, roles, enabled, createdAt, null);
        }

        // Constructor sin teléfono para compatibilidad hacia atrás
        public UserResponse(String uuid, String firstName, String lastName, String email,
                        List<Map<String, Object>> roles, boolean enabled, LocalDateTime createdAt, String avatar) {
                this(uuid, firstName, lastName, email, null, roles, enabled, createdAt, avatar);
        }
}
