package com.rchila.backend.service.impl;

import org.springframework.stereotype.Service;
import com.rchila.backend.model.TipoDocumento;
import com.rchila.backend.repository.TipoDocumentoRepository;
import com.rchila.backend.service.TipoDocumentoService;
import java.util.List;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TipoDocumentoServiceImpl implements TipoDocumentoService {

    private final TipoDocumentoRepository tipoDocumentoRepository;

    @Override
    public List<TipoDocumento> getTiposDocumento() {
        return tipoDocumentoRepository.findAll();
    }
}
