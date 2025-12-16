package com.rchila.backend.admin.config;

import com.rchila.backend.admin.privilege.repositories.PrivilegeRepository;
import com.rchila.backend.admin.privilege.repositories.models.Privilege;
import com.rchila.backend.admin.role.repositories.RoleRepository;
import com.rchila.backend.admin.role.repositories.models.Role;
import com.rchila.backend.admin.user.repositories.UserRepository;
import com.rchila.backend.admin.user.repositories.models.User;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Collection;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Component
@Slf4j
public class DataInitializer implements CommandLineRunner {

        private final UserRepository userRepository;
        private final RoleRepository roleRepository;
        private final PrivilegeRepository privilegeRepository;
        private final PasswordEncoder passwordEncoder;

        public DataInitializer(UserRepository userRepository, RoleRepository roleRepository,
                        PrivilegeRepository privilegeRepository, PasswordEncoder passwordEncoder) {
                this.userRepository = userRepository;
                this.roleRepository = roleRepository;
                this.privilegeRepository = privilegeRepository;
                this.passwordEncoder = passwordEncoder;
        }

        @Override
        @Transactional
        public void run(String... args) {
                log.info("Inicializando datos de la aplicación...");

                createPrivilegesIfNotFound();
                createRolesIfNotFound();
                createUsersIfNotFound();

                log.info("Datos inicializados correctamente.");
        }

        private void createPrivilegesIfNotFound() {
                if (privilegeRepository.count() == 0) {
                        log.info("Creando privilegios por defecto...");

                        // Crear todos los privilegios
                        Arrays.asList(
                                        // Privilegios generales
                                        Privilege.builder()
                                                        .uuid(UUID.randomUUID())
                                                        .name("READ")
                                                        .description("Permite la lectura general de recursos en el sistema")
                                                        .build(),
                                        Privilege.builder()
                                                        .uuid(UUID.randomUUID())
                                                        .name("WRITE")
                                                        .description("Permite la escritura general de recursos en el sistema")
                                                        .build(),
                                        Privilege.builder()
                                                        .uuid(UUID.randomUUID())
                                                        .name("DELETE")
                                                        .description("Permite la eliminación general de recursos en el sistema")
                                                        .build(),
                                        // Privilegios de administración de usuarios
                                        Privilege.builder()
                                                        .uuid(UUID.randomUUID())
                                                        .name("USER_READ")
                                                        .description("Permite ver y listar usuarios del sistema")
                                                        .build(),
                                        Privilege.builder()
                                                        .uuid(UUID.randomUUID())
                                                        .name("USER_CREATE")
                                                        .description("Permite crear nuevos usuarios en el sistema")
                                                        .build(),
                                        Privilege.builder()
                                                        .uuid(UUID.randomUUID())
                                                        .name("USER_UPDATE")
                                                        .description("Permite actualizar la información de usuarios existentes")
                                                        .build(),
                                        Privilege.builder()
                                                        .uuid(UUID.randomUUID())
                                                        .name("USER_DELETE")
                                                        .description("Permite eliminar usuarios del sistema")
                                                        .build(),
                                        Privilege.builder()
                                                        .uuid(UUID.randomUUID())
                                                        .name("USER_TOGGLE_STATUS")
                                                        .description("Permite activar o desactivar usuarios en el sistema")
                                                        .build(),
                                        Privilege.builder()
                                                        .uuid(UUID.randomUUID())
                                                        .name("USER_RESET_PASSWORD")
                                                        .description("Permite restablecer la contraseña de los usuarios")
                                                        .build(),
                                        Privilege.builder()
                                                        .uuid(UUID.randomUUID())
                                                        .name("USER_MANAGE_AVATAR")
                                                        .description("Permite gestionar las imágenes de perfil de los usuarios")
                                                        .build(),
                                        Privilege.builder()
                                                        .uuid(UUID.randomUUID())
                                                        .name("USER_ASSIGN_ROLES")
                                                        .description("Permite asignar o revocar roles a los usuarios")
                                                        .build(),
                                        // Privilegios de administración de roles
                                        Privilege.builder()
                                                        .uuid(UUID.randomUUID())
                                                        .name("ROLE_READ")
                                                        .description("Permite ver y listar roles del sistema")
                                                        .build(),
                                        Privilege.builder()
                                                        .uuid(UUID.randomUUID())
                                                        .name("ROLE_CREATE")
                                                        .description("Permite crear nuevos roles en el sistema")
                                                        .build(),
                                        Privilege.builder()
                                                        .uuid(UUID.randomUUID())
                                                        .name("ROLE_UPDATE")
                                                        .description("Permite actualizar roles existentes")
                                                        .build(),
                                        Privilege.builder()
                                                        .uuid(UUID.randomUUID())
                                                        .name("ROLE_DELETE")
                                                        .description("Permite eliminar roles del sistema")
                                                        .build(),
                                        Privilege.builder()
                                                        .uuid(UUID.randomUUID())
                                                        .name("ROLE_ASSIGN_PRIVILEGES")
                                                        .description("Permite asignar o revocar privilegios a los roles")
                                                        .build(),
                                        // Privilegios de administración de privilegios
                                        Privilege.builder()
                                                        .uuid(UUID.randomUUID())
                                                        .name("PRIVILEGE_READ")
                                                        .description("Permite ver y listar privilegios del sistema")
                                                        .build(),
                                        Privilege.builder()
                                                        .uuid(UUID.randomUUID())
                                                        .name("PRIVILEGE_CREATE")
                                                        .description("Permite crear nuevos privilegios en el sistema")
                                                        .build(),
                                        Privilege.builder()
                                                        .uuid(UUID.randomUUID())
                                                        .name("PRIVILEGE_UPDATE")
                                                        .description("Permite actualizar privilegios existentes")
                                                        .build(),
                                        Privilege.builder()
                                                        .uuid(UUID.randomUUID())
                                                        .name("PRIVILEGE_DELETE")
                                                        .description("Permite eliminar privilegios del sistema")
                                                        .build())
                                        .forEach(privilegeRepository::save);

                        log.info("Privilegios creados correctamente.");
                }
        }

