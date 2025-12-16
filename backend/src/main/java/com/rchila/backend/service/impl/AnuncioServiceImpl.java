package com.rchila.backend.service.impl;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.rchila.backend.model.Anuncio;
import com.rchila.backend.repository.AnuncioRepository;
import com.rchila.backend.service.AnuncioService;
import com.rchila.backend.service.StorageService;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;

@Service
@AllArgsConstructor
public class AnuncioServiceImpl implements AnuncioService {

    private final StorageService storageService;
    private final AnuncioRepository anuncioRepository;

    @Override
    public Page<Anuncio> getAnuncios(Pageable pageable, String search) {
        if (search == null || search.isEmpty()) {
            return anuncioRepository.findAll(pageable);
        }

        Specification<Anuncio> specification = (root, query, cb) -> {
            String likeSearch = "%" + search.toLowerCase() + "%";

            Predicate tituloPredicate = cb.like(cb.lower(root.get("titulo")), likeSearch);
            Predicate descripcionPredicate = cb.like(cb.lower(root.get("descripcion")), likeSearch);

            return cb.or(tituloPredicate, descripcionPredicate);
        };

        return anuncioRepository.findAll(specification, pageable);
    }

    @Override
    public Anuncio createAnuncio(MultipartFile file, Anuncio anuncio) {
        String imageUrl = storageService.guardarArchivo(file, null, null, "anuncios");
        anuncio.setUrl(imageUrl);
        return anuncioRepository.save(anuncio);
    }

    @Override
    public Anuncio updateAnuncio(Long id, MultipartFile file, Anuncio anuncio) {
        return anuncioRepository.findById(id)
                .map(existingAnuncio -> {
                    if (file != null) {
                        String imageUrl = storageService.guardarArchivo(file, null, null, "anuncios");
                        if (existingAnuncio.getUrl() != null) {
                            storageService.eliminarArchivo(existingAnuncio.getUrl());
                        }
                        existingAnuncio.setUrl(imageUrl);
                    }

                    existingAnuncio.setTitulo(anuncio.getTitulo());
                    existingAnuncio.setDescripcion(anuncio.getDescripcion());
                    existingAnuncio.setFecha(anuncio.getFecha());

                    return anuncioRepository.save(existingAnuncio);
                })
                .orElseThrow(() -> new RuntimeException("Anuncio no encontrado con id: " + id));
    }

    @Override
    public void deleteAnuncio(Long id) {
        anuncioRepository.deleteById(id);
    }

    @Override
    public Anuncio getAnuncioById(Long id) {
        return anuncioRepository.findById(id).orElse(null);
    }

    @Override
    public Anuncio activarAnuncio(Long id, Boolean activo) {
        return anuncioRepository.findById(id).map(existingAnuncio -> {
            existingAnuncio.setActivo(activo);
            return anuncioRepository.save(existingAnuncio);
        }).orElse(null);
    }
}