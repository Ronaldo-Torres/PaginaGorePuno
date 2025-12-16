package com.rchila.backend.admin.config.exceptions;

import java.util.List;

public record ErrorResponse(String message, List<String> errors) {
}