package com.rchila.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.rchila.backend.model.ConsejeroComision;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ConsejeroComisionRepository extends JpaRepository<ConsejeroComision, Long> {

    List<ConsejeroComision> findByComisionId(Long id);

    Page<ConsejeroComision> findByComisionId(Long id, Pageable pageable);

    List<ConsejeroComision> findByConsejeroId(Long id);
}
