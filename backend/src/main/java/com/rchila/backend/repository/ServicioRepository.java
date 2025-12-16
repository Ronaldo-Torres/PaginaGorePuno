package com.rchila.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rchila.backend.model.Servicio;

public interface ServicioRepository extends JpaRepository<Servicio, Long> {
    List<Servicio> findByActivo(Boolean activo);
}
