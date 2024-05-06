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
@RequestMapping("/Purchases")
public class PurchaseController {

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private SoftwareRepository softwareRepository;

    @Autowired
    private SoftwareLicenseRepository softwareLicenseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActivityRepository activityRepository;

    // get all purchases
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("")
    public List<Purchase> getAllPurchases() {
        return purchaseRepository.findAll();
    }

    // get purchase by id
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("/{purchase_id}")
    public ResponseEntity<?> getPurchase(@PathVariable long purchase_id) {
        Optional<Purchase> optionalPurchase = purchaseRepository.findById(purchase_id);
        if(optionalPurchase.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Purchase with ID : " + purchase_id + " not found !"
            );
        }
        Purchase purchase = optionalPurchase.get();

        return ResponseEntity.ok(purchase);
    }

    // create a new purchase
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @PostMapping("/add-purchase")
    public ResponseEntity<String> addPurchase(@Validated @RequestBody Purchase purchase, Authentication authentication) {

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
        Optional<Customer> optionalCustomer = customerRepository.findById(purchase.getCustomer().getId());
        if (optionalCustomer.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Customer not found. Purchase not created.");
        }

        // Check if the software exists
        Optional<Software> optionalSoftware = softwareRepository.findById(purchase.getSoftware().getId());
        if (optionalSoftware.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Software not found. Purchase not created.");
        }

        // specify the time zone ("Europe/Athens")
        ZoneId zoneId = ZoneId.of("Europe/Athens");

        // use LocalDateTime to get the current date and time in the specified time zone
        LocalDateTime registrationDateTime = LocalDateTime.now(zoneId);

        // convert LocalDateTime to Date
        Date registrationDate = Date.from(registrationDateTime.atZone(zoneId).toInstant());

        // set the current date as registration date
        purchase.setRegistrationDate(registrationDate);

        // both customer and software exist, proceed with creating the purchase
        Customer customer = optionalCustomer.get();
        Software software = optionalSoftware.get();

        // set the customer and software in the purchase
        purchase.setCustomer(customer);
        purchase.setSoftware(software);

        // save the purchase
        purchaseRepository.save(purchase);

        // Calculate expiration date based on selected licensing option
        LocalDateTime expirationDateTime = switch (purchase.getLicensingOption().toLowerCase()) {
            case "1 month" -> registrationDateTime.plusMonths(1);
            case "3 months" -> registrationDateTime.plusMonths(3);
            case "6 months" -> registrationDateTime.plusMonths(6);
            case "1 year" -> registrationDateTime.plusYears(1);
            default -> throw new IllegalArgumentException("Invalid licensing option: " + purchase.getLicensingOption());
        };

        // Convert expiration LocalDateTime to Date
        Date expirationDate = Date.from(expirationDateTime.atZone(zoneId).toInstant());

        SoftwareLicense softwareLicense = new SoftwareLicense(registrationDate, expirationDate, customer, software);

        // set the name of the license as the name of the associate software
        softwareLicense.setName(software.getName() + " License");

        //set the default status as Active
        softwareLicense.setStatus("Active");

        softwareLicenseRepository.save(softwareLicense);

        // save the customer
        customerRepository.save(customer);

        // save the software
        softwareRepository.save(software);

        // add activity
        String activityDescription = "Added a new purchase. ";
        Activity activity = new Activity(activityDescription, new Date(), user);
        activityRepository.save(activity);

        return ResponseEntity.ok("Purchase created successfully!");
    }

    // delete purchase by id
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @DeleteMapping("/{purchase_id}")
    public ResponseEntity<String> deletePurchase(@PathVariable long purchase_id, Authentication authentication){

        // extract the currently authenticated user's username from Authentication
        String username = authentication.getName();
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found!"
            );
        }

        User user = optionalUser.get();

        Optional<Purchase> optionalPurchase = purchaseRepository.findById(purchase_id);
        if(optionalPurchase.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Purchase with ID : " + purchase_id + " not found !"
            );
        }
        Purchase purchase = optionalPurchase.get();

        // add activity
        String activityDescription = "Deleted a purchase from : " + purchase.getPurchaseDate();
        Activity activity = new Activity(activityDescription, new Date(), user);
        activityRepository.save(activity);

        purchaseRepository.delete(purchase);
        return ResponseEntity.ok("Purchase with ID " + purchase_id + " successfully deleted ! ");
    }

    // Update purchase
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @PutMapping("/{purchase_id}/edit-purchase")
    public ResponseEntity<String> updatePurchase(@PathVariable long purchase_id, @RequestBody Purchase updatedPurchase, Authentication authentication) {

        Optional<Purchase> optionalPurchase = purchaseRepository.findById(purchase_id);
        if (optionalPurchase.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Purchase with ID : " + purchase_id + " not found !"
            );
        }

        Purchase originalPurchase = optionalPurchase.get();

        // Save the original values for comparison
        double originalPrice = originalPurchase.getPrice();
        Date originalPurchaseDate = originalPurchase.getPurchaseDate();
        Customer originalCustomer = originalPurchase.getCustomer();
        Software originalSoftware = originalPurchase.getSoftware();
        String originalLicensingOption = originalPurchase.getLicensingOption();

        // Update purchase
        originalPurchase.setPrice(updatedPurchase.getPrice());
        originalPurchase.setPurchaseDate(updatedPurchase.getPurchaseDate());

        // Check if the customer exists
        Optional<Customer> optionalCustomer = customerRepository.findById(updatedPurchase.getCustomer().getId());
        if (optionalCustomer.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Customer not found. Purchase not updated.");
        }

        Customer updatedCustomer = optionalCustomer.get();

        // Type cast the customer object if necessary
        if (updatedCustomer instanceof Company) {
            // Set the customer by casting to Customer
            originalPurchase.setCustomer((Customer) updatedCustomer);
        } else {
            // If it's already a Customer object, directly set it
            originalPurchase.setCustomer(updatedCustomer);
        }

        originalPurchase.setSoftware(updatedPurchase.getSoftware());
        originalPurchase.setLicensingOption(updatedPurchase.getLicensingOption());

        purchaseRepository.save(originalPurchase);

        // Check for changes and add activities accordingly
        addActivityForPurchaseUpdate(originalPurchase, originalPrice, originalPurchaseDate, originalCustomer, originalSoftware, originalLicensingOption, authentication);

        return ResponseEntity.ok("Purchase updated successfully !");
    }

    private void addActivityForPurchaseUpdate(
            Purchase updatedPurchase,
            double originalPrice,
            Date originalPurchaseDate,
            Customer originalCustomer,
            Software originalSoftware,
            String originalLicensingOption,
            Authentication authentication) {

        List<String> activities = new ArrayList<>();

        if (updatedPurchase.getPrice() != originalPrice) {
            activities.add("Updated Purchase price from " + originalPrice + " to " + updatedPurchase.getPrice() + ". ");
        }

        if (!updatedPurchase.getPurchaseDate().equals(originalPurchaseDate)) {
            activities.add("Updated Purchase date from " + originalPurchaseDate + " to " + updatedPurchase.getPurchaseDate() + ". ");
        }

        if (!updatedPurchase.getCustomer().equals(originalCustomer)) {
            activities.add("Updated Purchase customer with email: " + originalCustomer.getEmail()+ " to customer with email :" + updatedPurchase.getCustomer().getEmail() + ". ");
        }

        if (!updatedPurchase.getSoftware().equals(originalSoftware)) {
            activities.add("Updated Purchase software from " + originalSoftware.getName() + " to " + updatedPurchase.getSoftware().getName() + ". ");
        }

        if (!updatedPurchase.getLicensingOption().equals(originalLicensingOption)) {
            activities.add("Updated Purchase licensing option from " + originalLicensingOption + " to " + updatedPurchase.getLicensingOption() + ". ");
        }

        // Add the activities to the user's activity list
        String username = authentication.getName();
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
