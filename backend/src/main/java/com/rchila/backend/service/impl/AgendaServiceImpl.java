package com.rchila.backend.service.impl;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.stream.Collectors;

import com.rchila.backend.model.Agenda;
import com.rchila.backend.repository.AgendaRepository;
import com.rchila.backend.service.AgendaService;
import com.rchila.backend.exception.AgendaException;
import java.util.List;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;
import com.rchila.backend.service.StorageService;
import com.rchila.backend.model.NotificacionAgenda;
import com.rchila.backend.repository.notificacionAgendaRepository;
import com.rchila.backend.admin.email.service.NotificacionService;
import com.rchila.backend.admin.user.repositories.UserRepository;
import com.rchila.backend.admin.user.repositories.models.User;
import com.rchila.backend.model.dto.NotificacionDTO;
import com.rchila.backend.mapper.NotificacionMapper;
import java.util.ArrayList;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@AllArgsConstructor
public class AgendaServiceImpl implements AgendaService {

    private static final Logger logger = LoggerFactory.getLogger(AgendaServiceImpl.class);
    
    private final AgendaRepository agendaRepository;
    private final StorageService storageService;
    private final NotificacionService notificacionService;
    private final notificacionAgendaRepository notificacionAgendaRepository;
    private final UserRepository userRepository;
    private final NotificacionMapper notificacionMapper;

    // Formato para horas que permite tanto HH:mm como HH:mm:ss
    private static final DateTimeFormatter[] TIME_FORMATTERS = {
            DateTimeFormatter.ofPattern("HH:mm:ss"),
            DateTimeFormatter.ofPattern("HH:mm")
    };

    @Override
    public Page<Agenda> getAgenda(Pageable pageable) {
        return agendaRepository.findAll(pageable);
    }

    @Override
    public List<Agenda> getAgendaByEstado(String estado) {
        return agendaRepository.findByEstado(estado);
    }

    @Override
    public List<Agenda> getAgendaByMes(int mes) {
        // Validar que el mes esté entre 1 y 12
        if (mes < 1 || mes > 12) {
            throw new AgendaException("El mes debe estar entre 1 y 12");
        }

        // Por defecto mostrar solo agendas públicas
        // Boolean publico = true;
        return agendaRepository.findByMesAndPublico(mes, true);
    }

