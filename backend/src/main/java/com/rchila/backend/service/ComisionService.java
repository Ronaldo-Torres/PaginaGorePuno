package com.rchila.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.rchila.backend.model.Comision;
import com.rchila.backend.model.Actividad;
import com.rchila.backend.model.ConsejeroComision;
import com.rchila.backend.model.ActividadImagen;
import java.util.List;

public interface ComisionService {

    Page<Comision> findAllComisiones(Pageable pageable, String search);

    Comision findComisionById(Long id);

    Comision saveComision(Comision comision);

    Comision updateComision(Long id, Comision comision);

    void deleteComision(Long id);

    Comision activarComision(Long id, Boolean activo);

    // Actividades
    Page<Actividad> findActividadesByComisionId(Long comisionId, Pageable pageable);

    Actividad saveActividad(Actividad actividad);

    Actividad updateActividad(Long id, Actividad actividad);

    void deleteActividad(Long id);

    Page<ActividadImagen> findImagenesByActividadId(Long actividadId, Pageable pageable);

    void deleteImagen(Long id);

    ActividadImagen saveImagenActividad(MultipartFile file, String nombre, Long actividadId);

    Actividad activarActividad(Long id, Boolean activo);

    // ConsejeroComision
    ConsejeroComision createConsejeroComision(ConsejeroComision consejeroComision);

    Page<ConsejeroComision> findConsejerosByComisionId(Long comisionId, Pageable pageable);

    void deleteConsejeroComision(Long id);

    ConsejeroComision activarConsejeroComision(Long id, Boolean activo);

    List<Comision> findAllComisiones();
}
