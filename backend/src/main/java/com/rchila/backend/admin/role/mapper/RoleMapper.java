package com.rchila.backend.admin.role.mapper;

import com.rchila.backend.admin.privilege.mapper.PrivilegeMapper;
import com.rchila.backend.admin.role.dto.RoleResponse;
import com.rchila.backend.admin.role.repositories.models.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class RoleMapper {

    private final PrivilegeMapper privilegeMapper;

    public RoleResponse toResponse(Role role) {
        if (role == null) {
            return null;
        }

        return RoleResponse.builder()
                .id(role.getId())
                .uuid(role.getUuid())
                .name(role.getName())
                .createdAt(role.getCreatedAt())
                .updatedAt(role.getUpdatedAt())
                .privileges(role.getPrivileges() != null ? role.getPrivileges().stream()
                        .map(privilegeMapper::toResponse)
                        .collect(Collectors.toSet()) : null)
                .build();
    }
}