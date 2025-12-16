package com.rchila.backend.service.impl;

import java.util.List;
import java.util.ArrayList;
import java.util.Comparator;
import jakarta.persistence.criteria.Predicate;

import org.springframework.data.domain.Pageable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.rchila.backend.service.PrincipalService;
import com.rchila.backend.mapper.DocumentoMapper;
import com.rchila.backend.repository.PortadaRepository;
import com.rchila.backend.repository.AnuncioRepository;
import com.rchila.backend.repository.ConsejeroRepository;
import com.rchila.backend.repository.DocumentoRepository;
import com.rchila.backend.repository.LinkInteresRepository;

import com.rchila.backend.repository.ParametroRepository;
import com.rchila.backend.repository.ServicioRepository;
import com.rchila.backend.repository.TipoDocumentoRepository;
import com.rchila.backend.model.Portada;
import com.rchila.backend.mapper.NoticiaMapper;
import com.rchila.backend.model.Anuncio;
import com.rchila.backend.model.Comision;
import com.rchila.backend.model.LinkInteres;
import com.rchila.backend.model.Servicio;
import com.rchila.backend.model.TipoDocumento;
import com.rchila.backend.model.dto.BoletinDTO;
import com.rchila.backend.model.dto.NoticiaDTO;
import com.rchila.backend.model.Parametro;
import com.rchila.backend.model.Consejero;
import com.rchila.backend.model.ConsejeroComision;
import com.rchila.backend.model.Documento;
import com.rchila.backend.repository.ComisionRepository;
import com.rchila.backend.repository.ConsejeroComisionRepository;
import com.rchila.backend.repository.ActividadImagenRepository;
import com.rchila.backend.model.ActividadImagen;
import com.rchila.backend.repository.NoticiaRepository;
import com.rchila.backend.repository.BoletinRepository;
import com.rchila.backend.repository.AnioRepository;
import com.rchila.backend.model.Noticia;
import com.rchila.backend.model.NoticiaImagen;
import com.rchila.backend.model.Boletin;
import java.util.Collections;
import java.time.LocalDate;

import com.rchila.backend.repository.NoticiaImagenRepository;
import org.springframework.data.domain.Page;
import com.rchila.backend.model.Agenda;
import com.rchila.backend.model.Anio;
import com.rchila.backend.repository.AgendaRepository;
import com.rchila.backend.model.dto.PortadaDTO;
import java.util.stream.Collectors;
import com.rchila.backend.model.dto.PrincipalDTO;
import com.rchila.backend.model.dto.LinkInteresDTO;
import com.rchila.backend.model.dto.MesaDTO;
import com.rchila.backend.model.dto.ServicioDTO;
import com.rchila.backend.model.Atencion;
import org.springframework.web.multipart.MultipartFile;
import com.rchila.backend.repository.AtencionRepository;
import com.rchila.backend.service.StorageService;
import com.rchila.backend.model.dto.ConsejeroDTO;
import com.rchila.backend.model.dto.ComisionDTO;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import com.rchila.backend.model.dto.DocumentoDTO;
import com.rchila.backend.model.dto.DocumentoPrincipalDTO;
import com.rchila.backend.model.dto.DocumentoRelacionadoDTO;
import lombok.AllArgsConstructor;
import com.rchila.backend.model.ConsejeroGaleria;
import com.rchila.backend.repository.ConsejeroGaleriaRepository;
@Service
@AllArgsConstructor
public class PrincipalServiceImpl implements PrincipalService {

    private final PortadaRepository portadaRepository;
    private final LinkInteresRepository linkInteresRepository;
    private final ServicioRepository servicioRepository;
    private final ParametroRepository parametroRepository;
    private final AnuncioRepository anuncioRepository;
    private final ConsejeroRepository consejeroRepository;
    private final ComisionRepository comisionRepository;
    private final ConsejeroComisionRepository consejeroComisionRepository;
    private final ActividadImagenRepository actividadImagenRepository;
    private final DocumentoRepository documentoRepository;
    private final TipoDocumentoRepository tipoDocumentoRepository;
    private final NoticiaRepository noticiaRepository;
    private final BoletinRepository boletinRepository;
    private final NoticiaImagenRepository noticiaImagenRepository;
    private final AgendaRepository agendaRepository;
    private final AtencionRepository atencionRepository;
    private final StorageService storageService;
    private final NoticiaMapper noticiaMapper;
    private final AnioRepository anioRepository;
    private final ConsejeroGaleriaRepository consejeroGaleriaRepository;

