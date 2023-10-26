package dit.hua.gr.thesis.demo.controllers;

import dit.hua.gr.thesis.demo.entities.*;
import dit.hua.gr.thesis.demo.repositories.NotificationRepository;
import dit.hua.gr.thesis.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    // get all notifications
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("")
    public List<Notification> getAll(){
        return notificationRepository.findAll();
    }

    // get notification by id
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("/{notification_id}")
    public ResponseEntity<?> getNotification(@PathVariable int notification_id) {
        Optional<Notification> optionalNotification = notificationRepository.findById(notification_id);
        if(optionalNotification.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Notification with ID : " + notification_id + " not found !"
            );
        }
        Notification notification = optionalNotification.get();

        return ResponseEntity.ok(notification);
    }

    // delete notification by id
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @DeleteMapping("/{notification_id}")
    public ResponseEntity<String> deleteNotification(@PathVariable int notification_id){
        Optional<Notification> optionalNotification = notificationRepository.findById(notification_id);
        if(optionalNotification.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Notification with ID : " + notification_id + " not found !"
            );
        }
        Notification notification = optionalNotification.get();

        notificationRepository.delete(notification);

        return ResponseEntity.ok("Notification with ID " + notification_id + " successfully deleted ! ");
    }

    // get all in app notifications for the logged-in user
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("/myNotifications")
    public List<Notification> myNotifications(Authentication authentication){

        // extract the currently authenticated user's username from Authentication
        String username = authentication.getName();
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if(optionalUser.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found !"
            );
        }

        User user = optionalUser.get();

        List<Notification> inAppNotifications = new ArrayList<>();
        for(Notification notification : user.getNotifications()){
            if(notification.getType() == NotificationType.IN_APP){
                inAppNotifications.add(notification);
            }
        }
        return inAppNotifications;
    }

}

