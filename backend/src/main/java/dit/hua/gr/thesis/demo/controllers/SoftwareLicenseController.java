package dit.hua.gr.thesis.demo.controllers;

import dit.hua.gr.thesis.demo.entities.*;
import dit.hua.gr.thesis.demo.repositories.*;
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
@RequestMapping("/SoftwareLicences")
@CrossOrigin("*")
public class SoftwareLicenseController {

    @Autowired
    private SoftwareLicenseRepository softwareLicenseRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private SoftwareRepository softwareRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private UserRepository userRepository;

    // get all licenses
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("")
    public List<SoftwareLicense> getAll() {
        return softwareLicenseRepository.findAll();
    }

    // get license by id
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("/{license_id}")
    public ResponseEntity<?> getSoftwareLicense(@PathVariable long license_id) {
        Optional<SoftwareLicense> optionalSoftwareLicense = softwareLicenseRepository.findById(license_id);
        if (optionalSoftwareLicense.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Certificate license with ID : " + license_id + " not found !"
            );
        }
        SoftwareLicense softwareLicense = optionalSoftwareLicense.get();

        return ResponseEntity.ok(softwareLicense);
    }

    // create a new license
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @PostMapping("/add-license")
    public ResponseEntity<String> addSoftwareLicense(@Validated @RequestBody SoftwareLicense softwareLicense, Authentication authentication) {

        // extract the currently authenticated user's username from Authentication
        String username = authentication.getName();
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found!"
            );
        }

        User user = optionalUser.get();

        // Check if the customer exists
        Optional<Customer> optionalCustomer = customerRepository.findById(softwareLicense.getCustomer().getId());
        if (optionalCustomer.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Customer not found. License not created.");
        }

        // Check if the software exists
        Optional<Software> optionalSoftware = softwareRepository.findById(softwareLicense.getSoftware().getId());
        if (optionalSoftware.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Software not found. License not created.");
        }

        // specify the time zone ("Europe/Athens")
        ZoneId zoneId = ZoneId.of("Europe/Athens");

        // use LocalDateTime to get the current date and time in the specified time zone
        LocalDateTime registrationDateTime = LocalDateTime.now(zoneId);

        // convert LocalDateTime to Date
        Date registrationDate = Date.from(registrationDateTime.atZone(zoneId).toInstant());

        // set the current date as registration date
        softwareLicense.setRegistrationDate(registrationDate);

        Customer customer = optionalCustomer.get();
        Software software = optionalSoftware.get();

        // set the name of the license as the name of the associate software
        softwareLicense.setName(software.getName() + " License");

        //set the default status as Active
        softwareLicense.setStatus("Active");

        // set the customer and software in the purchase
        softwareLicense.setCustomer(customer);
        softwareLicense.setSoftware(software);

        softwareLicenseRepository.save(softwareLicense);

        // add activity
        String activityDescription = "Added a new software license for the software : " + softwareLicense.getName();
        Activity activity = new Activity(activityDescription, new Date(), user);
        activityRepository.save(activity);

        return ResponseEntity.ok("Software license successfully created !");
    }


    // delete license by id
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @DeleteMapping("/{license_id}")
    public ResponseEntity<String> deleteSoftwareLicense(@PathVariable long license_id, Authentication authentication) {

        // extract the currently authenticated user's username from Authentication
        String username = authentication.getName();
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found!"
            );
        }

        User user = optionalUser.get();

        Optional<SoftwareLicense> optionalSoftwareLicense = softwareLicenseRepository.findById(license_id);
        if (optionalSoftwareLicense.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Software license with ID : " + license_id + " not found !"
            );
        }
        SoftwareLicense softwareLicense = optionalSoftwareLicense.get();

        // add activity
        String activityDescription = "Deleted a license for software : " + softwareLicense.getName();
        Activity activity = new Activity(activityDescription, new Date(), user);
        activityRepository.save(activity);

        softwareLicenseRepository.delete(softwareLicense);

        return ResponseEntity.ok("Software license with ID " + license_id + " successfully deleted ! ");
    }

    // update software license
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @PutMapping("/{license_id}/edit-license")
    public ResponseEntity<String> updateSoftwareLicense(@PathVariable long license_id, @RequestBody SoftwareLicense theLicense, Authentication authentication) {

        Optional<SoftwareLicense> optionalSoftwareLicense = softwareLicenseRepository.findById(license_id);
        if (optionalSoftwareLicense.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Software license with ID : " + license_id + " not found !"
            );
        }

        SoftwareLicense originalLicense = optionalSoftwareLicense.get();

        // Save the original values for comparison
        String originalName = originalLicense.getName();
        String originalStatus = originalLicense.getStatus();
        Date originalActivationDate = originalLicense.getActivationDate();
        Date originalExpirationDate = originalLicense.getExpirationDate();

        // Update license
        originalLicense.setName(theLicense.getName());
        originalLicense.setStatus(theLicense.getStatus());
        originalLicense.setActivationDate(theLicense.getActivationDate());
        originalLicense.setExpirationDate(theLicense.getExpirationDate());

        softwareLicenseRepository.save(originalLicense);

        // Check for changes and add activities accordingly
        addActivityForLicenseUpdate(theLicense, originalName, originalStatus,
                originalActivationDate, originalExpirationDate,
                authentication);

        return ResponseEntity.ok("Software license updated successfully !");
    }

    private void addActivityForLicenseUpdate(SoftwareLicense updatedLicense,
                                             String originalName,
                                             String originalStatus,
                                             Date originalActivationDate,
                                             Date originalExpirationDate,
                                             Authentication authentication) {
        String username = authentication.getName();
        List<String> activities = new ArrayList<>();

        if (!updatedLicense.getName().equals(originalName)) {
            activities.add("Updated Software License name from " + originalName + " to " + updatedLicense.getName() + ". ");
        }

        if (!updatedLicense.getStatus().equals(originalStatus)) {
            activities.add("Updated Software License status from " + originalStatus + " to " + updatedLicense.getStatus() + ". ");
        }

        if (!updatedLicense.getActivationDate().equals(originalActivationDate)) {
            activities.add("Updated Software License activation date from " + originalActivationDate + " to " + updatedLicense.getActivationDate() + ". ");
        }

        if (!updatedLicense.getExpirationDate().equals(originalExpirationDate)) {
            activities.add("Updated Software License expiration date from " + originalExpirationDate + " to " + updatedLicense.getExpirationDate() + ". ");
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
