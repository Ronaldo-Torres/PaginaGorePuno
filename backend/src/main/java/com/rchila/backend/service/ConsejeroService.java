package com.rchila.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.rchila.backend.model.Consejero;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface ConsejeroService {

    Page<Consejero> findAllConsejeros(Pageable pageable, String search);

    Consejero findConsejeroById(Long id);

    Consejero saveConsejero(MultipartFile file, MultipartFile documento, Consejero consejero);

    Consejero updateConsejero(Long id, MultipartFile file, MultipartFile documento, Consejero consejero);

    void deleteConsejero(Long id);

    List<Consejero> findAllConsejo();

    Consejero activarConsejero(Long id, Boolean activo);

}