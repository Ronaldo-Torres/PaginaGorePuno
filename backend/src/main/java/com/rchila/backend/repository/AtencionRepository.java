package com.rchila.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.rchila.backend.model.Atencion;

public interface AtencionRepository extends JpaRepository<Atencion, Long>, JpaSpecificationExecutor<Atencion> {

}
