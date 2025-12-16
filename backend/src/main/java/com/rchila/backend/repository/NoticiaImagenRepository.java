package com.rchila.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.rchila.backend.model.NoticiaImagen;

public interface NoticiaImagenRepository extends JpaRepository<NoticiaImagen, Long> {

    // que se diferente a es principal se adiferente true
    /*
     * @Query("SELECT i FROM NoticiaImagen i WHERE i.noticia.id = :id AND (i.esPrincipal = false OR i.esPrincipal IS NULL)"
     * )
     */
    Page<NoticiaImagen> findByNoticiaId(Long id, Pageable pageable);
}
