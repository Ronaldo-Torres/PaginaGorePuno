package com.rchila.backend.service;

import java.util.List;

import com.rchila.backend.model.Anuncio;
import com.rchila.backend.model.Comision;
import com.rchila.backend.model.Parametro;
import com.rchila.backend.model.ConsejeroComision;
import com.rchila.backend.model.Documento;
import com.rchila.backend.model.ActividadImagen;
import com.rchila.backend.model.TipoDocumento;
import com.rchila.backend.model.Noticia;
import com.rchila.backend.model.NoticiaImagen;
import com.rchila.backend.model.Boletin;
import com.rchila.backend.model.dto.BoletinDTO;
import com.rchila.backend.model.dto.NoticiaDTO;
import com.rchila.backend.model.dto.PortadaDTO;
import com.rchila.backend.model.dto.PrincipalDTO;
import com.rchila.backend.model.dto.LinkInteresDTO;
import com.rchila.backend.model.dto.ServicioDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;
import com.rchila.backend.model.Agenda;
import com.rchila.backend.model.Atencion;
import com.rchila.backend.model.dto.ConsejeroDTO;
import com.rchila.backend.model.ConsejeroGaleria;   
import com.rchila.backend.model.dto.DocumentoPrincipalDTO;

public interface PrincipalService {

    List<PortadaDTO> getAllPortadas();
    List<LinkInteresDTO> getAllLinkInteres();
    List<ServicioDTO> getAllServicios();

    Parametro getParametro(Long id);
    List<Anuncio> getAnuncios(Boolean estado);

    List<ConsejeroDTO> getAllConsejeros();

    ConsejeroDTO getConsejero(Long id);

    List<Comision> getAllComisiones();

    List<ConsejeroComision> getConsejeroComision(Long id);

    List<NoticiaDTO> getActividades(Long id);

    List<ActividadImagen> getImagenesActividad(Long id);

    List<Documento> getDocumentos(Long id);

    List<TipoDocumento> getTiposDocumentos(String grupo);

    //// noticias
    List<NoticiaDTO> getNoticias();

    Noticia getNoticia(Long id);

    Page<NoticiaImagen> getImagenesNoticia(Long id);

    Page<NoticiaDTO> getNoticiasFiltro(Pageable pageable, String tag, String titulo, String consejero, String comision,
            String fechaPublicacion);

    ////// boletines
    List<BoletinDTO> getAllBoletines();

    Boletin getBoletin(Long id);

    ////// agendas
    List<Agenda> getAgendaByMes(int mes);

    PrincipalDTO getDatosPrincipales();

    ////// atenciones
    Atencion createAtencion(MultipartFile imagen, Atencion atencion);

    ////// noticias consejeros
    List<NoticiaDTO> getNoticiasConsejeros(Long id);

    ////// noticias comisiones
    List<NoticiaDTO> getNoticiasComisiones(Long id);

    ////// documentos
    Page<DocumentoPrincipalDTO> getDocumentosByTipo(Long id, Pageable pageable, String search, String anio, Long consejeroId);


    ////// anuncios
    List<Anuncio> getAnuncioActivo();

    ////// consejero galeria
    Page<ConsejeroGaleria> getGaleriaConsejeros(Long id, Pageable pageable);

    ////// consejero galeria ultimos
    List<ConsejeroGaleria> getGaleriaUltimos(Long id);
}
