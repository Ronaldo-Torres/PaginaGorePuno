package com.rchila.backend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.rchila.backend.model.ActividadImagen;

public interface ActividadImagenRepository extends JpaRepository<ActividadImagen, Long> {
    List<ActividadImagen> findByActividadId(Long id);

    Page<ActividadImagen> findByActividadId(Long actividadId, Pageable pageable);
}
