package com.rchila.backend.admin.privilege.services;

import com.rchila.backend.admin.privilege.repositories.PrivilegeRepository;
import com.rchila.backend.admin.privilege.repositories.models.Privilege;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PrivilegeService {

    private final PrivilegeRepository privilegeRepository;

    public List<Privilege> findAll() {
        return privilegeRepository.findAll();
    }

    public Page<Privilege> findAll(Pageable pageable) {
        return privilegeRepository.findAll(pageable);
    }

    public Page<Privilege> findAllWithSearch(String search, Pageable pageable) {
        if (search == null || search.trim().isEmpty()) {
            return privilegeRepository.findAll(pageable);
        }
        return privilegeRepository.findByNameOrDescriptionContainingIgnoreCase("%" + search.trim() + "%", pageable);
    }

    public Optional<Privilege> findById(Long id) {
        return privilegeRepository.findById(id);
    }

    public Optional<Privilege> findByName(String name) {
        return privilegeRepository.findByName(name);
    }

    public Privilege create(Privilege privilege) {
        if (privilege.getUuid() == null) {
            privilege.setUuid(UUID.randomUUID());
        }
        return privilegeRepository.save(privilege);
    }

    public Optional<Privilege> update(Long id, Privilege privilegeDetails) {
        return privilegeRepository.findById(id)
                .map(privilege -> {
                    privilege.setName(privilegeDetails.getName());
                    privilege.setDescription(privilegeDetails.getDescription());
                    return privilegeRepository.save(privilege);
                });
    }

    public void delete(Long id) {
        privilegeRepository.deleteById(id);
    }
}