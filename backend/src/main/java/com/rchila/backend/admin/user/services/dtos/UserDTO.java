package com.rchila.backend.admin.user.services.dtos;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record UserDTO(
        UUID uuid,
        String firstName,
        String lastName,
        String email,
        String phone,
        List<Map<String, Object>> roles,
        boolean enabled,
        boolean locked,
        LocalDateTime createdAt,
        String avatar) {
}