    @Override
    @Transactional
    public Agenda createAgenda(Agenda agenda, MultipartFile file) {
        try {
            // Validar que la fecha no sea nula
            if (agenda.getFecha() == null) {
                throw new AgendaException("La fecha es obligatoria");
            }

            // Procesar horaInicio
            if (agenda.getHoraInicio() != null) {
                agenda.setHoraInicio(parseLocalTime(agenda.getHoraInicio().toString(), "horaInicio"));
            }

            // Procesar horaFin
            if (agenda.getHoraFin() != null) {
                agenda.setHoraFin(parseLocalTime(agenda.getHoraFin().toString(), "horaFin"));
            }

            // Guardar el archivo
            if (file != null && !file.isEmpty()) {
                String fileUrl = storageService.guardarArchivo(file, "", "", "agendas");
                agenda.setDocumento(fileUrl);
            }
            return agendaRepository.save(agenda);
        } catch (Exception e) {
            throw new AgendaException("Error al crear la agenda: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public Agenda updateAgenda(Agenda agenda, MultipartFile file) {
        try {
            // Validar que la fecha no sea nula
            if (agenda.getFecha() == null) {
                throw new AgendaException("La fecha es obligatoria");
            }

            // Obtener la agenda existente de la base de datos para acceder al documento
            // actual
            Agenda agendaExistente = null;
            if (agenda.getId() != null) {
                agendaExistente = agendaRepository.findById(agenda.getId())
                        .orElseThrow(() -> new AgendaException("Agenda no encontrada con id: " + agenda.getId()));
            }

            // Procesar horaInicio
            if (agenda.getHoraInicio() != null) {
                agenda.setHoraInicio(parseLocalTime(agenda.getHoraInicio().toString(), "horaInicio"));
            }

            // Procesar horaFin
            if (agenda.getHoraFin() != null) {
                agenda.setHoraFin(parseLocalTime(agenda.getHoraFin().toString(), "horaFin"));
            }

            // Guardar el archivo
            if (file != null && !file.isEmpty()) {
                // Eliminar documento anterior si existe
                if (agendaExistente != null && agendaExistente.getDocumento() != null
                        && !agendaExistente.getDocumento().isEmpty()) {
                    storageService.eliminarArchivo(agendaExistente.getDocumento());
                }

                String fileUrl = storageService.guardarArchivo(file, "", "", "agendas");
                agenda.setDocumento(fileUrl);
            } else if (agendaExistente != null && agendaExistente.getDocumento() != null) {
                // Mantener el documento existente si no se sube uno nuevo
                agenda.setDocumento(agendaExistente.getDocumento());
            }

            return agendaRepository.save(agenda);
        } catch (Exception e) {
            throw new AgendaException("Error al actualizar la agenda: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void deleteAgenda(Long id) {
        try {
            // 1. Obtener la agenda
            Agenda agenda = agendaRepository.findById(id)
                    .orElseThrow(() -> new AgendaException("Agenda no encontrada con ID: " + id));

            // 2. Eliminar el documento si existe
            if (agenda.getDocumento() != null && !agenda.getDocumento().isEmpty()) {
                try {
                    storageService.eliminarArchivo(agenda.getDocumento());
                } catch (Exception e) {
                    logger.error("Error al eliminar el documento de la agenda: " + e.getMessage());
                    // Continuamos con la eliminación aunque falle el borrado del documento
                }
            }

            // 3. Eliminar todas las notificaciones asociadas primero
            notificacionAgendaRepository.deleteByAgendaId(id);

            // 4. Eliminar la agenda
            agendaRepository.delete(agenda);

            logger.info("Agenda y sus notificaciones eliminadas correctamente. ID: " + id);
        } catch (Exception e) {
            logger.error("Error al eliminar la agenda: " + e.getMessage());
            throw new AgendaException("Error al eliminar la agenda: " + e.getMessage());
        }
    }

    @Override
    public Agenda getAgendaById(Long id) {
        return agendaRepository.findById(id).orElse(null);
    }

    /**
     * Parsea una cadena de texto a LocalTime probando diferentes formatos.
     *
     * @param timeStr   La cadena que representa el tiempo
     * @param fieldName Nombre del campo para mensajes de error
     * @return LocalTime parseado
     * @throws AgendaException Si no se puede parsear con ningún formato
     */
    private LocalTime parseLocalTime(String timeStr, String fieldName) {
        if (timeStr == null || timeStr.trim().isEmpty()) {
            return null;
        }

        // Limpiar la entrada y eliminar cualquier parte después de los primeros 8
        // caracteres si es necesario
        if (timeStr.contains(":")) {
            String[] partes = timeStr.split(":");
            if (partes.length > 3) {
                timeStr = partes[0] + ":" + partes[1] + ":" + (partes.length > 2 ? partes[2] : "00");
            } else if (partes.length == 2) {
                // Si solo tiene horas y minutos, añadir segundos
                timeStr = timeStr + ":00";
            }
        }

        // Intentar con los formatos definidos
        for (DateTimeFormatter formatter : TIME_FORMATTERS) {
            try {
                return LocalTime.parse(timeStr, formatter);
            } catch (DateTimeParseException e) {
                // Continuar con el siguiente formato
            }
        }

        // Si llegamos aquí, ningún formato funcionó
        throw new AgendaException("Formato de " + fieldName + " inválido. Use el formato HH:mm o HH:mm:ss");
    }

    // notificar agenda
    @Override
    public List<NotificacionAgenda> notificarAgenda(NotificacionDTO notificacionDTO) {
        try {
            List<NotificacionAgenda> notificaciones = new ArrayList<>();

            // Obtener la agenda
            Agenda agenda = agendaRepository.findById(notificacionDTO.getAgendaId())
                    .orElseThrow(() -> new AgendaException(
                            "Agenda no encontrada con ID: " + notificacionDTO.getAgendaId()));

            // Obtener y notificar a cada usuario
            for (String userId : notificacionDTO.getUserId()) {
                User user = userRepository.findByUuid(UUID.fromString(userId))
                        .orElseThrow(() -> new AgendaException(
                                "Usuario no encontrado con UUID: " + userId));

                // Verificar si ya existe una notificación para este usuario y agenda
                NotificacionAgenda existingNotificacion = notificacionAgendaRepository
                        .findByUserAndAgenda(user, agenda)
                        .orElse(null);

                if (existingNotificacion != null) {
                    // Si ya existe, solo agregar a la lista y continuar
                    notificaciones.add(existingNotificacion);
                    throw new AgendaException("Ya se envió una notificación al usuario " + user.getEmail()
                            + ". Para reenviar, use la opción de reenvío.");
                } else {
                    // Si no existe, crear nueva notificación
                    NotificacionAgenda notificacionAgenda = notificacionMapper.toEntity(notificacionDTO, user, agenda);
                    notificacionAgenda = notificacionAgendaRepository.save(notificacionAgenda);
                    notificaciones.add(notificacionAgenda);
                    notificacionService.enviarNotificacion(notificacionAgenda, notificacionDTO.getMensaje(), user);
                }
            }

            return notificaciones;
        } catch (AgendaException e) {
            throw e; // Relanzar excepciones de agenda directamente
        } catch (Exception e) {
            throw new AgendaException("Error al notificar agenda: " + e.getMessage());
        }
    }

    @Override
    public NotificacionAgenda getNotificacionById(Long id) {
        NotificacionAgenda notificacionAgenda = notificacionAgendaRepository.findById(id).orElse(null);
        if (notificacionAgenda == null) {
            throw new AgendaException("Notificación no encontrada con id: " + id);
        }
        notificacionAgenda.setEstado("reenviado");
        notificacionAgendaRepository.save(notificacionAgenda);
        return notificacionAgenda;
    }

    @Override
    public List<NotificacionDTO> getNotificacionByAgendaId(Long agendaId) {
        return notificacionAgendaRepository.findByAgendaId(agendaId).stream()
                .map(notificacionMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public NotificacionAgenda actualizarNotificacion(NotificacionAgenda notificacion) {
        return notificacionAgendaRepository.save(notificacion);
    }

    @Override
    public NotificacionAgenda reenviarNotificacion(Long id) {
        NotificacionAgenda notificacion = getNotificacionById(id);
        if (notificacion != null) {
            User user = notificacion.getUser();
            notificacionService.reenviarNotificacion(notificacion, user);
        }
        return notificacion;
    }
}