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
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/Companies")
@CrossOrigin("*")
public class CompanyController {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private CustomerRepository customerRepository;


    // get all companies
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("")
    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    // get company by id
    @GetMapping("/id/{company_id}")
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    public ResponseEntity<?> getCompanyById(@PathVariable long company_id) {
        Optional<Company> optionalCompany = companyRepository.findById(company_id);
        if (optionalCompany.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Company with ID : " + company_id + " not found !"
            );
        }
        Company company = optionalCompany.get();
        return ResponseEntity.ok(company);
    }

    // get company by name
    @GetMapping("/companyName/{company_name}")
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    public ResponseEntity<?> getCompanyByName(@PathVariable String company_name) {
        Optional<Company> optionalCompany = companyRepository.findCompanyByName(company_name);
        if (optionalCompany.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Company with name : " + company_name + " not found !"
            );
        }
        Company company = optionalCompany.get();
        return ResponseEntity.ok(company);
    }

    // create a new company
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @PostMapping("/add-company")
    public ResponseEntity<String> addCompany(@Validated @RequestBody Company company, Authentication authentication) {

        // extract the currently authenticated user's username from Authentication
        String username = authentication.getName();
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found!"
            );
        }

        User user = optionalUser.get();

        if (customerRepository.existsByEmail(company.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        if (customerRepository.existsByPhoneNumber(company.getPhoneNumber())) {
            return ResponseEntity.badRequest().body("Error: Phone number is already in use!");
        }

        // specify the time zone ("Europe/Athens")
        ZoneId zoneId = ZoneId.of("Europe/Athens");

        // use LocalDateTime to get the current date and time in the specified time zone
        LocalDateTime registrationDateTime = LocalDateTime.now(zoneId);

        // convert LocalDateTime to Date
        Date registrationDate = Date.from(registrationDateTime.atZone(zoneId).toInstant());

        // set the current date as registration date
        company.setRegistrationDate(registrationDate);

        // save the company
        companyRepository.save(company);

        // send welcome email
        String message = "Welcome " + company.getName() + " hope you enjoy the journey !";
        String subject = "Welcome";
        emailService.sendEmail(company.getEmail(), message, subject);

        // convert LocalDateTime to Date for the Notification object too
        Date notificationDate = Date.from(registrationDateTime.atZone(zoneId).toInstant());

        Notification notification = new Notification(NotificationType.EMAIL, message, notificationDate, false);
        notification.setCustomer(company);
        notificationRepository.save(notification);

        // add activity
        String activityDescription = "Added a new company : " + company.getName();
        Activity activity = new Activity(activityDescription, new Date(), user);
        activityRepository.save(activity);

        return ResponseEntity.ok("Company successfully created!");
    }

    // delete company by id
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @DeleteMapping("/{company_id}")
    public ResponseEntity<String> deleteCompany(@PathVariable long company_id, Authentication authentication) {

        // extract the currently authenticated user's username from Authentication
        String username = authentication.getName();
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found!"
            );
        }

        User user = optionalUser.get();

        Optional<Company> optionalCompany = companyRepository.findById(company_id);
        if (optionalCompany.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Company with ID : " + company_id + " not found !"
            );
        }
        Company company = optionalCompany.get();

        List<Event> events = company.getEvents();
        for (Event event : events) {
            event.getCustomers().remove(company);
            eventRepository.save(event);
        }

        List<Contact> contacts = company.getContacts();
        for (Contact contact : contacts) {
            contact.setCompany(null);
            contactRepository.save(contact);
        }

        // add activity
        String activityDescription = "Deleted a company : " + company.getName();
        Activity activity = new Activity(activityDescription, new Date(), user);
        activityRepository.save(activity);

        companyRepository.delete(company);

        return ResponseEntity.ok("Company with ID " + company_id + " successfully deleted!");
    }

    // Edit company
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @PutMapping("/{company_id}/edit-company")
    public ResponseEntity<String> updateCompany(@PathVariable long company_id, @RequestBody Company updatedCompany, Authentication authentication) {

        Optional<Company> optionalCompany = companyRepository.findById(company_id);

        if (optionalCompany.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Company with ID : " + company_id + " not found!"
            );
        }

        Company originalCompany = optionalCompany.get();

        // Save the original values for comparison
        String originalName = originalCompany.getName();
        String originalPhoneNumber = originalCompany.getPhoneNumber();
        String originalEmail = originalCompany.getEmail();

        // Update company-specific fields
        originalCompany.setName(updatedCompany.getName());
        originalCompany.setWebsite(updatedCompany.getWebsite());
        originalCompany.setIndustry(updatedCompany.getIndustry());
        originalCompany.setAnnualRevenue(updatedCompany.getAnnualRevenue());
        originalCompany.setEmployeesNumber(updatedCompany.getEmployeesNumber());
        originalCompany.setDescription(updatedCompany.getDescription());
        originalCompany.setPhoneNumber(updatedCompany.getPhoneNumber());
        originalCompany.setEmail(updatedCompany.getEmail());

        // Check if the new email is already in use by another customer
        if (!originalEmail.equals(updatedCompany.getEmail()) && customerRepository.existsByEmail(updatedCompany.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        // Check if the new phone number is already in use by another customer
        if (!originalPhoneNumber.equals(updatedCompany.getPhoneNumber()) && customerRepository.existsByPhoneNumber(updatedCompany.getPhoneNumber())) {
            return ResponseEntity.badRequest().body("Error: Phone number is already in use!");
        }

        companyRepository.save(originalCompany);

        // Check for changes and add activities accordingly
        addActivityForCompanyUpdate(
                originalCompany,
                originalName,
                originalPhoneNumber,
                originalEmail,
                originalCompany.getAnnualRevenue(),
                originalCompany.getEmployeesNumber(),
                originalCompany.getDescription(),
                authentication
        );

        return ResponseEntity.ok("Company updated successfully!");
    }

    private void addActivityForCompanyUpdate(
            Company updatedCompany,
            String originalName,
            String originalPhoneNumber,
            String originalEmail,
            double originalAnnualRevenue,
            long originalEmployeesNumber,
            String originalDescription,
            Authentication authentication) {

        String username = authentication.getName();
        List<String> activities = new ArrayList<>();

        if (!updatedCompany.getName().equals(originalName)) {
            activities.add("Updated Company name from " + originalName + " to " + updatedCompany.getName() + ". ");
        }

        if (!updatedCompany.getPhoneNumber().equals(originalPhoneNumber)) {
            activities.add("Updated Company phone number from " + originalPhoneNumber + " to " + updatedCompany.getPhoneNumber() + ". ");
        }

        if (!updatedCompany.getEmail().equals(originalEmail)) {
            activities.add("Updated Company email from " + originalEmail + " to " + updatedCompany.getEmail() + ". ");
        }

        if (updatedCompany.getAnnualRevenue() != originalAnnualRevenue) {
            activities.add("Updated Company annual revenue from " + originalAnnualRevenue + " to " + updatedCompany.getAnnualRevenue() + ". ");
        }

        if (updatedCompany.getEmployeesNumber() != originalEmployeesNumber) {
            activities.add("Updated Company employees number from " + originalEmployeesNumber + " to " + updatedCompany.getEmployeesNumber() + ". ");
        }

        if (!updatedCompany.getDescription().equals(originalDescription)) {
            activities.add("Updated Company description for " + updatedCompany.getName() + " software. ");
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

    // get the contacts of this company that are connected with the logged-in user
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("/{company_id}/contacts")
    public List<Contact> getCommonContacts(@PathVariable Long company_id, Authentication authentication) {

        Optional<Company> optionalCompany = companyRepository.findById(company_id);
        if (optionalCompany.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Company with ID : " + company_id + " not found !"
            );
        }
        Company company = optionalCompany.get();

        // extract the currently authenticated user's username from Authentication
        String username = authentication.getName();
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found !"
            );
        }

        User user = optionalUser.get();
        List<Contact> commonContacts = new ArrayList<>();

        for (Contact contact : contactRepository.findAll()) {
            if (user.getContacts() != null && company.getContacts() != null) {
                if (user.getContacts().contains(contact) && company.getContacts().contains(contact)) {
                    commonContacts.add(contact);
                }
            }
        }

        return commonContacts;
    }

    // add contacts to a company
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @PostMapping("/{company_id}/add-contact")
    public ResponseEntity<String> addContactToCompany(@PathVariable Long company_id, @RequestBody List<Contact> contacts, Authentication authentication) {

        String username = authentication.getName();
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found!"
            );
        }

        User loggedInUser = optionalUser.get();

        Optional<Company> optionalCompany = companyRepository.findById(company_id);
        if (optionalCompany.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Company with ID : " + company_id + " not found !"
            );
        }

        Company company = optionalCompany.get();

        // Set the company for the contacts
        for (Contact contact : contacts) {
            contact.setCompany(company);
            contact.setUser(loggedInUser);
            contactRepository.save(contact);
        }

        // Update the company's contact list
        if (company.getContacts() == null) {
            company.setContacts(new ArrayList<>());
        }
        company.setContacts(contacts);

        // Save the updated company
        companyRepository.save(company);

        // Add activity
        String activityDescription = "Added a Contact.";
        Activity activity = new Activity(activityDescription, new Date(), loggedInUser);
        activityRepository.save(activity);

        return ResponseEntity.ok("Contact successfully added to the company!");
    }

    // remove the given contacts from the company contact list
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @DeleteMapping("/remove-contact")
    public ResponseEntity<String> removeContact(@RequestBody Contact contact, Authentication authentication) {

        String username = authentication.getName();
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found!"
            );
        }

        User loggedInUser = optionalUser.get();

        if (contact == null) {
            return ResponseEntity.badRequest().body("Contact is not found.");
        } else {

            contact.setCompany(null);
            contactRepository.save(contact);

            // Add activity
            String activityDescription = "Removed a Contact.";
            Activity activity = new Activity(activityDescription, new Date(), loggedInUser);
            activityRepository.save(activity);
        }
        return ResponseEntity.ok("Contact successfully removed from the company!");

    }
}
