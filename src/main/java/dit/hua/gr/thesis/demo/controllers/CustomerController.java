package dit.hua.gr.thesis.demo.controllers;

import dit.hua.gr.thesis.demo.entities.*;
import dit.hua.gr.thesis.demo.repositories.*;
import dit.hua.gr.thesis.demo.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@RestController
@RequestMapping("/customers")
@CrossOrigin("*")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private SoftwareRepository softwareRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private EmailService emailService;

    // get all customers
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("")
    public ResponseEntity<CustomerListResponse> getAllCustomers() {
        List<Customer> customers = customerRepository.findAll();
        long customerCount = customerRepository.count();

        CustomerListResponse response = new CustomerListResponse(customers, customerCount);
        return ResponseEntity.ok(response);
    }

    // create class that combine count and customer list
    public static class CustomerListResponse {
        private List<Customer> customers;
        private long customerCount;

        public CustomerListResponse(List<Customer> customers, long customerCount) {
            this.customers = customers;
            this.customerCount = customerCount;
        }

        public List<Customer> getCustomers() {
            return customers;
        }

        public long getCustomerCount() {
            return customerCount;
        }
    }

    // get customer by id
    @GetMapping("/{customer_id}")
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    public ResponseEntity<?> getCustomer(@PathVariable int customer_id) {
        Optional<Customer> optionalCustomer = customerRepository.findById(customer_id);
        if(optionalCustomer.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Customer with ID : " + customer_id + " not found !"
            );
        }
        Customer customer = optionalCustomer.get();
        return ResponseEntity.ok(customer);
    }

    // create a new customer
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @PostMapping("/add-customer")
    public ResponseEntity<String> addCustomer(@Validated @RequestBody Customer customer) {

        if (customerRepository.existsByEmail(customer.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }
        Calendar calendar = Calendar.getInstance();
        Date registrationDate = calendar.getTime();

        // set the current date as registration date
        customer.setRegistrationDate(registrationDate);

        // save the customer
        customerRepository.save(customer);

        // send welcome email
        String message = "Welcome " + customer.getFname() + " hope you enjoy the journey !";
        String subject = "Welcome";
        emailService.sendEmail(customer.getEmail(), message, subject);

        Date notificationDate = calendar.getTime();

        Notification notification = new Notification(NotificationType.EMAIL,message, notificationDate,"sent");
        notification.setCustomer(customer);
        notificationRepository.save(notification);

        return ResponseEntity.ok("Customer successfully created!");
    }

    // delete customer by id
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{customer_id}")
    public ResponseEntity<String> deleteCustomer(@PathVariable int customer_id) {
        Optional<Customer> optionalCustomer = customerRepository.findById(customer_id);

        if (optionalCustomer.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Customer with ID : " + customer_id + " not found!"
            );
        }

        Customer customer = optionalCustomer.get();

        List<Event> events = customer.getEvents();
        for (Event event : events) {
            event.getCustomers().remove(customer);
            eventRepository.save(event);
        }

        List<Software> softwares = customer.getSoftwares();
        for (Software software : softwares) {
            software.getCustomers().remove(customer);
            softwareRepository.save(software);
        }

        customerRepository.delete(customer);

        return ResponseEntity.ok("Customer with ID " + customer_id + " successfully deleted!");
    }

}
