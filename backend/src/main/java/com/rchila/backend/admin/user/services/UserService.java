package com.rchila.backend.admin.user.services;

import com.rchila.backend.admin.user.services.dtos.UserDTO;
import com.rchila.backend.admin.user.services.dtos.UserUpdateDTO;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public interface UserService {

    UserDTO updateUser(@NotNull final UUID uuid, @NotNull final UserUpdateDTO userDTO);

    void deleteUserByUuid(@NotNull UUID id);

    UserDTO getUserByUuid(@NotNull UUID uuid);

    UserDTO updateUserWithAvatar(@NotNull UUID uuid, @NotNull String firstName,
            @NotNull String lastName, String phone, String avatarPath);

    void changePassword(@NotNull UUID uuid, @NotNull String currentPassword, @NotNull String newPassword);

    UserDTO removeAvatar(@NotNull UUID uuid);

    boolean setPassword(@NotNull UUID uuid, @NotNull String newPassword);
}
