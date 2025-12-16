package com.rchila.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "redes_sociales")
public class RedesSociales {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String facebook;

    private String instagram;

    private String twitter;

    private String youtube;

    private String linkedin;

    private String tiktok;

    private String whatsapp;

    private String telegram;

    private String pinterest;

    private String snapchat;

    private String twitch;

    private String kick;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "parametro_id", nullable = true, unique = true)
    private Parametro parametro;

    @ManyToOne
    @JoinColumn(name = "consejero_id", nullable = true, unique = true)
    private Consejero consejero;

}
