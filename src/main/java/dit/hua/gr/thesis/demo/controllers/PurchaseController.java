package dit.hua.gr.thesis.demo.controllers;

import dit.hua.gr.thesis.demo.entities.*;
import dit.hua.gr.thesis.demo.repositories.CustomerRepository;
import dit.hua.gr.thesis.demo.repositories.PurchaseRepository;
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
@RequestMapping("/purchases")
public class PurchaseController {

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private SoftwareRepository softwareRepository;

    // get all purchases
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("")
    public ResponseEntity<PurchaseListResponse> getAllPurchases() {
        List<Purchase> purchases = purchaseRepository.findAll();
        long purchaseCount = purchaseRepository.count();

        PurchaseListResponse response = new PurchaseListResponse(purchases, purchaseCount);
        return ResponseEntity.ok(response);
    }

    // create class that combine count and purchase list
    public static class PurchaseListResponse {
        private List<Purchase> purchases;
        private long purchaseCount;

        public PurchaseListResponse(List<Purchase> purchases, long purchaseCount) {
            this.purchases = purchases;
            this.purchaseCount = purchaseCount;
        }

        public List<Purchase> getPurchases() {
            return purchases;
        }

        public long getPurchaseCount() {
            return purchaseCount;
        }
    }

    // get purchase by id
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("/{purchase_id}")
    public ResponseEntity<?> getPurchase(@PathVariable int purchase_id) {
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
    @PostMapping("/newPurchase")
    public ResponseEntity<String> addPurchase(@Validated @RequestBody Purchase purchase) {
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

        // both customer and software exist, proceed with creating the purchase
        Customer customer = optionalCustomer.get();
        Software software = optionalSoftware.get();

        // set the customer and software in the purchase
        purchase.setCustomer(customer);
        purchase.setSoftware(software);

        // associate the software with the customer
        customer.getSoftwares().add(software);
        software.getCustomers().add(customer);

        // save the purchase
        purchaseRepository.save(purchase);

        // save the customer
        customerRepository.save(customer);

        // save the software
        softwareRepository.save(software);

        return ResponseEntity.ok("Purchase created successfully!");
    }

    // delete purchase by id
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{purchase_id}")
    public ResponseEntity<String> deletePurchase(@PathVariable int purchase_id){
        Optional<Purchase> optionalPurchase = purchaseRepository.findById(purchase_id);
        if(optionalPurchase.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Purchase with ID : " + purchase_id + " not found !"
            );
        }
        Purchase purchase = optionalPurchase.get();

        // remove the association with the software

        purchaseRepository.delete(purchase);
        return ResponseEntity.ok("Purchase with ID " + purchase_id + " successfully deleted ! ");
    }

    // update purchase
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @PutMapping("/{purchase_id}/edit-purchase")
    public ResponseEntity<String> updatePurchase(@PathVariable int purchase_id, @RequestBody Purchase thePurchase){

        Optional<Purchase> optionalPurchase = purchaseRepository.findById(purchase_id);
        if(optionalPurchase.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Purchase with ID : " + purchase_id + " not found !"
            );
        }
        Purchase updatePurchase = optionalPurchase.get();

        // update purchase
        updatePurchase.setPrice(thePurchase.getPrice());
        updatePurchase.setPurchaseDate(thePurchase.getPurchaseDate());
        updatePurchase.setCustomer(thePurchase.getCustomer());
        updatePurchase.setSoftware(thePurchase.getSoftware());

        purchaseRepository.save(updatePurchase);
        return ResponseEntity.ok("Purchase updated successfully !");
    }
}
