package com.rchila.backend.controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.ResponseEntity;
import com.rchila.backend.service.AtencionService;
import com.rchila.backend.model.Atencion;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/v1/atenciones")
@AllArgsConstructor
public class AtencionController {

    private final AtencionService atencionService;

    @GetMapping
    public Page<Atencion> getAtenciones(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String orderBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false) String search) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction.toUpperCase());
        return atencionService.getAtenciones(PageRequest.of(page, size, Sort.by(sortDirection, orderBy)), search);
    }

    @PostMapping
    public ResponseEntity<Atencion> createAtencion(@RequestParam(value = "file", required = false) MultipartFile imagen,
            Atencion atencion) {
        return ResponseEntity.ok(atencionService.createAtencion(imagen, atencion));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Atencion> updateAtencion(@PathVariable Long id,
            @RequestParam(value = "file", required = false) MultipartFile imagen,
            Atencion atencion) {
        return ResponseEntity.ok(atencionService.updateAtencion(id, imagen, atencion));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAtencion(@PathVariable Long id) {
        atencionService.deleteAtencion(id);
        return ResponseEntity.noContent().build();
    }

}
