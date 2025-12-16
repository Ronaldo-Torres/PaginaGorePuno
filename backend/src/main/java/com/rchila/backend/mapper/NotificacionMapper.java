package com.rchila.backend.mapper;

import java.util.List;
import java.util.Collections;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import com.rchila.backend.model.NotificacionAgenda;
import com.rchila.backend.model.dto.NotificacionDTO;

import com.rchila.backend.model.Agenda;
import com.rchila.backend.admin.user.repositories.models.User;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, unmappedSourcePolicy = ReportingPolicy.IGNORE)
@Component("notificacionMapper")
public interface NotificacionMapper {

    @Mapping(target = "user", source = "user")
    @Mapping(target = "agenda", source = "agenda")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "estado", ignore = true)
    @Mapping(target = "fechaEvento", expression = "java(java.time.LocalDateTime.of(agenda.getFecha(), agenda.getHoraInicio() != null ? agenda.getHoraInicio() : java.time.LocalTime.MIDNIGHT))")
    NotificacionAgenda toEntity(NotificacionDTO dto, User user, Agenda agenda);

    @Mapping(target = "userId", source = "user.uuid")
    @Mapping(target = "agendaId", source = "agenda.id")
    NotificacionDTO toDTO(NotificacionAgenda entity);

    default List<String> map(String value) {
        return value != null ? Collections.singletonList(value) : Collections.emptyList();
    }
}
