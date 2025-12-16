package com.rchila.backend.model;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import org.hibernate.annotations.CreationTimestamp;
import lombok.Data;

@Data
@Entity
@Table(name = "consejero_galeria")
public class ConsejeroGaleria {

    @Id  
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String nombre;

    private String descripcion;

    private String urlImagen;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private java.time.LocalDateTime createdAt;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private java.time.LocalDateTime updatedAt;


    @ManyToOne
    @JoinColumn(name = "consejero_id")
    private Consejero consejero;
}
