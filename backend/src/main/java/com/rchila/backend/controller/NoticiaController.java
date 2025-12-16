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

import com.rchila.backend.service.NoticiaService;
import com.rchila.backend.model.Noticia;
import com.rchila.backend.model.NoticiaImagen;
import org.springframework.data.domain.Sort;
import com.rchila.backend.model.dto.NoticiaDTO;

@RestController
@RequestMapping("/v1/noticias")
@AllArgsConstructor
public class NoticiaController {

    private final NoticiaService noticiaService;

    // crud noticias

    @GetMapping
    public ResponseEntity<Page<Noticia>> getNoticias(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "fechaPublicacion") String orderBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean destacadoAntigua,
            @RequestParam(required = false) Boolean destacado) {

        System.out.println("Parámetros recibidos en el controlador:");
        System.out.println("page: " + page);
        System.out.println("size: " + size);
        System.out.println("search: " + search);
        System.out.println("destacadoAntigua: " + destacadoAntigua);
        System.out.println("destacado: " + destacado);

        Sort.Direction sortDirection = Sort.Direction.fromString(direction.toUpperCase());
        Page<Noticia> noticias = noticiaService.getNoticias(
                PageRequest.of(page, size, Sort.by(sortDirection, orderBy)),
                search,
                destacadoAntigua,
                destacado);
        return ResponseEntity.ok(noticias);
    }

    @PostMapping
    public ResponseEntity<NoticiaDTO> crear(@RequestBody NoticiaDTO noticia) {
        NoticiaDTO nueva = noticiaService.createNoticia(noticia);
        return ResponseEntity.ok(nueva);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NoticiaDTO> updateNoticia(@PathVariable Long id, @RequestBody NoticiaDTO noticia) {
        return ResponseEntity.ok(noticiaService.updateNoticia(id, noticia));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNoticia(@PathVariable Long id) {
        noticiaService.deleteNoticia(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Noticia> getNoticiaById(@PathVariable Long id) {
        return ResponseEntity.ok(noticiaService.getNoticiaById(id));
    }

    // crud imagenes noticias

    @GetMapping("/{id}/imagenes")
    public Page<NoticiaImagen> getImagenesByNoticiaId(@PathVariable Long id, @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return noticiaService.findImagenesByNoticiaId(id, PageRequest.of(page, size));
    }

    @PostMapping("/imagenes")
    public ResponseEntity<NoticiaImagen> addImagenToNoticia(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("nombre") String nombre, @RequestParam("noticiaId") Long noticiaId) {
        return ResponseEntity.ok(noticiaService.addImagenToNoticia(file, nombre, noticiaId));
    }

    @DeleteMapping("/{id}/imagenes")
    public void deleteImagen(@PathVariable Long id) {
        noticiaService.deleteImagen(id);
    }

    // acciones adicionales noticia

    @PutMapping("/{id}/activar")
    public Noticia activarNoticia(@PathVariable Long id, @RequestBody Noticia noticia) {
        return noticiaService.activarNoticia(id, noticia.getActivo());
    }

    @PutMapping("/imagenes/{id}/activar")
    public ResponseEntity<NoticiaImagen> activarImagen(@PathVariable Long id, @RequestBody NoticiaImagen imagen) {
        return ResponseEntity.ok(noticiaService.activarImagen(id, imagen.getEsPrincipal()));
    }
}
