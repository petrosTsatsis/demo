package dit.hua.gr.thesis.demo.controllers;

import dit.hua.gr.thesis.demo.entities.Activity;
import dit.hua.gr.thesis.demo.entities.Event;
import dit.hua.gr.thesis.demo.entities.User;
import dit.hua.gr.thesis.demo.repositories.ActivityRepository;
import dit.hua.gr.thesis.demo.repositories.EventRepository;
import dit.hua.gr.thesis.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Controller
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private ActivityRepository activityRepository;

    // get all users
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/Users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    // get current user
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("/User")
    public ResponseEntity<User> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found !");
        }
        User user = optionalUser.get();
        return ResponseEntity.ok(user);
    }

    // get user by id
    @GetMapping("/Users/{user_id}")
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    public ResponseEntity<?> getUserById(@PathVariable long user_id) {
        Optional<User> optionalUser = userRepository.findById(user_id);
        if(optionalUser.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User with ID : " + user_id + " not found !"
            );
        }
        User user = optionalUser.get();
        return ResponseEntity.ok(user);
    }

    // update user's details
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @PutMapping("/Profile/edit-profile/{user_id}")
    public ResponseEntity<String> updateUser(@PathVariable long user_id, @RequestBody User theUser, Authentication authentication){

        Optional<User> optionalUser = userRepository.findById(user_id);
        if(optionalUser.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User with ID : " + user_id + " not found !"
            );
        }
        User updateUser = optionalUser.get();

        // Update user fields
        updateUser.setFname(theUser.getFname());
        updateUser.setLname(theUser.getLname());
        updateUser.setDescription(theUser.getDescription());
        updateUser.setPhoneNumber(theUser.getPhoneNumber());

        // Check if the new email is already in use by another user
        if (!updateUser.getEmail().equals(theUser.getEmail()) && userRepository.existsByEmail(theUser.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        // Check if the new phone number is already in use by another user
        if (!updateUser.getPhoneNumber().equals(theUser.getPhoneNumber()) && userRepository.existsByPhoneNumber(theUser.getPhoneNumber())) {
            return ResponseEntity.badRequest().body("Error: Phone number is already in use!");
        }

        // Update email if no conflict
        updateUser.setEmail(theUser.getEmail());

        // Save the updated user
        userRepository.save(updateUser);
        return ResponseEntity.ok("User updated successfully !");
    }

    // delete customer by id
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("Users/{user_id}")
    public ResponseEntity<String> deleteUser(@PathVariable long user_id, Authentication authentication) {

        // extract the currently authenticated user's username from Authentication
        String username = authentication.getName();
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found!"
            );
        }

        User user = optionalUser.get();

        Optional<User> optionalUserToDelete = userRepository.findById(user_id);

        if (optionalUserToDelete.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User with ID : " + user_id + " not found!"
            );
        }

        User userToDelete = optionalUserToDelete .get();

        List<Event> events = userToDelete.getEvents();
        for (Event event : events) {
            event.getUsers().remove(userToDelete);
            eventRepository.save(event);
        }

        // add activity
        String activityDescription = "Deleted a customer : " + userToDelete.getFname() + " " + userToDelete.getLname();
        Activity activity = new Activity(activityDescription, new Date(), user);
        activityRepository.save(activity);

        userRepository.delete(userToDelete);

        return ResponseEntity.ok("User with ID " + user_id + " successfully deleted!");
    }
}
