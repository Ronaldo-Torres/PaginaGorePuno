package com.rchila.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.rchila.backend.model.Atencion;

public interface AtencionService {
    Page<Atencion> getAtenciones(Pageable pageable, String search);
    Atencion getAtencionById(Long id);
    Atencion createAtencion(MultipartFile imagen, Atencion atencion);
    Atencion updateAtencion(Long id, MultipartFile imagen, Atencion atencion);
    void deleteAtencion(Long id);
}
