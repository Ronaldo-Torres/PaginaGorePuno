package com.rchila.backend.admin.email.service.impl;

import com.rchila.backend.admin.config.EmailConfig;
import com.rchila.backend.admin.email.service.MarketingEmailService;
import com.rchila.backend.admin.email.service.dtos.BulkEmailRequest;
import com.rchila.backend.admin.email.service.dtos.CustomEmailRequest;
import com.rchila.backend.admin.email.service.dtos.EmailSendResult;
import com.rchila.backend.admin.user.repositories.UserRepository;
import com.rchila.backend.admin.user.repositories.models.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

/**
 * Implementación del servicio de correos de marketing y personalizados.
 * Proporciona funcionalidades para envío individual y masivo de correos.
 */
@Service
public class DefaultMarketingEmailService implements MarketingEmailService {

    private static final Logger logger = LoggerFactory.getLogger(DefaultMarketingEmailService.class);

    private final JavaMailSender mailSender;
    private final EmailConfig emailConfig;
    private final UserRepository userRepository;
    private final String frontendUrl;
    private final ExecutorService executorService;

    /**
     * Constructor para el servicio de marketing por email.
     */
    public DefaultMarketingEmailService(JavaMailSender mailSender,
            EmailConfig emailConfig,
            UserRepository userRepository,
            @Value("${app.url.frontend}") String frontendUrl) {
        this.mailSender = mailSender;
        this.emailConfig = emailConfig;
        this.userRepository = userRepository;
        this.frontendUrl = frontendUrl;
        this.executorService = Executors.newFixedThreadPool(10); // Pool de hilos para envío concurrente
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public EmailSendResult sendCustomEmail(CustomEmailRequest request) {
        try {
            String finalMessage = processMessageTemplate(request.message(),
                    request.recipientName() != null ? request.recipientName() : "Usuario");

            boolean success = sendEmail(request.recipientEmail(), request.subject(), finalMessage, request.isHtml());

            if (success) {
                return EmailSendResult.success("Correo enviado exitosamente a: " + request.recipientEmail());
            } else {
                return EmailSendResult.failure("Error al enviar correo a: " + request.recipientEmail());
            }
        } catch (Exception e) {
            logger.error("Error enviando correo personalizado", e);
            return EmailSendResult.failure("Error interno: " + e.getMessage());
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public EmailSendResult sendCustomEmailToUser(User user, String subject, String message, boolean isHtml) {
        try {
            String finalMessage = processMessageTemplate(message, user.getFirstName());
            boolean success = sendEmail(user.getEmail(), subject, finalMessage, isHtml);

            if (success) {
                return EmailSendResult.success("Correo enviado exitosamente a: " + user.getEmail());
            } else {
                return EmailSendResult.failure("Error al enviar correo a: " + user.getEmail());
            }
        } catch (Exception e) {
            logger.error("Error enviando correo a usuario", e);
            return EmailSendResult.failure("Error interno: " + e.getMessage());
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public EmailSendResult sendBulkEmails(BulkEmailRequest request) {
        Set<User> recipients = getRecipientsFromRequest(request);

        if (recipients.isEmpty()) {
            return EmailSendResult.failure("No se encontraron destinatarios válidos");
        }

        return sendEmailsToUsers(recipients, request.subject(), request.message(), request.isHtml());
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public EmailSendResult sendEmailToAllUsers(String subject, String message, boolean isHtml) {
        List<User> allUsers = userRepository.findAll();

        if (allUsers.isEmpty()) {
            return EmailSendResult.failure("No hay usuarios registrados en el sistema");
        }

        return sendEmailsToUsers(new HashSet<>(allUsers), subject, message, isHtml);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public EmailSendResult sendEmailToUsersWithRoles(List<String> roleNames, String subject, String message,
            boolean isHtml) {
        List<User> users = userRepository.findUsersWithRoles(roleNames);

        if (users.isEmpty()) {
            return EmailSendResult.failure("No se encontraron usuarios con los roles especificados");
        }

        return sendEmailsToUsers(new HashSet<>(users), subject, message, isHtml);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public EmailSendResult sendEmailToSpecificUsers(List<UUID> userIds, String subject, String message,
            boolean isHtml) {
        List<User> users = userRepository.findAllByUuidIn(userIds);

        if (users.isEmpty()) {
            return EmailSendResult.failure("No se encontraron usuarios con los IDs especificados");
        }

        return sendEmailsToUsers(new HashSet<>(users), subject, message, isHtml);
    }

    /**
     * Envía correos a un conjunto de usuarios de forma concurrente.
     */
    private EmailSendResult sendEmailsToUsers(Set<User> users, String subject, String message, boolean isHtml) {
        logger.info("Iniciando envío masivo a {} usuarios", users.size());

        List<String> errors = new ArrayList<>();
        int successful = 0;
        int failed = 0;

        // Crear tareas para envío concurrente
        List<CompletableFuture<Boolean>> futures = users.stream()
                .map(user -> CompletableFuture.supplyAsync(() -> {
                    try {
                        String personalizedMessage = processMessageTemplate(message, user.getFirstName());
                        return sendEmail(user.getEmail(), subject, personalizedMessage, isHtml);
                    } catch (Exception e) {
                        logger.error("Error enviando correo a {}", user.getEmail(), e);
                        return false;
                    }
                }, executorService))
                .collect(Collectors.toList());

        // Esperar a que todos los envíos completen y contar resultados
        for (int i = 0; i < futures.size(); i++) {
            try {
                boolean success = futures.get(i).get();
                if (success) {
                    successful++;
                } else {
                    failed++;
                    User user = users.stream().skip(i).findFirst().orElse(null);
                    if (user != null) {
                        errors.add("Error enviando a: " + user.getEmail());
                    }
                }
            } catch (Exception e) {
                failed++;
                errors.add("Error interno en envío #" + (i + 1) + ": " + e.getMessage());
            }
        }

        logger.info("Envío masivo completado: {} exitosos, {} fallidos", successful, failed);
        return EmailSendResult.bulk(users.size(), successful, failed, errors);
    }

    /**
     * Obtiene los destinatarios a partir de la solicitud de envío masivo.
     */
    private Set<User> getRecipientsFromRequest(BulkEmailRequest request) {
        Set<User> recipients = new HashSet<>();

        // Envío a todos los usuarios
        if (request.sendToAllUsers()) {
            recipients.addAll(userRepository.findAll());
        }

        // Envío a usuarios específicos por UUID
        if (request.userIds() != null && !request.userIds().isEmpty()) {
            recipients.addAll(userRepository.findAllByUuidIn(new ArrayList<>(request.userIds())));
        }

        // Envío a usuarios por email
        if (request.emails() != null && !request.emails().isEmpty()) {
            recipients.addAll(userRepository.findAllByEmailIn(request.emails()));
        }

        // Filtrar por roles si se especifican
        if (request.roleNames() != null && !request.roleNames().isEmpty()) {
            List<String> roleNames = new ArrayList<>(request.roleNames());
            Set<User> usersWithRoles = new HashSet<>(userRepository.findUsersWithRoles(roleNames));

            if (recipients.isEmpty()) {
                recipients.addAll(usersWithRoles);
            } else {
                recipients.retainAll(usersWithRoles); // Intersección
            }
        }

        return recipients;
    }

    /**
     * Procesa el template del mensaje reemplazando variables.
     */
    private String processMessageTemplate(String message, String userName) {
        return message
                .replace("{{nombre}}", userName != null ? userName : "Usuario")
                .replace("{{firstName}}", userName != null ? userName : "Usuario")
                .replace("{{sistemaUrl}}", frontendUrl)
                .replace("{{fecha}}", java.time.LocalDate.now().toString());
    }

    /**
     * Envía un correo electrónico.
     */
    private boolean sendEmail(String to, String subject, String content, boolean isHtml) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(emailConfig.getFrom());
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, isHtml);

            mailSender.send(message);
            logger.debug("Email enviado exitosamente a: {}", to);
            return true;
        } catch (MessagingException e) {
            logger.error("Error enviando email a: {}", to, e);
            return false;
        }
    }
}