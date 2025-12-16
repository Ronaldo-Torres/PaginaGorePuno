package com.rchila.backend.controller;

import com.rchila.backend.model.TipoDocumento;
import com.rchila.backend.repository.TipoDocumentoRepository;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/v1/tipo-documentos")
@AllArgsConstructor
public class TipoDocumentoController {

    private final TipoDocumentoRepository tipoDocumentoRepository;

    @GetMapping
    public List<TipoDocumento> getAllTipoDocumento(@RequestParam String grupo) {
        return tipoDocumentoRepository.findByGrupo(grupo);
    }

}
