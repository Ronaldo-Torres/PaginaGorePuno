package com.rchila.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.rchila.backend.model.ConsejeroGaleria;

public interface ConsejeroGaleriaRepository extends JpaRepository<ConsejeroGaleria, UUID> {

    Page<ConsejeroGaleria> findByConsejeroId(Long id, Pageable pageable);
    List<ConsejeroGaleria> findByConsejeroId(Long id);
}
