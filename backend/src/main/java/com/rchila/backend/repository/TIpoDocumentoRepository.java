package com.rchila.backend.repository;

import com.rchila.backend.model.TipoDocumento;
import com.rchila.backend.model.dto.TipoDocumentoDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TipoDocumentoRepository extends JpaRepository<TipoDocumento, Long> {
    List<TipoDocumento> findByAnioId(Integer anioId);

    List<TipoDocumento> findByActivoAndGrupo(Boolean activo, String grupo);

    @Query("SELECT new com.rchila.backend.model.dto.TipoDocumentoDTO(t.id, t.codigo) FROM TipoDocumento t WHERE t.id = :id")
    TipoDocumentoDTO findTipoDocumentoDTOById(Long id);

    List<TipoDocumento> findByGrupo(String grupo);
}
