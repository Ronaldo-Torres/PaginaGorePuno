package com.rchila.backend.admin.privilege.mapper;

import com.rchila.backend.admin.privilege.dto.PrivilegeResponse;
import com.rchila.backend.admin.privilege.repositories.models.Privilege;
import org.springframework.stereotype.Component;

@Component
public class PrivilegeMapper {

    public PrivilegeResponse toResponse(Privilege privilege) {
        if (privilege == null) {
            return null;
        }

        return PrivilegeResponse.builder()
                .id(privilege.getId())
                .uuid(privilege.getUuid())
                .name(privilege.getName())
                .description(privilege.getDescription())
                .createdAt(privilege.getCreatedAt())
                .updatedAt(privilege.getUpdatedAt())
                .build();
    }
}