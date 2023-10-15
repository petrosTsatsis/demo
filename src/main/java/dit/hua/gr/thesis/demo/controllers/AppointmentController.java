package dit.hua.gr.thesis.demo.controllers;

import dit.hua.gr.thesis.demo.entities.*;
import dit.hua.gr.thesis.demo.repositories.UserRepository;
import dit.hua.gr.thesis.demo.service.AppointmentService;
import dit.hua.gr.thesis.demo.service.CustomerService;
import dit.hua.gr.thesis.demo.service.EventService;
import dit.hua.gr.thesis.demo.service.ManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

import static java.lang.Integer.parseInt;

@RestController
@RequestMapping("/appointments")
@CrossOrigin("*")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private ManagerService managerService;

    @Autowired
    private EventService eventService;

    // get all appointments
    @GetMapping("")
    @PreAuthorize("hasRole('USER') OR hasRole('ADMIN')")
    public List<Appointment> getAll(){
        return appointmentService.findAll();
    }

    // get appointment by id
    @PreAuthorize("hasRole('USER') OR hasRole('ADMIN')")
    @GetMapping("/{appointment_id}")
    public ResponseEntity<?> getAppointment(@PathVariable int appointment_id) {
        Appointment appointment = appointmentService.findById(appointment_id);
        if (appointment == null) {
            String errorMessage = "Appointment with ID " + appointment_id + " does not exist.";
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }

        return ResponseEntity.ok(appointment);
    }

    // create a new appointment
    @PreAuthorize("hasRole('USER')")
    @PostMapping("/managers/{manager_id}/add-appointment")
    public ResponseEntity<?> createAppointment(@RequestBody Appointment appointment, @PathVariable int manager_id, Authentication authentication) {

        // extract the currently authenticated user's username from Authentication
        String username = authentication.getName();
        Optional<User> optionalCustomer = userRepository.findByUsername(username);
        if(optionalCustomer.isEmpty()){
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Customer not found !"
            );
        }

        User user = optionalCustomer.get();
        int customer_id = user.getId();

        Customer customer = customerService.findById(customer_id);
        Manager manager = managerService.findById(manager_id);

        // set appointment's customer and manager
        appointment.setCustomer(customer);
        appointment.setManager(manager);
        Optional<User> managerUserOptional = userRepository.findByUsername(manager.getUsername());

        if(managerUserOptional.isEmpty()){
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found !"
            );
        }
        User managerUser = managerUserOptional.get();

        // add the users in the users list of the event
        appointment.getUsers().add(user);
        appointment.getUsers().add(managerUser);
        appointment.setUsers(appointment.getUsers());

        // save appointment
        eventService.save(appointment);

        return ResponseEntity.status(HttpStatus.CREATED).body("Appointment successfully created !");
    }

    // delete an appointment by id
    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/{appointment_id}")
    public ResponseEntity<String> deleteAppointment(@PathVariable int appointment_id){
        Appointment appointment = appointmentService.findById(appointment_id);
        if (appointment == null) {
            String errorMessage = "Appointment with ID " + appointment_id + " does not exist.";
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }
        appointmentService.delete(appointment_id);
        return ResponseEntity.ok("Appointment with ID " + appointment_id + " successfully deleted ! ");
    }
}
