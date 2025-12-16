package com.rchila.backend.admin.privilege.controllers;

import com.rchila.backend.admin.privilege.dto.PrivilegeResponse;
import com.rchila.backend.admin.privilege.mapper.PrivilegeMapper;
import com.rchila.backend.admin.privilege.repositories.models.Privilege;
import com.rchila.backend.admin.privilege.services.PrivilegeService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/v1/privileges")
@Tag(name = "Privilegios", description = "API para la gestión de privilegios")
@RequiredArgsConstructor
public class PrivilegeController {

    private final PrivilegeService privilegeService;
    private final PrivilegeMapper privilegeMapper;

    @GetMapping("/list")
    @PreAuthorize("hasAuthority('PRIVILEGE_READ')")
    public ResponseEntity<List<PrivilegeResponse>> getAllPrivilegesForRoles() {
        List<PrivilegeResponse> privileges = privilegeService.findAll()
                .stream()
                .map(privilegeMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(privileges);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('PRIVILEGE_READ')")
    public ResponseEntity<Page<PrivilegeResponse>> getAllPrivileges(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String search) {

        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<PrivilegeResponse> privileges = privilegeService.findAllWithSearch(search, pageable)
                .map(privilegeMapper::toResponse);

        return ResponseEntity.ok(privileges);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('PRIVILEGE_READ')")
    public ResponseEntity<PrivilegeResponse> getPrivilegeById(@PathVariable Long id) {
        return privilegeService.findById(id)
                .map(privilegeMapper::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/name/{name}")
    @PreAuthorize("hasAuthority('PRIVILEGE_READ')")
    public ResponseEntity<PrivilegeResponse> getPrivilegeByName(@PathVariable String name) {
        return privilegeService.findByName(name)
                .map(privilegeMapper::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('PRIVILEGE_CREATE')")
    public ResponseEntity<PrivilegeResponse> createPrivilege(@RequestBody Privilege privilege) {
        Privilege createdPrivilege = privilegeService.create(privilege);
        return ResponseEntity.ok(privilegeMapper.toResponse(createdPrivilege));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('PRIVILEGE_UPDATE')")
    public ResponseEntity<PrivilegeResponse> updatePrivilege(@PathVariable Long id,
            @RequestBody Privilege privilegeDetails) {
        return privilegeService.update(id, privilegeDetails)
                .map(privilegeMapper::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('PRIVILEGE_DELETE')")
    public ResponseEntity<Void> deletePrivilege(@PathVariable Long id) {
        privilegeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}