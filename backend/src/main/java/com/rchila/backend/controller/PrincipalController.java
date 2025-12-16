package com.rchila.backend.controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

import com.rchila.backend.model.Boletin;
import com.rchila.backend.model.Comision;
import com.rchila.backend.model.ConsejeroComision;
import com.rchila.backend.model.ConsejeroGaleria;
import com.rchila.backend.model.Documento;
import com.rchila.backend.model.ActividadImagen;
import com.rchila.backend.model.Agenda;
import com.rchila.backend.model.Noticia;
import com.rchila.backend.model.NoticiaImagen;
import com.rchila.backend.model.TipoDocumento;
import com.rchila.backend.model.dto.BoletinDTO;
import com.rchila.backend.model.dto.NoticiaDTO;
import com.rchila.backend.service.PrincipalService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import com.rchila.backend.model.dto.PrincipalDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import com.rchila.backend.model.Atencion;
import org.springframework.web.bind.annotation.PostMapping;
import com.rchila.backend.model.dto.ConsejeroDTO;
import com.rchila.backend.model.dto.DocumentoPrincipalDTO;
import com.rchila.backend.model.Anuncio;
import org.springframework.data.domain.Sort;
import com.rchila.backend.sgdintegracion.service.DocumentoSgdService;
import com.rchila.backend.repository.TipoDocumentoRepository;
import com.rchila.backend.model.dto.TipoDocumentoDTO;

@RestController
@RequestMapping("/public/principal")
@AllArgsConstructor
public class PrincipalController {

    private final PrincipalService principalService;
    private final DocumentoSgdService documentoSgdService;
    private final TipoDocumentoRepository tipoDocumentoRepository;

    @GetMapping
    public ResponseEntity<PrincipalDTO> getDatosCombinados() {
        try {
            PrincipalDTO datos = principalService.getDatosPrincipales();
            return ResponseEntity.ok(datos);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/consejeros")
    public List<ConsejeroDTO> getAllConsejeros() {
        return principalService.getAllConsejeros();
    }

    @GetMapping("/consejero/{id}")
    public ConsejeroDTO getConsejero(@PathVariable Long id) {
        return principalService.getConsejero(id);
    }

    @GetMapping("/comisiones")
    public List<Comision> getAllComisiones() {
        return principalService.getAllComisiones();
    }

    @GetMapping("/consejero_comision/{id}")
    public List<ConsejeroComision> getConsejeroComision(@PathVariable Long id) {
        return principalService.getConsejeroComision(id);
    }

    @GetMapping("/actividades/{id}")
    public List<NoticiaDTO> getActividades(@PathVariable Long id) {
        return principalService.getActividades(id);
    }

    @GetMapping("/actividad/{id}/imagenes")
    public List<ActividadImagen> getImagenesActividad(@PathVariable Long id) {
        return principalService.getImagenesActividad(id);
    }

    @GetMapping("/documentos/{id}")
    public List<Documento> getDocumentos(@PathVariable Long id) {
        return principalService.getDocumentos(id);
    }

    @GetMapping("/documentos/tipo")
    public List<TipoDocumento> getTiposDocumentos(@RequestParam String grupo) {
        return principalService.getTiposDocumentos(grupo);
    }

    // Noticias

    @GetMapping("/noticias")
    public List<NoticiaDTO> getNoticias() {
        return principalService.getNoticias();
    }

    @GetMapping("/noticia/{id}")
    public Noticia getNoticia(@PathVariable Long id) {
        return principalService.getNoticia(id);
    }

    @GetMapping("/noticia/imagenes/{id}")
    public Page<NoticiaImagen> getImagenesNoticia(@PathVariable Long id) {
        return principalService.getImagenesNoticia(id);
    }

    @GetMapping("/noticia/filtro")
    public Page<NoticiaDTO> getNoticiasFiltro(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size, @RequestParam(required = false) String tag,
            @RequestParam(required = false, value = "titulo") String titulo,
            @RequestParam(required = false, value = "consejero") String consejero,
            @RequestParam(required = false, value = "comision") String comision,
            @RequestParam(required = false, value = "fechaPublicacion") String fechaPublicacion) {
        return principalService.getNoticiasFiltro(
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "fechaPublicacion")),
                tag, titulo, consejero, comision,
                fechaPublicacion);
    }

