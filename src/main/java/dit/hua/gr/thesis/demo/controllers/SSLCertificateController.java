package dit.hua.gr.thesis.demo.controllers;

import dit.hua.gr.thesis.demo.entities.Customer;
import dit.hua.gr.thesis.demo.entities.SSLCertificate;
import dit.hua.gr.thesis.demo.entities.Software;
import dit.hua.gr.thesis.demo.repositories.CustomerRepository;
import dit.hua.gr.thesis.demo.repositories.SSLCertificateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.cert.Certificate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Calendar;
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

    // get all SSLCerificates
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("")
    public List<SSLCertificate> getAll(){
        return sslCertificateRepository.findAll();
    }

    // get SSLCertificate by id
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("/{certificate_id}")
    public ResponseEntity<?> getSSLCertificate(@PathVariable int certificate_id) {
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
                                                    @PathVariable int customer_id){

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

        Customer customer = optionalCustomer.get();

        sslCertificate.setCustomer(customer);

        sslCertificateRepository.save(sslCertificate);

        return ResponseEntity.ok("SSL Certificate successfully created !");
    }

    // delete ssl certificate by id
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @DeleteMapping("/{certificate_id}")
    public ResponseEntity<String> deleteSSLCertificate(@PathVariable int certificate_id){
        Optional<SSLCertificate> optionalSSLCertificate = sslCertificateRepository.findById(certificate_id);
        if(optionalSSLCertificate.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "SSL Certificate with ID : " + certificate_id + " not found !"
            );
        }
        SSLCertificate sslCertificate = optionalSSLCertificate.get();

        sslCertificateRepository.delete(sslCertificate);

        return ResponseEntity.ok("SSL Certificate with ID " + certificate_id + " successfully deleted ! ");
    }

    // update ssl certificate
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @PutMapping("/{certificate_id}/edit-certificate")
    public ResponseEntity<String> updateCertificate(@PathVariable int certificate_id, @RequestBody SSLCertificate theCertificate){

        Optional<SSLCertificate> optionalSSLCertificate = sslCertificateRepository.findById(certificate_id);
        if(optionalSSLCertificate.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "SSL Certificate with ID : " + certificate_id + " not found !"
            );
        }
        SSLCertificate updateCertificate = optionalSSLCertificate.get();

        // update certificate
        updateCertificate.setType(theCertificate.getType());
        updateCertificate.setStatus(theCertificate.getStatus());
        updateCertificate.setIssuer(theCertificate.getIssuer());
        updateCertificate.setExpirationDate(theCertificate.getExpirationDate());

        sslCertificateRepository.save(updateCertificate);
        return ResponseEntity.ok("SSL Certificate updated successfully !");
    }
}
