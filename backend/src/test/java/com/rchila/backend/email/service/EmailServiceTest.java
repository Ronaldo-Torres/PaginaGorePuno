package com.rchila.backend.email.service;

import com.rchila.backend.admin.email.service.EmailService;
import com.rchila.backend.admin.user.repositories.models.User;
import com.rchila.backend.config.TestMailConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

/**
 * Pruebas para el servicio de correo electrónico.
 * Estas pruebas envían correos reales y requieren configuración en .env.local
 */
@SpringBootTest
@ActiveProfiles("test")
@Import(TestMailConfig.class)
public class EmailServiceTest {

    @Autowired
    private EmailService emailService;

    /**
     * Prueba el envío de un correo de cambio de contraseña.
     * Para ejecutar, cambia el correo por uno válido y comenta la
     * anotación @Ignore.
     */
    @Test // Descomenta para probar
    public void testSendPasswordChangedEmail() {
        // Crear un usuario de prueba
        User testUser = new User();
        testUser.setFirstName("Usuario");
        testUser.setLastName("Prueba");
        // Cambiar a un correo válido para probar
        testUser.setEmail("test@example.com");

        // Enviar correo
        emailService.sendPasswordChangedEmail(testUser);

        // Si no hay excepciones, la prueba pasa
    }
}