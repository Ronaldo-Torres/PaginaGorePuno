package com.rchila.backend.admin.user.controllers.dtos;

import java.util.List;


public record PageResponse<T>(
        List<T> content,
        long totalElements,
        int totalPages,
        int pageNumber,
        int pageSize) {
}