package dit.hua.gr.thesis.demo.controllers;

import dit.hua.gr.thesis.demo.entities.*;
import dit.hua.gr.thesis.demo.repositories.AppointmentRepository;
import dit.hua.gr.thesis.demo.repositories.CustomerRepository;
import dit.hua.gr.thesis.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static java.lang.Integer.parseInt;

@RestController
@RequestMapping("/appointments")
@CrossOrigin("*")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    // get all appointments
    @GetMapping("")
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    public List<Appointment> getAll(){
        return appointmentRepository.findAll();
    }

    // get appointment by id
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("/{appointment_id}")
    public ResponseEntity<?> getAppointment(@PathVariable int appointment_id) {
        Optional<Appointment> optionalAppointment = appointmentRepository.findById(appointment_id);
        if(optionalAppointment.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Appointment with ID : " + appointment_id + " not found !"
            );
        }
        Appointment appointment = optionalAppointment.get();

        return ResponseEntity.ok(appointment);
    }

    // create a new appointment
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @PostMapping("/customers/{customer_id}/add-appointment")
    public ResponseEntity<?> createAppointment(@RequestBody Appointment appointment, @PathVariable int customer_id, Authentication authentication) {

        // extract the currently authenticated user's username from Authentication
        String username = authentication.getName();
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if(optionalUser.isEmpty()){
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found !"
            );
        }

        User user = optionalUser.get();

        Optional<Customer> optionalCustomer = customerRepository.findById(customer_id);

        if(optionalCustomer.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Customer with ID : " + customer_id + " not found !"
            );
        }
        Customer customer = optionalCustomer.get();

        // initialize the list of customers and users
        appointment.setCustomers(new ArrayList<>());
        appointment.setUsers(new ArrayList<>());

        // add user and customer
        appointment.getUsers().add(user);
        appointment.getCustomers().add(customer);

        user.getEvents().add(appointment);
        customer.getEvents().add(appointment);

        // save appointment
        appointmentRepository.save(appointment);

        // save user
        userRepository.save(user);

        // save customer
        customerRepository.save(customer);

        return ResponseEntity.status(HttpStatus.CREATED).body("Appointment successfully created !");
    }
    // delete an appointment by id
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @DeleteMapping("/{appointment_id}")
    public ResponseEntity<String> deleteAppointment(@PathVariable int appointment_id){
        Optional<Appointment> optionalAppointment = appointmentRepository.findById(appointment_id);
        if(optionalAppointment.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Appointment with ID : " + appointment_id + " not found !"
            );
        }
        Appointment appointment = optionalAppointment.get();

        List<Customer> customers = appointment.getCustomers();
        for(Customer customer : customers){
            customer.getEvents().remove(appointment);
            customerRepository.save(customer);
        }

        List<User> users = appointment.getUsers();
        for(User user : users){
            user.getEvents().remove(appointment);
            userRepository.save(user);
        }

        appointmentRepository.delete(appointment);
        return ResponseEntity.ok("Appointment with ID " + appointment_id + " successfully deleted ! ");
    }
}
