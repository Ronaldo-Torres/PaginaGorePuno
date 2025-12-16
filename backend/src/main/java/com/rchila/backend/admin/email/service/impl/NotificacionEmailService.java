package com.rchila.backend.admin.email.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.rchila.backend.admin.config.EmailConfig;
import com.rchila.backend.admin.email.service.NotificacionService;
import com.rchila.backend.model.NotificacionAgenda;
import com.rchila.backend.admin.user.repositories.models.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import io.jsonwebtoken.Jwts;
import java.util.Date;
import javax.crypto.SecretKey;
import java.time.ZoneId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

@Service
public class NotificacionEmailService implements NotificacionService {

    private static final Logger logger = LoggerFactory.getLogger(NotificacionEmailService.class);
    private final JavaMailSender mailSender;
    private final EmailConfig emailConfig;
    private final SecretKey secretKey;

    @Value("${app.url.frontend}")
    private String frontendUrl;

    @Autowired
    public NotificacionEmailService(JavaMailSender mailSender, EmailConfig emailConfig, SecretKey secretKey) {
        this.mailSender = mailSender;
        this.emailConfig = emailConfig;
        this.secretKey = secretKey;
        logger.info("NotificacionEmailService inicializado con secretKey");
    }

    private String generarToken(NotificacionAgenda notificacionAgenda, User user) {
        try {
            LocalDateTime fechaEvento = notificacionAgenda.getFechaEvento();
            if (fechaEvento == null) {
                throw new IllegalArgumentException("La fecha del evento es requerida para generar el token");
            }

            LocalDateTime fechaExpiracion = fechaEvento.minusHours(12);
            logger.info("Generando token para notificación ID: {}, Usuario: {}, Fecha expiración: {}",
                    notificacionAgenda.getId(), user.getEmail(), fechaExpiracion);

            String token = Jwts.builder()
                    .setSubject(user.getEmail())
                    .claim("notificacionId", notificacionAgenda.getId())
                    .claim("userId", user.getId())
                    .setIssuedAt(new Date())
                    .setExpiration(Date.from(fechaExpiracion.atZone(ZoneId.systemDefault()).toInstant()))
                    .signWith(secretKey)
                    .compact();

            logger.info("Token generado exitosamente");
            return token;
        } catch (Exception e) {
            logger.error("Error al generar token", e);
            throw new RuntimeException("Error al generar token: " + e.getMessage());
        }
    }

    @Override
    public void enviarNotificacion(NotificacionAgenda notificacionAgenda, String mensaje, User user) {
        if (notificacionAgenda.getFechaEvento() == null) {
            throw new IllegalArgumentException("La fecha del evento no puede ser null");
        }

        String token = generarToken(notificacionAgenda, user);
        String subject = "Notificación de Actividad - Consejo Regional Puno";

        LocalDateTime fechaExpiracion = notificacionAgenda.getFechaEvento().minusHours(12);

        String content = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd;'>"
                + "<h2 style='color: #333; margin-bottom: 20px;'>Estimado(a) " + user.getFirstName() + " "
                + user.getLastName() + "</h2>"
                + "<p>Por medio de la presente se le notifica que " + mensaje + ".</p>"
                + "<div style='background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-left: 4px solid #333;'>"
                + "<p><strong>Fecha:</strong> " + notificacionAgenda.getAgenda().getFecha() + "</p>"
                + "<p><strong>Hora:</strong> " + notificacionAgenda.getAgenda().getHoraInicio() + " - "
                + notificacionAgenda.getAgenda().getHoraFin() + "</p>"
                + "<p><strong>Lugar:</strong> " + notificacionAgenda.getAgenda().getLugar() + "</p>"
                + "</div>"
                + "<p>Por favor, confirme su asistencia mediante los siguientes enlaces:</p>"
                + "<div style='text-align: center; margin: 30px 0;'>"
                + "<a href='" + frontendUrl + "/agenda/confirmar?token=" + token + "&respuesta=asistire"
                + "' style='display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; "
                + "text-decoration: none; margin-right: 10px;'>Confirmar Asistencia</a>"
                + "<a href='" + frontendUrl + "/agenda/confirmar?token=" + token + "&respuesta=no_asistire"
                + "' style='display: inline-block; background-color: #F44336; color: white; padding: 10px 20px; "
                + "text-decoration: none;'>No Asistiré</a>"
                + "</div>"
                + "<p style='color: #666; font-size: 12px;'>Este enlace estará disponible hasta el "
                + fechaExpiracion.toString() + "</p>"
                + "<p>Para cualquier consulta, por favor comunicarse con el administrador del sistema.</p>"
                + "<p style='margin-top: 30px;'>Atentamente,</p>"
                + "<p style='font-weight: bold;'>CONSEJO REGIONAL PUNO</p>"
                + "</div>";

        sendHtmlEmail(user.getEmail(), subject, content);
    }

