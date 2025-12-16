package com.rchila.backend.service.impl;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.rchila.backend.service.PortadaService;
import com.rchila.backend.model.Portada;
import com.rchila.backend.model.Servicio;
import com.rchila.backend.model.LinkInteres;
import com.rchila.backend.repository.PortadaRepository;
import com.rchila.backend.repository.LinkInteresRepository;
import com.rchila.backend.service.StorageService;
import com.rchila.backend.repository.ServicioRepository;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class PortadaServiceimpl implements PortadaService {

    private final PortadaRepository portadaRepository;

    private final LinkInteresRepository linkInteresRepository;

    private final StorageService storageService;

    private final ServicioRepository servicioRepository;

    @Override
    public Page<Portada> getPortadas(Pageable pageable) {
        return portadaRepository.findAll(pageable);
    }

    @Override
    public Page<LinkInteres> getLinks(Pageable pageable) {
        return linkInteresRepository.findAll(pageable);
    }

    @Override
    public Portada getPortada(Long id) {
        return portadaRepository.findById(id).orElse(null);
    }

    @Override
    public LinkInteres getLink(Long id) {
        return linkInteresRepository.findById(id).orElse(null);
    }

    @Override
    public Portada createPortada(MultipartFile file, Portada portada) {
        if (file != null && !file.isEmpty()) {
            String url = storageService.guardarArchivo(file, "", "", "fotos");
            portada.setImagen(url);
        }
        return portadaRepository.save(portada);
    }

    @Override
    public LinkInteres createLinks(MultipartFile file, LinkInteres linkInteres) {
        if (file != null && !file.isEmpty()) {
            String url = storageService.guardarArchivo(file, "", "", "fotos");
            linkInteres.setImagen(url);
        }
        return linkInteresRepository.save(linkInteres);
    }

    @Override
    public Portada updatePortada(MultipartFile file, Long id, Portada portada) {
        Portada portadaExistente = portadaRepository.findById(id).orElse(null);
        if (portadaExistente == null) {
            throw new RuntimeException("La portada no existe");
        }
        if (file != null && !file.isEmpty()) {
            storageService.eliminarArchivo(portadaExistente.getImagen());
            String url = storageService.guardarArchivo(file, "", "", "fotos");
            portadaExistente.setImagen(url);
        }
        Optional.ofNullable(portada.getTitulo()).ifPresent(portadaExistente::setTitulo);
        Optional.ofNullable(portada.getSubtitulo()).ifPresent(portadaExistente::setSubtitulo);
        Optional.ofNullable(portada.getDescripcion()).ifPresent(portadaExistente::setDescripcion);
        Optional.ofNullable(portada.getActivo()).ifPresent(portadaExistente::setActivo);
        Optional.ofNullable(portada.getNombreBoton()).ifPresent(portadaExistente::setNombreBoton);
        Optional.ofNullable(portada.getUrlBoton()).ifPresent(portadaExistente::setUrlBoton);
        return portadaRepository.save(portadaExistente);
    }

    @Override
    public LinkInteres updateLinks(MultipartFile file, Long id, LinkInteres linkInteres) {
        LinkInteres linkInteresExistente = linkInteresRepository.findById(id).orElse(null);
        if (linkInteresExistente == null) {
            throw new RuntimeException("El link de interés no existe");
        }
        if (file != null && !file.isEmpty()) {
            storageService.eliminarArchivo(linkInteresExistente.getImagen());
            String url = storageService.guardarArchivo(file, "", "", "fotos");
            linkInteresExistente.setImagen(url);
        }
        Optional.ofNullable(linkInteres.getNombre()).ifPresent(linkInteresExistente::setNombre);
        Optional.ofNullable(linkInteres.getUrl()).ifPresent(linkInteresExistente::setUrl);
        Optional.ofNullable(linkInteres.getActivo()).ifPresent(linkInteresExistente::setActivo);
        return linkInteresRepository.save(linkInteresExistente);
    }

    @Override
    public void deletePortada(Long id) {
        Portada portada = portadaRepository.findById(id).orElse(null);
        if (portada != null) {
            storageService.eliminarArchivo(portada.getImagen());
        }
        portadaRepository.deleteById(id);
    }

    @Override
    public void deleteLinks(Long id) {
        LinkInteres linkInteres = linkInteresRepository.findById(id).orElse(null);
        if (linkInteres != null) {
            storageService.eliminarArchivo(linkInteres.getImagen());
        }
        linkInteresRepository.deleteById(id);
    }

    @Override
    public Servicio createServicio(MultipartFile file, Servicio servicio) {
        if (file != null && !file.isEmpty()) {
            String url = storageService.guardarArchivo(file, "", "", "fotos");
            servicio.setImagen(url);
        }
        return servicioRepository.save(servicio);
    }

    @Override
    public Servicio updateServicio(MultipartFile file, Long id, Servicio servicio) {
        Servicio servicioExistente = servicioRepository.findById(id).orElse(null);
        if (servicioExistente == null) {
            throw new RuntimeException("El servicio no existe");
        }
        if (file != null && !file.isEmpty()) {
            storageService.eliminarArchivo(servicioExistente.getImagen());
            String url = storageService.guardarArchivo(file, "", "", "fotos");
            servicioExistente.setImagen(url);
        }
        Optional.ofNullable(servicio.getNombre()).ifPresent(servicioExistente::setNombre);
        Optional.ofNullable(servicio.getDescripcion()).ifPresent(servicioExistente::setDescripcion);
        Optional.ofNullable(servicio.getIcono()).ifPresent(servicioExistente::setIcono);
        Optional.ofNullable(servicio.getUrl()).ifPresent(servicioExistente::setUrl);
        Optional.ofNullable(servicio.getActivo()).ifPresent(servicioExistente::setActivo);
        return servicioRepository.save(servicioExistente);
    }

    @Override
    public void deleteServicio(Long id) {
        Servicio servicio = servicioRepository.findById(id).orElse(null);
        if (servicio != null) {
            storageService.eliminarArchivo(servicio.getImagen());
        }
        servicioRepository.deleteById(id);
    }

    @Override
    public Page<Servicio> getServicios(Pageable pageable) {
        return servicioRepository.findAll(pageable);
    }

    @Override
    public Servicio activarServicio(Long id, Boolean activo) {
        return servicioRepository.findById(id).map(
                servicioExistente -> {
                    servicioExistente.setActivo(activo);
                    return servicioRepository.save(servicioExistente);
                }).orElse(null);
    }

    @Override
    public LinkInteres activarLink(Long id, Boolean activo) {
        LinkInteres linkInteres = linkInteresRepository.findById(id).orElse(null);
        linkInteres.setActivo(activo);
        return linkInteresRepository.save(linkInteres);
    }

    @Override
    public Portada activarPortada(Long id, Boolean activo) {
        Portada portada = portadaRepository.findById(id).orElse(null);
        portada.setActivo(activo);
        return portadaRepository.save(portada);
    }

}
