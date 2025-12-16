package com.rchila.backend.admin.role.services;

import com.rchila.backend.admin.privilege.repositories.models.Privilege;
import com.rchila.backend.admin.role.repositories.RoleRepository;
import com.rchila.backend.admin.role.repositories.models.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class RoleService {

    private final RoleRepository roleRepository;

    public List<Role> findAll() {
        return roleRepository.findAll();
    }

    public Optional<Role> findById(Long id) {
        return roleRepository.findById(id);
    }

    public Optional<Role> findByName(String name) {
        return roleRepository.findByName(name);
    }

    public Role create(Role role) {
        if (role.getUuid() == null) {
            role.setUuid(UUID.randomUUID());
        }
        return roleRepository.save(role);
    }

    public Optional<Role> update(Long id, Role roleDetails) {
        return roleRepository.findById(id)
                .map(existingRole -> {
                    existingRole.setName(roleDetails.getName());
                    existingRole.setPrivileges(roleDetails.getPrivileges());
                    return roleRepository.save(existingRole);
                });
    }

    public Optional<Role> updatePrivileges(Long id, Set<Privilege> privileges) {
        return roleRepository.findById(id)
                .map(existingRole -> {
                    existingRole.setPrivileges(privileges);
                    return roleRepository.save(existingRole);
                });
    }

    public void delete(Long id) {
        roleRepository.deleteById(id);
    }
}
