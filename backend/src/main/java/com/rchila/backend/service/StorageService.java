package com.rchila.backend.service;

import org.springframework.web.multipart.MultipartFile;

import com.rchila.backend.model.Documento;

public interface StorageService {
    void eliminarArchivo(String url);

    String guardarArchivo(MultipartFile file, String nombre, String anio, String tipo);

    String guardarDocumento(MultipartFile file, Documento documento);
}
