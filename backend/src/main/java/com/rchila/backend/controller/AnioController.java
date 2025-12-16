package com.rchila.backend.controller;

import lombok.AllArgsConstructor;
import com.rchila.backend.model.Anio;
import com.rchila.backend.repository.AnioRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/v1/anios")
@AllArgsConstructor
public class AnioController {

    private final AnioRepository anioRepository;

    @GetMapping
    public List<Anio> obtenerAnios() {
        return anioRepository.findAll();
    }
}
