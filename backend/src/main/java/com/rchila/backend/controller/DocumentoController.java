package com.rchila.backend.controller;

import com.rchila.backend.model.Documento;
import com.rchila.backend.model.Consejero;
import com.rchila.backend.model.Comision;
import com.rchila.backend.model.dto.DocuemntoSyncObtenerDTO;
import com.rchila.backend.model.dto.DocumentoDTO;
import com.rchila.backend.model.dto.DocumentoRelacionadoDTO;
import com.rchila.backend.model.dto.DocumetoSyncDTO;
import com.rchila.backend.repository.DocumentoRepository;
import com.rchila.backend.repository.ConsejeroRepository;
import com.rchila.backend.repository.ComisionRepository;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Set;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import com.rchila.backend.service.DocumentoService;

import jakarta.annotation.security.PermitAll;

@RestController
@RequestMapping("/v1/documentos")
@AllArgsConstructor
public class DocumentoController {

    private final DocumentoRepository documentoRepository;
    private final ConsejeroRepository consejeroRepository;
    private final ComisionRepository comisionRepository;
    private final DocumentoService documentoService;

    private DocumentoDTO convertToDTO(Documento documento) {
        DocumentoDTO dto = new DocumentoDTO();
        dto.setId(documento.getId());
        dto.setNumeroDocumento(documento.getNumeroDocumento());
        dto.setNombreDocumento(documento.getNombreDocumento());
        dto.setDescripcion(documento.getDescripcion());
        dto.setFechaEmision(documento.getFechaEmision().toString());
        dto.setActivo(documento.getActivo());
        dto.setUrlDocumento(documento.getUrlDocumento());
        dto.setTagsDocumento(documento.getTagsDocumento());
        dto.setCreatedAt(documento.getCreatedAt());
        dto.setUpdatedAt(documento.getUpdatedAt());

        // Convertir relaciones a DTOs
        if (documento.getTipoDocumento() != null) {
            dto.setTipoDocumento(new DocumentoRelacionadoDTO(
                documento.getTipoDocumento().getId(),
                documento.getTipoDocumento().getNombre()
            ));
        }

        if (documento.getAnio() != null) {
            dto.setAnio(new DocumentoRelacionadoDTO(
                documento.getAnio().getId(),
                documento.getAnio().getAnio()
            ));
        }

        // Convertir consejeros
        if (documento.getConsejeros() != null) {
            dto.setConsejeros(documento.getConsejeros().stream()
                .map(c -> new DocumentoRelacionadoDTO(c.getId(), c.getNombre() + " " + c.getApellido()))
                .collect(Collectors.toList()));
        }

        // Convertir comisiones
        if (documento.getComisiones() != null) {
            dto.setComisiones(documento.getComisiones().stream()
                .map(c -> new DocumentoRelacionadoDTO(c.getId(), c.getNombre()))
                .collect(Collectors.toList()));
        }

        return dto;
    }

