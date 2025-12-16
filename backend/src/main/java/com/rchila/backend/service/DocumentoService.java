package com.rchila.backend.service;

import com.rchila.backend.model.Documento;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.rchila.backend.model.dto.DocumetoSyncDTO;
import com.rchila.backend.model.dto.DocuemntoSyncObtenerDTO;

public interface DocumentoService {
    Documento actualizarDocumento(
        MultipartFile archivo, 
        String id, 
        String tipoDocumentoId, 
        String anioId, 
        String numeroDocumento, 
        String nombreDocumento, 
        String descripcion, 
        String fechaEmision, 
        String activo, 
        String oficinaId,
        Set<String> tags,
        List<Long> consejeroIds,
        List<Long> comisionIds
    );

    Documento crearDocumento(
        MultipartFile archivo,
        String tipoDocumentoId,
        String anioId,
        String numeroDocumento,
        String nombreDocumento,
        String descripcion,
        String fechaEmision,
        String activo,
        String oficinaId,
        Set<String> tags,
        List<Long> consejeroIds,
        List<Long> comisionIds
    );

    Page<Documento> obtenerDocumentosPorTipoYAnio(Integer idDocumento, Integer anioId, Pageable pageable, String search);


    DocumetoSyncDTO sincronizarDocumentos(DocumetoSyncDTO documetoSyncDTO);

    DocumetoSyncDTO actualizarSincronizacion(DocumetoSyncDTO documetoSyncDTO);

    DocuemntoSyncObtenerDTO obtenerDocumentoSincronizacion(String codigoEmision);
}
