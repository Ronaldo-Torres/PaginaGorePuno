package com.rchila.backend.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.rchila.backend.model.Agenda;
import com.rchila.backend.model.NotificacionAgenda;
import com.rchila.backend.model.dto.NotificacionDTO;

public interface AgendaService {

    Page<Agenda> getAgenda(Pageable pageable);

    Agenda createAgenda(Agenda agenda, MultipartFile file);

    Agenda updateAgenda(Agenda agenda, MultipartFile file);

    void deleteAgenda(Long id);

    Agenda getAgendaById(Long id);

    List<Agenda> getAgendaByEstado(String estado);

    List<Agenda> getAgendaByMes(int mes);

    // notificar agenda
    List<NotificacionAgenda> notificarAgenda(NotificacionDTO notificacionAgenda);

    // obtener notificacion por id
    NotificacionAgenda getNotificacionById(Long id);

    List<NotificacionDTO> getNotificacionByAgendaId(Long agendaId);

    NotificacionAgenda actualizarNotificacion(NotificacionAgenda notificacion);

    NotificacionAgenda reenviarNotificacion(Long id);
}
