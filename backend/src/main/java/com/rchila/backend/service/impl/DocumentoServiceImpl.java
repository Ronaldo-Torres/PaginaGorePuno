package com.rchila.backend.service.impl;

import org.springframework.stereotype.Service;
import com.rchila.backend.service.DocumentoService;
import com.rchila.backend.model.Documento;
import com.rchila.backend.model.TipoDocumento;
import com.rchila.backend.model.Anio;
import com.rchila.backend.model.Consejero;
import com.rchila.backend.model.Comision;
import com.rchila.backend.repository.DocumentoRepository;
import com.rchila.backend.repository.TipoDocumentoRepository;
import com.rchila.backend.repository.AnioRepository;
import com.rchila.backend.repository.ConsejeroRepository;
import com.rchila.backend.repository.ComisionRepository;
import com.rchila.backend.service.StorageService;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Set;
import java.util.Optional;
import java.sql.Date;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import lombok.AllArgsConstructor;       
import com.rchila.backend.model.DocumentoSincronizacion;
import com.rchila.backend.model.dto.DocumetoSyncDTO;
import com.rchila.backend.model.dto.DocuemntoSyncObtenerDTO;
import com.rchila.backend.model.dto.ConsejeroDTO;
import com.rchila.backend.model.dto.ComisionDTO;
import com.rchila.backend.repository.DocumentoSincronizacionRepository;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class DocumentoServiceImpl implements DocumentoService {
    private final DocumentoRepository documentoRepository;
    private final TipoDocumentoRepository tipoDocumentoRepository;
    private final AnioRepository anioRepository;
    private final ConsejeroRepository consejeroRepository;
    private final ComisionRepository comisionRepository;
    private final StorageService storageService;
    private final DocumentoSincronizacionRepository documentoSincronizacionRepository;

    @Override
    public Documento crearDocumento(
            MultipartFile archivo,
            String tipoDocumentoId,
            String anioId,
            String numeroDocumento,
            String nombreDocumento,
            String descripcion,
            String fechaEmision,
            String activo,
            String oficinaId,
            Set<String> tags,
            List<Long> consejeroIds,
            List<Long> comisionIds) {
        
        Documento documento = new Documento();
        documento.setNumeroDocumento(numeroDocumento);
        documento.setNombreDocumento(nombreDocumento);
        documento.setDescripcion(descripcion);
        documento.setFechaEmision(Date.valueOf(fechaEmision));
        documento.setActivo("on".equals(activo) || "true".equals(activo));
        
        // Establecer tags
        if (tags != null) {
            documento.setTagsDocumento(tags);
        }

        // Establecer consejeros
        if (consejeroIds != null && !consejeroIds.isEmpty()) {
            List<Consejero> consejeros = consejeroRepository.findAllById(consejeroIds);
            documento.setConsejeros(consejeros);
        }

        // Establecer comisiones
        if (comisionIds != null && !comisionIds.isEmpty()) {
            List<Comision> comisiones = comisionRepository.findAllById(comisionIds);
            documento.setComisiones(comisiones);
        }

        // Buscar y establecer TipoDocumento
        Optional<TipoDocumento> tipoDocumentoOpt = tipoDocumentoRepository.findById(Long.parseLong(tipoDocumentoId));
        tipoDocumentoOpt.ifPresent(documento::setTipoDocumento);

        // Buscar y establecer Año
        Optional<Anio> anioOpt = anioRepository.findById(Long.parseLong(anioId));
        anioOpt.ifPresent(documento::setAnio);

        // Guardar archivo si existe
        if (archivo != null && !archivo.isEmpty()) {
            String urlArchivo = storageService.guardarDocumento(archivo, documento);
            documento.setUrlDocumento(urlArchivo);
        }

        return documentoRepository.save(documento);
    }

    @Override
    public Documento actualizarDocumento(
            MultipartFile archivo,
            String id,
            String tipoDocumentoId,
            String anioId,
            String numeroDocumento,
            String nombreDocumento,
            String descripcion,
            String fechaEmision,
            String activo,
            String oficinaId,
            Set<String> tags,
            List<Long> consejeroIds,
            List<Long> comisionIds) {

        Optional<Documento> documentoOpt = documentoRepository.findById(Long.parseLong(id));
        if (documentoOpt.isEmpty()) {
            throw new RuntimeException("Documento no encontrado");
        }

        Documento documento = documentoOpt.get();
        
        // Actualizar campos básicos si se proporcionan
        if (numeroDocumento != null) documento.setNumeroDocumento(numeroDocumento);
        if (nombreDocumento != null) documento.setNombreDocumento(nombreDocumento);
        if (descripcion != null) documento.setDescripcion(descripcion);
        if (fechaEmision != null) documento.setFechaEmision(Date.valueOf(fechaEmision));
        if (activo != null) documento.setActivo("on".equals(activo) || "true".equals(activo));

        // Actualizar tags si se proporcionan
        if (tags != null) {
            documento.setTagsDocumento(tags);
        }

        // Actualizar consejeros si se proporcionan
        if (consejeroIds != null) {
            List<Consejero> consejeros = consejeroRepository.findAllById(consejeroIds);
            documento.setConsejeros(consejeros);
        }

        // Actualizar comisiones si se proporcionan
        if (comisionIds != null) {
            List<Comision> comisiones = comisionRepository.findAllById(comisionIds);
            documento.setComisiones(comisiones);
        }

        // Actualizar TipoDocumento si se proporciona
        if (tipoDocumentoId != null) {
            Optional<TipoDocumento> tipoDocumentoOpt = tipoDocumentoRepository.findById(Long.parseLong(tipoDocumentoId));
            tipoDocumentoOpt.ifPresent(documento::setTipoDocumento);
        }

        // Actualizar Año si se proporciona
        if (anioId != null) {
            Optional<Anio> anioOpt = anioRepository.findById(Long.parseLong(anioId));
            anioOpt.ifPresent(documento::setAnio);
        }

        // Actualizar archivo solo si se proporciona uno nuevo
        if (archivo != null && !archivo.isEmpty()) {
            // Eliminar archivo anterior si existe
            if (documento.getUrlDocumento() != null) {
                storageService.eliminarArchivo(documento.getUrlDocumento());
            }
            String urlArchivo = storageService.guardarDocumento(archivo, documento);
            documento.setUrlDocumento(urlArchivo);
        }
        // Si no se proporciona archivo, mantener el archivo existente

        return documentoRepository.save(documento);
    }

    @Override
    public Page<Documento> obtenerDocumentosPorTipoYAnio(Integer idDocumento, Integer anioId, Pageable pageable, String search) {
        Specification<Documento> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            predicates.add(cb.equal(root.get("tipoDocumento").get("id"), idDocumento));
            predicates.add(cb.equal(root.get("anio").get("id"), anioId));

            if (search != null && !search.isEmpty()) {
                List<Predicate> searchPredicates = new ArrayList<>();
                String searchLower = "%" + search.toLowerCase() + "%";
                
                searchPredicates.add(cb.like(cb.lower(root.get("nombreDocumento")), searchLower));
                searchPredicates.add(cb.like(cb.lower(root.get("numeroDocumento")), searchLower));
                searchPredicates.add(cb.like(cb.lower(root.get("descripcion")), searchLower));
                predicates.add(cb.or(searchPredicates.toArray(new Predicate[0])));
            }

            query.orderBy(cb.desc(root.get("createdAt")));
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return documentoRepository.findAll(spec, pageable);
    }


    @Override
    public DocumetoSyncDTO sincronizarDocumentos(DocumetoSyncDTO documetoSyncDTO) {
        try {
            System.out.println("=== INICIANDO SINCRONIZACIÓN ===");
            DocumentoSincronizacion documentoSincronizacion = new DocumentoSincronizacion();
            documentoSincronizacion.setCodigoEmision(documetoSyncDTO.getCodigoEmision());
            System.out.println("Código emisión establecido: " + documetoSyncDTO.getCodigoEmision());
            
            // Convertir tags a Set<String>
            if (documetoSyncDTO.getTags() != null && !documetoSyncDTO.getTags().isEmpty()) {
                documentoSincronizacion.setTagsDocumento(new HashSet<>(documetoSyncDTO.getTags()));
                System.out.println("Tags establecidos: " + documetoSyncDTO.getTags());
            }
            
                        // Buscar y asignar consejeros por IDs
            if (documetoSyncDTO.getConsejeros() != null && !documetoSyncDTO.getConsejeros().isEmpty()) {
                List<Integer> consejeroIds = documetoSyncDTO.getConsejeros();
                System.out.println("IDs de consejeros recibidos: " + consejeroIds);
                List<Consejero> consejeros = consejeroRepository.findAllById(consejeroIds.stream().map(Long::valueOf).collect(Collectors.toList()));
                documentoSincronizacion.setConsejeros(consejeros);
                System.out.println("Consejeros encontrados: " + consejeros.size());
            }
            
            // Buscar y asignar comisiones por IDs  
            if (documetoSyncDTO.getComisiones() != null && !documetoSyncDTO.getComisiones().isEmpty()) {
                List<Integer> comisionIds = documetoSyncDTO.getComisiones();
                System.out.println("IDs de comisiones recibidos: " + comisionIds);
                List<Comision> comisiones = comisionRepository.findAllById(comisionIds.stream().map(Long::valueOf).collect(Collectors.toList()));
                documentoSincronizacion.setComisiones(comisiones);
                System.out.println("Comisiones encontradas: " + comisiones.size());
            }
            
            System.out.println("Guardando en base de datos...");
            DocumentoSincronizacion savedDoc = documentoSincronizacionRepository.save(documentoSincronizacion);
            System.out.println("Documento sincronizado guardado con ID: " + savedDoc.getId());
            System.out.println("=== SINCRONIZACIÓN COMPLETADA ===");

            return documetoSyncDTO;
        } catch (Exception e) {
            System.err.println("ERROR en sincronización: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }


    @Override
    public DocumetoSyncDTO actualizarSincronizacion(DocumetoSyncDTO documetoSyncDTO) {
        try {
            System.out.println("=== ACTUALIZANDO SINCRONIZACIÓN ===");
            System.out.println("ID a actualizar: " + documetoSyncDTO.getId());
            
            // Buscar el documento existente
            Optional<DocumentoSincronizacion> existente = documentoSincronizacionRepository.findById(documetoSyncDTO.getId());
            if (existente.isEmpty()) {
                throw new RuntimeException("Sincronización no encontrada con ID: " + documetoSyncDTO.getId());
            }
            
            DocumentoSincronizacion documentoSincronizacion = existente.get();
            
            // Actualizar código emisión
            documentoSincronizacion.setCodigoEmision(documetoSyncDTO.getCodigoEmision());
            System.out.println("Código emisión actualizado: " + documetoSyncDTO.getCodigoEmision());
            
            // Actualizar tags
            if (documetoSyncDTO.getTags() != null) {
                documentoSincronizacion.setTagsDocumento(new HashSet<>(documetoSyncDTO.getTags()));
                System.out.println("Tags actualizados: " + documetoSyncDTO.getTags());
            }
            
            // Actualizar consejeros
            if (documetoSyncDTO.getConsejeros() != null) {
                List<Integer> consejeroIds = documetoSyncDTO.getConsejeros();
                System.out.println("IDs de consejeros recibidos: " + consejeroIds);
                List<Consejero> consejeros = consejeroRepository.findAllById(consejeroIds.stream().map(Long::valueOf).collect(Collectors.toList()));
                documentoSincronizacion.setConsejeros(consejeros);
                System.out.println("Consejeros actualizados: " + consejeros.size());
            }
            
            // Actualizar comisiones
            if (documetoSyncDTO.getComisiones() != null) {
                List<Integer> comisionIds = documetoSyncDTO.getComisiones();
                System.out.println("IDs de comisiones recibidos: " + comisionIds);
                List<Comision> comisiones = comisionRepository.findAllById(comisionIds.stream().map(Long::valueOf).collect(Collectors.toList()));
                documentoSincronizacion.setComisiones(comisiones);
                System.out.println("Comisiones actualizadas: " + comisiones.size());
            }
            
            System.out.println("Guardando actualización en base de datos...");
            DocumentoSincronizacion savedDoc = documentoSincronizacionRepository.save(documentoSincronizacion);
            System.out.println("Sincronización actualizada con ID: " + savedDoc.getId());
            System.out.println("=== ACTUALIZACIÓN COMPLETADA ===");

            return documetoSyncDTO;
        } catch (Exception e) {
            System.err.println("ERROR en actualización: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public DocuemntoSyncObtenerDTO obtenerDocumentoSincronizacion(String codigoEmision) {
        DocumentoSincronizacion documentoSincronizacion = documentoSincronizacionRepository.findByCodigoEmision(codigoEmision);
        DocuemntoSyncObtenerDTO docuemntoSyncObtenerDTO = new DocuemntoSyncObtenerDTO();
        docuemntoSyncObtenerDTO.setCodigoEmision(documentoSincronizacion.getCodigoEmision());
        docuemntoSyncObtenerDTO.setTags(new ArrayList<>(documentoSincronizacion.getTagsDocumento()));
        docuemntoSyncObtenerDTO.setConsejeros(documentoSincronizacion.getConsejeros().stream()
            .map(c -> { ConsejeroDTO dto = new ConsejeroDTO(); dto.setId(c.getId()); return dto; })
            .collect(Collectors.toList()));
        docuemntoSyncObtenerDTO.setComisiones(documentoSincronizacion.getComisiones().stream()
            .map(c -> { ComisionDTO dto = new ComisionDTO(); dto.setId(c.getId()); return dto; })
            .collect(Collectors.toList()));
        docuemntoSyncObtenerDTO.setId(documentoSincronizacion.getId());
        return docuemntoSyncObtenerDTO;
    }
}
