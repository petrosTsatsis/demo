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
import java.util.*;

@RestController
@RequestMapping("/softwares")
public class SoftwareController {

    @Autowired
    private SoftwareRepository softwareRepository;

    @Autowired
    private CustomerRepository customerRepository;

    // get all softwares
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("")
    public ResponseEntity<SoftwareListResponse> getAllSoftware() {
        List<Software> softwareList = softwareRepository.findAll();
        long softwareCount = softwareRepository.count();

        SoftwareListResponse response = new SoftwareListResponse(softwareList, softwareCount);
        return ResponseEntity.ok(response);
    }

    // create class that combine count and software list
    public static class SoftwareListResponse {
        private List<Software> softwareList;
        private long softwareCount;

        public SoftwareListResponse(List<Software> softwareList, long softwareCount) {
            this.softwareList = softwareList;
            this.softwareCount = softwareCount;
        }

        public List<Software> getSoftwareList() {
            return softwareList;
        }

        public long getSoftwareCount() {
            return softwareCount;
        }
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
}
