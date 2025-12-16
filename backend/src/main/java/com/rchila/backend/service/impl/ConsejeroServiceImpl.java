package com.rchila.backend.service.impl;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.rchila.backend.model.Consejero;
import com.rchila.backend.repository.ConsejeroRepository;
import com.rchila.backend.service.ConsejeroService;
import com.rchila.backend.service.StorageService;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@Service
@AllArgsConstructor
public class ConsejeroServiceImpl implements ConsejeroService {

    private final StorageService storageService;
    private final ConsejeroRepository consejeroRepository;

    @Override
    public void deleteConsejero(Long id) {
        try {
            Consejero consejeroExistente = consejeroRepository.findById(id).orElse(null);

            if (consejeroExistente != null) {
                storageService.eliminarArchivo(consejeroExistente.getUrl_imagen());
                consejeroRepository.deleteById(id);
            } else {
                throw new RuntimeException("El consejero con ID " + id + " no existe.");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error al eliminar el consejero.", e);
        }
    }

    @Override
    public Page<Consejero> findAllConsejeros(Pageable pageable, String search) {
        if (search == null || search.isBlank()) {
            return consejeroRepository.findAll(pageable);
        }

        Specification<Consejero> specification = (root, query, cb) -> {
            String likeSearch = "%" + search.toLowerCase() + "%";

            Predicate nombrePredicate = cb.like(cb.lower(root.get("nombre")), likeSearch);
            Predicate apellidoPredicate = cb.like(cb.lower(root.get("apellido")), likeSearch);
            Predicate cargoPredicate = cb.like(cb.lower(root.get("cargo")), likeSearch);
            Predicate dniPredicate = cb.like(cb.lower(root.get("dni")), likeSearch);

            return cb.or(nombrePredicate, apellidoPredicate, cargoPredicate, dniPredicate);
        };

        return consejeroRepository.findAll(specification, pageable);
    }

    @Override
    public Consejero findConsejeroById(Long id) {
        return consejeroRepository.findById(id).orElse(null);
    }

    @Override
    public Consejero saveConsejero(MultipartFile file, MultipartFile documento, Consejero consejero) {
        String fileUrl = storageService.guardarArchivo(file, "", "", "fotos");
        consejero.setUrl_imagen(fileUrl);
        String documentoUrl = storageService.guardarArchivo(documento, "", "", "documentos");
        consejero.setDocumento(documentoUrl);
        return consejeroRepository.save(consejero);
    }

    @Override
    public Consejero updateConsejero(Long id, MultipartFile file, MultipartFile documento, Consejero consejero) {
        try {
            Consejero consejeroExistente = consejeroRepository.findById(id).orElse(null);
            if (consejeroExistente == null) {
                throw new RuntimeException("El consejero con ID " + id + " no existe.");
            }

            if (documento != null && !documento.isEmpty()) {
                storageService.eliminarArchivo(consejeroExistente.getDocumento());
                String documentoUrl = storageService.guardarArchivo(documento, "", "", "documentos");
                consejeroExistente.setDocumento(documentoUrl);
            }

            if (file != null && !file.isEmpty()) {
                storageService.eliminarArchivo(consejeroExistente.getUrl_imagen());
                String fileUrl = storageService.guardarArchivo(file, "", "", "fotos");
                consejeroExistente.setUrl_imagen(fileUrl);
            }

            Optional.ofNullable(consejero.getNombre()).filter(nombre -> !nombre.isEmpty())
                    .ifPresent(consejeroExistente::setNombre);
            Optional.ofNullable(consejero.getApellido()).filter(apellido -> !apellido.isEmpty())
                    .ifPresent(consejeroExistente::setApellido);
            Optional.ofNullable(consejero.getDni()).filter(dni -> !dni.isEmpty())
                    .ifPresent(consejeroExistente::setDni);
            Optional.ofNullable(consejero.getCargo()).filter(cargo -> !cargo.isEmpty())
                    .ifPresent(consejeroExistente::setCargo);
            Optional.ofNullable(consejero.getDescripcion()).filter(descripcion -> !descripcion.isEmpty())
                    .ifPresent(consejeroExistente::setDescripcion);
            Optional.ofNullable(consejero.getCorreo()).filter(correo -> !correo.isEmpty())
                    .ifPresent(consejeroExistente::setCorreo);
            Optional.ofNullable(consejero.getTelefono()).filter(telefono -> !telefono.isEmpty())
                    .ifPresent(consejeroExistente::setTelefono);
            Optional.ofNullable(consejero.getDireccion()).filter(direccion -> !direccion.isEmpty())
                    .ifPresent(consejeroExistente::setDireccion);
            Optional.ofNullable(consejero.getActivo()).ifPresent(consejeroExistente::setActivo);

            Optional.ofNullable(consejero.getFacebook()).filter(facebook -> !facebook.isEmpty())
                    .ifPresent(consejeroExistente::setFacebook);
            Optional.ofNullable(consejero.getInstagram()).filter(instagram -> !instagram.isEmpty())
                    .ifPresent(consejeroExistente::setInstagram);
            Optional.ofNullable(consejero.getTwitter()).filter(twitter -> !twitter.isEmpty())
                    .ifPresent(consejeroExistente::setTwitter);
            Optional.ofNullable(consejero.getYoutube()).filter(youtube -> !youtube.isEmpty())
                    .ifPresent(consejeroExistente::setYoutube);
            Optional.ofNullable(consejero.getTiktok()).filter(tiktok -> !tiktok.isEmpty())
                    .ifPresent(consejeroExistente::setTiktok);
            Optional.ofNullable(consejero.getWhatsapp()).filter(whatsapp -> !whatsapp.isEmpty())
                    .ifPresent(consejeroExistente::setWhatsapp);
            Optional.ofNullable(consejero.getTelegram()).filter(telegram -> !telegram.isEmpty())
                    .ifPresent(consejeroExistente::setTelegram);
            Optional.ofNullable(consejero.getPinterest()).filter(pinterest -> !pinterest.isEmpty())
                    .ifPresent(consejeroExistente::setPinterest);
            Optional.ofNullable(consejero.getSnapchat()).filter(snapchat -> !snapchat.isEmpty())
                    .ifPresent(consejeroExistente::setSnapchat);
            Optional.ofNullable(consejero.getKick()).filter(kick -> !kick.isEmpty())
                    .ifPresent(consejeroExistente::setKick);
            Optional.ofNullable(consejero.getTwitch()).filter(twitch -> !twitch.isEmpty())
                    .ifPresent(consejeroExistente::setTwitch);
            Optional.ofNullable(consejero.getLinkedin()).filter(linkedin -> !linkedin.isEmpty())
                    .ifPresent(consejeroExistente::setLinkedin);

            return consejeroRepository.save(consejeroExistente);
        } catch (Exception e) {
            throw new RuntimeException("Error al procesar el archivo.", e);
        }
    }

    @Override
    public List<Consejero> findAllConsejo() {
        return consejeroRepository.findAll();
    }

    @Override
    public Consejero activarConsejero(Long id, Boolean activo) {
        return consejeroRepository.findById(id).map(consejero -> {
            consejero.setActivo(activo);
            return consejeroRepository.save(consejero);
        }).orElse(null);
    }

}
