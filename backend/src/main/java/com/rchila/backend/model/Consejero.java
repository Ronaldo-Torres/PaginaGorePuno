package com.rchila.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.ManyToMany;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "consejeros")
public class Consejero {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    private String apellido;

    private String dni;

    private String cargo;

    private String descripcion;

    private String correo;

    private String telefono;

    private String direccion;

    private Boolean activo;

    // alcaldes

    private String entidad;
    private String provincia;
    private String distrito;


    private String url_imagen;

    private String documento;


    //redes sociales
    private String facebook;
    private String instagram;
    private String twitter;
    private String youtube;
    private String tiktok;
    private String whatsapp;
    private String telegram;
    private String pinterest;
    private String snapchat;
    private String kick;
    private String twitch;
    private String linkedin;

    @JsonIgnore
    @ManyToMany(mappedBy = "consejeros")
    private List<Noticia> noticias;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private java.time.LocalDateTime createdAt;

    @UpdateTimestamp
    private java.time.LocalDateTime updatedAt;

    private String sexo;
}
