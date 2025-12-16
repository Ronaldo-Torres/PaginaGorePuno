package com.rchila.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.rchila.backend.model.Boletin;
import com.rchila.backend.model.BoletinImagen;
import org.springframework.web.multipart.MultipartFile;
import com.rchila.backend.model.dto.BoletinDTO;

public interface BoletinService {
    Page<BoletinDTO> getBoletines(Pageable pageable, String search);

    Boletin createBoletin(MultipartFile file, Boletin boletin);

    Boletin updateBoletin(Long id, MultipartFile file, Boletin boletin);

    void deleteBoletin(Long id);

    Boletin getBoletinById(Long id);

    // Agregar y eliminar imagenes a un boletin
    Page<BoletinImagen> findImagenesByBoletinId(Long id, Pageable pageable);

    BoletinImagen addImagenToBoletin(MultipartFile file, String nombre, Long boletinId);

    void deleteImagen(Long id);

    Boletin activarBoletin(Long id, Boolean activo);

    BoletinImagen activarImagen(Long id, Boolean esPrincipal);
}