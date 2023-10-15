package dit.hua.gr.thesis.demo.controllers;

import dit.hua.gr.thesis.demo.entities.ERole;
import dit.hua.gr.thesis.demo.entities.Manager;
import dit.hua.gr.thesis.demo.entities.Role;
import dit.hua.gr.thesis.demo.entities.User;
import dit.hua.gr.thesis.demo.repositories.ManagerRepository;
import dit.hua.gr.thesis.demo.repositories.RoleRepository;
import dit.hua.gr.thesis.demo.repositories.UserRepository;
import dit.hua.gr.thesis.demo.service.ManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/managers")
@CrossOrigin("*")
public class ManagerController {

    @Autowired
    private ManagerService managerService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ManagerRepository managerRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    // get all managers
    @GetMapping("")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Manager> getAll(){
        return managerService.findAll();
    }

    // get manager by id
    @GetMapping("/{manager_id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getManager(@PathVariable int manager_id) {
        Manager manager = managerService.findById(manager_id);
        if (manager == null) {
            String errorMessage = "Manager with ID " + manager_id + " does not exist.";
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }

        return ResponseEntity.ok(manager);
    }

    // create a new manager
    @PostMapping("/add-manager")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> addManager(@Validated @RequestBody Manager manager){

        if (managerRepository.existsByUsername(manager.getUsername())) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        if (managerRepository.existsByEmail(manager.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        manager.setPassword(passwordEncoder.encode(manager.getPassword()));
        
        Role managerRole = roleRepository.findByName(ERole.ROLE_MANAGER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        manager.getRoles().add(managerRole);

        managerService.save(manager);
        return ResponseEntity.ok("Manager successfully created ! ");
    }

    // delete manager by id
    @DeleteMapping("/{manager_id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteManager(@PathVariable int manager_id){

        Manager manager = managerService.findById(manager_id);

        Optional<User> optionalUser = userRepository.findByUsername(manager.getUsername());

        if(optionalUser.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User does not exist !");
        }

        User user = optionalUser.get();

        userRepository.delete(user);

        return ResponseEntity.ok("Manager with ID " + manager_id + " successfully deleted ! ");
    }
}