    @Override
    public List<PortadaDTO> getAllPortadas() {
        Boolean activo = true;
        List<Portada> portadas = portadaRepository.findByActivo(activo);
        return portadas.stream()
                .map(portada -> new PortadaDTO(portada.getId(), portada.getTitulo(), portada.getSubtitulo(),
                        portada.getDescripcion(), portada.getNombreBoton(), portada.getUrlBoton(),
                        portada.getImagen()))
                .collect(Collectors.toList());
    }

    @Override
    public List<LinkInteresDTO> getAllLinkInteres() {
        Boolean activo = true;
        List<LinkInteres> linkInteres = linkInteresRepository.findByActivo(activo);
        return linkInteres.stream()
                .map(link -> new LinkInteresDTO(link.getId(), link.getNombre(), link.getUrl(), link.getImagen()))
                .collect(Collectors.toList());
    }

    @Override
    public List<ServicioDTO> getAllServicios() {
        Boolean activo = true;
        List<Servicio> servicios = servicioRepository.findByActivo(activo);
        return servicios.stream()
                .map(servicio -> new ServicioDTO(servicio.getId(), servicio.getNombre(), servicio.getDescripcion(),
                        servicio.getImagen(), servicio.getUrl(), servicio.getIcono()))
                .collect(Collectors.toList());
    }

    @Override
    public Parametro getParametro(Long id) {
        return parametroRepository.findById(id).orElse(null);
    }

    @Override
    public List<Anuncio> getAnuncios(Boolean activo) {
        return anuncioRepository.findByActivo(activo);
    }

    @Override
    public List<ConsejeroDTO> getAllConsejeros() {
        Boolean activo = true;
        List<Consejero> consejeros = consejeroRepository.findByActivoOrderByProvinciaAsc(activo);
        List<ConsejeroDTO> consejerosDTO = new ArrayList<>();
        for (Consejero consejero : consejeros) {
            consejerosDTO.add(new ConsejeroDTO(consejero));
        }
        return consejerosDTO;
    }

    @Override
    public ConsejeroDTO getConsejero(Long id) {
        Consejero consejero = consejeroRepository.findByIdAndActivo(id, true);
        if (consejero == null) {
            return null;
        }

        // lista de comisiones
        List<ConsejeroComision> consejeroComisiones = consejeroComisionRepository.findByConsejeroId(consejero.getId());

        // Obtener las últimas noticias
        List<NoticiaDTO> noticiasDTO = getNoticiasConsejeros(consejero.getId());
        noticiasDTO.sort(Comparator.comparing(NoticiaDTO::getFechaPublicacion).reversed());
        if (noticiasDTO.size() > 5) {
            noticiasDTO = noticiasDTO.subList(0, 4);
        }

        // Obtener los últimos 6 documentos asociados
        Page<Documento> documentosPage = documentoRepository.findByConsejerosId(consejero.getId(), 
            PageRequest.of(0, 6, Sort.by(Sort.Direction.DESC, "fechaEmision")));
        List<DocumentoDTO> documentosDTO = documentosPage.getContent().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());

        List<ComisionDTO> comisionesDTO = new ArrayList<>();
        for (ConsejeroComision consejeroComision : consejeroComisiones) {
            comisionesDTO.add(new ComisionDTO(
                    consejeroComision.getComision().getId(),
                    consejeroComision.getComision().getNombre(),
                    consejeroComision.getCargo()));
        }

