package com.rchila.backend.mapper;

import com.rchila.backend.model.Anio;
import com.rchila.backend.model.Comision;
import com.rchila.backend.model.Consejero;
import com.rchila.backend.model.Documento;
import com.rchila.backend.model.TipoDocumento;
import com.rchila.backend.model.dto.ComisionDTO;
import com.rchila.backend.model.dto.ConsejeroDTO;
import com.rchila.backend.model.dto.DocumentoPrincipalDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.sql.Date;
import java.util.List;

@Mapper(componentModel = "spring")
public interface DocumentoMapper {
    DocumentoMapper INSTANCE = Mappers.getMapper(DocumentoMapper.class);

    @Mapping(target = "fechaEmision", source = "fechaEmision", qualifiedByName = "dateToString")
    @Mapping(target = "tipoDocumento", source = "tipoDocumento", qualifiedByName = "tipoDocumentoToString")
    @Mapping(target = "anio", source = "anio", qualifiedByName = "anioToString")
    @Mapping(target = "consejeros", source = "consejeros", qualifiedByName = "consejerosToDTO")
    @Mapping(target = "comisiones", source = "comisiones", qualifiedByName = "comisionesToDTO")
    DocumentoPrincipalDTO toDocumentoPrincipalDTO(Documento documento);

    @Named("dateToString")
    default String dateToString(Date date) {
        return date != null ? date.toString() : null;
    }

    @Named("tipoDocumentoToString")
    default String tipoDocumentoToString(TipoDocumento tipoDocumento) {
        return tipoDocumento != null ? tipoDocumento.getNombre() : null;
    }

    @Named("anioToString")
    default String anioToString(Anio anio) {
        return anio != null ? anio.getAnio() : null;
    }

    @Named("consejerosToDTO")
    default List<ConsejeroDTO> consejerosToDTO(List<Consejero> consejeros) {
        if (consejeros == null) {
            return null;
        }
        return consejeros.stream()
            .map(this::consejeroToDTO)
            .toList();
    }

    @Named("comisionesToDTO")
    default List<ComisionDTO> comisionesToDTO(List<Comision> comisiones) {
        if (comisiones == null) {
            return null;
        }
        return comisiones.stream()
            .map(this::comisionToDTO)
            .toList();
    }

    @Mapping(target = "celular", ignore = true)
    @Mapping(target = "comisiones", ignore = true)
    @Mapping(target = "documentos", ignore = true)
    @Mapping(target = "noticias", ignore = true)
    ConsejeroDTO consejeroToDTO(Consejero consejero);

    @Mapping(target = "cargo", ignore = true)
    ComisionDTO comisionToDTO(Comision comision);
}