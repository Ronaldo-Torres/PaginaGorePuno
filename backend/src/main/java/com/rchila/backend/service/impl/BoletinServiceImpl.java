package com.rchila.backend.service.impl;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.rchila.backend.mapper.BoletinMapper;
import com.rchila.backend.model.Boletin;
import com.rchila.backend.repository.BoletinRepository;

import java.util.Optional;

import com.rchila.backend.service.BoletinService;
import com.rchila.backend.model.BoletinImagen;
import com.rchila.backend.service.StorageService;
import com.rchila.backend.repository.BoletinImagenRepository;
import com.rchila.backend.model.dto.BoletinDTO;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;

@Service
@AllArgsConstructor
public class BoletinServiceImpl implements BoletinService {

    private final StorageService storageService;
    private final BoletinImagenRepository boletinImagenRepository;
    private final BoletinRepository boletinRepository;
    private final BoletinMapper boletinMapper;

    @Override
    public Page<BoletinDTO> getBoletines(Pageable pageable, String search) {
        if (search == null || search.isEmpty()) {
            return boletinRepository.findAllBoletines(pageable);
        }

        Specification<Boletin> specification = (root, query, cb) -> {
            String likeSearch = "%" + search.toLowerCase() + "%";

            Predicate tituloPredicate = cb.like(cb.lower(root.get("titulo")), likeSearch);
            Predicate categoriaPredicate = cb.like(cb.lower(root.get("contenido")), likeSearch);

            return cb.or(tituloPredicate, categoriaPredicate);
        };

        return boletinRepository.findAll(specification, pageable).map(boletinMapper::toDto);
    }

    @Override
    public Boletin createBoletin(MultipartFile file, Boletin boletin) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Por favor, selecciona un archivo para subir.");
        }
        String fileUrl = storageService.guardarArchivo(file, "", "", "boletines");
        // fecha de publicacion
        boletin.setUrlDocumento(fileUrl);
        return boletinRepository.save(boletin);
    }

    @Override
    public Boletin updateBoletin(Long id, MultipartFile file, Boletin boletin) {
        try {
            Boletin boletinExistente = boletinRepository.findById(id).orElse(null);
            if (boletinExistente == null) {
                throw new RuntimeException("El boletin con ID " + id + " no existe.");
            }

            if (file != null && !file.isEmpty()) {
                storageService.eliminarArchivo(boletinExistente.getUrlDocumento());
                String fileUrl = storageService.guardarArchivo(file, "", "", "boletines");
                boletinExistente.setUrlDocumento(fileUrl);
            }

            Optional.ofNullable(boletin.getTitulo()).filter(titulo -> !titulo.isEmpty())
                    .ifPresent(boletinExistente::setTitulo);
            Optional.ofNullable(boletin.getContenido()).filter(contenido -> !contenido.isEmpty())
                    .ifPresent(boletinExistente::setContenido);
            Optional.ofNullable(boletin.getCategoria()).filter(categoria -> !categoria.isEmpty())
                    .ifPresent(boletinExistente::setCategoria);
            Optional.ofNullable(boletin.getActivo()).ifPresent(boletinExistente::setActivo);
            Optional.ofNullable(boletin.getUrlDocumento()).filter(urlDocumento -> !urlDocumento.isEmpty())
                    .ifPresent(boletinExistente::setUrlDocumento);
            Optional.ofNullable(boletin.getFechaPublicacion()).filter(fechaPublicacion -> fechaPublicacion != null)
                    .ifPresent(boletinExistente::setFechaPublicacion);

            return boletinRepository.save(boletinExistente);
        } catch (Exception e) {
            throw new RuntimeException("Error al actualizar el boletin", e);
        }
    }

    @Override
    public void deleteBoletin(Long id) {
        boletinRepository.deleteById(id);
    }

    @Override
    public Boletin getBoletinById(Long id) {
        return boletinRepository.findById(id).orElse(null);
    }

    @Override
    public Page<BoletinImagen> findImagenesByBoletinId(Long id, Pageable pageable) {
        return boletinImagenRepository.findByBoletinId(id, pageable);
    }

    @Override
    public BoletinImagen addImagenToBoletin(MultipartFile file, String nombre, Long boletinId) {

        if (file.isEmpty()) {
            throw new IllegalArgumentException("Por favor, selecciona un archivo para subir.");
        }

        String fileUrl = storageService.guardarArchivo(file, "", "", "boletines");
        BoletinImagen boletinImagen = new BoletinImagen();
        boletinImagen.setDescripcion(nombre);
        boletinImagen.setUrl(fileUrl);
        boletinImagen.setBoletin(boletinRepository.findById(boletinId).orElse(null));
        return boletinImagenRepository.save(boletinImagen);
    }

    @Override
    public void deleteImagen(Long id) {
        BoletinImagen imagenExistente = boletinImagenRepository.findById(id).orElse(null);
        if (imagenExistente == null) {
            throw new RuntimeException("Imagen no encontrada");
        }
        storageService.eliminarArchivo(imagenExistente.getUrl());
        boletinImagenRepository.delete(imagenExistente);
    }

    @Override
    public Boletin activarBoletin(Long id, Boolean activo) {
        return boletinRepository.findById(id).map(boletin -> {
            boletin.setActivo(activo);
            return boletinRepository.save(boletin);
        }).orElse(null);
    }

    @Override
    public BoletinImagen activarImagen(Long id, Boolean esPrincipal) {
        return boletinImagenRepository.findById(id).map(imagen -> {
            imagen.setEsPrincipal(esPrincipal);
            return boletinImagenRepository.save(imagen);
        }).orElse(null);
    }

}
