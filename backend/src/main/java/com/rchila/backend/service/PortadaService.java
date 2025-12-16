package com.rchila.backend.service;

import org.springframework.web.multipart.MultipartFile;
import com.rchila.backend.model.Portada;
import com.rchila.backend.model.Servicio;
import com.rchila.backend.model.LinkInteres;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PortadaService {
    Portada createPortada(MultipartFile file, Portada portada);

    LinkInteres createLinks(MultipartFile file, LinkInteres linkInteres);

    Page<Portada> getPortadas(Pageable pageable);

    Page<LinkInteres> getLinks(Pageable pageable);

    Page<Servicio> getServicios(Pageable pageable);

    Portada getPortada(Long id);

    LinkInteres getLink(Long id);

    Portada updatePortada(MultipartFile file, Long id, Portada portada);

    LinkInteres updateLinks(MultipartFile file, Long id, LinkInteres linkInteres);

    void deletePortada(Long id);

    void deleteLinks(Long id);

    Servicio createServicio(MultipartFile file, Servicio servicio);

    Servicio updateServicio(MultipartFile file, Long id, Servicio servicio);

    void deleteServicio(Long id);

    Servicio activarServicio(Long id, Boolean activo);

    LinkInteres activarLink(Long id, Boolean activo);

    Portada activarPortada(Long id, Boolean activo);
}
