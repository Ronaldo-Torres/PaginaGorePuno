package com.rchila.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.rchila.backend.model.Anuncio;
import org.springframework.web.multipart.MultipartFile;

public interface AnuncioService {

    Page<Anuncio> getAnuncios(Pageable pageable, String search);

    Anuncio createAnuncio(MultipartFile file, Anuncio anuncio);

    Anuncio updateAnuncio(Long id, MultipartFile file, Anuncio anuncio);

    void deleteAnuncio(Long id);

    Anuncio getAnuncioById(Long id);

    Anuncio activarAnuncio(Long id, Boolean activo);
}