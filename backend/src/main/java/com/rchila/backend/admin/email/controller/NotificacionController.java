package com.rchila.backend.admin.email.controller;

import com.rchila.backend.admin.email.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/v1/notificacion")
public class NotificacionController {

    private final EmailService emailService;

    public NotificacionController(EmailService emailService) {
        this.emailService = emailService;
    }

    @GetMapping("/agenda")
    public ResponseEntity<Map<String, String>> testEmail(@RequestParam String email, @RequestParam String mensaje) {
        try {
            // Crear un usuario de prueba
            com.rchila.backend.admin.user.repositories.models.User testUser = new com.rchila.backend.admin.user.repositories.models.User();
            testUser.setFirstName("Usuario");
            testUser.setLastName("Prueba");
            testUser.setEmail(email);

            // Enviar correo de prueba
            emailService.sendPasswordChangedEmail(testUser);

            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Correo enviado correctamente a: " + email);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Error al enviar correo: " + e.getMessage());

            return ResponseEntity.internalServerError().body(response);
        }
    }

}