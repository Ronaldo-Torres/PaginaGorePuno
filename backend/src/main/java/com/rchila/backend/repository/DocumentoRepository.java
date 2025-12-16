package com.rchila.backend.repository;

import com.rchila.backend.model.Documento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DocumentoRepository extends JpaRepository<Documento, Long>, JpaSpecificationExecutor<Documento> {

    List<Documento> findByTipoDocumentoId(Integer idDocumento);

    List<Documento> findByTipoDocumentoIdAndActivo(Integer idDocumento, Boolean activo);

    Page<Documento> findByTipoDocumentoIdAndAnioId(Integer idDocumento, Integer anioId, Pageable pageable);

    Page<Documento> findByTipoDocumentoId(Integer idDocumento, Pageable pageable);

    @Query("SELECT d FROM Documento d JOIN d.consejeros c WHERE c.id = :consejeroId")
    Page<Documento> findByConsejerosId(@Param("consejeroId") Long consejeroId, Pageable pageable);
}
