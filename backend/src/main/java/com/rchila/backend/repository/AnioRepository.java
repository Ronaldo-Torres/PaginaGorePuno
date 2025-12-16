package com.rchila.backend.repository;

import com.rchila.backend.model.Anio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnioRepository extends JpaRepository<Anio, Long> {

    Anio findByAnio(String anio);
}
