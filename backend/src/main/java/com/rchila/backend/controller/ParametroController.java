package com.rchila.backend.controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.rchila.backend.service.ParametrosService;
import com.rchila.backend.model.Parametro;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import java.util.Optional;
import org.springframework.data.domain.Sort;

@RestController
@RequestMapping("/v1/parametros")
@AllArgsConstructor
public class ParametroController {

    private final ParametrosService parametroService;

    @GetMapping
    public Page<Parametro> getParametros(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String orderBy,
            @RequestParam(defaultValue = "desc") String direction) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction.toUpperCase());
        return parametroService.findAllParametros(PageRequest.of(page, size, Sort.by(sortDirection, orderBy)));
    }

    @GetMapping("/{id}")
    public Optional<Parametro> getParametroById(@PathVariable Long id) {
        return parametroService.findParametroById(id);
    }

    @PostMapping
    public Parametro createParametro(@RequestBody Parametro parametro) {
        return parametroService.saveParametro(parametro);
    }

    @PutMapping("/{id}")
    public Parametro updateParametro(@PathVariable Long id,
            @RequestParam(value = "file1", required = false) MultipartFile file1,
            @RequestParam(value = "file2", required = false) MultipartFile file2,
            Parametro parametro) {
        System.out.println("=== DATOS RECIBIDOS EN EL CONTROLADOR ===");
        System.out.println("ID: " + id);
        System.out.println("File1: " + (file1 != null ? file1.getOriginalFilename() : "null"));
        System.out.println("File2: " + (file2 != null ? file2.getOriginalFilename() : "null"));
        System.out.println("Nombre Institución: " + parametro.getNombreInstitucion());
        System.out.println("Dirección: " + parametro.getDireccionInstitucion());
        System.out.println("Facebook: " + parametro.getFacebook());
        System.out.println("Instagram: " + parametro.getInstagram());
        System.out.println("Título Presidencia: " + parametro.getTituloPresidencia());
        System.out.println("Descripción Presidencia: " + parametro.getDescripcionPresidencia());
        System.out.println("=========================================");
        
        return parametroService.updateParametro(id, file1, file2, parametro);
    }

    @DeleteMapping("/{id}")
    public void deleteParametro(@PathVariable Long id) {
        parametroService.deleteParametro(id);
    }

}
