package com.rchila.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/reporte")
public class ReporteController {

    //total de contratos en estadoContrato EJECUCION, FINALIZADOS

    @GetMapping("/estadisticas")
    public String getReporte() {
        return "Reporte";
    }
    
}