    ////////////// Noticias consejeros/////////
    @GetMapping("/noticias/consejeros/{id}")
    public List<NoticiaDTO> getNoticiasConsejeros(@PathVariable Long id) {
        return principalService.getNoticiasConsejeros(id);
    }

    ////////////// Noticias comisiones/////////
    @GetMapping("/noticias/comisiones/{id}")
    public List<NoticiaDTO> getNoticiasComisiones(@PathVariable Long id) {
        return principalService.getNoticiasComisiones(id);
    }

    ///
    ///

    @GetMapping("/saludo")
    public String saludo() {
        return "Hola leo pisado";
    }

    @GetMapping("/boletin")
    public List<BoletinDTO> getAllBoletines() {
        return principalService.getAllBoletines();
    }

    @GetMapping("/boletin/{id}")
    public Boletin getBoletin(@PathVariable Long id) {
        return principalService.getBoletin(id);
    }

    /// agendas
    ///
    @GetMapping("/agendas/mes/{mes}")
    public List<Agenda> getAgendaByMes(@PathVariable int mes) {
        return principalService.getAgendaByMes(mes);
    }

    // para crear atenciones
    @PostMapping("/atenciones")
    public ResponseEntity<Atencion> createAtencion(
            @RequestParam(value = "file", required = false) MultipartFile imagen,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "telefono", required = false) String telefono,
            @RequestParam(value = "descripcion", required = false) String descripcion) {
        Atencion atencion = new Atencion();
        atencion.setEmail(email);
        atencion.setTelefono(telefono);
        atencion.setDescripcion(descripcion);
        return ResponseEntity.ok(principalService.createAtencion(imagen, atencion));
    }

    // documentos // buscar
    @GetMapping("/documentos/tipo/{id}")
    public ResponseEntity<Object> getDocumentosByTipo(@PathVariable Long id, @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size, @RequestParam(required = false) String search,
            @RequestParam(required = true) String anio,
            @RequestParam(required = false) String grupo,
            @RequestParam(value = "consejeroId", required = false) Long consejeroId) {
        // try {
        if (anio != null && Integer.parseInt(anio) >= 2025) {

            // obtener el tipo de documento
            TipoDocumentoDTO tipoDocumento = tipoDocumentoRepository.findTipoDocumentoDTOById(id);
            if (tipoDocumento == null) {
                throw new IllegalArgumentException("Tipo de documento no encontrado");
            }

            System.out.println("-------------------------------------------");
            System.out.println("tipo Documento: " + tipoDocumento);
            System.out.println("-------------------------------------------");

            ResponseEntity<Object> responseSgd = documentoSgdService.getDocumentosByTipo(
                    "00004",
                    tipoDocumento.getCodigo(),
                    anio,
                    page,
                    size,
                    search);


            System.out.println("-------------------------------------------");
            System.out.println("responseSgd responseSgd: " + responseSgd);
            System.out.println("-------------------------------------------");

            return responseSgd;
        } else {
            Page<DocumentoPrincipalDTO> documentos = principalService.getDocumentosByTipo(id,
                    PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "numeroDocumento")),
                    search, anio, consejeroId);
            return ResponseEntity.ok(documentos);
        }

    }

    // anuncios
    @GetMapping("/anuncios")
    public ResponseEntity<List<Anuncio>> getAnuncioActivo() {
        // obtener el anuncio activo
        List<Anuncio> anuncios = principalService.getAnuncioActivo();
        return ResponseEntity.ok(anuncios);
    }

    @GetMapping("/{id}/galeria-consejeros")
    public ResponseEntity<Page<ConsejeroGaleria>> getGaleriaConsejeros(@PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String orderBy,
            @RequestParam(defaultValue = "desc") String direction) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction.toUpperCase());
        return ResponseEntity.ok(
                principalService.getGaleriaConsejeros(id, PageRequest.of(page, size, Sort.by(sortDirection, orderBy))));
    }

    // los 4 ultimos de la galeria
    @GetMapping("/{id}/galeria-consejeros/ultimos")
    public ResponseEntity<List<ConsejeroGaleria>> getGaleriaUltimos(@PathVariable Long id) {
        return ResponseEntity.ok(principalService.getGaleriaUltimos(id));
    }

}
