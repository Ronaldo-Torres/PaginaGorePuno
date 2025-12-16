package com.rchila.backend.controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.rchila.backend.model.Comision;
import com.rchila.backend.model.ConsejeroComision;
import com.rchila.backend.service.ComisionService;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.rchila.backend.model.Actividad;
import com.rchila.backend.model.ActividadImagen;
import org.springframework.data.domain.Sort;

@RestController
@RequestMapping("/v1/comisiones")
@AllArgsConstructor
public class ComisionController {

    private final ComisionService comisionService;

    @GetMapping
    public Page<Comision> getComisiones(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String orderBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false) String search
            ) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction.toUpperCase());
        return comisionService.findAllComisiones(PageRequest.of(page, size, Sort.by(sortDirection, orderBy)), search);
    }

    @GetMapping("/{id}")
    public Comision getComisionById(@PathVariable Long id) {
        return comisionService.findComisionById(id);
    }

    @PostMapping
    public Comision createComision(@RequestBody Comision comision) {
        return comisionService.saveComision(comision);
    }

    @PutMapping("/{id}")
    public Comision updateComision(@PathVariable Long id, @RequestBody Comision comision) {
        return comisionService.updateComision(id, comision);
    }

    @DeleteMapping("/{id}")
    public void deleteComision(@PathVariable Long id) {
        comisionService.deleteComision(id);
    }

    @PutMapping("/{id}/activar")
    public Comision activarComision(@PathVariable Long id, @RequestBody Comision comision) {
        return comisionService.activarComision(id, comision.getActivo());
    }

    // Actividades
    @GetMapping("/{id}/actividades")
    public Page<Actividad> getActividades(@PathVariable Long id, @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String orderBy,
            @RequestParam(defaultValue = "asc") String direction) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction.toUpperCase());
        return comisionService.findActividadesByComisionId(id,
                PageRequest.of(page, size, Sort.by(sortDirection, orderBy)));
    }

    @PostMapping("/actividades")
    public Actividad createActividad(@RequestBody Actividad actividad) {
        return comisionService.saveActividad(actividad);
    }

    @PutMapping("/{id}/actividades")
    public Actividad updateActividad(@PathVariable Long id, @RequestBody Actividad actividad) {
        return comisionService.updateActividad(id, actividad);
    }

    @DeleteMapping("/{id}/actividades")
    public void deleteActividad(@PathVariable Long id) {
        comisionService.deleteActividad(id);
    }

    @PutMapping("/{id}/actividades/activar")
    public Actividad activarActividad(@PathVariable Long id, @RequestBody Actividad actividad) {
        return comisionService.activarActividad(id, actividad.getActivo());
    }

    // Imagenes de actividad

    @GetMapping("/actividad/{id}/imagenes")
    public Page<ActividadImagen> getImagenesByActividadId(@PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String orderBy,
            @RequestParam(defaultValue = "asc") String direction) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction.toUpperCase());
        return comisionService.findImagenesByActividadId(id,
                PageRequest.of(page, size, Sort.by(sortDirection, orderBy)));
    }

    @DeleteMapping("/actividad/{id}/imagenes")
    public void deleteImagen(@PathVariable Long id) {
        comisionService.deleteImagen(id);
    }

    @PostMapping("/actividad/imagenes")
    public ActividadImagen createImagen(@RequestParam("file") MultipartFile file,
            @RequestParam("nombre") String nombre,
            @RequestParam("actividadId") Long actividadId) {
        return comisionService.saveImagenActividad(file, nombre, actividadId);
    }

    // Consejeros comisiones

    @PostMapping("/consejeros")
    public ConsejeroComision createConsejeroComision(@RequestBody ConsejeroComision consejeroComision) {
        return comisionService.createConsejeroComision(consejeroComision);
    }

    @GetMapping("/{id}/consejeros")
    public Page<ConsejeroComision> getConsejeros(@PathVariable Long id, @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String orderBy,
            @RequestParam(defaultValue = "asc") String direction) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction.toUpperCase());
        return comisionService.findConsejerosByComisionId(id,
                PageRequest.of(page, size, Sort.by(sortDirection, orderBy)));
    }

    @DeleteMapping("/{id}/consejeros")
    public void deleteConsejeroComision(@PathVariable Long id) {
        comisionService.deleteConsejeroComision(id);
    }

    @PutMapping("/activar/{id}/consejeros")
    public ConsejeroComision activarConsejeroComision(@PathVariable Long id,
            @RequestBody ConsejeroComision consejeroComision) {
        return comisionService.activarConsejeroComision(id, consejeroComision.getActivo());
    }

    @GetMapping("/all")
    public List<Comision> getAllComisiones() {
        return comisionService.findAllComisiones();
    }
}
