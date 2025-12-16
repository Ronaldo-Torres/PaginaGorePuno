package com.rchila.backend.controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.rchila.backend.service.PortadaService;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;

import com.rchila.backend.model.LinkInteres;
import com.rchila.backend.model.Portada;
import com.rchila.backend.model.Servicio;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

@RestController
@RequestMapping("/v1/portadas")
@AllArgsConstructor
public class PortadaController {

    private final PortadaService portadaService;

    @GetMapping
    public Page<Portada> getPortadas(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String orderBy,
            @RequestParam(defaultValue = "desc") String direction) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction.toUpperCase());
        return portadaService.getPortadas(PageRequest.of(page, size, Sort.by(sortDirection, orderBy)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Portada> getPortada(@PathVariable Long id) {
        return ResponseEntity.ok(portadaService.getPortada(id));
    }

    @PostMapping
    public ResponseEntity<Portada> createPortada(@RequestParam(value = "file", required = false) MultipartFile file, Portada portada) {
        return ResponseEntity.ok(portadaService.createPortada(file, portada));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Portada> updatePortada(@RequestParam(value = "file", required = false) MultipartFile file, @PathVariable Long id,
            Portada portada) {
        return ResponseEntity.ok(portadaService.updatePortada(file, id, portada));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePortada(@PathVariable Long id) {
        portadaService.deletePortada(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/activar")
    public Portada activarPortada(@PathVariable Long id, @RequestBody Portada portada) {
        return portadaService.activarPortada(id, portada.getActivo());
    }

    @GetMapping("/links")
    public Page<LinkInteres> getLinks(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String orderBy,
            @RequestParam(defaultValue = "asc") String direction) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction.toUpperCase());
        return portadaService.getLinks(PageRequest.of(page, size, Sort.by(sortDirection, orderBy)));
    }

    @PostMapping("/links")
    public ResponseEntity<LinkInteres> createLinks(@RequestParam(value = "file", required = false) MultipartFile file, LinkInteres linkInteres) {
        return ResponseEntity.ok(portadaService.createLinks(file, linkInteres));
    }

    @PutMapping("/links/{id}")
    public ResponseEntity<LinkInteres> updateLinks(@RequestParam(value = "file", required = false) MultipartFile file, @PathVariable Long id,
            LinkInteres linkInteres) {
        return ResponseEntity.ok(portadaService.updateLinks(file, id, linkInteres));
    }

    @DeleteMapping("/links/{id}")
    public ResponseEntity<Void> deleteLinks(@PathVariable Long id) {
        portadaService.deleteLinks(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/links/{id}")
    public ResponseEntity<LinkInteres> getLink(@PathVariable Long id) {
        return ResponseEntity.ok(portadaService.getLink(id));
    }

    @PutMapping("/links/{id}/activar")
    public LinkInteres activarLink(@PathVariable Long id, @RequestBody LinkInteres linkInteres) {
        return portadaService.activarLink(id, linkInteres.getActivo());
    }

    @GetMapping("/servicios")
    public Page<Servicio> getServicios(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String orderBy,
            @RequestParam(defaultValue = "asc") String direction) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction.toUpperCase());
        return portadaService.getServicios(PageRequest.of(page, size, Sort.by(sortDirection, orderBy)));
    }

    @PostMapping("/servicios")
    public ResponseEntity<Servicio> createServicio(@RequestParam(value = "file", required = false) MultipartFile file, Servicio servicio) {
        return ResponseEntity.ok(portadaService.createServicio(file, servicio));
    }

    @PutMapping("/servicios/{id}")
    public ResponseEntity<Servicio> updateServicio(@RequestParam(value = "file", required = false) MultipartFile file, @PathVariable Long id,
            Servicio servicio) {
        return ResponseEntity.ok(portadaService.updateServicio(file, id, servicio));
    }

    @DeleteMapping("/servicios/{id}")
    public ResponseEntity<Void> deleteServicio(@PathVariable Long id) {
        portadaService.deleteServicio(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/servicios/{id}/activar")
    public Servicio activarServicio(@PathVariable Long id, @RequestBody Servicio servicio) {
        return portadaService.activarServicio(id, servicio.getActivo());
    }


}