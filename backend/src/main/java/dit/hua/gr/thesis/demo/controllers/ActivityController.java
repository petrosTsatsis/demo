package dit.hua.gr.thesis.demo.controllers;

import dit.hua.gr.thesis.demo.entities.Activity;
import dit.hua.gr.thesis.demo.entities.User;
import dit.hua.gr.thesis.demo.repositories.ActivityRepository;
import dit.hua.gr.thesis.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/Activities")
public class ActivityController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActivityRepository activityRepository;

    // get the activities
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("/latest-activities")
    public List<Activity> getLatestActivities(Authentication authentication) {
        String username = authentication.getName();

        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found!");
        }
        User user = optionalUser.get();
        return user.getActivities();
    }

    // delete activity by id
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @DeleteMapping("/{activity_id}")
    public ResponseEntity<String> deleteActivity(@PathVariable long activity_id){
        Optional<Activity> optionalActivity = activityRepository.findById(activity_id);
        if(optionalActivity.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Activity with ID : " + activity_id + " not found !"
            );
        }
        Activity activity = optionalActivity.get();

        activityRepository.delete(activity);

        return ResponseEntity.ok("Activity with ID " + activity_id + " successfully deleted ! ");
    }
}