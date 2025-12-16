package com.rchila.backend.admin.user.mappers;

import com.rchila.backend.admin.user.controllers.dtos.UserResponse;
import com.rchila.backend.admin.user.controllers.dtos.UserUpdateRequest;
import com.rchila.backend.admin.user.repositories.models.User;
import com.rchila.backend.admin.user.services.dtos.UserDTO;
import com.rchila.backend.admin.user.services.dtos.UserUpdateDTO;
import jakarta.annotation.Nullable;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class UserMapper {

    private UserMapper() {
        // Constructor privado para prevenir instanciación
    }


    @Nullable
    public static UserDTO toDTO(@Nullable final User user) {
        if (user == null)
            return null;

        List<Map<String, Object>> roles = user.getRoles().stream()
                .map(role -> {
                    Map<String, Object> roleMap = new HashMap<>();
                    roleMap.put("id", role.getId());
                    roleMap.put("name", role.getName());
                    return roleMap;
                })
                .collect(Collectors.toList());

        return new UserDTO(
                user.getUuid(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone(),
                roles,
                user.isEnabled(),
                user.isLocked(),
                user.getCreatedAt(),
                user.getAvatar());
    }

    @Nullable
    public static UserResponse toResponse(@Nullable final UserDTO userDTO) {
        if (userDTO == null)
            return null;

        return new UserResponse(
                userDTO.uuid().toString(),
                userDTO.firstName(),
                userDTO.lastName(),
                userDTO.email(),
                userDTO.phone(),
                userDTO.roles(),
                userDTO.enabled(),
                userDTO.createdAt(),
                userDTO.avatar());
    }


    @Nullable
    public static UserUpdateDTO toUserUpdateDTO(@Nullable final UserUpdateRequest userUpdateRequest) {
        if (userUpdateRequest == null)
            return null;
        return new UserUpdateDTO(
                userUpdateRequest.firstName(),
                userUpdateRequest.lastName(),
                userUpdateRequest.email());
    }
}
