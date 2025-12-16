package com.rchila.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Date;
import java.util.List;
import java.util.Set;

@Data
@Entity
@Table(name = "documentos")
public class Documento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String numeroDocumento;

    private String nombreDocumento;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    private Date fechaEmision;

    private Boolean activo;

    private String urlDocumento;

    @ElementCollection
    @CollectionTable(name = "documento_tags", joinColumns = @JoinColumn(name = "documento_id"))
    @Column(name = "tag")
    private Set<String> tagsDocumento;

    @ManyToMany
    @JoinTable(name = "documento_consejero", joinColumns = @JoinColumn(name = "documento_id"), inverseJoinColumns = @JoinColumn(name = "consejero_id"))
    private List<Consejero> consejeros;

    @ManyToMany
    @JoinTable(name = "documento_comision", joinColumns = @JoinColumn(name = "documento_id"), inverseJoinColumns = @JoinColumn(name = "comision_id"))
    private List<Comision> comisiones;

    @ManyToOne
    @JoinColumn(name = "tipo_documento_id", nullable = true)
    private TipoDocumento tipoDocumento;

    @ManyToOne
    @JoinColumn(name = "anio_id", nullable = true)
    private Anio anio;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private java.time.LocalDateTime createdAt;

/*     @ManyToOne
    @JoinColumn(name = "oficina_id", nullable = true)
    private Oficina oficina; */

    @UpdateTimestamp
    private java.time.LocalDateTime updatedAt;
}
