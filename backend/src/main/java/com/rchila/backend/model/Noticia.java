package com.rchila.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.sql.Date;
import jakarta.persistence.CascadeType;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import java.util.List;
import jakarta.persistence.JoinTable;
import jakarta.persistence.JoinColumn;
import java.util.Set;
import jakarta.persistence.CollectionTable;

@Data
@Entity
@Table(name = "noticias")
public class Noticia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 500)
    private String gorro;

    @Column(length = 500)
    private String titulo;

    @Column(length = 5000)
    private String bajada;

    @Column(length = 5000)
    private String introduccion;

    @Column(length = 10000)
    private String contenido;

    @Column(length = 5000)
    private String conclusion;

    @Column(length = 1000)
    private String nota;

    private Date fechaPublicacion;

    private Boolean destacado;

    private String url;

    private Boolean activo;

    private Boolean destacadoAntigua;

    private String autor;

    @ElementCollection
    @CollectionTable(name = "noticia_tags", joinColumns = @JoinColumn(name = "noticia_id"))
    @Column(name = "tag")
    private Set<String> tags;

    @ManyToMany
    @JoinTable(name = "noticia_consejero", joinColumns = @JoinColumn(name = "noticia_id"), inverseJoinColumns = @JoinColumn(name = "consejero_id"))
    private List<Consejero> consejeros;

    @ManyToMany
    @JoinTable(name = "noticia_comision", joinColumns = @JoinColumn(name = "noticia_id"), inverseJoinColumns = @JoinColumn(name = "comision_id"))
    private List<Comision> comisiones;

    @OneToMany(mappedBy = "noticia", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<NoticiaImagen> imagenes;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private java.time.LocalDateTime createdAt;

    @UpdateTimestamp
    private java.time.LocalDateTime updatedAt;
}