    @Override
    public void reenviarNotificacion(NotificacionAgenda notificacionAgenda, User user) {
        if (notificacionAgenda.getFechaEvento() == null) {
            throw new IllegalArgumentException("La fecha del evento no puede ser null");
        }

        String token = generarToken(notificacionAgenda, user);
        String subject = "Recordatorio de Confirmación - Consejo Regional Puno";

        LocalDateTime fechaExpiracion = notificacionAgenda.getFechaEvento().minusHours(12);

        String content = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd;'>"
                + "<h2 style='color: #333; margin-bottom: 20px;'>Estimado(a) " + user.getFirstName() + " "
                + user.getLastName() + "</h2>"
                + "<p>Le recordamos que tiene pendiente confirmar su asistencia para la siguiente actividad:</p>"
                + "<div style='background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-left: 4px solid #333;'>"
                + "<p><strong>Actividad:</strong> " + notificacionAgenda.getAgenda().getNombre() + "</p>"
                + "<p><strong>Fecha:</strong> " + notificacionAgenda.getAgenda().getFecha() + "</p>"
                + "<p><strong>Hora:</strong> " + notificacionAgenda.getAgenda().getHoraInicio() + " - "
                + notificacionAgenda.getAgenda().getHoraFin() + "</p>"
                + "<p><strong>Lugar:</strong> " + notificacionAgenda.getAgenda().getLugar() + "</p>"
                + "</div>"
                + "<p>Por favor, confirme su asistencia mediante los siguientes enlaces:</p>"
                + "<div style='text-align: center; margin: 30px 0;'>"
                + "<a href='" + frontendUrl + "/agenda/confirmar?token=" + token + "&respuesta=asistire"
                + "' style='display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; "
                + "text-decoration: none; margin-right: 10px;'>Confirmar Asistencia</a>"
                + "<a href='" + frontendUrl + "/agenda/confirmar?token=" + token + "&respuesta=no_asistire"
                + "' style='display: inline-block; background-color: #F44336; color: white; padding: 10px 20px; "
                + "text-decoration: none;'>No Asistiré</a>"
                + "</div>"
                + "<p style='color: #666; font-size: 12px;'>Este es un nuevo enlace de confirmación. Los enlaces anteriores han sido desactivados.</p>"
                + "<p style='color: #666; font-size: 12px;'>Este enlace estará disponible hasta el "
                + fechaExpiracion.toString() + "</p>"
                + "<p>Para cualquier consulta, por favor comunicarse con el administrador del sistema.</p>"
                + "<p style='margin-top: 30px;'>Atentamente,</p>"
                + "<p style='font-weight: bold;'>CONSEJO REGIONAL PUNO</p>"
                + "</div>";

        sendHtmlEmail(user.getEmail(), subject, content);
    }

    @Override
    public void reenviarNotificacion(NotificacionAgenda notificacionAgenda) {
        // Este método se mantiene vacío por compatibilidad
    }

    @Override
    public void obtenerNotificacionById(Long id) {
        // Este método se mantiene vacío por compatibilidad
    }

    @Override
    public void enviarCorreoConfirmacion(String email, String asunto, String contenido) {
        try {
            logger.info("Enviando correo de confirmación a: {}", email);
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(emailConfig.getFrom());
            helper.setTo(email);
            helper.setSubject(asunto);
            helper.setText(contenido, true);

            mailSender.send(message);
            logger.info("Correo de confirmación enviado exitosamente");
        } catch (MessagingException e) {
            logger.error("Error enviando correo de confirmación a: {}", email, e);
            throw new RuntimeException("Error al enviar correo de confirmación: " + e.getMessage());
        }
    }

    private void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(emailConfig.getFrom());
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            logger.info("Email enviado a: {}", to);
        } catch (MessagingException e) {
            logger.error("Error enviando email a: {}", to, e);
        }
    }
}
