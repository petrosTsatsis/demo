package dit.hua.gr.thesis.demo.controllers;

import dit.hua.gr.thesis.demo.entities.Customer;
import dit.hua.gr.thesis.demo.entities.Event;
import dit.hua.gr.thesis.demo.entities.Software;
import dit.hua.gr.thesis.demo.repositories.CustomerRepository;
import dit.hua.gr.thesis.demo.repositories.SoftwareRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

@RestController
@RequestMapping("/Software")
public class SoftwareController {

    @Autowired
    private SoftwareRepository softwareRepository;

    @Autowired
    private CustomerRepository customerRepository;

    // get all softwares
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("")
    public List<Software> getAllSoftware() {
        return softwareRepository.findAll();
    }

    // get software by id
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("/{software_id}")
    public ResponseEntity<?> getSoftware(@PathVariable int software_id) {
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
    public ResponseEntity<String> addSoftware(@Validated @RequestBody Software software) throws ParseException {

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

        return ResponseEntity.ok("Software successfully created ! ");
    }

    // delete software by id
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{software_id}")
    public ResponseEntity<String> deleteSoftware(@PathVariable int software_id){
        Optional<Software> optionalSoftware = softwareRepository.findById(software_id);
        if(optionalSoftware.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Software with ID : " + software_id + " not found !"
            );
        }
        Software software = optionalSoftware.get();

        List<Customer> customers = software.getCustomers();
        for (Customer customer : customers) {
            customer.getSoftwares().remove(software);
            customerRepository.save(customer);
        }

        // delete the software
        softwareRepository.delete(software);

        return ResponseEntity.ok("Software with ID " + software_id + " successfully deleted ! ");
    }

    // update software
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @PutMapping("/{software_id}/edit-software")
    public ResponseEntity<String> updateSoftware(@PathVariable int software_id, @RequestBody Software theSoftware){

        Optional<Software> optionalSoftware = softwareRepository.findById(software_id);

        if(optionalSoftware.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Software with ID : " + software_id + " not found !"
            );
        }
        Software updateSoftware= optionalSoftware.get();

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
        return ResponseEntity.ok("Software updated successfully !");
    }
}
