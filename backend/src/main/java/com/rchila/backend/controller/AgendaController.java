package com.rchila.backend.controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.HashMap;

import jakarta.validation.Valid;

import com.rchila.backend.model.Agenda;
import com.rchila.backend.model.NotificacionAgenda;
import com.rchila.backend.model.dto.NotificacionDTO;
import com.rchila.backend.service.AgendaService;
import com.rchila.backend.admin.email.service.NotificacionService;

import org.springframework.web.multipart.MultipartFile;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.http.HttpStatus;
import java.time.LocalDateTime;
import java.util.Date;
import javax.crypto.SecretKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.format.DateTimeFormatter;

import com.rchila.backend.admin.user.repositories.models.User;
import com.rchila.backend.admin.user.repositories.UserRepository;

@RestController
@RequestMapping("/v1/agendas")
@AllArgsConstructor
public class AgendaController {

    private static final Logger logger = LoggerFactory.getLogger(AgendaController.class);
    private final AgendaService agendaService;
    private final SecretKey secretKey;
    private final NotificacionService notificacionService;
    private final UserRepository userRepository;

    @GetMapping
    public  ResponseEntity<Page<Agenda>> getAgenda(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size, @RequestParam(defaultValue = "id") String orderBy,
            @RequestParam(defaultValue = "asc") String direction) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction.toUpperCase());
        if (!orderBy.equals("id") && !orderBy.equals("fecha") && !orderBy.equals("nombre")) {
            return ResponseEntity.badRequest().body(null);
        }
        return ResponseEntity.ok(agendaService.getAgenda(PageRequest.of(page, size, Sort.by(sortDirection, orderBy))));
    }

    @PostMapping
    public ResponseEntity<?> createAgenda(@Valid @RequestParam(value = "file", required = false) MultipartFile file,
            Agenda agenda) {
        try {
            return ResponseEntity.ok(agendaService.createAgenda(agenda, file));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAgenda(@PathVariable Long id,
            @Valid @RequestParam(value = "file", required = false) MultipartFile file, Agenda agenda) {

        try {
            return ResponseEntity.ok(agendaService.updateAgenda(agenda, file));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAgenda(@PathVariable Long id) {
        try {
            agendaService.deleteAgenda(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Error al eliminar la agenda: " + e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<String, String>() {
                        {
                            put("error",
                                    "No se pudo eliminar la agenda y sus notificaciones asociadas. " + e.getMessage());
                        }
                    });
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Agenda> getAgendaById(@PathVariable Long id) {
        return ResponseEntity.ok(agendaService.getAgendaById(id));
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Agenda>> getAgendaByEstado(@PathVariable String estado) {
        return ResponseEntity.ok(agendaService.getAgendaByEstado(estado));
    }

    // agenda por mes ademas solo los que tengan publico true
    @GetMapping("/mes/{mes}")
    public ResponseEntity<List<Agenda>> getAgendaByMes(@PathVariable int mes) {
        return ResponseEntity.ok(agendaService.getAgendaByMes(mes));
    }

    @PostMapping("/notificar")
    public ResponseEntity<?> notificarAgenda(@RequestBody NotificacionDTO notificacionAgenda) {

        return ResponseEntity.ok(agendaService.notificarAgenda(notificacionAgenda));
    }

    // reenviar notificacion
    @PostMapping("/reenviar/{id}")
    public ResponseEntity<NotificacionAgenda> reenviarNotificacion(@PathVariable Long id) {
        NotificacionAgenda notificacion = agendaService.reenviarNotificacion(id);
        return ResponseEntity.ok(notificacion);
    }

    @GetMapping("/notificaciones/{id}")
    public ResponseEntity<List<NotificacionDTO>> getNotificacionByAgendaId(@PathVariable Long id) {
        return ResponseEntity.ok(agendaService.getNotificacionByAgendaId(id));
    }

    @GetMapping("/confirmar")
    public ResponseEntity<?> confirmarAsistencia(
            @RequestParam String token,
            @RequestParam String respuesta) {
        try {
            logger.info("Recibida solicitud de confirmación. Token: {}, Respuesta: {}", token, respuesta);

            // Validar el token
            Claims claims;
            try {
                claims = Jwts.parserBuilder()
                        .setSigningKey(secretKey)
                        .build()
                        .parseClaimsJws(token)
                        .getBody();
                logger.info("Token validado correctamente. Claims: {}", claims);
            } catch (Exception e) {
                logger.error("Error al validar el token: {}", e.getMessage());
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("Token inválido o expirado: " + e.getMessage());
            }

            // Verificar si el token ha expirado
            Date expiration = claims.getExpiration();
            if (expiration.before(new Date())) {
                logger.warn("Token expirado. Fecha de expiración: {}", expiration);
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("El enlace de confirmación ha expirado");
            }

            // Obtener datos del token
            Long notificacionId = claims.get("notificacionId", Long.class);
            Long userId = claims.get("userId", Long.class);
            String userEmail = claims.getSubject();
            logger.info("Datos extraídos del token. NotificacionId: {}, UserId: {}, Email: {}",
                    notificacionId, userId, userEmail);

            // Procesar la respuesta
            NotificacionAgenda notificacion = agendaService.getNotificacionById(notificacionId);
            if (notificacion == null) {
                logger.error("Notificación no encontrada. ID: {}", notificacionId);
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Notificación no encontrada");
            }
            logger.info("Notificación encontrada: {}", notificacion);

            // Actualizar el estado de la notificación
            notificacion.setEstado(respuesta);
            notificacion.setFechaRespuesta(LocalDateTime.now());
            agendaService.actualizarNotificacion(notificacion);
            // obtener usuario por id
            User usuario = userRepository.findById(userId).orElse(null);
            if (usuario != null && usuario.getPresidente() != null && usuario.getPresidente()) {
                Agenda agenda = agendaService.getAgendaById(notificacion.getAgenda().getId());
                agenda.setEstado(respuesta.equals("asistire") ? "ASISTIRA" : "NO_ASISTIRA");
                agendaService.updateAgenda(agenda, null);
                logger.info("Estado de agenda actualizado por respuesta del presidente");
            }
            logger.info("Notificación actualizada correctamente");

            // Enviar correo de confirmación
            try {
                String estadoTexto = respuesta.equals("asistire") ? "asistirá" : "no asistirá";
                String asuntoCorreo = "Confirmación de respuesta - Consejo Regional Puno";
                String fecha = notificacion.getAgenda().getFecha().format(DateTimeFormatter.ofPattern("dd/MM/yy"));

                String EMAIL_STYLES = """
                        <style>
                            .email-container { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
                            .header { background-color: #1a5f7a; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                            .content { background-color: white; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
                            .info { background-color: #f8f9fa; padding: 15px; border-left: 4px solid #1a5f7a; margin: 15px 0; }
                            .warning { color: #856404; background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; }
                        </style>
                        """;

                String EMAIL_SIGNATURE = """
                        <div style="margin-top: 30px; border-top: 2px solid #1a5f7a; padding-top: 20px;">
                            <p style="color: #1a5f7a; font-weight: bold; margin: 0;">CONSEJO REGIONAL PUNO</p>
                            <p style="color: #666; font-size: 12px; margin: 5px 0;">Jr. Deustua N° 356</p>
                            <p style="color: #666; font-size: 12px; margin: 5px 0;">Teléfono: (051) 051 354000</p>
                            <p style="color: #666; font-size: 12px; margin: 5px 0;">Puno - Perú</p>
                        </div>
                        """;

                String contenidoCorreo = EMAIL_STYLES
                        + """
                                <div class="email-container">
                                    <div class="header">
                                        <h1>Confirmación de Respuesta</h1>
                                    </div>
                                    <div class="content">
                                        <p>Estimado(a) consejero(a),</p>
                                        <p>Se ha registrado correctamente su respuesta para la siguiente actividad:</p>

                                        <div class="info">
                                            <p><strong>Actividad:</strong> %s</p>
                                            <p><strong>Fecha:</strong> %s</p>
                                            <p><strong>Su respuesta:</strong> Usted %s a esta actividad</p>
                                        </div>

                                        <div class="warning">
                                            <p>Si necesita modificar su respuesta, por favor contacte con el administrador del sistema.</p>
                                        </div>
                                        %s
                                    </div>
                                </div>
                                """
                                .formatted(
                                        notificacion.getAgenda().getNombre(),
                                        fecha,
                                        estadoTexto,
                                        EMAIL_SIGNATURE);

                notificacionService.enviarCorreoConfirmacion(userEmail, asuntoCorreo, contenidoCorreo);
                logger.info("Correo de confirmación enviado exitosamente a: {}", userEmail);
            } catch (Exception e) {
                logger.error("Error al enviar correo de confirmación", e);
                // No retornamos error al usuario si falla el correo, ya que la confirmación fue
                // exitosa
            }

            return ResponseEntity.ok("Respuesta registrada correctamente");

        } catch (Exception e) {
            logger.error("Error no controlado al procesar la confirmación", e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al procesar la confirmación: " + e.getMessage());
        }
    }
}
