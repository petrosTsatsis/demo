package dit.hua.gr.thesis.demo.controllers;

import dit.hua.gr.thesis.demo.entities.Customer;
import dit.hua.gr.thesis.demo.entities.SSLCertificate;
import dit.hua.gr.thesis.demo.entities.Software;
import dit.hua.gr.thesis.demo.entities.SoftwareLicense;
import dit.hua.gr.thesis.demo.repositories.CustomerRepository;
import dit.hua.gr.thesis.demo.repositories.SoftwareLicenseRepository;
import dit.hua.gr.thesis.demo.repositories.SoftwareRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/softwareLicences")
@CrossOrigin("*")
public class SoftwareLicenseController {

    @Autowired
    private SoftwareLicenseRepository softwareLicenseRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private SoftwareRepository softwareRepository;

    // get all licenses
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("")
    public List<SoftwareLicense> getAll(){
        return softwareLicenseRepository.findAll();
    }

    // get license by id
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("/{license_id}")
    public ResponseEntity<?> getSoftwareLicense(@PathVariable int license_id) {
        Optional<SoftwareLicense> optionalSoftwareLicense = softwareLicenseRepository.findById(license_id);
        if(optionalSoftwareLicense.isEmpty()) {
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
    public ResponseEntity<String> addSoftwareLicense(@Validated @RequestBody SoftwareLicense softwareLicense){

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

        Customer customer = optionalCustomer.get();
        Software software = optionalSoftware.get();

        softwareLicense.setName(software.getName());

        // set the customer and software in the purchase
        softwareLicense.setCustomer(customer);
        softwareLicense.setSoftware(software);

        softwareLicenseRepository.save(softwareLicense);

        return ResponseEntity.ok("Software license successfully created !");
    }


    // delete license by id
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @DeleteMapping("/{license_id}")
    public ResponseEntity<String> deleteSoftwareLicense(@PathVariable int license_id){
        Optional<SoftwareLicense> optionalSoftwareLicense = softwareLicenseRepository.findById(license_id);
        if(optionalSoftwareLicense.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Software license with ID : " + license_id + " not found !"
            );
        }
        SoftwareLicense softwareLicense = optionalSoftwareLicense.get();

        softwareLicenseRepository.delete(softwareLicense);

        return ResponseEntity.ok("Software license with ID " + license_id + " successfully deleted ! ");
    }
    // update software license
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @PutMapping("/{license_id}/edit-license")
    public ResponseEntity<String> updateSoftwareLicense(@PathVariable int license_id, @RequestBody SoftwareLicense theLicense){

        Optional<SoftwareLicense> optionalSoftwareLicense = softwareLicenseRepository.findById(license_id);
        if(optionalSoftwareLicense.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Software license with ID : " + license_id + " not found !"
            );
        }
        SoftwareLicense updateLicense = optionalSoftwareLicense.get();

        // update license
        updateLicense.setName(theLicense.getName());
        updateLicense.setStatus(theLicense.getStatus());
        updateLicense.setActivationDate(theLicense.getActivationDate());
        updateLicense.setExpirationDate(theLicense.getExpirationDate());
        updateLicense.setCustomer(theLicense.getCustomer());
        updateLicense.setSoftware(theLicense.getSoftware());

        softwareLicenseRepository.save(updateLicense);
        return ResponseEntity.ok("Software license updated successfully !");
    }
}
