package dit.hua.gr.thesis.demo.controllers;

import dit.hua.gr.thesis.demo.entities.Event;
import dit.hua.gr.thesis.demo.repositories.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/events")
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    // get all events
    @GetMapping("")
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    public List<Event> getAll(){
        return eventRepository.findAll();
    }

    // get event by id
    @GetMapping("/{event_id}")
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    public ResponseEntity<?> getEvent(@PathVariable int event_id){
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
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{event_id}")
    public ResponseEntity<String> deleteEvent(@PathVariable int event_id){
        Optional<Event> optionalEvent = eventRepository.findById(event_id);
        if(optionalEvent.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Event with ID : " + event_id + " not found !"
            );
        }
        Event event = optionalEvent.get();

        eventRepository.delete(event);

        return ResponseEntity.ok("Event with ID " + event_id + " successfully deleted ! ");
    }



}
