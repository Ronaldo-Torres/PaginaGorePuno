package com.rchila.backend.admin.user.controllers.dtos;

import com.rchila.backend.admin.role.dto.RoleResponse;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;

public record UserDetailedResponse(
        String uuid,
        String firstName,
        String lastName,
        String email,
        String phone,
        List<Map<String, Object>> roles,
        boolean enabled,
        LocalDateTime createdAt,
        String avatar,
        Set<RoleResponse> roleDetails) {
}