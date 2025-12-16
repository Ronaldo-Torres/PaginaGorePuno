package com.rchila.backend.controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import com.rchila.backend.service.AnuncioService;
import com.rchila.backend.model.Anuncio;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;

@RestController
@RequestMapping("/v1/anuncios")
@AllArgsConstructor
public class AnucioController {

    private final AnuncioService anuncioService;
    private final ObjectMapper objectMapper;

    @GetMapping
    public Page<Anuncio> getAnuncios(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String orderBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false) String search) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction.toUpperCase());
        return anuncioService.getAnuncios(PageRequest.of(page, size, Sort.by(sortDirection, orderBy)), search);
    }

    @PostMapping
    public ResponseEntity<Anuncio> createAnuncio(
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestPart("anuncio") String anuncioJson) throws IOException {
        Anuncio anuncio = objectMapper.readValue(anuncioJson, Anuncio.class);
        return ResponseEntity.ok(anuncioService.createAnuncio(file, anuncio));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Anuncio> updateAnuncio(
            @PathVariable Long id,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestPart("anuncio") String anuncioJson) throws IOException {
        Anuncio anuncio = objectMapper.readValue(anuncioJson, Anuncio.class);
        return ResponseEntity.ok(anuncioService.updateAnuncio(id, file, anuncio));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnuncio(@PathVariable Long id) {
        anuncioService.deleteAnuncio(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Anuncio> getAnuncioById(@PathVariable Long id) {
        return ResponseEntity.ok(anuncioService.getAnuncioById(id));
    }

    @PutMapping("/{id}/activar")
    public ResponseEntity<Anuncio> activarAnuncio(@PathVariable Long id, @RequestBody Anuncio anuncio) {
        return ResponseEntity.ok(anuncioService.activarAnuncio(id, anuncio.getActivo()));
    }
}