        ConsejeroDTO consejeroDTO = new ConsejeroDTO(consejero);
        consejeroDTO.setComisiones(comisionesDTO);
        consejeroDTO.setNoticias(noticiasDTO);
        consejeroDTO.setDocumentos(documentosDTO);
        return consejeroDTO;
    }

    @Override
    public List<Comision> getAllComisiones() {
        Boolean activo = true;
        return comisionRepository.findByActivo(activo);
    }

    @Override
    public List<ConsejeroComision> getConsejeroComision(Long id) {
        return consejeroComisionRepository.findByComisionId(id);
    }

    @Override
    public List<NoticiaDTO> getActividades(Long id) {
        List<Noticia> noticias = noticiaRepository.findByComisionId(id);
        List<NoticiaDTO> noticiasDTO = new ArrayList<>();
        for (Noticia noticia : noticias) {
            noticiasDTO.add(new NoticiaDTO(noticia.getId(), noticia.getGorro(), noticia.getTitulo(),
                    noticia.getBajada(), noticia.getIntroduccion(), null, noticia.getFechaPublicacion()));
        }
        return noticiasDTO;
    }

    @Override
    public List<ActividadImagen> getImagenesActividad(Long id) {
        return actividadImagenRepository.findByActividadId(id);
    }

    @Override
    public List<Documento> getDocumentos(Long id) {
        return null;
    }

    @Override
    public List<TipoDocumento> getTiposDocumentos(String grupo) {
        Boolean activo = true;
        return tipoDocumentoRepository.findByActivoAndGrupo(activo, grupo);
    }

    /////// noticias

    @Override
    public List<NoticiaDTO> getNoticias() {
        List<NoticiaDTO> result = new ArrayList<>();

        // Obtener 1 noticia destacada
        List<NoticiaDTO> destacada = noticiaRepository.findDestacadas();
        if (!destacada.isEmpty()) {
            result.add(destacada.get(0)); // Solo agregamos una noticia destacada
        }

        // Obtener hasta 4 noticias destacadas antiguas
        List<NoticiaDTO> destacadasAntiguas = noticiaRepository.findDestacadasAntiguas();
        if (destacadasAntiguas.size() > 4) {
            destacadasAntiguas = destacadasAntiguas.subList(0, 4); // Limitar a 4 noticias destacadas antiguas
        }
        result.addAll(destacadasAntiguas);

        // Obtener las noticias normales (el resto)
        List<NoticiaDTO> normales = noticiaRepository.findNormales();
        result.addAll(normales);

        // Limitar el total de noticias a 20
        return result.size() > 20 ? result.subList(0, 20) : result;
    }

    @Override
    public Noticia getNoticia(Long id) {
        return noticiaRepository.findById(id).orElse(null);
    }

    @Override
    public Page<NoticiaImagen> getImagenesNoticia(Long id) {
        return noticiaImagenRepository.findByNoticiaId(id, Pageable.ofSize(10));
    }

    public Page<NoticiaDTO> getNoticiasFiltro(Pageable pageable, String tag, String titulo, String consejero,
            String comision, String fechaPublicacion) {
        Specification<Noticia> spec = Specification.where(null);

        if (tag != null && !tag.isBlank()) {
            spec = spec.and((root, query, cb) -> {
                Join<Noticia, String> tagJoin = root.join("tags", JoinType.INNER);
                return cb.like(tagJoin, "%" + tag + "%");
            });
        }

        if (titulo != null && !titulo.isBlank()) {
            spec = spec
                    .and((root, query, cb) -> cb.like(cb.lower(root.get("titulo")), "%" + titulo.toLowerCase() + "%"));
        }

        if (consejero != null && !consejero.isBlank()) {
            spec = spec.and((root, query, cb) -> {
                Join<Noticia, Consejero> join = root.join("consejeros", JoinType.INNER);
                return cb.equal(join.get("nombre"), consejero);
            });
        }

        if (comision != null && !comision.isBlank()) {
            spec = spec.and((root, query, cb) -> {
                Join<Noticia, Comision> join = root.join("comisiones", JoinType.INNER);
                return cb.equal(join.get("nombre"), comision);
            });
        }

        if (fechaPublicacion != null && !fechaPublicacion.isBlank()) {
            LocalDate fecha = LocalDate.parse(fechaPublicacion);
            spec = spec.and((root, query, cb) -> cb.equal(root.get("fechaPublicacion"), fecha));
        }

        Page<Noticia> noticias = noticiaRepository.findAll(spec, pageable);
        return noticias.map(noticia -> {
            NoticiaDTO dto = noticiaMapper.toDto(noticia);
            Page<NoticiaImagen> imagenes = noticiaImagenRepository.findByNoticiaId(noticia.getId(),
                    Pageable.ofSize(1));
            if (!imagenes.isEmpty()) {
                dto.setUrlImagenPrincipal(Collections.singletonList(imagenes.getContent().get(0).getUrl()));
            }
            return dto;
        });
    }

    //////////////////
    // OJO no esta funcionando
    @Override
    public List<BoletinDTO> getAllBoletines() {
        List<BoletinDTO> boletines = boletinRepository.findAllBoletinesConImagenPrincipal();

        for (BoletinDTO boletin : boletines) {
            String imagenUrl = boletin.getImagenPrincipalUrl();
            if (imagenUrl == null || imagenUrl.isEmpty()) {
                boletin.setImagenPrincipalUrl((String) null);
            }
        }
        return boletines;
    }
    // OJO no esta funcionando

    @Override
    public Boletin getBoletin(Long id) {
        return boletinRepository.findById(id).orElse(null);
    }

    @Override
    public List<Agenda> getAgendaByMes(int mes) {
        Boolean publico = true;
        return agendaRepository.findByMesAndPublico(mes, publico);
    }

    @Override
    public PrincipalDTO getDatosPrincipales() {
        try {
            List<PortadaDTO> portadas = getAllPortadas();
            List<LinkInteresDTO> linkInteres = getAllLinkInteres();
            List<ServicioDTO> servicios = getAllServicios();
            List<MesaDTO> mesaDirectiva = getAllMesaDirectiva();
            Parametro parametro = getParametro(1L);

            // Validaciones básicas (opcional)
            portadas = portadas != null ? portadas : Collections.emptyList();
            linkInteres = linkInteres != null ? linkInteres : Collections.emptyList();
            servicios = servicios != null ? servicios : Collections.emptyList();
            parametro = parametro != null ? parametro : new Parametro();
            mesaDirectiva = mesaDirectiva != null ? mesaDirectiva : Collections.emptyList();

            return new PrincipalDTO(portadas, linkInteres, servicios, mesaDirectiva, parametro);

        } catch (Exception e) {
            // Log del error
            System.err.println("Error al obtener datos principales: " + e.getMessage());
            // Retornar datos vacíos en caso de error
            return new PrincipalDTO(
                    Collections.emptyList(),
                    Collections.emptyList(),
                    Collections.emptyList(),
                    Collections.emptyList(),
                    null);
        }
    }

    @Override
    public Atencion createAtencion(MultipartFile imagen, Atencion atencion) {
        // guardar imagen

        if (imagen != null) {
            String imagenUrl = storageService.guardarArchivo(imagen, null, null, "atenciones");
            atencion.setImagen(imagenUrl);
        }

        return atencionRepository.save(atencion);
    }

    @Override
    public List<NoticiaDTO> getNoticiasConsejeros(Long id) {
        List<Noticia> noticias = noticiaRepository.findByConsejeroId(id);
        List<NoticiaDTO> noticiasDTO = new ArrayList<>();
        for (Noticia noticia : noticias) {
            noticiasDTO.add(new NoticiaDTO(noticia.getId(), noticia.getGorro(), noticia.getTitulo(),
                    noticia.getBajada(), noticia.getIntroduccion(), null, noticia.getFechaPublicacion()));
        }
        return noticiasDTO;
    }

    @Override
    public List<NoticiaDTO> getNoticiasComisiones(Long id) {
        List<Noticia> noticias = noticiaRepository.findByComisionId(id);
        List<NoticiaDTO> noticiasDTO = new ArrayList<>();
        for (Noticia noticia : noticias) {
            noticiasDTO.add(new NoticiaDTO(noticia.getId(), noticia.getGorro(), noticia.getTitulo(),
                    noticia.getBajada(), noticia.getIntroduccion(), null, noticia.getFechaPublicacion()));
        }
        return noticiasDTO;
    }

    @Autowired
    private DocumentoMapper documentoMapper;

    @Override
    public Page<DocumentoPrincipalDTO> getDocumentosByTipo(Long id, Pageable pageable, String search, String anio, Long consejeroId) {
        if (anio == null || anio.isBlank()) {
            throw new IllegalArgumentException("El año es requerido para buscar documentos.");
        }
        
        Anio anioObtenido = anioRepository.findByAnio(anio);
        if (anioObtenido == null) {
            throw new IllegalArgumentException("Año no encontrado: " + anio);
        }
        final Long anioId = anioObtenido.getId();

        // Crear especificación base con predicados comunes
        Specification<Documento> specification = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            // Filtro por tipo de documento (obligatorio)
            predicates.add(cb.equal(root.get("tipoDocumento").get("id"), id.intValue()));

            // Filtro por año (obligatorio)
            predicates.add(cb.equal(root.get("anio").get("id"), anioId.intValue()));

            // Filtro por consejero si está presente
            if (consejeroId != null) {
                predicates.add(cb.equal(root.join("consejeros").get("id"), consejeroId));
            }

            // Agregar predicados de búsqueda si hay término de búsqueda
            if (search != null && !search.isBlank()) {
                String likeSearch = "%" + search.toLowerCase() + "%";
                Predicate searchPredicate = cb.or(
                    cb.like(cb.lower(root.get("numeroDocumento")), likeSearch),
                    cb.like(cb.lower(root.get("nombreDocumento")), likeSearch),
                    cb.like(cb.lower(root.get("descripcion")), likeSearch)
                );
                predicates.add(searchPredicate);
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Documento> documentos = documentoRepository.findAll(specification, pageable);
        return documentos.map(documentoMapper::toDocumentoPrincipalDTO);
    }





    public List<MesaDTO> getAllMesaDirectiva() {
        List<Consejero> mesaDirectiva = consejeroRepository.findAll();
        // ordenar por cargo presidente, vice presidente, secretario, etc
        mesaDirectiva.sort(Comparator.comparing(Consejero::getCargo));
        // si el cargo es presidente, vice presidente, secretario, etc, entonces es mesa directiva
        mesaDirectiva = mesaDirectiva.stream()
                .filter(mesa -> mesa.getCargo().equals("PRESIDENTE") || mesa.getCargo().equals("VICEPRESIDENTE")
                        || mesa.getCargo().equals("VICESECRETARIO") || mesa.getCargo().equals("VICESECRETARIO"))
                .collect(Collectors.toList());

        // ordenar por cargo
        mesaDirectiva.sort(Comparator.comparing(Consejero::getCargo));

        return mesaDirectiva.stream()
                .map(mesa -> new MesaDTO(
                    mesa.getId(), 
                    mesa.getNombre(), 
                    mesa.getApellido(), 
                    mesa.getDni(),
                    mesa.getCargo(), 
                    mesa.getDescripcion(), 
                    mesa.getCorreo(), 
                    mesa.getTelefono(), 
                    null, 
                    mesa.getDireccion(), 
                    mesa.getActivo(), 
                    mesa.getProvincia(), 
                    mesa.getUrl_imagen(), 
                    mesa.getDocumento(), mesa.getFacebook(), mesa.getTwitter(), mesa.getInstagram()))
                .collect(Collectors.toList());
    }

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

        return dto;
    }

    @Override
    public List<Anuncio> getAnuncioActivo() {
        //solo retornar el primero
        return anuncioRepository.findByActivo(true);
    }

    @Override
    public Page<ConsejeroGaleria> getGaleriaConsejeros(Long id , Pageable pageable) {
        return consejeroGaleriaRepository.findByConsejeroId(id, pageable);
    }

    //odenamdo de mas reciente por createdAt
    @Override
    public List<ConsejeroGaleria> getGaleriaUltimos(Long id) {
        List<ConsejeroGaleria> galeria = consejeroGaleriaRepository.findByConsejeroId(id);
        galeria.sort(Comparator.comparing(ConsejeroGaleria::getCreatedAt).reversed());
        return galeria.subList(0, Math.min(4, galeria.size()));
    }
}
