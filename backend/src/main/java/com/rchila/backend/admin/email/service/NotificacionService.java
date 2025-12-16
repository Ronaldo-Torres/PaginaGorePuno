package com.rchila.backend.admin.email.service;

import com.rchila.backend.model.NotificacionAgenda;
import com.rchila.backend.admin.user.repositories.models.User;

public interface NotificacionService {

    void enviarNotificacion(NotificacionAgenda notificacionAgenda, String mensaje, User user);

    void reenviarNotificacion(NotificacionAgenda notificacionAgenda);

    void obtenerNotificacionById(Long id);

    void enviarCorreoConfirmacion(String email, String asunto, String contenido);

    void reenviarNotificacion(NotificacionAgenda notificacion, User user);
}
