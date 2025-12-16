package com.rchila.backend.sgdintegracion.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.rchila.backend.sgdintegracion.service.DocumentoSgdService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.List;

@RestController
@RequestMapping("/sgd/documentos")
@AllArgsConstructor
public class DocumentoSgdController {

    private final DocumentoSgdService documentoService;

    @GetMapping("/{emision}")
    public ResponseEntity<Object> getDocumento(@PathVariable String emision) {
        return ResponseEntity.ok(documentoService.getDocumento(emision));
    }

    @PostMapping("/all")
    public ResponseEntity<Object> getAllDocumentos(
        @RequestParam String codigoOficina,
        @RequestParam String tipoDocumento,
        @RequestParam String anio,
        @RequestBody List<String> emisiones) {
        return ResponseEntity.ok(documentoService.getAllDocumentos(codigoOficina, tipoDocumento, anio, emisiones));
    }

    @PostMapping("/crp")
    public ResponseEntity<Object> getDocumentosByTipo(
            @RequestParam String codigoOficina,
            @RequestParam String tipoDocumento,
            @RequestParam String anio,
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam String search) {
        return ResponseEntity.ok(documentoService.getDocumentosByTipo(codigoOficina, tipoDocumento, anio, page, size, search));
    }


}
