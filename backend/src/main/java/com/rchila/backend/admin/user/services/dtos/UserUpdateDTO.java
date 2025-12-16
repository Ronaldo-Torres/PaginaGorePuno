package com.rchila.backend.admin.user.services.dtos;

public record UserUpdateDTO(
        String firstName, String lastName,
        String email
) {
}
