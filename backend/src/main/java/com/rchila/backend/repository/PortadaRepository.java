package com.rchila.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rchila.backend.model.Portada;

public interface PortadaRepository extends JpaRepository<Portada, Long> {
    List<Portada> findByActivo(Boolean activo);
}
