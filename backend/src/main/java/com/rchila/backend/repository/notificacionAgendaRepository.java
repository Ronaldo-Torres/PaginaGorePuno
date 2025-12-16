package com.rchila.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.rchila.backend.model.NotificacionAgenda;
import com.rchila.backend.admin.user.repositories.models.User;
import com.rchila.backend.model.Agenda;
import java.util.List;
import java.util.Optional;

public interface notificacionAgendaRepository extends JpaRepository<NotificacionAgenda, Long> {

    List<NotificacionAgenda> findByAgendaId(Long agendaId);

    Optional<NotificacionAgenda> findByUserAndAgenda(User user, Agenda agenda);

    void deleteByAgendaId(Long agendaId);

}
