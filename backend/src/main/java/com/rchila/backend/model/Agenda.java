package com.rchila.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.util.List;

@Data
@Entity
public class Agenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    @Column(length = 1000)
    private String descripcion;

    private LocalTime horaInicio;

    private LocalTime horaFin;

    @Column(nullable = false)
    private LocalDate fecha;

    private String color;

    private String tipo;

    private String estado;

    private Boolean publico;

    private String documento;

    private String lugar;

    @OneToMany(mappedBy = "agenda")
    private List<NotificacionAgenda> notificaciones;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private java.time.LocalDateTime createdAt;

    @UpdateTimestamp
    private java.time.LocalDateTime updatedAt;

}
