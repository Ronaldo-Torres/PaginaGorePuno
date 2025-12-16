package com.rchila.backend.mapper;

import com.rchila.backend.model.dto.NoticiaDTO;
import com.rchila.backend.model.Noticia;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface NoticiaMapper {
    NoticiaMapper INSTANCE = Mappers.getMapper(NoticiaMapper.class);

    @Mapping(target = "consejeros", ignore = true)
    @Mapping(target = "comisiones", ignore = true)
    Noticia toEntity(NoticiaDTO dto);

    @Mapping(target = "consejeros", ignore = true)
    @Mapping(target = "comisiones", ignore = true)
    NoticiaDTO toDto(Noticia entity);
}