package com.rchila.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;
import java.util.UUID;

import com.rchila.backend.model.ConsejeroGaleria;

public interface GaleriaService {
    Page<ConsejeroGaleria> getGaleriaConsejeros(Long id, Pageable pageable);
    ConsejeroGaleria createGaleriaConsejero(Long id, MultipartFile file, String descripcion, Long consejeroId, String nombre);
    ConsejeroGaleria updateGaleriaConsejero(UUID id, MultipartFile file, String descripcion, Long consejeroId, String nombre);
    void deleteGaleriaConsejero(UUID id);
    }
