package com.rchila.backend.service;

import com.rchila.backend.model.Parametro;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;
import java.util.Optional;

public interface ParametrosService {

    Page<Parametro> findAllParametros(Pageable pageable);

    Optional<Parametro> findParametroById(Long id);

    Parametro saveParametro(Parametro parametro);

    Parametro updateParametro(Long id, MultipartFile file1, MultipartFile file2,
            Parametro parametro);

    void deleteParametro(Long id);
}
