package com.rchila.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rchila.backend.model.LinkInteres;

public interface LinkInteresRepository extends JpaRepository<LinkInteres, Long> {
    List<LinkInteres> findByActivo(Boolean activo);
}
