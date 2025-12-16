package com.rchila.backend.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.rchila.backend.model.Noticia;
import com.rchila.backend.repository.NoticiaRepository;
import com.rchila.backend.service.NoticiaService;
import com.rchila.backend.service.StorageService;
import org.springframework.web.multipart.MultipartFile;
import com.rchila.backend.model.NoticiaImagen;
import com.rchila.backend.repository.NoticiaImagenRepository;
import com.rchila.backend.model.dto.NoticiaDTO;
import com.rchila.backend.model.Consejero;
import com.rchila.backend.model.Comision;
import java.util.List;
import com.rchila.backend.repository.ConsejeroRepository;
import com.rchila.backend.repository.ComisionRepository;
import com.rchila.backend.mapper.NoticiaMapper;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class NoticiaServiceImpl implements NoticiaService {

    private final NoticiaRepository noticiaRepository;

    private final StorageService storageService;

    private final NoticiaImagenRepository noticiaImagenRepository;

    private final ConsejeroRepository consejeroRepository;

    private final ComisionRepository comisionRepository;

    private final NoticiaMapper noticiaMapper;

    @Override
    public Page<Noticia> getNoticias(Pageable pageable, String search, Boolean destacadoAntigua,
            Boolean destacado) {

        Specification<Noticia> specification = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Aplicar filtro de búsqueda si existe
            if (search != null && !search.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("titulo")), "%" + search.toLowerCase() + "%"));
            }

            // Aplicar filtros de destacado independientemente de la búsqueda
            if (destacadoAntigua != null) {
                predicates.add(cb.equal(root.get("destacadoAntigua"), destacadoAntigua));
            }

            if (destacado != null) {
                predicates.add(cb.equal(root.get("destacado"), destacado));
            }

            return predicates.isEmpty() ? null : cb.and(predicates.toArray(new Predicate[0]));
        };

        return noticiaRepository.findAll(specification, pageable);
    }

    @Override
    public NoticiaDTO createNoticia(NoticiaDTO dto) {
        Noticia noticia = noticiaMapper.toEntity(dto);

        if (dto.getConsejeros() != null) {
            List<Consejero> consejeros = consejeroRepository.findAllById(dto.getConsejeros());
            noticia.setConsejeros(consejeros);
        }
        if (dto.getComisiones() != null) {
            List<Comision> comisiones = comisionRepository.findAllById(dto.getComisiones());
            noticia.setComisiones(comisiones);
        }

        Noticia saved = noticiaRepository.save(noticia);
        return dto;
    }

    @Override
    public NoticiaDTO updateNoticia(Long id, NoticiaDTO noticiaDTO) {
        return noticiaRepository.findById(id)
                .map(noticiaExistente -> {
                    noticiaExistente.setGorro(noticiaDTO.getGorro());
                    noticiaExistente.setTitulo(noticiaDTO.getTitulo());
                    noticiaExistente.setBajada(noticiaDTO.getBajada());
                    noticiaExistente.setIntroduccion(noticiaDTO.getIntroduccion());
                    noticiaExistente.setContenido(noticiaDTO.getContenido());
                    noticiaExistente.setConclusion(noticiaDTO.getConclusion());
                    noticiaExistente.setNota(noticiaDTO.getNota());
                    noticiaExistente.setFechaPublicacion(new java.sql.Date(noticiaDTO.getFechaPublicacion().getTime()));
                    noticiaExistente.setDestacado(noticiaDTO.getDestacado());
                    noticiaExistente.setUrl(noticiaDTO.getUrl());
                    noticiaExistente.setActivo(noticiaDTO.getActivo());
                    noticiaExistente.setDestacadoAntigua(noticiaDTO.getDestacadoAntigua());
                    noticiaExistente.setAutor(noticiaDTO.getAutor());
                    noticiaExistente.setTags(noticiaDTO.getTags());

                    // Actualizar consejeros usando findAllById
                    if (noticiaDTO.getConsejeros() != null) {
                        List<Consejero> consejeros = consejeroRepository.findAllById(noticiaDTO.getConsejeros());
                        noticiaExistente.setConsejeros(consejeros);
                    }

                    // Actualizar comisiones usando findAllById
                    if (noticiaDTO.getComisiones() != null) {
                        List<Comision> comisiones = comisionRepository.findAllById(noticiaDTO.getComisiones());
                        noticiaExistente.setComisiones(comisiones);
                    }

                    Noticia savedNoticia = noticiaRepository.save(noticiaExistente);
                    return noticiaDTO;
                })
                .orElse(null);
    }

    @Override
    public void deleteNoticia(Long id) {
        noticiaRepository.deleteById(id);
    }

    @Override
    public Noticia getNoticiaById(Long id) {
        return noticiaRepository.findById(id).orElse(null);
    }

    @Override
    public Page<NoticiaImagen> findImagenesByNoticiaId(Long id, Pageable pageable) {
        return noticiaImagenRepository.findByNoticiaId(id, pageable);
    }

    @Override
    public NoticiaImagen addImagenToNoticia(MultipartFile file, String nombre, Long noticiaId) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Por favor, selecciona un archivo para subir.");
        }

        String fileUrl = storageService.guardarArchivo(file, "", "", "noticias");
        NoticiaImagen noticiaImagen = new NoticiaImagen();
        noticiaImagen.setDescripcion(nombre);
        noticiaImagen.setUrl(fileUrl);
        noticiaImagen.setNoticia(noticiaRepository.findById(noticiaId).orElse(null));
        return noticiaImagenRepository.save(noticiaImagen);
    }

    @Override
    public void deleteImagen(Long id) {
        NoticiaImagen imagenExistente = noticiaImagenRepository.findById(id).orElse(null);
        if (imagenExistente == null) {
            throw new RuntimeException("Imagen no encontrada");
        }
        storageService.eliminarArchivo(imagenExistente.getUrl());
        noticiaImagenRepository.delete(imagenExistente);
    }

    @Override
    public Noticia activarNoticia(Long id, Boolean activo) {
        return noticiaRepository.findById(id).map(noticia -> {
            noticia.setActivo(activo);
            return noticiaRepository.save(noticia);
        }).orElse(null);
    }

    @Override
    public NoticiaImagen activarImagen(Long id, Boolean esPrincipal) {
        return noticiaImagenRepository.findById(id).map(imagen -> {
            imagen.setEsPrincipal(esPrincipal);
            return noticiaImagenRepository.save(imagen);
        }).orElse(null);
    }
}
