package com.rchila.backend.sgdintegracion.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Date;
import org.springframework.web.client.RestTemplate;

@Service
public class DocumentoSgdService {


    @Value("${sgd.api.url}")
    private String urlPrueba;

    @Value("${sgd.api.token}")
    private String tokenPrueba;


    public ResponseEntity<Object> getDocumento(String emision) {
        try {
            String token = tokenPrueba;
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + token);

            RestTemplate restTemplate = new RestTemplate();
            HttpEntity<String> entity = new HttpEntity<>(headers);
            String url = urlPrueba + "/sgd/documento/" + emision;
            
            System.out.println("Intentando obtener documento: " + url);
            
            ResponseEntity<Object> response = restTemplate.exchange(url, HttpMethod.GET, entity, Object.class);
            return response;
        } catch (Exception e) {
            System.err.println("Error en getDocumento: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error de conexión con el servicio SGD");
            errorResponse.put("details", e.getMessage());
            errorResponse.put("timestamp", new Date());
            errorResponse.put("emision", emision);
            
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(errorResponse);
        }
    }   

    //esto es post
    public ResponseEntity<Object> getAllDocumentos(String codigoOficina, String tipoDocumento, String anio, List<String> emisiones) {
        try {
            String token = tokenPrueba;
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + token);
            headers.set("Content-Type", "application/json");
            RestTemplate restTemplate = new RestTemplate();
            String url = urlPrueba + "/sgd/documento/all/" + codigoOficina + "/emisiones?tipoDocumento=" + tipoDocumento + "&anio=" + anio;
            
            HttpEntity<List<String>> body = new HttpEntity<>(emisiones, headers);
            
            ResponseEntity<Object> response = restTemplate.exchange(url, HttpMethod.POST, body, Object.class);
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error de conexión con el servicio SGD");
            errorResponse.put("details", e.getMessage());
            errorResponse.put("timestamp", new Date());
            errorResponse.put("codigoOficina", codigoOficina);
            errorResponse.put("tipoDocumento", tipoDocumento);
            errorResponse.put("anio", anio);
            
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(errorResponse);
        }
    }

    public ResponseEntity<Object> getDocumentosByTipo(String codigoOficina, String tipoDocumento, String anio, int page, int size, String search) {
            if (tipoDocumento.equals("036")) {
                codigoOficina = "00001";
            }
            String token = tokenPrueba;
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + token);
            
            RestTemplate restTemplate = new RestTemplate();
            String url =  urlPrueba+  "/sgd/documento/crp/" + codigoOficina + "/emisiones?tipoDocumento=" + tipoDocumento + "&anio=" + anio + "&page=" + page + "&size=" + size;
            if (search != null && !search.trim().isEmpty()) {
                url += "&search=" + search;
            }
            List<String> emisiones = new ArrayList<>();
            HttpEntity<List<String>> entity = new HttpEntity<>(emisiones, headers);
            ResponseEntity<Object> response = restTemplate.exchange(url, HttpMethod.POST, entity, Object.class);
            Object body = response.getBody();

            return ResponseEntity.ok(body);
            
    }

    
    public ResponseEntity<Object> getOficinaByCodigo(String codigoOficina) {
        try {
            String token = tokenPrueba;
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + token);
            HttpEntity<String> entity = new HttpEntity<>(headers);
            RestTemplate restTemplate = new RestTemplate();
            String url = urlPrueba + "/sgd/dependencia/" + codigoOficina;
            
            
            ResponseEntity<Object> response = restTemplate.exchange(url, HttpMethod.GET, entity, Object.class);
            Object body = response.getBody();

            System.out.println("Respuesta JSON: " + body);
    
            return ResponseEntity.ok(body);
        } catch (Exception e) {
            System.err.println("Error en getOficinaByCodigo: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error de conexión con el servicio SGD");
            errorResponse.put("details", e.getMessage());
            errorResponse.put("timestamp", new Date());
            errorResponse.put("codigoOficina", codigoOficina);
            
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(errorResponse);
        }
    }

/* 
    public ResponseEntity<Object> getOficinaByCodigo(String codigoOficina) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://sistemas.regionpuno.gob.pe/sisplan-api/api/consultas-empresa";
        ResponseEntity<Object> response = restTemplate.getForEntity(url, Object.class, codigoOficina);
        Object body = response.getBody();

        System.out.println("Respuesta JSON: " + body);

        return ResponseEntity.ok(body);
    }*/


}
