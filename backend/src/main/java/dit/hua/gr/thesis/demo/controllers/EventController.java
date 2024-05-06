package dit.hua.gr.thesis.demo.controllers;

import dit.hua.gr.thesis.demo.entities.Event;
import dit.hua.gr.thesis.demo.entities.User;
import dit.hua.gr.thesis.demo.repositories.EventRepository;
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
@RequestMapping("/Events")
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    // get all events
    @GetMapping("")
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    public List<Event> getAll(Authentication authentication){
        // extract the currently authenticated user's username from Authentication
        String username = authentication.getName();
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if(optionalUser.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found !"
            );
        }

        User user = optionalUser.get();

        // fetch the current user's events
        ArrayList<Event> allEvents = new ArrayList<>(user.getEvents());

        // fetch all the update events
        for(Event event : eventRepository.findAll()){
            if(event.getTitle().equalsIgnoreCase("Update time !")){
                allEvents.add(event);
            }
        }
        return allEvents;
    }

    // get event by id
    @GetMapping("/{event_id}")
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    public ResponseEntity<?> getEvent(@PathVariable long event_id){
        Optional<Event> optionalEvent = eventRepository.findById(event_id);
        if(optionalEvent.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Event with ID : " + event_id + " not found !"
            );
        }
        Event event = optionalEvent.get();
        return ResponseEntity.ok(event);
    }

    // delete event by id
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @DeleteMapping("/{event_id}")
    public ResponseEntity<String> deleteEvent(@PathVariable long event_id){
        Optional<Event> optionalEvent = eventRepository.findById(event_id);
        if(optionalEvent.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Event with ID : " + event_id + " not found !"
            );
        }
        Event event = optionalEvent.get();

        List<User> users = event.getUsers();
        for(User otherUser : users){
            otherUser.getEvents().remove(event);
            userRepository.save(otherUser);
        }

        eventRepository.delete(event);

        return ResponseEntity.ok("Event with ID " + event_id + " successfully deleted ! ");
    }



}
