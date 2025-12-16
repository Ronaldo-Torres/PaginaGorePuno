package com.rchila.backend.admin.user.services;

import com.rchila.backend.admin.role.repositories.models.Role;
import com.rchila.backend.admin.user.services.dtos.UserDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface AdminUserService {

        UserDTO createUser(String firstName, String lastName, String email, Set<Long> roleIds);

        UserDTO createUser(String firstName, String lastName, String email, Set<Long> roleIds,
                        boolean sendActivationEmail, String password, boolean enabled);

        UserDTO createUserWithAvatar(String firstName, String lastName, String email, String phone, Set<Long> roleIds,
                        boolean sendActivationEmail, String password, boolean enabled, String avatarPath);

        List<UserDTO> getAllUsers();

        Page<UserDTO> getUsersPage(Pageable pageable);

        Page<UserDTO> getUsersPageWithFilters(Pageable pageable, String search, String role);

        UserDTO updateUser(UUID userId, String firstName, String lastName, String email);

        UserDTO updateUserWithAvatar(UUID userId, String firstName, String lastName, String email, String phone,
                        Set<Long> roleIds, String avatarPath);

        void deleteUser(UUID userId);

        UserDTO toggleUserStatus(UUID userId, boolean enabled);

        UserDTO removeUserAvatar(UUID userId);

        UserDTO resetUserPassword(UUID userId);

        List<Role> getRoles();
}