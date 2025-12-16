package com.rchila.backend.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.query.Param;

import com.rchila.backend.model.dto.NoticiaDTO;

import com.rchila.backend.model.Noticia;
import org.springframework.data.domain.Page;

public interface NoticiaRepository extends JpaRepository<Noticia, Long>, JpaSpecificationExecutor<Noticia> {

        @Query("SELECT n FROM Noticia n WHERE n.activo = true ORDER BY n.id DESC")
        Page<Noticia> findAllNoticiasDTO(Pageable pageable);

        @Query("SELECT new com.rchila.backend.model.dto.NoticiaDTO(n.id, n.gorro, n.titulo, n.bajada, n.introduccion, n.conclusion, n.contenido, n.fechaPublicacion, n.nota, n.destacado, n.destacadoAntigua, n.url, n.activo, i.url, n.autor) "
                        + "FROM Noticia n "
                        + "LEFT JOIN n.imagenes i ON i.esPrincipal = true "
                        + "WHERE n.destacado = true and n.activo = true "
                        + "ORDER BY n.fechaPublicacion DESC")
        List<NoticiaDTO> findDestacadas();

        @Query("SELECT new com.rchila.backend.model.dto.NoticiaDTO(n.id, n.gorro, n.titulo, n.bajada, n.introduccion, n.conclusion, n.contenido, n.fechaPublicacion, n.nota, n.destacado, n.destacadoAntigua, n.url, n.activo, i.url, n.autor) "
                        + "FROM Noticia n "
                        + "LEFT JOIN n.imagenes i ON i.esPrincipal = true "
                        + "WHERE n.destacadoAntigua = true and n.activo = true "
                        + "ORDER BY n.fechaPublicacion DESC")
        List<NoticiaDTO> findDestacadasAntiguas();

        @Query("SELECT new com.rchila.backend.model.dto.NoticiaDTO(n.id, n.gorro, n.titulo, n.bajada, n.introduccion, n.conclusion, n.contenido, n.fechaPublicacion, n.nota, n.destacado, n.destacadoAntigua, n.url, n.activo, i.url, n.autor) "
                        + "FROM Noticia n "
                        + "LEFT JOIN n.imagenes i ON i.esPrincipal = true "
                        + "WHERE (n.destacado = false OR n.destacado IS NULL) AND (n.destacadoAntigua = false OR n.destacadoAntigua IS NULL) AND n.activo = true "
                        + "ORDER BY n.fechaPublicacion DESC ")
        List<NoticiaDTO> findNormales();

        @Query("SELECT new com.rchila.backend.model.dto.NoticiaDTO(n.id, n.gorro, n.titulo, n.bajada, n.introduccion, n.conclusion, n.contenido, n.fechaPublicacion, n.nota, n.destacado, n.destacadoAntigua, n.url, n.activo, i.url, n.autor) "
                        + "FROM Noticia n "
                        + "LEFT JOIN n.imagenes i ON i.esPrincipal = true "
                        + "WHERE n.destacado = true and n.activo = true "
                        + "ORDER BY n.fechaPublicacion DESC")
        List<NoticiaDTO> findByDestacado();

        @Query("SELECT new com.rchila.backend.model.dto.NoticiaDTO(n.id, n.gorro, n.titulo, n.bajada, n.introduccion, n.conclusion, n.contenido, n.fechaPublicacion, n.nota, n.destacado, n.destacadoAntigua, n.url, n.activo, i.url, n.autor) "
                        + "FROM Noticia n "
                        + "LEFT JOIN n.imagenes i ON i.esPrincipal = true "
                        + "WHERE n.id = :id")
        NoticiaDTO findDTOById(Long id);

        @Query("SELECT new com.rchila.backend.model.dto.NoticiaDTO(n.id, n.gorro, n.titulo, n.bajada, n.introduccion, n.conclusion, n.contenido, n.fechaPublicacion, n.nota, n.destacado, n.destacadoAntigua, n.url, n.activo, i.url, n.autor) "
                        + "FROM Noticia n "
                        + "LEFT JOIN n.imagenes i ON i.esPrincipal = true "
                        + "WHERE n.activo = true " +
                        "AND (:tags IS NULL OR :tags IN elements(n.tags)) " +
                        "ORDER BY n.fechaPublicacion DESC")
        Page<NoticiaDTO> findByTags(@Param("tags") String tags, Pageable pageable);

        @Query("SELECT n FROM Noticia n JOIN n.consejeros c WHERE c.id = :consejeroId")
        List<Noticia> findByConsejeroId(@Param("consejeroId") Long consejeroId);

        @Query("SELECT n FROM Noticia n JOIN n.comisiones c WHERE c.id = :comisionId")
        List<Noticia> findByComisionId(@Param("comisionId") Long comisionId);
}
