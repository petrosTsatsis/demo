package dit.hua.gr.thesis.demo.controllers;

import dit.hua.gr.thesis.demo.entities.*;
import dit.hua.gr.thesis.demo.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@RestController
@RequestMapping("/Appointments")
@CrossOrigin("*")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private ContactRepository contactRepository;

    // get all appointments
    @GetMapping("")
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    public List<Appointment> getAll(){
        return appointmentRepository.findAll();
    }

    // get appointment by id
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("/{appointment_id}")
    public ResponseEntity<?> getAppointment(@PathVariable long appointment_id) {
        Optional<Appointment> optionalAppointment = appointmentRepository.findById(appointment_id);
        if(optionalAppointment.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Appointment with ID : " + appointment_id + " not found !"
            );
        }
        Appointment appointment = optionalAppointment.get();

        return ResponseEntity.ok(appointment);
    }

    // delete an appointment by id
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @DeleteMapping("/{appointment_id}")
    public ResponseEntity<String> deleteAppointment(@PathVariable long appointment_id, Authentication authentication){

        // extract the currently authenticated user's username from Authentication
        String username = authentication.getName();
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found!"
            );
        }

        User user = optionalUser.get();

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
        for(User otherUser : users){
            otherUser.getEvents().remove(appointment);
            userRepository.save(otherUser);
        }

        // add activity
        String activityDescription = "Deleted an appointment for: " + appointment.getDate();
        Activity activity = new Activity(activityDescription, new Date(), user);
        activityRepository.save(activity);

        appointmentRepository.delete(appointment);

        return ResponseEntity.ok("Appointment with ID " + appointment_id + " successfully deleted ! ");
    }

    // get appointments for the logged-in user
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("/myAppointments")
    public List<Appointment> myAppointment(Authentication authentication){

        // extract the currently authenticated user's username from Authentication
        String username = authentication.getName();
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if(optionalUser.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found !"
            );
        }

        User user = optionalUser.get();
        List<Appointment> myAppointments = new ArrayList<>();

        for(Appointment appointment : appointmentRepository.findAll()){

            if (appointment.getUsers() != null && appointment.getUsers().contains(user)){
                myAppointments.add(appointment);
            }
        }
        return myAppointments;
    }

    // Update appointment
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @PutMapping("/{appointment_id}/edit-appointment")
    public ResponseEntity<String> updateAppointment(@PathVariable long appointment_id, @RequestBody Appointment updatedAppointment, Authentication authentication) {

        // extract the currently authenticated user's username from Authentication
        String username = authentication.getName();
        Optional<User> optionalUser = userRepository.findByUsername(username);

        if (optionalUser.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found!"
            );
        }

        User user = optionalUser.get();

        Optional<Appointment> optionalAppointment = appointmentRepository.findById(appointment_id);
        if (optionalAppointment.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Appointment with ID : " + appointment_id + " not found !"
            );
        }

        Appointment originalAppointment = optionalAppointment.get();

        // Save the original values for comparison
        String originalTitle = originalAppointment.getTitle();
        Date originalDate = originalAppointment.getDate();
        String originalDescription = originalAppointment.getDescription();
        String originalStartTime = originalAppointment.getStartTime();
        String originalEndTime = originalAppointment.getEndTime();
        String originalCallUrl = originalAppointment.getCallUrl();
        String originalType = originalAppointment.getType();
        String originalRelatedTo = originalAppointment.getRelatedTo();
        List<Customer> originalCustomers = originalAppointment.getCustomers();
        List<Contact> originalContacts = originalAppointment.getContacts();

        // Update appointment fields
        originalAppointment.setTitle(updatedAppointment.getTitle());
        originalAppointment.setDate(updatedAppointment.getDate());
        originalAppointment.setDescription(updatedAppointment.getDescription());
        originalAppointment.setStartTime(updatedAppointment.getStartTime());
        originalAppointment.setEndTime(updatedAppointment.getEndTime());
        originalAppointment.setCallUrl(updatedAppointment.getCallUrl());
        originalAppointment.setType(updatedAppointment.getType());
        originalAppointment.setRelatedTo(updatedAppointment.getRelatedTo());

        List<Customer> updatedCustomers = updatedAppointment.getCustomers();
        if (updatedCustomers != null) {
            for (Customer customer : updatedCustomers) {
                if (!originalCustomers.contains(customer)) {

                    if (customer.getEvents() == null) {
                        customer.setEvents(new ArrayList<>());
                    }
                    customer.getEvents().add(originalAppointment);
                }
            }
            originalAppointment.setCustomers(updatedCustomers);
        }

        List<Contact> updatedContacts = updatedAppointment.getContacts();
        List<Contact> reloadedContacts = new ArrayList<>();
        if (updatedContacts != null) {
            for (Contact contact : updatedContacts) {
                // Reload the contact from the database
                Contact reloadedContact = contactRepository.findById(contact.getId()).orElse(null);
                if (reloadedContact != null) {
                    reloadedContacts.add(reloadedContact);
                    if (!originalContacts.contains(reloadedContact)) {
                        if (reloadedContact.getEvents() == null) {
                            reloadedContact.setEvents(new ArrayList<>());
                        }
                        reloadedContact.getEvents().add(originalAppointment);
                    }
                }
            }
            originalAppointment.setContacts(reloadedContacts);
        }

        appointmentRepository.save(originalAppointment);

        // Check for changes and add activities accordingly
        addActivityForAppointmentUpdate(originalAppointment, originalTitle, originalDate, originalDescription, originalStartTime, originalEndTime, originalCallUrl, originalType, originalRelatedTo, originalCustomers, originalContacts, authentication);

        return ResponseEntity.ok("Appointment updated successfully !");
    }
    private void addActivityForAppointmentUpdate(
            Appointment updatedAppointment,
            String originalTitle,
            Date originalDate,
            String originalDescription,
            String originalStartTime,
            String originalEndTime,
            String originalCallUrl,
            String originalType,
            String originalRelatedTo,
            List originalCustomers,
            List originalContacts,
            Authentication authentication) {

        List<String> activities = new ArrayList<>();

        if (!updatedAppointment.getTitle().equals(originalTitle)) {
            activities.add("Updated Appointment title from " + originalTitle + " to " + updatedAppointment.getTitle() + ". ");
        }

        if (!updatedAppointment.getDate().equals(originalDate)) {
            activities.add("Updated Appointment date from " + originalDate + " to " + updatedAppointment.getDate() + ". ");
        }

        if (!updatedAppointment.getDescription().equals(originalDescription)) {
            activities.add("Updated the description of the Appointment with title: " + updatedAppointment.getTitle() + ". ");
        }

        // Add other fields specific to the Appointment class
        if (!updatedAppointment.getStartTime().equals(originalStartTime)) {
            activities.add("Updated Appointment start time from " + originalStartTime + " to " + updatedAppointment.getStartTime() + ". ");
        }

        if (!updatedAppointment.getEndTime().equals(originalEndTime)) {
            activities.add("Updated Appointment end time from " + originalEndTime + " to " + updatedAppointment.getEndTime() + ". ");
        }

        if (!updatedAppointment.getCallUrl().equals(originalCallUrl)) {
            activities.add("Updated Appointment call URL from " + originalCallUrl + " to " + updatedAppointment.getCallUrl() + ". ");
        }

        if (!updatedAppointment.getType().equals(originalType)) {
            activities.add("Updated Appointment type from " + originalType + " to " + updatedAppointment.getType() + ". ");
        }

        if (!updatedAppointment.getRelatedTo().equals(originalRelatedTo)) {
            activities.add("Updated Appointment related to from " + originalRelatedTo + " to " + updatedAppointment.getRelatedTo() + ". ");
        }

        // Add the activities to the user's activity list
        String username = authentication.getName();
        Optional<User> optionalUser = userRepository.findByUsername(username);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            for (String activityDescription : activities) {
                Activity activity = new Activity(activityDescription, new Date(), user);
                activityRepository.save(activity);
            }
        }
    }

    // add a new appointment
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @PostMapping("/book-appointment")
    public ResponseEntity<String> createAppointment(@Validated @RequestBody Appointment appointment, Authentication authentication) {
        // extract the currently authenticated user's username from Authentication
        String username = authentication.getName();
        Optional<User> optionalUser = userRepository.findByUsername(username);

        if (optionalUser.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found!"
            );
        }

        User user = optionalUser.get();
        List<User> users = Collections.singletonList(user);

        List<Customer> customers = appointment.getCustomers();
        List<Contact> contacts = appointment.getContacts();

        // Handle customers
        if (customers != null) {
            for (Customer customer : customers) {
                if (customer.getEvents() == null) {
                    customer.setEvents(new ArrayList<>());
                }
                customer.getEvents().add(appointment);
            }
        }

        // Handle contacts
        if (contacts != null) {
            for (Contact contact : contacts) {
                if (contact.getEvents() == null) {
                    contact.setEvents(new ArrayList<>());
                }
                contact.getEvents().add(appointment);
            }
        }

        // Handle user
        if (user.getEvents() == null) {
            user.setEvents(new ArrayList<>());
        }
        user.getEvents().add(appointment);

        // Set the customers, contacts and users of the appointment
        appointment.setCustomers(customers);
        appointment.setContacts(contacts);
        appointment.setUsers(users);

        // Save the appointment
        appointmentRepository.save(appointment);

        // Add activity
        String activityDescription = "Added a new appointment.";
        Activity activity = new Activity(activityDescription, new Date(), user);
        activityRepository.save(activity);

        return ResponseEntity.ok("Appointment created successfully!");
    }
}
