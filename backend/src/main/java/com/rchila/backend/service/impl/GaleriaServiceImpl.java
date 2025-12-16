package com.rchila.backend.service.impl;

import org.springframework.stereotype.Service;

import com.rchila.backend.service.GaleriaService;
import com.rchila.backend.repository.ConsejeroGaleriaRepository;
import com.rchila.backend.model.ConsejeroGaleria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.web.multipart.MultipartFile;
import com.rchila.backend.service.StorageService;
import com.rchila.backend.model.Consejero;
import com.rchila.backend.repository.ConsejeroRepository;

@Service
@AllArgsConstructor
public class GaleriaServiceImpl implements GaleriaService {

    private final ConsejeroGaleriaRepository consejeroGaleriaRepository;
    private final StorageService storageService;
    private final ConsejeroRepository consejeroRepository;

    @Override
    public Page<ConsejeroGaleria> getGaleriaConsejeros(Long id, Pageable pageable) {
        return consejeroGaleriaRepository.findByConsejeroId(id, pageable);
    }

    @Override
    public ConsejeroGaleria createGaleriaConsejero(Long id, MultipartFile file, String descripcion, Long consejeroId, String nombre) {


        Consejero consejero = consejeroRepository.findById(id).orElseThrow(() -> new RuntimeException("Consejero no encontrado"));

        if (consejero == null) {
            throw new RuntimeException("Consejero no encontrado");
        }

        if (file.isEmpty()) {
            throw new RuntimeException("Archivo no encontrado");
        }

        String fileName = storageService.guardarArchivo(file, nombre, null, "galeria");

        ConsejeroGaleria consejeroGaleria = new ConsejeroGaleria();
        consejeroGaleria.setDescripcion(descripcion);
        consejeroGaleria.setUrlImagen(fileName);
        consejeroGaleria.setConsejero(consejero);
        consejeroGaleria.setNombre(nombre);
        return consejeroGaleriaRepository.save(consejeroGaleria);
    }

    @Override
    public ConsejeroGaleria updateGaleriaConsejero(UUID id, MultipartFile file, String descripcion, Long consejeroId, String nombre) {
        ConsejeroGaleria consejeroGaleria = consejeroGaleriaRepository.findById(id).orElseThrow(() -> new RuntimeException("Galeria no encontrada"));

        if (consejeroGaleria == null) {
            throw new RuntimeException("Galeria no encontrada");
        }

        if (file != null) {
            if (file.isEmpty()) {
                throw new RuntimeException("Archivo no encontrado");
            }

            String fileName = storageService.guardarArchivo(file, nombre, null, "galeria");
            consejeroGaleria.setUrlImagen(fileName);
        }

        if (nombre != null) {
            consejeroGaleria.setNombre(nombre);
        }

        if (descripcion != null) {
            consejeroGaleria.setDescripcion(descripcion);
        }

        if (consejeroId != null) {
            Consejero consejero = consejeroRepository.findById(consejeroId).orElseThrow(() -> new RuntimeException("Consejero no encontrado"));
            if (consejero == null) {
                throw new RuntimeException("Consejero no encontrado");
            }
            consejeroGaleria.setConsejero(consejero);
        }

        consejeroGaleria.setUpdatedAt(java.time.LocalDateTime.now());
        return consejeroGaleriaRepository.save(consejeroGaleria);
    }

    @Override
    public void deleteGaleriaConsejero(UUID id) {
        ConsejeroGaleria consejeroGaleria = consejeroGaleriaRepository.findById(id).orElseThrow(() -> new RuntimeException("Galeria no encontrada"));

        if (consejeroGaleria == null) {
            throw new RuntimeException("Galeria no encontrada");
        }

        storageService.eliminarArchivo(consejeroGaleria.getUrlImagen());
        consejeroGaleriaRepository.deleteById(id);
    }               
}
