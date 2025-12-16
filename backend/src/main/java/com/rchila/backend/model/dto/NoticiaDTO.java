package com.rchila.backend.model.dto;

import java.util.Date;
import java.util.List;
import java.util.Set;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class NoticiaDTO {
    private Long id;
    private String gorro;
    private String titulo;
    private String bajada;
    private String introduccion;
    private String conclusion;
    private String contenido;
    private Date fechaPublicacion;
    private String nota;
    private Boolean destacado;
    private Boolean destacadoAntigua;
    private String url;
    private Boolean activo;
    private String urlImagenPrincipal;
    private String autor;
    private Set<String> tags;
    private List<Long> consejeros;
    private List<Long> comisiones;

    public NoticiaDTO(
            Long id,
            String gorro,
            String titulo,
            String bajada,
            String introduccion,
            String conclusion,
            String contenido,
            Date fechaPublicacion,
            String nota,
            Boolean destacado,
            Boolean destacadoAntigua,
            String url,
            Boolean activo,
            String urlImagenPrincipal,
            String autor) {
        this.id = id;
        this.gorro = gorro;
        this.titulo = titulo;
        this.bajada = bajada;
        this.introduccion = introduccion;
        this.conclusion = conclusion;
        this.contenido = contenido;
        this.fechaPublicacion = fechaPublicacion;
        this.nota = nota;
        this.destacado = destacado;
        this.destacadoAntigua = destacadoAntigua;
        this.url = url;
        this.activo = activo;
        this.urlImagenPrincipal = urlImagenPrincipal;
        this.autor = autor;
    }

    public NoticiaDTO(Long id,
            String gorro,
            String titulo,
            String bajada,
            String introduccion,
            String urlImagenPrincipal,
            Date fechaPublicacion) {
        this.id = id;
        this.gorro = gorro;
        this.titulo = titulo;
        this.bajada = bajada;
        this.introduccion = introduccion;
        this.urlImagenPrincipal = urlImagenPrincipal;
        this.fechaPublicacion = fechaPublicacion;
    }

    public void setUrlImagenPrincipal(List<String> imagenes) {
        if (imagenes != null && !imagenes.isEmpty()) {
            this.urlImagenPrincipal = imagenes.get(0);
        }
    }

}
