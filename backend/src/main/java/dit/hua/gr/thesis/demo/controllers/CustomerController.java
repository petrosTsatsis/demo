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
    private EventRepository eventRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private ActivityRepository activityRepository;

    // get all customers
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("")
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    // get customer by id
    @GetMapping("/{customer_id}")
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    public ResponseEntity<?> getCustomer(@PathVariable long customer_id) {
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
    public ResponseEntity<String> addCustomer(@Validated @RequestBody Customer customer, Authentication authentication) {

        // extract the currently authenticated user's username from Authentication
        String username = authentication.getName();
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found!"
            );
        }

        User user = optionalUser.get();

        if (customerRepository.existsByEmail(customer.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        if (customerRepository.existsByPhoneNumber(customer.getPhoneNumber())) {
            return ResponseEntity.badRequest().body("Error: Phone number is already in use!");
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

        // add activity
        String activityDescription = "Added a new customer : " + customer.getFname() + " " + customer.getLname();
        Activity activity = new Activity(activityDescription, new Date(), user);
        activityRepository.save(activity);

        return ResponseEntity.ok("Customer successfully created!");
    }

    // delete customer by id
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @DeleteMapping("/{customer_id}")
    public ResponseEntity<String> deleteCustomer(@PathVariable long customer_id, Authentication authentication) {

        // extract the currently authenticated user's username from Authentication
        String username = authentication.getName();
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found!"
            );
        }

        User user = optionalUser.get();

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

        // add activity
        String activityDescription = "Deleted a customer : " + customer.getFname() + " " + customer.getLname();
        Activity activity = new Activity(activityDescription, new Date(), user);
        activityRepository.save(activity);

        customerRepository.delete(customer);

        return ResponseEntity.ok("Customer with ID " + customer_id + " successfully deleted!");
    }

    // Edit customer
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @PutMapping("/{customer_id}/edit-customer")
    public ResponseEntity<String> updateCustomer(@PathVariable long customer_id, @RequestBody Customer updatedCustomer, Authentication authentication) {

        Optional<Customer> optionalCustomer = customerRepository.findById(customer_id);

        if (optionalCustomer.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Customer with ID : " + customer_id + " not found !"
            );
        }
        Customer originalCustomer = optionalCustomer.get();

        // Save the original values for comparison
        String originalFname = originalCustomer.getFname();
        String originalLname = originalCustomer.getLname();
        String originalPhoneNumber = originalCustomer.getPhoneNumber();
        String originalEmail = originalCustomer.getEmail();
        Date originalBirthDate = originalCustomer.getBirthDate();

        // Update customer
        originalCustomer.setFname(updatedCustomer.getFname());
        originalCustomer.setLname(updatedCustomer.getLname());
        originalCustomer.setPhoneNumber(updatedCustomer.getPhoneNumber());
        originalCustomer.setEmail(updatedCustomer.getEmail());
        originalCustomer.setBirthDate(updatedCustomer.getBirthDate());

        // Check if the new email is already in use by another customer
        if (!originalEmail.equals(updatedCustomer.getEmail()) && customerRepository.existsByEmail(updatedCustomer.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        // Check if the new phone number is already in use by another customer
        if (!originalPhoneNumber.equals(updatedCustomer.getPhoneNumber()) && customerRepository.existsByPhoneNumber(updatedCustomer.getPhoneNumber())) {
            return ResponseEntity.badRequest().body("Error: Phone number is already in use!");
        }

        customerRepository.save(originalCustomer);

        // Check for changes and add activities accordingly
        addActivityForCustomerUpdate(originalCustomer, originalFname, originalLname, originalPhoneNumber, originalEmail, originalBirthDate, authentication);

        return ResponseEntity.ok("Customer updated successfully !");
    }

    private void addActivityForCustomerUpdate(
            Customer updatedCustomer,
            String originalFname,
            String originalLname,
            String originalPhoneNumber,
            String originalEmail,
            Date originalBirthDate,
            Authentication authentication) {

        String username = authentication.getName();
        List<String> activities = new ArrayList<>();

        if (!updatedCustomer.getFname().equals(originalFname)) {
            activities.add("Updated Customer first name from " + originalFname + " to " + updatedCustomer.getFname() + ". ");
        }

        if (!updatedCustomer.getLname().equals(originalLname)) {
            activities.add("Updated Customer last name from " + originalLname + " to " + updatedCustomer.getLname() + ". ");
        }

        if (!updatedCustomer.getPhoneNumber().equals(originalPhoneNumber)) {
            activities.add("Updated Customer phone number from " + originalPhoneNumber + " to " + updatedCustomer.getPhoneNumber() + ". ");
        }

        if (!updatedCustomer.getEmail().equals(originalEmail)) {
            activities.add("Updated Customer email from " + originalEmail + " to " + updatedCustomer.getEmail() + ". ");
        }

        if (!Objects.equals(updatedCustomer.getBirthDate(), originalBirthDate)) {
            activities.add("Updated Customer birth date from " + originalBirthDate + " to " + updatedCustomer.getBirthDate() + ". ");
        }

        // Add the activities to the user's activity list
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            for (String activityDescription : activities) {
                Activity activity = new Activity(activityDescription, new Date(), user);
                activityRepository.save(activity);
            }
        }
    }

    // get all the purchases for a customer
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("/{customer_id}/purchases")
    public List<Purchase> getPurchases(@PathVariable long customer_id){

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
    public List<SSLCertificate> getCertificates(@PathVariable long customer_id){

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
    @GetMapping("/{customer_id}/SoftwareLicenses")
    public List<SoftwareLicense> getLicenses(@PathVariable long customer_id){

        Optional<Customer> optionalCustomer = customerRepository.findById(customer_id);

        if(optionalCustomer.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Customer with ID : " + customer_id + " not found !"
            );
        }
        Customer customer = optionalCustomer.get();

        return customer.getSoftwareLicenses();
    }

    // get the appointments between a customer and the logged in user
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("/{customer_id}/appointments")
    public List<Appointment> getCommonAppointments(@PathVariable long customer_id, Authentication authentication){

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

            if(appointment.getCustomers() != null && appointment.getCustomers().contains(customer)
            && appointment.getUsers() != null && appointment.getUsers().contains(user)) {
                commonAppointments.add(appointment);
            }
        }

        return commonAppointments;
    }

}
