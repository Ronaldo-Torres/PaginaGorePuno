package com.rchila.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.rchila.backend.model.Boletin;
import com.rchila.backend.model.dto.BoletinDTO;

public interface BoletinRepository extends JpaRepository<Boletin, Long>, JpaSpecificationExecutor<Boletin> {
        @Query("SELECT new com.rchila.backend.model.dto.BoletinDTO(b.id, b.titulo, b.contenido, b.fechaPublicacion, b.categoria, b.url, b.activo, b.urlDocumento, i.url) "
                        +
                        "FROM Boletin b " +
                        "LEFT JOIN b.imagenes i " +
                        "WHERE b.activo = true AND i.esPrincipal = true OR i IS NULL " +
                        "ORDER BY b.fechaPublicacion DESC")
        List<BoletinDTO> findAllBoletinesConImagenPrincipal();

        @Query("SELECT new com.rchila.backend.model.dto.BoletinDTO(b.id, b.titulo, b.contenido, b.fechaPublicacion, b.categoria, b.url, b.activo, b.urlDocumento, null) "
                        + "FROM Boletin b")
        Page<BoletinDTO> findAllBoletines(Pageable pageable);
}
