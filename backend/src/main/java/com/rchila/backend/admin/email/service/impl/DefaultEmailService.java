package com.rchila.backend.admin.email.service.impl;

import com.rchila.backend.admin.config.EmailConfig;
import com.rchila.backend.admin.email.service.EmailService;
import com.rchila.backend.admin.user.repositories.models.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Implementación por defecto del servicio de correo electrónico.
 * Utiliza JavaMailSender para enviar correos con contenido HTML.
 */
@Service
public class DefaultEmailService implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(DefaultEmailService.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yy");
    private static final String EMAIL_SIGNATURE = """
            <div style="margin-top: 30px; border-top: 2px solid #1a5f7a; padding-top: 20px;">
                <p style="color: #1a5f7a; font-weight: bold; margin: 0;">CONSEJO REGIONAL PUNO</p>
                <p style="color: #666; font-size: 12px; margin: 5px 0;">Jr. Deustua N° 356</p>
                <p style="color: #666; font-size: 12px; margin: 5px 0;">Teléfono: (051) 051 354000</p>
                <p style="color: #666; font-size: 12px; margin: 5px 0;">Puno - Perú</p>
            </div>
            """;

    private static final String EMAIL_STYLES = """
            <style>
                .email-container { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #1a5f7a; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                .content { background-color: white; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
                .button { background-color: #1a5f7a; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
                .button:hover { background-color: #134b61; }
                .info { background-color: #f8f9fa; padding: 15px; border-left: 4px solid #1a5f7a; margin: 15px 0; }
                .warning { color: #856404; background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; }
            </style>
            """;

    private final JavaMailSender mailSender;
    private final EmailConfig emailConfig;
    private final String frontendUrl;

    /**
     * Constructor para el servicio de correo.
     *
     * @param mailSender  el servicio para enviar correos
     * @param emailConfig la configuración de correo electrónico
     * @param frontendUrl la URL del frontend para incluir en los correos
     */
    public DefaultEmailService(JavaMailSender mailSender, EmailConfig emailConfig,
            @Value("${app.url.frontend}") String frontendUrl) {
        this.mailSender = mailSender;
        this.emailConfig = emailConfig;
        this.frontendUrl = frontendUrl;
    }

    /**
     * {@inheritDoc}
     */
    @Async
    @Override
    public void sendActivationEmail(User user, String token) {
        String subject = "Activa tu cuenta - Consejo Regional Puno";
        String activationLink = frontendUrl + emailConfig.getActivationUrl() + "?token=" + token;

        String content = EMAIL_STYLES
                + """
                        <div class="email-container">
                            <div class="header">
                                <h1>Activación de Cuenta</h1>
                            </div>
                            <div class="content">
                                <p>Estimado(a) %s,</p>
                                <p>Gracias por registrarte en el sistema del Consejo Regional Puno. Para activar tu cuenta, haz clic en el siguiente botón:</p>
                                <div style="text-align: center;">
                                    <a href="%s" class="button">Activar cuenta</a>
                                </div>
                                <div class="info">
                                    <p>Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:</p>
                                    <p><a href="%s">%s</a></p>
                                </div>
                                <div class="warning">
                                    <p>⚠️ Este enlace expirará en 24 horas.</p>
                                    <p>Si no has solicitado esta activación, por favor ignora este correo.</p>
                                </div>
                                %s
                            </div>
                        </div>
                        """
                        .formatted(user.getFirstName(), activationLink, activationLink, activationLink,
                                EMAIL_SIGNATURE);

        sendHtmlEmail(user.getEmail(), subject, content);
    }

    /**
     * {@inheritDoc}
     */
    @Async
    @Override
    public void sendResetPasswordEmail(User user, String token) {
        String subject = "Restablecer contraseña - Consejo Regional Puno";
        String resetLink = frontendUrl + emailConfig.getResetPasswordUrl() + "?token=" + token;

        String content = EMAIL_STYLES
                + """
                        <div class="email-container">
                            <div class="header">
                                <h1>Restablecer Contraseña</h1>
                            </div>
                            <div class="content">
                                <p>Estimado(a) %s,</p>
                                <p>Has solicitado restablecer tu contraseña. Para continuar, haz clic en el siguiente botón:</p>
                                <div style="text-align: center;">
                                    <a href="%s" class="button">Restablecer contraseña</a>
                                </div>
                                <div class="info">
                                    <p>Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:</p>
                                    <p><a href="%s">%s</a></p>
                                </div>
                                <div class="warning">
                                    <p>⚠️ Este enlace expirará en 1 hora.</p>
                                    <p>Si no has solicitado este cambio, por favor ignora este correo o contacta al administrador.</p>
                                </div>
                                %s
                            </div>
                        </div>
                        """
                        .formatted(user.getFirstName(), resetLink, resetLink, resetLink, EMAIL_SIGNATURE);

        sendHtmlEmail(user.getEmail(), subject, content);
    }

    /**
     * {@inheritDoc}
     */
    @Async
    @Override
    public void sendPasswordChangedEmail(User user) {
        String subject = "Confirmación de cambio de contraseña - Consejo Regional Puno";
        String fecha = LocalDateTime.now().format(DATE_FORMATTER);

        String content = EMAIL_STYLES
                + """
                        <div class="email-container">
                            <div class="header">
                                <h1>Cambio de Contraseña Exitoso</h1>
                            </div>
                            <div class="content">
                                <p>Estimado(a) %s,</p>
                                <p>Tu contraseña ha sido cambiada exitosamente el %s.</p>
                                <div class="warning">
                                    <p>⚠️ Si no has realizado este cambio, por favor contacta inmediatamente con el administrador del sistema.</p>
                                </div>
                                %s
                            </div>
                        </div>
                        """
                        .formatted(user.getFirstName(), fecha, EMAIL_SIGNATURE);

        sendHtmlEmail(user.getEmail(), subject, content);
    }

    /**
     * {@inheritDoc}
     */
    @Async
    @Override
    public void sendAccountCreatedByAdminEmail(User user, String plainPassword, String token) {
        String subject = "Bienvenido al Sistema - Consejo Regional Puno";
        String activationLink = frontendUrl + emailConfig.getActivationUrl() + "?token=" + token;
        String fecha = LocalDateTime.now().format(DATE_FORMATTER);

        String content = EMAIL_STYLES
                + """
                        <div class="email-container">
                            <div class="header">
                                <h1>Cuenta Creada</h1>
                            </div>
                            <div class="content">
                                <p>Estimado(a) %s,</p>
                                <p>Un administrador ha creado una cuenta para ti en el sistema del Consejo Regional Puno el %s.</p>

                                <div class="info">
                                    <h3>Tus credenciales de acceso son:</h3>
                                    <p><strong>Email:</strong> %s</p>
                                    <p><strong>Contraseña temporal:</strong> %s</p>
                                </div>

                                <p><strong>IMPORTANTE:</strong> Por razones de seguridad, cuando inicies sesión por primera vez,
                                deberás cambiar tu contraseña.</p>

                                <div style="text-align: center;">
                                    <a href="%s" class="button">Activar cuenta</a>
                                </div>

                                <div class="warning">
                                    <p>⚠️ Este enlace expirará en 24 horas.</p>
                                    <p>Por favor, activa tu cuenta y cambia tu contraseña lo antes posible.</p>
                                </div>
                                %s
                            </div>
                        </div>
                        """
                        .formatted(user.getFirstName(), fecha, user.getEmail(), plainPassword, activationLink,
                                EMAIL_SIGNATURE);

        sendHtmlEmail(user.getEmail(), subject, content);
    }

    /**
     * {@inheritDoc}
     */
    @Async
    @Override
    public void sendWelcomeEmail(User user) {
        String subject = "¡Bienvenido al Sistema! - Consejo Regional Puno";
        String fecha = LocalDateTime.now().format(DATE_FORMATTER);

        String content = EMAIL_STYLES
                + """
                        <div class="email-container">
                            <div class="header">
                                <h1>¡Bienvenido!</h1>
                            </div>
                            <div class="content">
                                <p>Estimado(a) %s,</p>
                                <p>¡Nos complace darte la bienvenida al sistema del Consejo Regional Puno! Tu cuenta ha sido activada exitosamente el %s.</p>

                                <div class="info">
                                    <h3>¿Qué puedes hacer ahora?</h3>
                                    <ul>
                                        <li>Acceder al sistema con tus credenciales</li>
                                        <li>Personalizar tu perfil</li>
                                        <li>Explorar las funcionalidades disponibles</li>
                                    </ul>
                                </div>

                                <div style="text-align: center;">
                                    <a href="%s" class="button">Ir al Sistema</a>
                                </div>

                                <div class="warning">
                                    <p>Si tienes alguna duda o necesitas ayuda, no dudes en contactar al administrador del sistema.</p>
                                </div>
                                %s
                            </div>
                        </div>
                        """
                        .formatted(user.getFirstName(), fecha, frontendUrl, EMAIL_SIGNATURE);

        sendHtmlEmail(user.getEmail(), subject, content);
    }

    /**
     * {@inheritDoc}
     */
    @Async
    @Override
    public void sendPasswordResetByAdminEmail(User user, String plainPassword, String token) {
        String subject = "Contraseña Restablecida - Consejo Regional Puno";
        String activationLink = frontendUrl + emailConfig.getActivationUrl() + "?token=" + token;
        String fecha = LocalDateTime.now().format(DATE_FORMATTER);

        String content = EMAIL_STYLES
                + """
                        <div class="email-container">
                            <div class="header">
                                <h1>Contraseña Restablecida</h1>
                            </div>
                            <div class="content">
                                <p>Estimado(a) %s,</p>
                                <p>Un administrador ha restablecido tu contraseña el %s por motivos de seguridad.</p>

                                <div class="info">
                                    <h3>Tus nuevas credenciales temporales:</h3>
                                    <p><strong>Email:</strong> %s</p>
                                    <p><strong>Contraseña temporal:</strong> %s</p>
                                </div>

                                <p><strong>IMPORTANTE:</strong> Por razones de seguridad, deberás cambiar esta contraseña temporal en tu próximo inicio de sesión.</p>

                                <div style="text-align: center;">
                                    <a href="%s" class="button">Acceder al Sistema</a>
                                </div>

                                <div class="warning">
                                    <p>⚠️ Si no has solicitado este cambio o tienes dudas sobre la seguridad de tu cuenta,
                                    contacta inmediatamente con el administrador del sistema.</p>
                                </div>
                                %s
                            </div>
                        </div>
                        """
                        .formatted(user.getFirstName(), fecha, user.getEmail(), plainPassword, activationLink,
                                EMAIL_SIGNATURE);

        sendHtmlEmail(user.getEmail(), subject, content);
    }

    /**
     * Método utilitario para enviar correos HTML.
     *
     * @param to          la dirección de correo del destinatario
     * @param subject     el asunto del correo
     * @param htmlContent el contenido HTML del correo
     */
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