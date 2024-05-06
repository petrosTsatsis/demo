package dit.hua.gr.thesis.demo.controllers;

import dit.hua.gr.thesis.demo.entities.Activity;
import dit.hua.gr.thesis.demo.entities.Customer;
import dit.hua.gr.thesis.demo.entities.SSLCertificate;
import dit.hua.gr.thesis.demo.entities.User;
import dit.hua.gr.thesis.demo.repositories.ActivityRepository;
import dit.hua.gr.thesis.demo.repositories.CustomerRepository;
import dit.hua.gr.thesis.demo.repositories.SSLCertificateRepository;
import dit.hua.gr.thesis.demo.repositories.UserRepository;
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
@RequestMapping("/SSLCertificates")
@CrossOrigin("*")
public class SSLCertificateController {

    @Autowired
    private SSLCertificateRepository sslCertificateRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private UserRepository userRepository;

    // get all SSLCerificates
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("")
    public List<SSLCertificate> getAll(){
        return sslCertificateRepository.findAll();
    }

    // get SSLCertificate by id
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("/{certificate_id}")
    public ResponseEntity<?> getSSLCertificate(@PathVariable long certificate_id) {
        Optional<SSLCertificate> optionalSSLCertificate = sslCertificateRepository.findById(certificate_id);
        if(optionalSSLCertificate.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "SSL Certificate with ID : " + certificate_id + " not found !"
            );
        }
        SSLCertificate sslCertificate = optionalSSLCertificate.get();

        return ResponseEntity.ok(sslCertificate);
    }
    // create a new SSL Certificate
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @PostMapping("/add-certificate/customers/{customer_id}")
    public ResponseEntity<String> addSSLCertificate(@Validated @RequestBody SSLCertificate sslCertificate,
                                                    @PathVariable long customer_id, Authentication authentication){

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
        if(optionalCustomer.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Customer with ID : " + customer_id + " not found !"
            );
        }

        // specify the time zone ("Europe/Athens")
        ZoneId zoneId = ZoneId.of("Europe/Athens");

        // use LocalDateTime to get the current date and time in the specified time zone
        LocalDateTime registrationDateTime = LocalDateTime.now(zoneId);

        // convert LocalDateTime to Date
        Date registrationDate = Date.from(registrationDateTime.atZone(zoneId).toInstant());

        // set the current date as registration date
        sslCertificate.setRegistrationDate(registrationDate);

        // set the default status as Active
        sslCertificate.setStatus("Active");

        Customer customer = optionalCustomer.get();

        sslCertificate.setCustomer(customer);

        sslCertificateRepository.save(sslCertificate);

        // add activity
        String activityDescription = "Added a new ssl certificate from : " + sslCertificate.getIssuer();
        Activity activity = new Activity(activityDescription, new Date(), user);
        activityRepository.save(activity);

        return ResponseEntity.ok("SSL Certificate successfully created !");
    }

    // delete ssl certificate by id
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @DeleteMapping("/{certificate_id}")
    public ResponseEntity<String> deleteSSLCertificate(@PathVariable long certificate_id, Authentication authentication){

        // extract the currently authenticated user's username from Authentication
        String username = authentication.getName();
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found!"
            );
        }

        User user = optionalUser.get();

        Optional<SSLCertificate> optionalSSLCertificate = sslCertificateRepository.findById(certificate_id);
        if(optionalSSLCertificate.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "SSL Certificate with ID : " + certificate_id + " not found !"
            );
        }
        SSLCertificate sslCertificate = optionalSSLCertificate.get();

        String activityDescription = "Deleted a certificate from : " + sslCertificate.getIssuer();
        Activity activity = new Activity(activityDescription, new Date(), user);
        activityRepository.save(activity);


        sslCertificateRepository.delete(sslCertificate);

        return ResponseEntity.ok("SSL Certificate with ID " + certificate_id + " successfully deleted ! ");
    }

    // update ssl certificate
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @PutMapping("/{certificate_id}/edit-certificate")
    public ResponseEntity<String> updateCertificate(@PathVariable long certificate_id, @RequestBody SSLCertificate theCertificate, Authentication authentication) {

        Optional<SSLCertificate> optionalSSLCertificate = sslCertificateRepository.findById(certificate_id);
        if (optionalSSLCertificate.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "SSL Certificate with ID : " + certificate_id + " not found !"
            );
        }
        SSLCertificate updateCertificate = optionalSSLCertificate.get();

        // Save the original values for comparison
        String originalType = updateCertificate.getType();
        String originalStatus = updateCertificate.getStatus();
        String originalIssuer = updateCertificate.getIssuer();
        Date originalExpirationDate = updateCertificate.getExpirationDate();

        // update certificate
        updateCertificate.setType(theCertificate.getType());
        updateCertificate.setStatus(theCertificate.getStatus());
        updateCertificate.setIssuer(theCertificate.getIssuer());
        updateCertificate.setExpirationDate(theCertificate.getExpirationDate());

        sslCertificateRepository.save(updateCertificate);

        // Check for changes and add activities accordingly
        addActivityForCertificateUpdate(updateCertificate, originalType, originalStatus,
                originalIssuer, originalExpirationDate, authentication);

        return ResponseEntity.ok("SSL Certificate updated successfully !");
    }

    private void addActivityForCertificateUpdate(SSLCertificate updatedCertificate,
                                                 String originalType,
                                                 String originalStatus,
                                                 String originalIssuer,
                                                 Date originalExpirationDate,
                                                 Authentication authentication) {
        String username = authentication.getName();
        List<String> activities = new ArrayList<>();

        if (!updatedCertificate.getType().equals(originalType)) {
            activities.add("Updated SSL Certificate type from " + originalType + " to " + updatedCertificate.getType() + ". ");
        }

        if (!updatedCertificate.getStatus().equals(originalStatus)) {
            activities.add("Updated SSL Certificate status from " + originalStatus + " to " + updatedCertificate.getStatus() + ". ");
        }

        if (!updatedCertificate.getIssuer().equals(originalIssuer)) {
            activities.add("Updated SSL Certificate issuer from " + originalIssuer + " to " + updatedCertificate.getIssuer() + ". ");
        }

        if (!updatedCertificate.getExpirationDate().equals(originalExpirationDate)) {
            activities.add("Updated SSL Certificate expiration date from " + originalExpirationDate + " to " + updatedCertificate.getExpirationDate() + ". ");
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
}
