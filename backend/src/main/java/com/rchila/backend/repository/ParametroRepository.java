package com.rchila.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

import com.rchila.backend.model.Parametro;

public interface ParametroRepository extends JpaRepository<Parametro, Long> {
    Optional<Parametro> findById(Long id);

}
