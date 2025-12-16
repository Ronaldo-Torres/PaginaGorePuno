package com.rchila.backend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.rchila.backend.model.Actividad;

public interface ActividadRepository extends JpaRepository<Actividad, Long> {

    List<Actividad> findByComisionId(Long id);

    Page<Actividad> findByComisionId(Long id, Pageable pageable);
}
