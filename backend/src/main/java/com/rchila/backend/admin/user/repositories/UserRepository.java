package com.rchila.backend.admin.user.repositories;

import com.rchila.backend.admin.user.repositories.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    void deleteByUuid(UUID uuid);

    Optional<User> findByUuid(UUID uuid);

    Optional<User> findByActivationToken(String token);

    Optional<User> findByResetPasswordToken(String token);

    List<User> findAllByUuidIn(List<UUID> uuids);

    List<User> findAllByEmailIn(List<String> emails);

    @Query("SELECT DISTINCT u FROM User u JOIN u.roles r WHERE CAST(r.name AS string) IN :roleNames")
    List<User> findUsersWithRoles(@Param("roleNames") List<String> roleNames);

    Page<User> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String firstName, String lastName, String email, Pageable pageable);

    @Query("SELECT DISTINCT u FROM User u JOIN u.roles r WHERE CAST(r.name AS string) = :role")
    Page<User> findByRole(@Param("role") String role, Pageable pageable);

    @Query("SELECT DISTINCT u FROM User u JOIN u.roles r WHERE " +
            "(LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
            "CAST(r.name AS string) = :role")
    Page<User> findBySearchAndRole(@Param("search") String search, @Param("role") String role, Pageable pageable);
}
