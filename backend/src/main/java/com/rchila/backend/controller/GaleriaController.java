package com.rchila.backend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rchila.backend.model.ConsejeroGaleria;
import java.util.UUID;
import com.rchila.backend.service.GaleriaService;
import lombok.AllArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/v1/galeria")
    @AllArgsConstructor
public class GaleriaController {

    private final GaleriaService galeriaService;

    @GetMapping("/{id}/galeria-consejeros")
    public ResponseEntity<Page<ConsejeroGaleria>> getGaleriaConsejeros(@PathVariable Long id, @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String orderBy,
            @RequestParam(defaultValue = "desc") String direction) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction.toUpperCase());
        return ResponseEntity.ok(galeriaService.getGaleriaConsejeros(id, PageRequest.of(page, size, Sort.by(sortDirection, orderBy))));
    }

    @PostMapping("/{id}/galeria-consejeros")
    public ResponseEntity<ConsejeroGaleria> createGaleriaConsejero(@PathVariable Long id, @RequestParam(value = "file") MultipartFile file,
            @RequestParam(value = "descripcion" ) String descripcion,
            @RequestParam(value = "consejeroId") Long consejeroId,
            @RequestParam(value = "nombre" , required = false) String nombre
            ) {

        return ResponseEntity.ok(galeriaService.createGaleriaConsejero(id, file, descripcion, consejeroId, nombre));
    }

    @PutMapping("/{id}/galeria-consejeros")
    public ResponseEntity<ConsejeroGaleria> updateGaleriaConsejero(@PathVariable UUID id, @RequestParam(value = "file" , required = false) MultipartFile file,
            @RequestParam(value = "descripcion" , required = false) String descripcion,
            @RequestParam(value = "consejeroId" , required = false) Long consejeroId,
            @RequestParam(value = "nombre" , required = false) String nombre
            ) {
        return ResponseEntity.ok(galeriaService.updateGaleriaConsejero(id, file, descripcion, consejeroId, nombre));
    }

    @DeleteMapping("/{id}/galeria-consejeros")
    public ResponseEntity<Void> deleteGaleriaConsejero(@PathVariable UUID id) {
        galeriaService.deleteGaleriaConsejero(id);
        return ResponseEntity.noContent().build();
    }

}
