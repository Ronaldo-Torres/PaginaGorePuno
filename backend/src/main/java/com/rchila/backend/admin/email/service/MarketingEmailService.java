package com.rchila.backend.admin.email.service;

import com.rchila.backend.admin.email.service.dtos.BulkEmailRequest;
import com.rchila.backend.admin.email.service.dtos.CustomEmailRequest;
import com.rchila.backend.admin.email.service.dtos.EmailSendResult;
import com.rchila.backend.admin.user.repositories.models.User;

import java.util.List;
import java.util.UUID;

/**
 * Interfaz para el servicio de correos de marketing y personalizados.
 * Proporciona métodos para envío individual y masivo de correos personalizados.
 */
public interface MarketingEmailService {

    /**
     * Envía un correo personalizado a un destinatario específico.
     *
     * @param request la solicitud de correo personalizado
     * @return resultado del envío
     */
    EmailSendResult sendCustomEmail(CustomEmailRequest request);

    /**
     * Envía un correo personalizado a un usuario específico.
     *
     * @param user    el usuario destinatario
     * @param subject el asunto del correo
     * @param message el mensaje del correo
     * @param isHtml  si el mensaje está en formato HTML
     * @return resultado del envío
     */
    EmailSendResult sendCustomEmailToUser(User user, String subject, String message, boolean isHtml);

    /**
     * Envía correos masivos según la configuración especificada.
     *
     * @param request la solicitud de envío masivo
     * @return resultado del envío con estadísticas
     */
    EmailSendResult sendBulkEmails(BulkEmailRequest request);

    /**
     * Envía un correo a todos los usuarios del sistema.
     *
     * @param subject el asunto del correo
     * @param message el mensaje del correo
     * @param isHtml  si el mensaje está en formato HTML
     * @return resultado del envío con estadísticas
     */
    EmailSendResult sendEmailToAllUsers(String subject, String message, boolean isHtml);

    /**
     * Envía correos a usuarios con roles específicos.
     *
     * @param roleNames nombres de los roles
     * @param subject   el asunto del correo
     * @param message   el mensaje del correo
     * @param isHtml    si el mensaje está en formato HTML
     * @return resultado del envío con estadísticas
     */
    EmailSendResult sendEmailToUsersWithRoles(List<String> roleNames, String subject, String message, boolean isHtml);

    /**
     * Envía correos a usuarios específicos por sus UUIDs.
     *
     * @param userIds lista de UUIDs de usuarios
     * @param subject el asunto del correo
     * @param message el mensaje del correo
     * @param isHtml  si el mensaje está en formato HTML
     * @return resultado del envío con estadísticas
     */
    EmailSendResult sendEmailToSpecificUsers(List<UUID> userIds, String subject, String message, boolean isHtml);
}