package com.rchila.backend.admin.privilege.repositories;

import com.rchila.backend.admin.privilege.repositories.models.Privilege;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PrivilegeRepository extends JpaRepository<Privilege, Long> {
    Optional<Privilege> findByName(String name);

    @Query("SELECT p FROM Privilege p WHERE LOWER(p.name) LIKE LOWER(:search) OR LOWER(p.description) LIKE LOWER(:search)")
    Page<Privilege> findByNameOrDescriptionContainingIgnoreCase(@Param("search") String search, Pageable pageable);
}