        private void createRolesIfNotFound() {
                if (roleRepository.count() == 0) {
                        log.info("Creando roles por defecto...");

                        // Obtener todos los privilegios
                        Collection<Privilege> allPrivileges = privilegeRepository.findAll();

                        // Crear rol de administrador con todos los privilegios
                        Role adminRole = Role.builder()
                                        .uuid(UUID.randomUUID())
                                        .name("ADMIN")
                                        .privileges(new HashSet<>(allPrivileges))
                                        .build();
                        roleRepository.save(adminRole);

                        // Filtrar privilegios para el rol de usuario (solo lectura básica)
                        Set<Privilege> userPrivileges = new HashSet<>();
                        allPrivileges.forEach(privilege -> {
                                if ("READ".equals(privilege.getName()) ||
                                                "USER_READ".equals(privilege.getName()) ||
                                                "ROLE_READ".equals(privilege.getName()) ||
                                                "PRIVILEGE_READ".equals(privilege.getName())) {
                                        userPrivileges.add(privilege);
                                }
                        });

                        // Crear rol de usuario
                        Role userRole = Role.builder()
                                        .uuid(UUID.randomUUID())
                                        .name("USER")
                                        .privileges(userPrivileges)
                                        .build();
                        roleRepository.save(userRole);

                        // Crear rol de super administrador con todos los privilegios
                        Role superAdminRole = Role.builder()
                                        .uuid(UUID.randomUUID())
                                        .name("SUPER_ADMIN")
                                        .privileges(new HashSet<>(allPrivileges))
                                        .build();
                        roleRepository.save(superAdminRole);

                        log.info("Roles creados correctamente.");
                }
        }

        private void createUsersIfNotFound() {
                if (userRepository.count() == 0) {
                        log.info("Creando usuarios por defecto...");

                        // Buscar roles
                        Optional<Role> adminRole = roleRepository.findByName("ADMIN");
                        Optional<Role> userRole = roleRepository.findByName("USER");

                        if (adminRole.isPresent() && userRole.isPresent()) {
                                // Crear usuario administrador
                                User admin = User.builder()
                                                .firstName("Admin")
                                                .lastName("Sistema")
                                                .email("admin@example.com")
                                                .password(passwordEncoder.encode("admin123"))
                                                .roles(Arrays.asList(adminRole.get()))
                                                .build();
                                userRepository.save(admin);
                                log.info("Usuario administrador creado: {}", admin.getEmail());

                                // Crear usuario normal
                                User user = User.builder()
                                                .firstName("Usuario")
                                                .lastName("Regular")
                                                .email("usuario@sistemabas.com")
                                                .password(passwordEncoder.encode("user123"))
                                                .roles(Arrays.asList(userRole.get()))
                                                .build();
                                userRepository.save(user);
                                log.info("Usuario regular creado: {}", user.getEmail());
                        } else {
                                log.error("No se pudieron crear los usuarios porque no se encontraron los roles.");
                        }
                }
        }
}