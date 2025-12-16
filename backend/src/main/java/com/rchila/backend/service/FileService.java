package com.rchila.backend.service;

import org.springframework.web.multipart.MultipartFile;

import com.rchila.backend.model.Imagen;
import com.rchila.backend.model.Consejero;

public interface FileService {
    Imagen uploadFile(MultipartFile file, Consejero consejero);

    Imagen updateFile(String id, MultipartFile newFile);

    void deleteFile(Long id);
}
