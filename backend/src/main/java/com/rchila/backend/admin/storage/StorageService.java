package com.rchila.backend.admin.storage;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * Interfaz para el servicio de almacenamiento de archivos.
 * Proporciona métodos para guardar, obtener y eliminar archivos.
 */
public interface StorageService {

    /**
     * Guarda un archivo de imagen en el sistema de almacenamiento.
     *
     * @param file archivo de imagen a guardar
     * @return ruta donde se guardó el archivo
     * @throws IOException              si ocurre un error durante el guardado
     * @throws IllegalArgumentException si el archivo no es válido o no es una
     *                                  imagen
     */
    String saveImage(MultipartFile file) throws IOException;

    /**
     * Elimina un archivo del sistema de almacenamiento.
     *
     * @param filePath ruta del archivo a eliminar
     * @return true si se eliminó correctamente, false en caso contrario
     */
    boolean deleteFile(String filePath);

    /**
     * Verifica si un archivo es una imagen válida.
     *
     * @param file archivo a validar
     * @return true si es una imagen válida, false en caso contrario
     */
    boolean isValidImage(MultipartFile file);

    /**
     * Obtiene la URL pública para acceder al archivo.
     *
     * @param filePath ruta del archivo
     * @return URL pública del archivo
     */
    String getFileUrl(String filePath);
}