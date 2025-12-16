package com.rchila.backend.service.impl;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;

import com.rchila.backend.model.Atencion;
import com.rchila.backend.repository.AtencionRepository;
import com.rchila.backend.service.AtencionService;
import com.rchila.backend.service.StorageService;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AtencionServiceImpl implements AtencionService {

    private final AtencionRepository atencionRepository;
    private final StorageService storageService;

    @Override
    public Page<Atencion> getAtenciones(Pageable pageable, String search) {
        if (search == null || search.isEmpty()) {
            return atencionRepository.findAll(pageable);
        }

        Specification<Atencion> specification = (root, query, cb) -> {
            String likeSearch = "%" + search.toLowerCase() + "%";

            Predicate nombrePredicate = cb.like(cb.lower(root.get("nombre")), likeSearch);
            Predicate descripcionPredicate = cb.like(cb.lower(root.get("descripcion")), likeSearch);
            Predicate emailPredicate = cb.like(cb.lower(root.get("email")), likeSearch);
            Predicate telefonoPredicate = cb.like(cb.lower(root.get("telefono")), likeSearch);

            // Combinamos todos los predicados con OR
            return cb.or(nombrePredicate, descripcionPredicate, emailPredicate, telefonoPredicate);
        };

        return atencionRepository.findAll(specification, pageable);
    }

    @Override
    public Atencion getAtencionById(Long id) {
        return atencionRepository.findById(id).orElse(null);
    }

    @Override
    public Atencion createAtencion(MultipartFile imagen, Atencion atencion) {
        if (imagen != null) {
            String imagenUrl = storageService.guardarArchivo(imagen, null, null, "atenciones");
            atencion.setImagen(imagenUrl);
        }
        return atencionRepository.save(atencion);
    }

    @Override
    public Atencion updateAtencion(Long id, MultipartFile imagen, Atencion atencion) {
        Atencion existingAtencion = atencionRepository.findById(id).orElse(null);

        if (existingAtencion == null) {
            throw new RuntimeException("Atencion no encontrada");
        }

        if (imagen != null) {
            if (existingAtencion.getImagen() != null) {
                storageService.eliminarArchivo(existingAtencion.getImagen());
            }
            String imagenUrl = storageService.guardarArchivo(imagen, null, null, "atenciones");
            existingAtencion.setImagen(imagenUrl);
        }

        existingAtencion.setNombre(atencion.getNombre());
        existingAtencion.setEmail(atencion.getEmail());
        existingAtencion.setTelefono(atencion.getTelefono());
        existingAtencion.setEstado(atencion.getEstado());
        existingAtencion.setDescripcion(atencion.getDescripcion());

        return atencionRepository.save(existingAtencion);
    }

    @Override
    public void deleteAtencion(Long id) {
        atencionRepository.deleteById(id);
    }
}
