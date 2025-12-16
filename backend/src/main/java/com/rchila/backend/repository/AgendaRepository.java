package com.rchila.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.rchila.backend.model.Agenda;

public interface AgendaRepository extends JpaRepository<Agenda, Long> {

    List<Agenda> findByEstado(String estado);

    @Query("SELECT a FROM Agenda a WHERE EXTRACT(MONTH FROM a.fecha) = :mes AND a.publico = :publico")
    List<Agenda> findByMesAndPublico(@Param("mes") int mes, @Param("publico") Boolean publico);
}
