package com.rchila.backend.model.dto;

import java.util.Date;
import java.util.List;

public class BoletinDTO {
    private Long id;
    private String titulo;
    private String contenido;
    private Date fechaPublicacion;
    private String categoria;
    private String url;
    private Boolean activo;
    private String urlDocumento;
    private String imagenPrincipalUrl;

    public BoletinDTO(Long id, String titulo, String contenido, Date fechaPublicacion, String categoria, String url,
            Boolean activo, String urlDocumento, String imagenPrincipalUrl) {
        this.id = id;
        this.titulo = titulo;
        this.contenido = contenido;
        this.fechaPublicacion = fechaPublicacion;
        this.categoria = categoria;
        this.url = url;
        this.activo = activo;
        this.urlDocumento = urlDocumento;
        this.imagenPrincipalUrl = imagenPrincipalUrl;
    }

    public BoletinDTO() {
    }

    //OJO no esta fucnionando
    public void setImagenPrincipalUrl(List<String> imagenes) {
        if (imagenes != null && !imagenes.isEmpty()) {
            this.imagenPrincipalUrl = imagenes.get(0);
        }
    }
    //OJO no esta fucnionando

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getContenido() {
        return contenido;
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
    }

    public Date getFechaPublicacion() {
        return fechaPublicacion;
    }

    public void setFechaPublicacion(Date fechaPublicacion) {
        this.fechaPublicacion = fechaPublicacion;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    public String getUrlDocumento() {
        return urlDocumento;
    }

    public void setUrlDocumento(String urlDocumento) {
        this.urlDocumento = urlDocumento;
    }

    public String getImagenPrincipalUrl() {
        return imagenPrincipalUrl;
    }

    public void setImagenPrincipalUrl(String imagenPrincipalUrl) {
        this.imagenPrincipalUrl = imagenPrincipalUrl;
    }

}
