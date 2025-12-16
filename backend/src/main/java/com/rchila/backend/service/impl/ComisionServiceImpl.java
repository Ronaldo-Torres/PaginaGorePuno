package com.rchila.backend.service.impl;

import java.util.List;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.rchila.backend.model.Comision;
import com.rchila.backend.repository.ComisionRepository;
import com.rchila.backend.service.ComisionService;
import com.rchila.backend.model.Actividad;
import com.rchila.backend.repository.ActividadRepository;
import com.rchila.backend.model.ConsejeroComision;
import com.rchila.backend.repository.ConsejeroComisionRepository;
import com.rchila.backend.model.ActividadImagen;
import com.rchila.backend.repository.ActividadImagenRepository;
import org.springframework.web.multipart.MultipartFile;
import com.rchila.backend.service.StorageService;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;

@Service
@AllArgsConstructor
public class ComisionServiceImpl implements ComisionService {

    private final ComisionRepository comisionRepository;
    private final ActividadRepository actividadRepository;
    private final ConsejeroComisionRepository consejeroComisionRepository;
    private final StorageService storageService;
    private final ActividadImagenRepository actividadImagenRepository;

    @Override
    public void deleteComision(Long id) {
        comisionRepository.deleteById(id);
    }

    @Override
    public Page<Comision> findAllComisiones(Pageable pageable, String search) {
        if (search == null || search.isEmpty()) {
            return comisionRepository.findAll(pageable);
        }

        Specification<Comision> specification = (root, query, cb) -> {
            String likeSearch = "%" + search.toLowerCase() + "%";

            Predicate nombrePredicate = cb.like(cb.lower(root.get("nombre")), likeSearch);
            Predicate descripcionPredicate = cb.like(cb.lower(root.get("descripcion")), likeSearch);

            query.orderBy(cb.desc(root.get("id")));
            return cb.and(nombrePredicate, descripcionPredicate);
        };

        return comisionRepository.findAll(specification, pageable);
    }

    @Override
    public Comision findComisionById(Long id) {
        return comisionRepository.findById(id).orElse(null);
    }

    @Override
    public Comision saveComision(Comision comision) {
        return comisionRepository.save(comision);
    }

    @Override
    public Comision updateComision(Long id, Comision comision) {
        return comisionRepository.findById(id).map(comisionExistente -> {
            comisionExistente.setNombre(comision.getNombre());
            comisionExistente.setDescripcion(comision.getDescripcion());
            comisionExistente.setFechaInicio(comision.getFechaInicio());
            comisionExistente.setFechaFin(comision.getFechaFin());
            comisionExistente.setActivo(comision.getActivo());
            return comisionRepository.save(comisionExistente);
        }).orElse(null);
    }

    @Override
    public Comision activarComision(Long id, Boolean activo) {
        return comisionRepository.findById(id).map(comision -> {
            System.out.println("comision: " + activo);
            comision.setActivo(activo);
            System.out.println("comisionget: " + comision.getActivo());
            return comisionRepository.save(comision);
        }).orElse(null);
    }

    // Actividades
    @Override
    public Page<Actividad> findActividadesByComisionId(Long comisionId, Pageable pageable) {
        return actividadRepository.findByComisionId(comisionId, pageable);
    }

    @Override
    public Actividad saveActividad(Actividad actividad) {
        return actividadRepository.save(actividad);
    }

    @Override
    public Actividad updateActividad(Long id, Actividad actividad) {
        return actividadRepository.save(actividad);
    }

    @Override
    public void deleteActividad(Long id) {
        actividadRepository.deleteById(id);
    }

    @Override
    public Actividad activarActividad(Long id, Boolean activo) {
        return actividadRepository.findById(id).map(actividad -> {
            actividad.setActivo(activo);
            return actividadRepository.save(actividad);
        }).orElse(null);
    }

    @Override
    public Page<ActividadImagen> findImagenesByActividadId(Long actividadId, Pageable pageable) {
        return actividadImagenRepository.findByActividadId(actividadId, pageable);
    }

    @Override
    public void deleteImagen(Long id) {
        ActividadImagen actividadImagen = actividadImagenRepository.findById(id).orElse(null);
        if (actividadImagen != null) {
            storageService.eliminarArchivo(actividadImagen.getUrl());
            actividadImagenRepository.deleteById(id);
        }
    }

    @Override
    public ActividadImagen saveImagenActividad(MultipartFile file, String nombre, Long actividadId) {

        if (file.isEmpty()) {
            throw new IllegalArgumentException("Por favor, selecciona un archivo para subir.");
        }

        String fileUrl = storageService.guardarArchivo(file, "", "", "actividades");
        ActividadImagen actividadImagen = new ActividadImagen();
        actividadImagen.setDescripcion(nombre);
        actividadImagen.setUrl(fileUrl);
        actividadImagen.setActividad(actividadRepository.findById(actividadId).orElse(null));
        return actividadImagenRepository.save(actividadImagen);

    }

    // ConsejeroComision
    @Override
    public ConsejeroComision createConsejeroComision(ConsejeroComision consejeroComision) {
        return consejeroComisionRepository.save(consejeroComision);
    }

    @Override
    public Page<ConsejeroComision> findConsejerosByComisionId(Long comisionId, Pageable pageable) {
        return consejeroComisionRepository.findByComisionId(comisionId, pageable);
    }

    @Override
    public void deleteConsejeroComision(Long id) {
        consejeroComisionRepository.deleteById(id);
    }

    @Override
    public ConsejeroComision activarConsejeroComision(Long id, Boolean activo) {
        return consejeroComisionRepository.findById(id).map(consejeroComision -> {
            consejeroComision.setActivo(activo);
            return consejeroComisionRepository.save(consejeroComision);
        }).orElse(null);
    }

    @Override
    public List<Comision> findAllComisiones() {
        return comisionRepository.findAllComisiones();
    }

}
