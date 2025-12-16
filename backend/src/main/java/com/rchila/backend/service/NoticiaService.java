package com.rchila.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.rchila.backend.model.Noticia;
import com.rchila.backend.model.NoticiaImagen;
import com.rchila.backend.model.dto.NoticiaDTO;

public interface NoticiaService {
    Page<Noticia> getNoticias(Pageable pageable, String search, Boolean destacadoAntigua, Boolean destacado);

    NoticiaDTO createNoticia(NoticiaDTO noticia);

    NoticiaDTO updateNoticia(Long id, NoticiaDTO noticia);

    void deleteNoticia(Long id);

    Noticia getNoticiaById(Long id);

    // Agregar y eliminar imagenes a una noticia

    Page<NoticiaImagen> findImagenesByNoticiaId(Long id, Pageable pageable);

    NoticiaImagen addImagenToNoticia(MultipartFile file, String nombre, Long noticiaId);

    void deleteImagen(Long id);

    Noticia activarNoticia(Long id, Boolean activo);

    NoticiaImagen activarImagen(Long id, Boolean esPrincipal);
}