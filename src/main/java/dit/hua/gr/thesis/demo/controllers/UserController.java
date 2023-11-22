package dit.hua.gr.thesis.demo.controllers;

import dit.hua.gr.thesis.demo.entities.User;
import dit.hua.gr.thesis.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Controller
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // update user's details
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @PutMapping("/profile")
    public ResponseEntity<String> updateCertificate(@RequestBody User theUser, Authentication authentication){

        // extract the currently authenticated user's username from Authentication
        String username = authentication.getName();
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if(optionalUser.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found !"
            );
        }

        User updateUser = optionalUser.get();

        // update user
        updateUser.setFname(theUser.getFname());
        updateUser.setLname(theUser.getLname());
        updateUser.setUsername(theUser.getUsername());
        updateUser.setEmail(theUser.getEmail());
        updateUser.setDescription(theUser.getDescription());

        userRepository.save(updateUser);
        return ResponseEntity.ok("User updated successfully !");
    }
}