    @GetMapping
    public List<DocumentoDTO> obtenerDocumentos() {
        return documentoRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    @GetMapping("/tipo/{id}/anio/{anio}")
    @PermitAll // o @PreAuthorize("permitAll()")
    public Page<DocumentoDTO> obtenerDocumentoPorId(
            @PathVariable String id,
            @PathVariable String anio,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "numeroDocumento") String orderBy,
            @RequestParam(defaultValue = "desc") String orderDirection
            ) {
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, orderBy));

        Page<Documento> documentos = documentoService.obtenerDocumentosPorTipoYAnio(
            Integer.parseInt(id),
            Integer.parseInt(anio),
            pageable,
            search
    );

        List<DocumentoDTO> dtos = documentos.getContent().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, documentos.getTotalElements());
    }

    // Los demás métodos se mantienen igual ya que manejan la creación y actualización
    @PostMapping
    public ResponseEntity<?> crearDocumento(
            @RequestParam("file") MultipartFile archivo,
            @RequestParam("tipoDocumentoId") String tipoDocumentoId,
            @RequestParam("anioId") String anioId,
            @RequestParam("numeroDocumento") String numeroDocumento,
            @RequestParam("nombreDocumento") String nombreDocumento,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("fechaEmision") String fechaEmision,
            @RequestParam(value = "activo", defaultValue = "true") String activo,
            @RequestParam(value = "oficinaId", required = false) String oficinaId,
            @RequestParam(value = "tags", required = false) Set<String> tags,
            @RequestParam(value = "consejeroIds", required = false) List<Long> consejeroIds,
            @RequestParam(value = "comisionIds", required = false) List<Long> comisionIds) {

        try {
            Documento documento = documentoService.crearDocumento(
                archivo,
                tipoDocumentoId,
                anioId,
                numeroDocumento,
                nombreDocumento,
                descripcion,
                fechaEmision,
                activo,
                oficinaId,
                tags,
                consejeroIds,
                comisionIds
            );
            return ResponseEntity.ok(convertToDTO(documento));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear el documento: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarDocumento(
            @PathVariable String id,
            @RequestParam(value = "file", required = false) MultipartFile archivo,
            @RequestParam("tipoDocumentoId") String tipoDocumentoId,
            @RequestParam("anioId") String anioId,
            @RequestParam("numeroDocumento") String numeroDocumento,
            @RequestParam("nombreDocumento") String nombreDocumento,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("fechaEmision") String fechaEmision,
            @RequestParam(value = "activo", defaultValue = "true") String activo,
            @RequestParam(value = "oficinaId", required = false) String oficinaId,
            @RequestParam(value = "tags", required = false) Set<String> tags,
            @RequestParam(value = "consejeroIds", required = false) List<Long> consejeroIds,
            @RequestParam(value = "comisionIds", required = false) List<Long> comisionIds) {

        try {
            Documento documento = documentoService.actualizarDocumento(
                archivo,
                id,
                tipoDocumentoId,
                anioId,
                numeroDocumento,
                nombreDocumento,
                descripcion,
                fechaEmision,
                activo,
                oficinaId,
                tags,
                consejeroIds,
                comisionIds
            );
            return ResponseEntity.ok(convertToDTO(documento));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar el documento: " + e.getMessage());
        }
    }

    @GetMapping("/consejeros")
    public ResponseEntity<?> obtenerConsejeros() {
        try {
            List<Consejero> consejeros = consejeroRepository.findAll();
            return ResponseEntity.ok(consejeros.stream()
                .map(c -> new DocumentoRelacionadoDTO(c.getId(), c.getNombre() + " " + c.getApellido()))
                .collect(Collectors.toList()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al obtener consejeros: " + e.getMessage());
        }
    }

    @GetMapping("/comisiones")
    public ResponseEntity<?> obtenerComisiones() {
        try {
            List<Comision> comisiones = comisionRepository.findAll();
            return ResponseEntity.ok(comisiones.stream()
                .map(c -> new DocumentoRelacionadoDTO(c.getId(), c.getNombre()))
                .collect(Collectors.toList()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al obtener comisiones: " + e.getMessage());
        }
    }

    @GetMapping("/consejero/{consejeroId}")
    public ResponseEntity<Page<DocumentoDTO>> obtenerDocumentosPorConsejero(
            @PathVariable Long consejeroId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Documento> documentos = documentoRepository.findByConsejerosId(consejeroId, pageable);
            
            List<DocumentoDTO> dtos = documentos.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

            return ResponseEntity.ok(new PageImpl<>(dtos, pageable, documentos.getTotalElements()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new PageImpl<>(List.of(), PageRequest.of(0, size), 0));
        }
    }

    @PostMapping("/sincronizar")
    public ResponseEntity<DocumetoSyncDTO> sincronizarDocumentos(
        @RequestBody DocumetoSyncDTO documetoSyncDTO
    ) {
        try {
            DocumetoSyncDTO documentoSincronizacion = documentoService.sincronizarDocumentos(documetoSyncDTO);
            return ResponseEntity.ok(documentoSincronizacion);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new DocumetoSyncDTO());
        }
    }

    @PutMapping("/sincronizar/{id}")
    public ResponseEntity<DocumetoSyncDTO> actualizarSincronizacion(
        @PathVariable Long id,
        @RequestBody DocumetoSyncDTO documetoSyncDTO
    ) {
        try {
            documetoSyncDTO.setId(id); 
            DocumetoSyncDTO documentoSincronizacion = documentoService.actualizarSincronizacion(documetoSyncDTO);
            return ResponseEntity.ok(documentoSincronizacion);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new DocumetoSyncDTO());
        }
    }

    @GetMapping("/sincronizar/{codigoEmision}")
    public ResponseEntity<DocuemntoSyncObtenerDTO> obtenerDocumentosSincronizados(@PathVariable String codigoEmision) {
        try {
            DocuemntoSyncObtenerDTO documentoSincronizacion = documentoService.obtenerDocumentoSincronizacion(codigoEmision);
            return ResponseEntity.ok(documentoSincronizacion);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new DocuemntoSyncObtenerDTO());
        }
    }
}
