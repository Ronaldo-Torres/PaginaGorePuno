package com.rchila.backend.exception;

public class AgendaException extends RuntimeException {

    public AgendaException(String message) {
        super(message);
    }

    public AgendaException(String message, Throwable cause) {
        super(message, cause);
    }
}