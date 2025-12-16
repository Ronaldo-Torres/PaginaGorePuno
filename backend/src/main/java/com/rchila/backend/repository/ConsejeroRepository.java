package com.rchila.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.rchila.backend.model.Consejero;

public interface ConsejeroRepository extends JpaRepository<Consejero, Long>, JpaSpecificationExecutor<Consejero> {
    List<Consejero> findByActivoOrderByProvinciaAsc(Boolean activo);

    Consejero findByIdAndActivo(Long id, Boolean activo);
}
