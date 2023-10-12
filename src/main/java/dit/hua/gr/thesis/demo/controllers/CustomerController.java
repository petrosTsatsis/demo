package dit.hua.gr.thesis.demo.controllers;

import dit.hua.gr.thesis.demo.entities.Customer;
import dit.hua.gr.thesis.demo.entities.ERole;
import dit.hua.gr.thesis.demo.entities.Role;
import dit.hua.gr.thesis.demo.entities.User;
import dit.hua.gr.thesis.demo.repositories.CustomerRepository;
import dit.hua.gr.thesis.demo.repositories.RoleRepository;
import dit.hua.gr.thesis.demo.repositories.UserRepository;
import dit.hua.gr.thesis.demo.service.CustomerService;
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
@RequestMapping("/customers")
@CrossOrigin("*")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    // get all customers
    @GetMapping("")
    @PreAuthorize("hasRole('USER')")
    public List<Customer> getAll(){
        return customerService.findAll();
    }

    // get customer by id
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/{customer_id}")
    public ResponseEntity<?> getCustomer(@PathVariable int customer_id) {
        Customer customer = customerService.findById(customer_id);
        if (customer == null) {
            String errorMessage = "Customer with ID " + customer_id + " does not exist.";
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }

        return ResponseEntity.ok(customer);
    }

    // create a new customer
    @PostMapping("/add-customer")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> addCustomer(@Validated @RequestBody Customer customer) {
        if (customerRepository.existsByUsername(customer.getUsername())) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        if (customerRepository.existsByEmail(customer.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        customer.setPassword(passwordEncoder.encode(customer.getPassword()));

        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        customer.getRoles().add(userRole);

        customerService.save(customer);
        return ResponseEntity.ok("Customer successfully created!");
    }

    // delete customer by id
    @DeleteMapping("/{customer_id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> deleteCustomer(@PathVariable int customer_id){

        Customer customer = customerService.findById(customer_id);

        Optional<User> optionalUser = userRepository.findByUsername(customer.getUsername());

        if(optionalUser.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User does not exist !");
        }

        User user = optionalUser.get();

        userRepository.delete(user);

        return ResponseEntity.ok("Customer with ID " + customer_id + " successfully deleted ! ");
    }

}
