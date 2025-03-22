package com.library.lms.config;

import com.library.lms.model.Role;
import com.library.lms.model.Role.ERole;
import com.library.lms.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        initRoles();
    }

    private void initRoles() {
        // Initialize roles if they don't exist
        if (roleRepository.count() == 0) {
            Role userRole = new Role();
            userRole.setName(ERole.ROLE_USER);
            roleRepository.save(userRole);

            Role librarianRole = new Role();
            librarianRole.setName(ERole.ROLE_LIBRARIAN);
            roleRepository.save(librarianRole);

            Role adminRole = new Role();
            adminRole.setName(ERole.ROLE_ADMIN);
            roleRepository.save(adminRole);

            System.out.println("Initialized roles in the database");
        }
    }
} 