package com.rchila.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import lombok.Data;

@Data
@Entity
@Table(name = "parametros")
public class Parametro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String mesaPartesUrl;

    private String consultaTramiteUrl;

    private String correoInstitucion;

    private String nombreInstitucion;

    private String direccionInstitucion;

    private String telefonoInstitucion;

    private String telefonoInstitucion2;

    @Column(length = 1000)
    private String mapaInstitucion;

    private String encargadoTransparencia;

    private String cargoEncargadoTransparencia;

    private String numeroResolucionTransparencia;

    private String encargadoTransparenciaSecundario;

    private String cargoEncargadoTransparenciaSecundario;

    private String numeroResolucionTransparenciaSecundario;

    // redes sociales
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

    @Column(length = 1000)
    private String nosotros;

    @Column(length = 1000)
    private String mision;

    @Column(length = 1000)
    private String vision;

    @Column(length = 1000)
    private String objetivos;

    @Column(length = 1000)
    private String valores;

    @Column(length = 5000)
    private String historia;

    private String logoInstitucionLight;

    private String logoInstitucionDark;


    private String tituloPresidencia;
    private String descripcionPresidencia;

    private String tituloServicio;
    private String descripcionServicio;

    private String tituloAgenda;
    private String descripcionAgenda;

    private String tituloNoticias;
    private String descripcionNoticias;

    private String tituloBoletin;
    private String descripcionBoletin;

    private String tituloDocumentos;
    private String descripcionDocumentos;

    private String tituloEnlaces;
    private String descripcionEnlaces;

    private String tituloVideo;
    private String descripcionVideo;

}
