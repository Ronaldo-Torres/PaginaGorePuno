package com.rchila.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;
import java.util.Set;

@Data
@Entity
@Table(name = "documento_sincronizacion")
public class DocumentoSincronizacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String codigoEmision;

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
}
