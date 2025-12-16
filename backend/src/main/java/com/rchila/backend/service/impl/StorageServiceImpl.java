package com.rchila.backend.service.impl;

import org.springframework.stereotype.Service;

import com.rchila.backend.model.Documento;
import com.rchila.backend.service.StorageService;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import java.util.Calendar;
import java.io.File;
import java.nio.file.StandardCopyOption;

@Service
public class StorageServiceImpl implements StorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    private int obtenerAnioActual() {
        return Calendar.getInstance().get(Calendar.YEAR);
    }

    @Override
    public void eliminarArchivo(String urlDocumento) {
        if (urlDocumento != null) {
            File archivoExistente = new File(uploadDir + urlDocumento);
            if (archivoExistente.exists()) {
                archivoExistente.delete();
            }
        }
    }

    @Override
    public String guardarArchivo(MultipartFile file, String nombre, String anio, String tipo) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        String anioActual = String.valueOf(obtenerAnioActual());

        String directoryPath = uploadDir + "/" + (anio != null && !anio.isEmpty() ? anio : anioActual) + "/" + tipo
                + (nombre != null && !nombre.isEmpty() ? "/" + nombre : "");
        String urlArchivo = "/" + (anio != null && !anio.isEmpty() ? anio : anioActual) + "/" + tipo
                + (nombre != null && !nombre.isEmpty() ? "/" + nombre : "");
        File directory = new File(directoryPath);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        try {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(directory.getAbsolutePath(), fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            return urlArchivo + "/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar el archivo", e);
        }
    }

    @Override
    public String guardarDocumento(MultipartFile file, Documento documento) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        String anioActual = String.valueOf(obtenerAnioActual());

        String directoryPath = uploadDir + "/"
                + (documento.getAnio() != null && !documento.getAnio().getAnio().isEmpty()
                        ? documento.getAnio().getAnio()
                        : anioActual)
                + "/" + "documentos"
                + (documento.getTipoDocumento().getNombre() != null
                        && !documento.getTipoDocumento().getNombre().isEmpty()
                                ? "/" + documento.getTipoDocumento().getNombre()
                                : "");
        String urlArchivo = "/"
                + (documento.getAnio() != null && !documento.getAnio().getAnio().isEmpty()
                        ? documento.getAnio().getAnio()
                        : anioActual)
                + "/" + "documentos"
                + (documento.getTipoDocumento().getNombre() != null
                        && !documento.getTipoDocumento().getNombre().isEmpty()
                                ? "/" + documento.getTipoDocumento().getNombre()
                                : "");
        File directory = new File(directoryPath);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        try {
            String milisegundos = String.valueOf(System.currentTimeMillis());
            String extension = "";
            if (file.getOriginalFilename() != null) {
                extension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
            } else {
                extension = ".pdf";
            }
            String fileName = milisegundos + "_" + documento.getTipoDocumento().getNombre() + "_"
                    + documento.getNumeroDocumento() + extension;
            Path filePath = Paths.get(directory.getAbsolutePath(), fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            return urlArchivo + "/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar el archivo", e);
        }
    }
}
