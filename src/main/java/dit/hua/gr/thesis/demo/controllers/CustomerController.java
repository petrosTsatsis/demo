package dit.hua.gr.thesis.demo.controllers;

import dit.hua.gr.thesis.demo.entities.*;
import dit.hua.gr.thesis.demo.repositories.*;
import dit.hua.gr.thesis.demo.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

@RestController
@RequestMapping("/Customers")
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

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    // get all customers
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("")
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
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

        // specify the time zone ("Europe/Athens")
        ZoneId zoneId = ZoneId.of("Europe/Athens");

        // use LocalDateTime to get the current date and time in the specified time zone
        LocalDateTime registrationDateTime = LocalDateTime.now(zoneId);

        // convert LocalDateTime to Date
        Date registrationDate = Date.from(registrationDateTime.atZone(zoneId).toInstant());

        // set the current date as registration date
        customer.setRegistrationDate(registrationDate);

        // save the customer
        customerRepository.save(customer);

        // send welcome email
        String message = "Welcome " + customer.getFname() + " hope you enjoy the journey !";
        String subject = "Welcome";
        emailService.sendEmail(customer.getEmail(), message, subject);

        // convert LocalDateTime to Date for the Notification object too
        Date notificationDate = Date.from(registrationDateTime.atZone(zoneId).toInstant());

        Notification notification = new Notification(NotificationType.EMAIL, message, notificationDate, false);
        notification.setCustomer(customer);
        notificationRepository.save(notification);

        return ResponseEntity.ok("Customer successfully created!");
    }

    // add a new contact
    @PostMapping("{customer_id}/contacts/add-contact")
    public ResponseEntity<String> addContact(@Validated @PathVariable int customer_id,
                                             @RequestBody Contact contact){
        Optional<Customer> optionalCustomer = customerRepository.findById(customer_id);
        if(optionalCustomer.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Customer with ID : " + customer_id + " not found !"
            );
        }
        Customer customer = optionalCustomer.get();

        customer.getContacts().add(contact);
        contact.setCustomer(customer);

        customerRepository.save(customer);

        return ResponseEntity.ok("Contact successfully created!");
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

    // create a new appointment
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @PostMapping("/{customer_id}/book-appointment")
    public ResponseEntity<?> createAppointment(@RequestBody Appointment appointment, @PathVariable int customer_id, Authentication authentication) {

        // extract the currently authenticated user's username from Authentication
        String username = authentication.getName();
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if(optionalUser.isEmpty()){
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found !"
            );
        }

        User user = optionalUser.get();

        Optional<Customer> optionalCustomer = customerRepository.findById(customer_id);

        if(optionalCustomer.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Customer with ID : " + customer_id + " not found !"
            );
        }
        Customer customer = optionalCustomer.get();

        // initialize the list of customers and users
        appointment.setCustomers(new ArrayList<>());
        appointment.setUsers(new ArrayList<>());

        // add user and customer
        appointment.getUsers().add(user);
        appointment.getCustomers().add(customer);

        user.getEvents().add(appointment);
        customer.getEvents().add(appointment);

        // save appointment
        appointmentRepository.save(appointment);

        // save user
        userRepository.save(user);

        // save customer
        customerRepository.save(customer);

        return ResponseEntity.status(HttpStatus.CREATED).body("Appointment successfully created !");
    }

    // edit customer
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @PutMapping("/{customer_id}/edit-customer")
    public ResponseEntity<String> updateCustomer(@PathVariable int customer_id, @RequestBody Customer theCustomer){

        Optional<Customer> optionalCustomer = customerRepository.findById(customer_id);

        if(optionalCustomer.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Customer with ID : " + customer_id + " not found !"
            );
        }
        Customer updateCustomer = optionalCustomer.get();

        // update customer
        updateCustomer.setFname(theCustomer.getFname());
        updateCustomer.setLname(theCustomer.getLname());
        updateCustomer.setPhoneNumber(theCustomer.getPhoneNumber());
        updateCustomer.setEmail(theCustomer.getEmail());

        customerRepository.save(updateCustomer);
        return ResponseEntity.ok("Customer updated successfully !");
    }

    // get all the purchases for a customer
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("/{customer_id}/purchases")
    public List<Purchase> getPurchases(@PathVariable int customer_id){

        Optional<Customer> optionalCustomer = customerRepository.findById(customer_id);

        if(optionalCustomer.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Customer with ID : " + customer_id + " not found !"
            );
        }
        Customer customer = optionalCustomer.get();

        return customer.getPurchases();
    }

    // get all the ssl certificates for a customer
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("/{customer_id}/SSLCertificates")
    public List<SSLCertificate> getCertificates(@PathVariable int customer_id){

        Optional<Customer> optionalCustomer = customerRepository.findById(customer_id);

        if(optionalCustomer.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Customer with ID : " + customer_id + " not found !"
            );
        }
        Customer customer = optionalCustomer.get();

        return customer.getSslCertificates();
    }

    // get all the software licenses for a customer
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("/{customer_id}/softwareLicenses")
    public List<SoftwareLicense> getLicenses(@PathVariable int customer_id){

        Optional<Customer> optionalCustomer = customerRepository.findById(customer_id);

        if(optionalCustomer.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Customer with ID : " + customer_id + " not found !"
            );
        }
        Customer customer = optionalCustomer.get();

        return customer.getSoftwareLicenses();
    }

    // get all the contacts for a customer
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("/{customer_id}/contacts")
    public List<Contact> getContacts(@PathVariable int customer_id){

        Optional<Customer> optionalCustomer = customerRepository.findById(customer_id);

        if(optionalCustomer.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Customer with ID : " + customer_id + " not found !"
            );
        }
        Customer customer = optionalCustomer.get();

        return customer.getContacts();
    }

    // get all the softwares for a customer
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("/{customer_id}/softwares")
    public List<Software> getSoftwares(@PathVariable int customer_id){

        Optional<Customer> optionalCustomer = customerRepository.findById(customer_id);

        if(optionalCustomer.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Customer with ID : " + customer_id + " not found !"
            );
        }
        Customer customer = optionalCustomer.get();

        return customer.getSoftwares();
    }

    // get the appointments between a customer and the logged in user
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("/{customer_id}/appointments")
    public List<Appointment> getAppointments(@PathVariable int customer_id, Authentication authentication){

        Optional<Customer> optionalCustomer = customerRepository.findById(customer_id);

        if(optionalCustomer.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Customer with ID : " + customer_id + " not found !"
            );
        }
        Customer customer = optionalCustomer.get();

        // extract the currently authenticated user's username from Authentication
        String username = authentication.getName();
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if(optionalUser.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found !"
            );
        }

        User user = optionalUser.get();
        List<Appointment> commonAppointments = new ArrayList<>();

        for(Appointment appointment : appointmentRepository.findAll()){
            System.out.println(appointment.getCustomers().toString());
            if(appointment.getCustomers() != null && appointment.getCustomers().contains(customer)
            && appointment.getUsers() != null && appointment.getUsers().contains(user)) {
                commonAppointments.add(appointment);
            }
        }

        return commonAppointments;
    }

}
