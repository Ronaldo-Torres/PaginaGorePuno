package com.rchila.backend.admin.storage.impl;

import com.rchila.backend.admin.storage.StorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class LocalStorageService implements StorageService {

    private static final Logger logger = LoggerFactory.getLogger(LocalStorageService.class);

    // Tipos de archivos permitidos
    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
            "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp");

    // Tamaño máximo del archivo (5MB)
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;

    private final String uploadDirectory;
    private final String baseUrl;

    public LocalStorageService(
            @Value("${app.storage.upload-dir:uploads}") String uploadDirectory,
            @Value("${app.storage.base-url:http://localhost:8080/api/uploads}") String baseUrl) {
        this.uploadDirectory = uploadDirectory;
        this.baseUrl = baseUrl;
        initializeStorageDirectory();
    }

    /**
     * Inicializa el directorio de almacenamiento si no existe.
     */
    private void initializeStorageDirectory() {
        try {
            Path uploadPath = Paths.get(uploadDirectory);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                logger.info("Directorio de uploads creado: {}", uploadPath.toAbsolutePath());
            }

            // Crear subdirectorio para avatares
            Path avatarsPath = uploadPath.resolve("avatars");
            if (!Files.exists(avatarsPath)) {
                Files.createDirectories(avatarsPath);
                logger.info("Directorio de avatares creado: {}", avatarsPath.toAbsolutePath());
            }
        } catch (IOException e) {
            logger.error("Error al crear directorios de almacenamiento", e);
            throw new RuntimeException("No se pudo inicializar el sistema de almacenamiento", e);
        }
    }

    @Override
    public String saveImage(MultipartFile file) throws IOException {
        // Validar que el archivo sea una imagen
        if (!isValidImage(file)) {
            throw new IllegalArgumentException("El archivo no es una imagen válida o excede el tamaño permitido");
        }

        // Generar nombre único para el archivo
        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

        // Crear ruta completa (guardamos en subdirectorio avatars)
        Path uploadPath = Paths.get(uploadDirectory);
        Path avatarsPath = uploadPath.resolve("avatars");
        Path filePath = avatarsPath.resolve(uniqueFilename);

        // Guardar archivo
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        logger.info("Imagen guardada: {}", filePath.toAbsolutePath());

        // Retornar ruta relativa
        return "avatars/" + uniqueFilename;
    }

    @Override
    public boolean deleteFile(String filePath) {
        try {
            Path fileToDelete = Paths.get(uploadDirectory).resolve(filePath);
            if (Files.exists(fileToDelete)) {
                Files.delete(fileToDelete);
                logger.info("Archivo eliminado: {}", fileToDelete.toAbsolutePath());
                return true;
            }
            return false;
        } catch (IOException e) {
            logger.error("Error al eliminar archivo: {}", filePath, e);
            return false;
        }
    }

    @Override
    public boolean isValidImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return false;
        }

        // Validar tamaño
        if (file.getSize() > MAX_FILE_SIZE) {
            logger.warn("Archivo demasiado grande: {} bytes", file.getSize());
            return false;
        }

        // Validar tipo de contenido
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType.toLowerCase())) {
            logger.warn("Tipo de archivo no permitido: {}", contentType);
            return false;
        }

        return true;
    }

    @Override
    public String getFileUrl(String filePath) {
        if (filePath == null || filePath.trim().isEmpty()) {
            return null;
        }
        return baseUrl + "/" + filePath;
    }
}