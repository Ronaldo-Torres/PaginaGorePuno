package com.rchila.backend.admin.role.controllers;

import com.rchila.backend.admin.privilege.repositories.models.Privilege;
import com.rchila.backend.admin.role.dto.RoleResponse;
import com.rchila.backend.admin.role.mapper.RoleMapper;
import com.rchila.backend.admin.role.repositories.models.Role;
import com.rchila.backend.admin.role.services.RoleService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.HashMap;

@RestController
@RequestMapping("/v1/roles")
@Tag(name = "Roles", description = "API para la gestión de roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;
    private final RoleMapper roleMapper;

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_READ')")
    public ResponseEntity<List<RoleResponse>> getAllRoles() {
        List<RoleResponse> roles = roleService.findAll().stream()
                .map(roleMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(roles);
    }

    @GetMapping("/list")
    @PreAuthorize("hasAuthority('ROLE_READ')")
    public ResponseEntity<List<Map<String, Object>>> getRolesList() {
        List<Map<String, Object>> rolesList = roleService.findAll().stream()
                .map(role -> {
                    Map<String, Object> roleMap = new HashMap<>();
                    roleMap.put("id", role.getId());
                    roleMap.put("name", role.getName());
                    return roleMap;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(rolesList);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_READ')")
    public ResponseEntity<RoleResponse> getRoleById(@PathVariable Long id) {
        return roleService.findById(id)
                .map(roleMapper::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/name/{name}")
    @PreAuthorize("hasAuthority('ROLE_READ')")
    public ResponseEntity<RoleResponse> getRoleByName(@PathVariable String name) {
        return roleService.findByName(name)
                .map(roleMapper::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_CREATE')")
    public ResponseEntity<RoleResponse> createRole(@RequestBody Role role) {
        Role createdRole = roleService.create(role);
        return ResponseEntity.ok(roleMapper.toResponse(createdRole));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_UPDATE')")
    public ResponseEntity<RoleResponse> updateRole(@PathVariable Long id, @RequestBody Role roleDetails) {
        try {
            Role updatedRole = roleService.update(id, roleDetails)
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
            return ResponseEntity.ok(roleMapper.toResponse(updatedRole));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/privileges")
    @PreAuthorize("hasAuthority('ROLE_ASSIGN_PRIVILEGES')")
    public ResponseEntity<RoleResponse> updateRolePrivileges(
            @PathVariable Long id,
            @RequestBody Set<Privilege> privileges) {
        try {
            Role updatedRole = roleService.updatePrivileges(id, privileges)
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
            return ResponseEntity.ok(roleMapper.toResponse(updatedRole));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_DELETE')")
    public ResponseEntity<Void> deleteRole(@PathVariable Long id) {
        roleService.delete(id);
        return ResponseEntity.noContent().build();
    }
}