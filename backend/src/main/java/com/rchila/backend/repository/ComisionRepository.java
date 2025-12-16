package com.rchila.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.rchila.backend.model.Comision;

public interface ComisionRepository extends JpaRepository<Comision, Long>, JpaSpecificationExecutor<Comision> {
    List<Comision> findByActivo(Boolean activo);

    @Query("SELECT c FROM Comision c WHERE c.activo = true")
    List<Comision> findAllComisiones();
}
