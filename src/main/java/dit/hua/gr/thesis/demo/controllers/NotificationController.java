package dit.hua.gr.thesis.demo.controllers;

import dit.hua.gr.thesis.demo.entities.*;
import dit.hua.gr.thesis.demo.service.CustomerService;
import dit.hua.gr.thesis.demo.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private CustomerService customerService;

    // get all notifications
    @PreAuthorize("hasRole('USER') OR hasRole('ADMIN')")
    @GetMapping("")
    public List<Notification> getAll(){
        return notificationService.findAll();
    }

    // get notification by id
    @PreAuthorize("hasRole('USER') OR hasRole('ADMIN')")
    public ResponseEntity<?> getNotification(@PathVariable int notification_id) {
        Notification notification = notificationService.findById(notification_id);
        if (notification == null) {
            String errorMessage = "Notification with ID " + notification_id + " does not exist.";
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }

        return ResponseEntity.ok(notification);
    }

    // delete notification by id
    @PreAuthorize("hasRole('USER') OR hasRole('ADMIN')")
    @DeleteMapping("/{notification_id}")
    public ResponseEntity<String> deleteNotification(@PathVariable int notification_id){

        Notification notification = notificationService.findById(notification_id);

        if(notification == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Notification does not exist !");
        }

        // Check if there are references in customer_notifications
        if (notification.getCustomers() != null && !notification.getCustomers().isEmpty()) {
            // if there are, remove them
            for (Customer customer : notification.getCustomers()) {
                customer.getNotifications().remove(notification);
                customerService.save(customer);
            }
        }
        notificationService.delete(notification_id);

        return ResponseEntity.ok("Notification with ID " + notification_id + " successfully deleted ! ");
    }
}
