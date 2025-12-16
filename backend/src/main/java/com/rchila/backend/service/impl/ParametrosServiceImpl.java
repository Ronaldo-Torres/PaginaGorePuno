package com.rchila.backend.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.rchila.backend.service.ParametrosService;
import com.rchila.backend.model.Parametro;
import com.rchila.backend.repository.ParametroRepository;
import java.util.Optional;
import com.rchila.backend.service.StorageService;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ParametrosServiceImpl implements ParametrosService {

        private final ParametroRepository parametroRepository;

        private final StorageService storageService;

        @Override
        public Page<Parametro> findAllParametros(Pageable pageable) {
                return parametroRepository.findAll(pageable);
        }

        @Override
        public Optional<Parametro> findParametroById(Long id) {
                return parametroRepository.findById(id);
        }

        @Override
        public Parametro saveParametro(Parametro parametro) {
                return parametroRepository.save(parametro);
        }

        @Override
        public Parametro updateParametro(Long id, MultipartFile file1, MultipartFile file2,
                        Parametro parametro) {
                if (id != 1) {
                        throw new RuntimeException("El ID del parámetro debe ser 1");
                }
                Parametro parametroExistente = parametroRepository.findById(id).orElse(null);
                if (parametroExistente == null) {
                        throw new RuntimeException("Parametro not found with id: " + id);
                }
                try {
                        // Obtener el parámetro existente
                        if (file1 != null && !file1.isEmpty()) {
                                storageService.eliminarArchivo(parametroExistente.getLogoInstitucionLight());
                                String urlFile = storageService.guardarArchivo(file1, "", "", "fotos");
                                parametroExistente.setLogoInstitucionLight(urlFile);
                        }

                        if (file2 != null && !file2.isEmpty()) {
                                storageService.eliminarArchivo(parametroExistente.getLogoInstitucionDark());
                                String urlFile = storageService.guardarArchivo(file2, "", "", "fotos");
                                parametroExistente.setLogoInstitucionDark(urlFile);
                        }

                        // Actualizar los datos del parámetro solo si no son nulos o vacíos
                        Optional.ofNullable(parametro.getNombreInstitucion())
                                        .filter(nombre -> !nombre.isEmpty())
                                        .ifPresent(parametroExistente::setNombreInstitucion);
                        Optional.ofNullable(parametro.getDireccionInstitucion())
                                        .filter(descripcion -> !descripcion.isEmpty())
                                        .ifPresent(parametroExistente::setDireccionInstitucion);
                        Optional.ofNullable(parametro.getCorreoInstitucion())
                                        .filter(correo -> !correo.isEmpty())
                                        .ifPresent(parametroExistente::setCorreoInstitucion);
                        Optional.ofNullable(parametro.getTelefonoInstitucion())
                                        .filter(telefono -> !telefono.isEmpty())
                                        .ifPresent(parametroExistente::setTelefonoInstitucion);
                        Optional.ofNullable(parametro.getTelefonoInstitucion2())
                                        .filter(telefono -> !telefono.isEmpty())
                                        .ifPresent(parametroExistente::setTelefonoInstitucion2);
                        Optional.ofNullable(parametro.getMesaPartesUrl())
                                        .filter(mesaPartesUrl -> !mesaPartesUrl.isEmpty())
                                        .ifPresent(parametroExistente::setMesaPartesUrl);
                        Optional.ofNullable(parametro.getConsultaTramiteUrl())
                                        .filter(consultaTramiteUrl -> !consultaTramiteUrl.isEmpty())
                                        .ifPresent(parametroExistente::setConsultaTramiteUrl);
                        Optional.ofNullable(parametro.getEncargadoTransparencia())
                                        .filter(encargadoTransparencia -> !encargadoTransparencia.isEmpty())
                                        .ifPresent(parametroExistente::setEncargadoTransparencia);
                        Optional.ofNullable(parametro.getCargoEncargadoTransparencia())
                                        .filter(cargoEncargadoTransparencia -> !cargoEncargadoTransparencia
                                                        .isEmpty())
                                        .ifPresent(parametroExistente::setCargoEncargadoTransparencia);
                        Optional.ofNullable(parametro.getNumeroResolucionTransparencia())
                                        .filter(numeroResolucionTransparencia -> !numeroResolucionTransparencia
                                                        .isEmpty())
                                        .ifPresent(parametroExistente::setNumeroResolucionTransparencia);
                        Optional.ofNullable(parametro.getEncargadoTransparenciaSecundario())
                                        .filter(encargadoTransparenciaSecundario -> !encargadoTransparenciaSecundario
                                                        .isEmpty())
                                        .ifPresent(parametroExistente::setEncargadoTransparenciaSecundario);
                        Optional.ofNullable(parametro.getCargoEncargadoTransparenciaSecundario()).filter(
                                        cargoEncargadoTransparenciaSecundario -> !cargoEncargadoTransparenciaSecundario
                                                        .isEmpty())
                                        .ifPresent(parametroExistente::setCargoEncargadoTransparenciaSecundario);
                        Optional.ofNullable(parametro.getNumeroResolucionTransparenciaSecundario()).filter(
                                        numeroResolucionTransparenciaSecundario -> !numeroResolucionTransparenciaSecundario
                                                        .isEmpty())
                                        .ifPresent(parametroExistente::setNumeroResolucionTransparenciaSecundario);
                        Optional.ofNullable(parametro.getNosotros()).filter(nosotros -> !nosotros.isEmpty())
                                        .ifPresent(parametroExistente::setNosotros);
                        Optional.ofNullable(parametro.getMision()).filter(mision -> !mision.isEmpty())
                                        .ifPresent(parametroExistente::setMision);
                        Optional.ofNullable(parametro.getVision()).filter(vision -> !vision.isEmpty())
                                        .ifPresent(parametroExistente::setVision);
                        Optional.ofNullable(parametro.getObjetivos()).filter(objetivos -> !objetivos.isEmpty())
                                        .ifPresent(parametroExistente::setObjetivos);
                        Optional.ofNullable(parametro.getValores()).filter(valores -> !valores.isEmpty())
                                        .ifPresent(parametroExistente::setValores);
                        Optional.ofNullable(parametro.getHistoria()).filter(historia -> !historia.isEmpty())
                                        .ifPresent(parametroExistente::setHistoria);
                        Optional.ofNullable(parametro.getMapaInstitucion())
                                        .filter(mapaInstitucion -> !mapaInstitucion.isEmpty())
                                        .ifPresent(parametroExistente::setMapaInstitucion);

                        Optional.ofNullable(parametro.getFacebook()).filter(facebook -> !facebook.isEmpty())
                                        .ifPresent(parametroExistente::setFacebook);
                        Optional.ofNullable(parametro.getInstagram()).filter(instagram -> !instagram.isEmpty())
                                        .ifPresent(parametroExistente::setInstagram);
                        Optional.ofNullable(parametro.getTwitter()).filter(twitter -> !twitter.isEmpty())
                                        .ifPresent(parametroExistente::setTwitter);
                        Optional.ofNullable(parametro.getYoutube()).filter(youtube -> !youtube.isEmpty())
                                        .ifPresent(parametroExistente::setYoutube);
                        Optional.ofNullable(parametro.getTiktok()).filter(tiktok -> !tiktok.isEmpty())
                                        .ifPresent(parametroExistente::setTiktok);
                        Optional.ofNullable(parametro.getWhatsapp()).filter(whatsapp -> !whatsapp.isEmpty())
                                        .ifPresent(parametroExistente::setWhatsapp);
                        Optional.ofNullable(parametro.getTelegram()).filter(telegram -> !telegram.isEmpty())
                                        .ifPresent(parametroExistente::setTelegram);
                        Optional.ofNullable(parametro.getPinterest()).filter(pinterest -> !pinterest.isEmpty())
                                        .ifPresent(parametroExistente::setPinterest);
                        Optional.ofNullable(parametro.getSnapchat()).filter(snapchat -> !snapchat.isEmpty())
                                        .ifPresent(parametroExistente::setSnapchat);
                        Optional.ofNullable(parametro.getKick()).filter(kick -> !kick.isEmpty())
                                        .ifPresent(parametroExistente::setKick);
                        Optional.ofNullable(parametro.getTwitch()).filter(twitch -> !twitch.isEmpty())
                                        .ifPresent(parametroExistente::setTwitch);
                        Optional.ofNullable(parametro.getLinkedin()).filter(linkedin -> !linkedin.isEmpty())
                                        .ifPresent(parametroExistente::setLinkedin);

                        // Actualizar campos de títulos y descripciones de secciones
                        Optional.ofNullable(parametro.getTituloPresidencia()).filter(titulo -> !titulo.isEmpty())
                                        .ifPresent(parametroExistente::setTituloPresidencia);
                        Optional.ofNullable(parametro.getDescripcionPresidencia()).filter(descripcion -> !descripcion.isEmpty())
                                        .ifPresent(parametroExistente::setDescripcionPresidencia);
                        Optional.ofNullable(parametro.getTituloServicio()).filter(titulo -> !titulo.isEmpty())
                                        .ifPresent(parametroExistente::setTituloServicio);
                        Optional.ofNullable(parametro.getDescripcionServicio()).filter(descripcion -> !descripcion.isEmpty())
                                        .ifPresent(parametroExistente::setDescripcionServicio);
                        Optional.ofNullable(parametro.getTituloAgenda()).filter(titulo -> !titulo.isEmpty())
                                        .ifPresent(parametroExistente::setTituloAgenda);
                        Optional.ofNullable(parametro.getDescripcionAgenda()).filter(descripcion -> !descripcion.isEmpty())
                                        .ifPresent(parametroExistente::setDescripcionAgenda);
                        Optional.ofNullable(parametro.getTituloNoticias()).filter(titulo -> !titulo.isEmpty())
                                        .ifPresent(parametroExistente::setTituloNoticias);
                        Optional.ofNullable(parametro.getDescripcionNoticias()).filter(descripcion -> !descripcion.isEmpty())
                                        .ifPresent(parametroExistente::setDescripcionNoticias);
                        Optional.ofNullable(parametro.getTituloBoletin()).filter(titulo -> !titulo.isEmpty())
                                        .ifPresent(parametroExistente::setTituloBoletin);
                        Optional.ofNullable(parametro.getDescripcionBoletin()).filter(descripcion -> !descripcion.isEmpty())
                                        .ifPresent(parametroExistente::setDescripcionBoletin);
                        Optional.ofNullable(parametro.getTituloDocumentos()).filter(titulo -> !titulo.isEmpty())
                                        .ifPresent(parametroExistente::setTituloDocumentos);
                        Optional.ofNullable(parametro.getDescripcionDocumentos()).filter(descripcion -> !descripcion.isEmpty())
                                        .ifPresent(parametroExistente::setDescripcionDocumentos);
                        Optional.ofNullable(parametro.getTituloEnlaces()).filter(titulo -> !titulo.isEmpty())
                                        .ifPresent(parametroExistente::setTituloEnlaces);
                        Optional.ofNullable(parametro.getDescripcionEnlaces()).filter(descripcion -> !descripcion.isEmpty())
                                        .ifPresent(parametroExistente::setDescripcionEnlaces);
                        Optional.ofNullable(parametro.getTituloVideo()).filter(titulo -> !titulo.isEmpty())
                                        .ifPresent(parametroExistente::setTituloVideo);
                        Optional.ofNullable(parametro.getDescripcionVideo()).filter(descripcion -> !descripcion.isEmpty())
                                        .ifPresent(parametroExistente::setDescripcionVideo);

                        return parametroRepository.save(parametroExistente);
                } catch (Exception e) {
                        throw new RuntimeException("Error al procesar el archivo.", e);
                }
        }

        @Override
        public void deleteParametro(Long id) {
                parametroRepository.deleteById(id);
        }
}
