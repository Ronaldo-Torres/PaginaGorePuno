package com.rchila.backend.mapper;

import org.mapstruct.Mapper;
import com.rchila.backend.model.Boletin;
import com.rchila.backend.model.dto.BoletinDTO;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring")
@Component("boletinMapper")
public interface BoletinMapper {
    BoletinDTO toDto(Boletin boletin);

    Boletin toEntity(BoletinDTO boletinDto);
}
