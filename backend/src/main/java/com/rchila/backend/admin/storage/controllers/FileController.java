package com.rchila.backend.admin.storage.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/uploads")
public class FileController {

    private static final Logger logger = LoggerFactory.getLogger(FileController.class);

    private final String uploadDirectory;

    public FileController(@Value("${app.storage.upload-dir:uploads}") String uploadDirectory) {
        this.uploadDirectory = uploadDirectory;
        logger.info("FileController inicializado con directorio: {}", uploadDirectory);
        logger.info("Directorio de trabajo actual: {}", System.getProperty("user.dir"));
    }

    @GetMapping("/avatars/{filename:.+}")
    public ResponseEntity<Resource> serveAvatarFile(@PathVariable String filename) {
        return serveFile("avatars/" + filename);
    }


    @GetMapping("/{year}/{folder}/{filename:.+}")
    public ResponseEntity<Resource> serveYearFile(@PathVariable String year, @PathVariable String folder,
            @PathVariable String filename) {
        String filePath = year + "/" + folder + "/" + filename;

        if (filePath.contains("..") || filePath.startsWith("/")) {
            logger.warn("Intento de acceso a ruta no permitida: {}", filePath);
            return ResponseEntity.badRequest().build();
        }

        logger.debug("Sirviendo archivo (3 niveles): {}", filePath);
        return serveFile(filePath);
    }

    @GetMapping("/{folder}/{filename:.+}")
    public ResponseEntity<Resource> serveFolderFile(@PathVariable String folder, @PathVariable String filename) {

        if (folder.equals("avatars") || folder.equals("test")) {
            return ResponseEntity.notFound().build();
        }

        String filePath = folder + "/" + filename;

        if (filePath.contains("..") || filePath.startsWith("/")) {
            logger.warn("Intento de acceso a ruta no permitida: {}", filePath);
            return ResponseEntity.badRequest().build();
        }

        logger.debug("Sirviendo archivo (2 niveles): {}", filePath);
        return serveFile(filePath);
    }

    @GetMapping("/{year}/{folder}/{subfolder}/{filename:.+}")
    public ResponseEntity<Resource> serveYearSubfolderFile(
            @PathVariable String year,
            @PathVariable String folder,
            @PathVariable String subfolder,
            @PathVariable String filename) {
        String filePath = year + "/" + folder + "/" + subfolder + "/" + filename;

        if (filePath.contains("..") || filePath.startsWith("/")) {
            logger.warn("Intento de acceso a ruta no permitida: {}", filePath);
            return ResponseEntity.badRequest().build();
        }

        logger.debug("Sirviendo archivo (4 niveles): {}", filePath);
        return serveFile(filePath);
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        logger.info("Endpoint de prueba llamado");
        return ResponseEntity.ok("FileController funcionando correctamente. Directorio: " + uploadDirectory);
    }


    private ResponseEntity<Resource> serveFile(String filePath) {
        try {
            logger.debug("Intentando servir archivo: {}", filePath);
            logger.debug("Directorio base configurado: {}", uploadDirectory);

            Path file = Paths.get(uploadDirectory).resolve(filePath);
            logger.debug("Ruta completa resolvida: {}", file.toAbsolutePath());
            logger.debug("El archivo existe: {}", file.toFile().exists());

            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() && resource.isReadable()) {
                logger.debug("Archivo encontrado y legible: {}", file.toAbsolutePath());
                String contentType = determineContentType(filePath);

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                logger.warn("Archivo no encontrado o no legible: {}", file.toAbsolutePath());
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            logger.error("Error al servir archivo: {}", filePath, e);
            return ResponseEntity.badRequest().build();
        }
    }

    private String determineContentType(String filePath) {
        String lowercasePath = filePath.toLowerCase();

        if (lowercasePath.endsWith(".jpg") || lowercasePath.endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (lowercasePath.endsWith(".png")) {
            return "image/png";
        } else if (lowercasePath.endsWith(".gif")) {
            return "image/gif";
        } else if (lowercasePath.endsWith(".webp")) {
            return "image/webp";
        } else if (lowercasePath.endsWith(".pdf")) {
            return "application/pdf";
        } else {
            return "application/octet-stream";
        }
    }
}