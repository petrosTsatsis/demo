package dit.hua.gr.thesis.demo.controllers;

import dit.hua.gr.thesis.demo.entities.Software;
import dit.hua.gr.thesis.demo.service.SoftwareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/softwares")
public class SoftwareController {

    @Autowired
    private SoftwareService softwareService;

    // get all softwares
    @GetMapping("")
    public List<Software> getAll(){
        return softwareService.findAll();
    }

    // get software by id
    @GetMapping("/{software_id}")
    public ResponseEntity<?> getSoftware(@PathVariable int software_id) {
        Software software = softwareService.findById(software_id);
        if (software == null) {
            String errorMessage = "Software with ID " + software_id + " does not exist.";
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }

        return ResponseEntity.ok(software);
    }

    // create a new software
    @PostMapping("/add-software")
    public ResponseEntity<String> addSoftware(@Validated @RequestBody Software software){
        softwareService.save(software);
        return ResponseEntity.ok("Software successfully created ! ");
    }

    // delete software by id
    @DeleteMapping("/{software_id}")
    public ResponseEntity<String> deleteSoftware(@PathVariable int software_id){
        Software software = softwareService.findById(software_id);
        if (software == null) {
            String errorMessage = "Software with ID " + software_id + " does not exist.";
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }
        softwareService.delete(software_id);
        return ResponseEntity.ok("Software with ID " + software_id + " successfully deleted ! ");
    }
}
