package dit.hua.gr.thesis.demo.controllers;

import dit.hua.gr.thesis.demo.repositories.CustomerRepository;
import dit.hua.gr.thesis.demo.repositories.PurchaseRepository;
import dit.hua.gr.thesis.demo.repositories.SoftwareRepository;
import dit.hua.gr.thesis.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.HashMap;
import java.util.Map;

@Controller
@CrossOrigin("*")
public class HomeController {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private SoftwareRepository softwareRepository;

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Autowired
    private UserRepository userRepository;

    // get the counts for the customers, software, purchases

    @GetMapping("/home")
    public ResponseEntity<Map<String, String>> getCounts() {
        Map<String, String> counts = new HashMap<>();

        counts.put("Customers", String.valueOf(customerRepository.count()));
        counts.put("Software", String.valueOf(softwareRepository.count()));
        counts.put("Purchases", String.valueOf(purchaseRepository.count()));
        counts.put("Users", String.valueOf(userRepository.count()));

        return ResponseEntity.ok(counts);
    }

}
