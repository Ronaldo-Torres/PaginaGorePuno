package com.rchila.backend.controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.rchila.backend.service.BoletinService;
import com.rchila.backend.model.Boletin;
import com.rchila.backend.model.BoletinImagen;
import org.springframework.data.domain.Sort;
import com.rchila.backend.model.dto.BoletinDTO;

@RestController
@RequestMapping("/v1/boletines")
@AllArgsConstructor
public class BoletinController {

    private final BoletinService boletinService;

    @GetMapping
    public Page<BoletinDTO> getBoletines(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String orderBy,
            @RequestParam(defaultValue = "desc") String direction, @RequestParam(required = false) String search) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction.toUpperCase());
        return boletinService.getBoletines(PageRequest.of(page, size, Sort.by(sortDirection, orderBy)), search);
    }

    @PostMapping
    public ResponseEntity<Boletin> createBoletin(@RequestParam(value = "file", required = false) MultipartFile file, Boletin boletin) {
        return ResponseEntity.ok(boletinService.createBoletin(file, boletin));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Boletin> updateBoletin(@PathVariable Long id, @RequestParam(value = "file", required = false) MultipartFile file,
            Boletin boletin) {
        return ResponseEntity.ok(boletinService.updateBoletin(id, file, boletin));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBoletin(@PathVariable Long id) {
        boletinService.deleteBoletin(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Boletin> getBoletinById(@PathVariable Long id) {
        return ResponseEntity.ok(boletinService.getBoletinById(id));
    }

    @GetMapping("/{id}/imagenes")
    public Page<BoletinImagen> getImagenesByBoletinId(@PathVariable Long id, @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return boletinService.findImagenesByBoletinId(id, PageRequest.of(page, size));
    }

    @PostMapping("/imagenes")
    public ResponseEntity<BoletinImagen> addImagenToBoletin(@RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("nombre") String nombre, @RequestParam("boletinId") Long boletinId) {
        return ResponseEntity.ok(boletinService.addImagenToBoletin(file, nombre, boletinId));
    }

    @DeleteMapping("/{id}/imagenes")
    public void deleteImagen(@PathVariable Long id) {
        boletinService.deleteImagen(id);
    }

    @PutMapping("/{id}/activar")
    public Boletin activarBoletin(@PathVariable Long id, @RequestBody Boletin boletin) {
        return boletinService.activarBoletin(id, boletin.getActivo());
    }

    // cambiar de estado la imagen de un boletin
    @PutMapping("/imagenes/{id}/activar")
    public ResponseEntity<BoletinImagen> activarImagen(@PathVariable Long id, @RequestBody BoletinImagen imagen) {
        return ResponseEntity.ok(boletinService.activarImagen(id, imagen.getEsPrincipal()));
    }
}
