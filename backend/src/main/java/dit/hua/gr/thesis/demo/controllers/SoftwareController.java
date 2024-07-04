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
@RequestMapping("/Software")
public class SoftwareController {

    @Autowired
    private SoftwareRepository softwareRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    // get all software
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("")
    public List<Software> getAllSoftware() {
        return softwareRepository.findAll();
    }

    // get software by id
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("/{software_id}")
    public ResponseEntity<?> getSoftware(@PathVariable long software_id) {
        Optional<Software> optionalSoftware = softwareRepository.findById(software_id);
        if(optionalSoftware.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Software with ID : " + software_id + " not found !"
            );
        }
        Software software = optionalSoftware.get();

        return ResponseEntity.ok(software);
    }

    // create a new software
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @PostMapping("/add-software")
    public ResponseEntity<String> addSoftware(@Validated @RequestBody Software software, Authentication authentication) {

        // extract the currently authenticated user's username from Authentication
        String username = authentication.getName();
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found!"
            );
        }

        User user = optionalUser.get();

        // specify the time zone ("Europe/Athens")
        ZoneId zoneId = ZoneId.of("Europe/Athens");

        // use LocalDateTime to get the current date and time in the specified time zone
        LocalDateTime registrationDateTime = LocalDateTime.now(zoneId);

        // convert LocalDateTime to Date
        Date registrationDate = Date.from(registrationDateTime.atZone(zoneId).toInstant());

        // set the current date as registration date
        software.setRegistrationDate(registrationDate);

        // save the software
        softwareRepository.save(software);

        // add activity
        String activityDescription = "Added a new software : " + software.getName();
        Activity activity = new Activity(activityDescription, new Date(), user);
        activityRepository.save(activity);

        return ResponseEntity.ok("Software successfully created ! ");
    }

    // delete software by id
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @DeleteMapping("/{software_id}")
    public ResponseEntity<String> deleteSoftware(@PathVariable long software_id,  Authentication authentication){

        // extract the currently authenticated user's username from Authentication
        String username = authentication.getName();
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found!"
            );
        }

        User user = optionalUser.get();

        Optional<Software> optionalSoftware = softwareRepository.findById(software_id);
        if(optionalSoftware.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Software with ID : " + software_id + " not found !"
            );
        }
        Software software = optionalSoftware.get();

        // add activity
        String activityDescription = "Deleted a software : " + software.getName();
        Activity activity = new Activity(activityDescription, new Date(), user);
        activityRepository.save(activity);

        List<Event> events = software.getEvents();
        List<Customer> customers;
        List<User> users;

        for(Event event: events){
            customers = event.getCustomers();
            users = event.getUsers();

            for(Customer customer: customers){
                customer.getEvents().remove(event);
                customerRepository.save(customer);
            }

            for(User user1: users){
                user1.getEvents().remove(event);
                userRepository.save(user1);
            }

            eventRepository.save(event);
            eventRepository.delete(event);
        }

        // delete the software
        softwareRepository.delete(software);

        return ResponseEntity.ok("Software with ID " + software_id + " successfully deleted ! ");
    }

    // update software
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @PutMapping("/{software_id}/edit-software")
    public ResponseEntity<String> updateSoftware(@PathVariable long software_id, @RequestBody Software theSoftware, Authentication authentication) {

        Optional<Software> optionalSoftware = softwareRepository.findById(software_id);

        if (optionalSoftware.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Software with ID : " + software_id + " not found !"
            );
        }
        Software updateSoftware = optionalSoftware.get();

        // Save the original values for comparison
        String originalName = updateSoftware.getName();
        String originalDescription = updateSoftware.getDescription();
        String originalVersion = updateSoftware.getVersion();
        String originalCategory = updateSoftware.getCategory();
        Double originalPrice = updateSoftware.getPrice();
        String originalSystemRequirements = updateSoftware.getSystemRequirements();
        List<String> originalLicensingOptions = updateSoftware.getLicensingOptions();
        List<String> originalSupportedPlatforms = updateSoftware.getSupportedPlatforms();
        Date originalReleaseDate = updateSoftware.getReleaseDate();
        String originalDeveloper = updateSoftware.getDeveloper();

        // update software
        updateSoftware.setName(theSoftware.getName());
        updateSoftware.setDescription(theSoftware.getDescription());
        updateSoftware.setVersion(theSoftware.getVersion());
        updateSoftware.setCategory(theSoftware.getCategory());
        updateSoftware.setPrice(theSoftware.getPrice());
        updateSoftware.setSystemRequirements(theSoftware.getSystemRequirements());
        updateSoftware.setLicensingOptions(theSoftware.getLicensingOptions());
        updateSoftware.setSupportedPlatforms(theSoftware.getSupportedPlatforms());
        updateSoftware.setReleaseDate(theSoftware.getReleaseDate());
        updateSoftware.setDeveloper(theSoftware.getDeveloper());

        softwareRepository.save(updateSoftware);

        addActivityForSoftwareUpdate(updateSoftware, originalName, originalDescription, originalVersion,
                originalCategory, originalPrice, originalSystemRequirements, originalLicensingOptions,
                originalSupportedPlatforms, originalReleaseDate, originalDeveloper, authentication);

        return ResponseEntity.ok("Software updated successfully !");
    }

    private void addActivityForSoftwareUpdate(Software updatedSoftware,
                                              String originalName,
                                              String originalDescription,
                                              String originalVersion,
                                              String originalCategory,
                                              Double originalPrice,
                                              String originalSystemRequirements,
                                              List <String> originalLicensingOptions,
                                              List<String> originalSupportedPlatforms,
                                              Date originalReleaseDate,
                                              String originalDeveloper,
                                              Authentication authentication) {
        String username = authentication.getName();
        List<String> activities = new ArrayList<>();

        if (!updatedSoftware.getName().equals(originalName)) {
            activities.add("Updated Software name from " + originalName + " to " + updatedSoftware.getName() + ". ");
        }

        if (!updatedSoftware.getDescription().equals(originalDescription)) {
            activities.add("Updated Software description for " + updatedSoftware.getName() + " software. ");
        }

        if (!updatedSoftware.getVersion().equals(originalVersion)) {
            activities.add("Updated Software version from " + originalVersion + " to " + updatedSoftware.getVersion() + ". ");
        }

        if (!updatedSoftware.getCategory().equals(originalCategory)) {
            activities.add("Updated Software category from " + originalCategory + " to " + updatedSoftware.getCategory() + ". ");
        }

        if (updatedSoftware.getPrice() != originalPrice) {
            activities.add("Updated Software price from " + originalPrice + " to " + updatedSoftware.getPrice() + ". ");
        }

        if (!updatedSoftware.getSystemRequirements().equals(originalSystemRequirements)) {
            activities.add("Updated Software system requirements for " + updatedSoftware.getName() + " software. ");
        }

        if (!updatedSoftware.getLicensingOptions().equals(originalLicensingOptions)) {
            activities.add("Updated Software licensing options for " + updatedSoftware.getName() + " software. ");
        }

        if (!updatedSoftware.getSupportedPlatforms().equals(originalSupportedPlatforms)) {
            activities.add("Updated Software supported platforms for " + updatedSoftware.getName() + " software. ");
        }

        if (!updatedSoftware.getReleaseDate().equals(originalReleaseDate)) {
            activities.add("Updated Software release date from " + originalReleaseDate + " to " + updatedSoftware.getReleaseDate() + ". ");
        }

        if (!updatedSoftware.getDeveloper().equals(originalDeveloper)) {
            activities.add("Updated Software developer from " + originalDeveloper + " to " + updatedSoftware.getDeveloper() + ". ");
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

    // get all the software licenses for a software
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("/{software_id}/softwareLicenses")
    public List<SoftwareLicense> getLicenses(@PathVariable long software_id){

        Optional<Software> optionalSoftware= softwareRepository.findById(software_id);

        if(optionalSoftware.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Software with ID : " + software_id + " not found !"
            );
        }
        Software software = optionalSoftware.get();

        return software.getSoftwareLicenses();
    }

    // get all the purchases for a software
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("/{software_id}/purchases")
    public List<Purchase> getPurchases(@PathVariable long software_id){

        Optional<Software> optionalSoftware= softwareRepository.findById(software_id);

        if(optionalSoftware.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Software with ID : " + software_id + " not found !"
            );
        }
        Software software = optionalSoftware.get();

        return software.getPurchases();
    }

    // get all the customers for a software
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("/{software_id}/customers")
    public List<Customer> getCustomers(@PathVariable long software_id){

        Optional<Software> optionalSoftware= softwareRepository.findById(software_id);

        if(optionalSoftware.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Software with ID : " + software_id + " not found !"
            );
        }
        Software software = optionalSoftware.get();

        List<Customer> customers = new ArrayList<>();

        // fetch the purchases of the software and then fetch the customer of each purchase
        for(Purchase purchase : software.getPurchases()){
            customers.add(purchase.getCustomer());
        }

        return customers;
    }
}
