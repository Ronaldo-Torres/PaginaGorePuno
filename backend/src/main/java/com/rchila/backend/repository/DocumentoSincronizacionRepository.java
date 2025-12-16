package com.rchila.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rchila.backend.model.DocumentoSincronizacion;

public interface DocumentoSincronizacionRepository extends JpaRepository<DocumentoSincronizacion, Long> {
    DocumentoSincronizacion findByCodigoEmision(String codigoEmision);
}
