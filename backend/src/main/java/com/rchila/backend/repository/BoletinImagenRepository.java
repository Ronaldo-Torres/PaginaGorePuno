package com.rchila.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.rchila.backend.model.BoletinImagen;
import java.util.List;

public interface BoletinImagenRepository extends JpaRepository<BoletinImagen, Long> {

    Page<BoletinImagen> findByBoletinId(Long id, Pageable pageable);

    List<BoletinImagen> findByBoletinIdAndEsPrincipal(Long id, Boolean esPrincipal);
}
