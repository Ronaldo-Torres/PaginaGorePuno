package com.rchila.backend.admin.user.controllers.dtos;

import jakarta.validation.constraints.NotNull;

public record ToggleStatusRequest(
        @NotNull(message = "El estado de activación es obligatorio") Boolean enabled) {
}