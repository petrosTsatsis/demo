package dit.hua.gr.thesis.demo.controllers;

import dit.hua.gr.thesis.demo.entities.*;
import dit.hua.gr.thesis.demo.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/Contacts")
@CrossOrigin("*")
public class ContactController {

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private EventRepository eventRepository;

    // get all contacts
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("")
    public List<Contact> getAllContacts(){
        return contactRepository.findAll();
    }

    // get contact by id
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("{contact_id}")
    public ResponseEntity<?> getContactById(@PathVariable long contact_id){
        Optional<Contact> optionalContact = contactRepository.findById(contact_id);
        if(optionalContact.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Contact with ID : " + contact_id + " not found !"
            );
        }
        Contact contact = optionalContact.get();

        return ResponseEntity.ok(contact);
    }

    // add a new contact
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @PostMapping("/add-contact")
    public ResponseEntity<String> addContact(@RequestBody Contact contact, Authentication authentication) {
        // extract the currently authenticated user's username from Authentication
        String username = authentication.getName();
        Optional<User> optionalUser = userRepository.findByUsername(username);

        if (optionalUser.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found!");
        }

        User user = optionalUser.get();

        if (contactRepository.existsByEmail(contact.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        if (contactRepository.existsByPhoneNumber(contact.getPhoneNumber())) {
            return ResponseEntity.badRequest().body("Error: Phone number is already in use!");
        }

        // specify the time zone ("Europe/Athens")
        ZoneId zoneId = ZoneId.of("Europe/Athens");

        // use LocalDateTime to get the current date and time in the specified time zone
        LocalDateTime registrationDateTime = LocalDateTime.now(zoneId);

        // convert LocalDateTime to Date
        Date registrationDate = Date.from(registrationDateTime.atZone(zoneId).toInstant());

        // set the current date as registration date
        contact.setRegistrationDate(registrationDate);

        // set the user for the contact
        contact.setUser(user);

        // Save the contact
        contactRepository.save(contact);

        // add activity
        String activityDescription = "Added a new contact: " + contact.getFname() + " " + contact.getLname();
        Activity activity = new Activity(activityDescription, new Date(), user);
        activityRepository.save(activity);

        return ResponseEntity.ok("Contact successfully created!");
    }

    // delete contact by id
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @DeleteMapping("/{contact_id}")
    public ResponseEntity<String> deleteContact(@PathVariable long contact_id, Authentication authentication){

        // extract the currently authenticated user's username from Authentication
        String username = authentication.getName();
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found!"
            );
        }

        User user = optionalUser.get();

        Optional<Contact> optionalContact = contactRepository.findById(contact_id);
        if(optionalContact.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Contact with ID : " + contact_id + " not found !"
            );
        }
        Contact contact = optionalContact.get();

        // iterate over all events
        for(Event event: eventRepository.findAll()){
            List<Contact> contacts = event.getContacts();
            // check if the contact exists in the list of event's contacts
            if(contacts.contains(contact)) {
                // if the contact exists remove it from the list
                contacts.remove(contact);
                // update the event's list of contacts
                event.setContacts(contacts);
                // save the updated event
                eventRepository.save(event);
            }
        }

        // add activity
        String activityDescription = "Deleted a contact: " + contact.getFname() + " " + contact.getLname();
        Activity activity = new Activity(activityDescription, new Date(), user);
        activityRepository.save(activity);

        contactRepository.delete(contact);

        return ResponseEntity.ok("Contact with ID " + contact_id + " successfully deleted ! ");
    }

    // update contact
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @PutMapping("/{contact_id}/edit-contact")
    public ResponseEntity<String> updateContact(@PathVariable long contact_id, @RequestBody Contact theContact, Authentication authentication) {

        Optional<Contact> optionalContact = contactRepository.findById(contact_id);
        if (optionalContact.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Contact with ID : " + contact_id + " not found!"
            );
        }
        Contact updateContact = optionalContact.get();

        // Save the original values for comparison
        String originalFname = updateContact.getFname();
        String originalLname = updateContact.getLname();
        Date originalBirthDate = updateContact.getBirthDate();
        String originalPriority = updateContact.getPriority();
        String originalPhoneNumber = updateContact.getPhoneNumber();
        String originalEmail = updateContact.getEmail();
        String originalNotes = updateContact.getNotes();

        // update contact
        updateContact.setFname(theContact.getFname());
        updateContact.setLname(theContact.getLname());
        updateContact.setBirthDate(theContact.getBirthDate());
        updateContact.setPriority(theContact.getPriority());
        updateContact.setPhoneNumber(theContact.getPhoneNumber());
        updateContact.setEmail(theContact.getEmail());
        updateContact.setNotes(theContact.getNotes());

        // Check if the new email is already in use by another contact
        if (!originalEmail.equals(updateContact.getEmail()) && contactRepository.existsByEmail(updateContact.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        // Check if the new phone number is already in use by another contact
        if (!originalPhoneNumber.equals(updateContact.getPhoneNumber()) && contactRepository.existsByPhoneNumber(updateContact.getPhoneNumber())) {
            return ResponseEntity.badRequest().body("Error: Phone number is already in use!");
        }

        contactRepository.save(updateContact);

        // Check for changes and add activities accordingly
        addActivityForContactUpdate(
                updateContact,
                originalFname,
                originalLname,
                originalBirthDate,
                originalPriority,
                originalPhoneNumber,
                originalEmail,
                originalNotes,
                authentication
        );

        return ResponseEntity.ok("Contact updated successfully!");
    }

    private void addActivityForContactUpdate(Contact updatedContact,
                                             String originalFname,
                                             String originalLname,
                                             Date originalBirthDate, String originalPriority,
                                             String originalPhoneNumber,
                                             String originalEmail,
                                             String originalNotes, Authentication authentication) {
        String username = authentication.getName();
        List<String> activities = new ArrayList<>();

        if (!updatedContact.getFname().equals(originalFname)) {
            activities.add("Updated Contact first name from " + originalFname + " to " + updatedContact.getFname() + ". ");
        }

        if (!updatedContact.getFname().equals(originalFname)) {
            activities.add("Updated Contact last name from " + originalLname + " to " + updatedContact.getLname() + ". ");
        }

        if (!updatedContact.getBirthDate().equals(originalBirthDate)) {
            activities.add("Updated Contact title from " + originalBirthDate + " to " + updatedContact.getBirthDate() + ". ");
        }

        if (!updatedContact.getPriority().equals(originalPriority)) {
            activities.add("Updated Contact priority from " + originalPriority + " to " + updatedContact.getPriority() + ". ");
        }

        if (!updatedContact.getPhoneNumber().equals(originalPhoneNumber)) {
            activities.add("Updated Contact phone number from " + originalPhoneNumber + " to " + updatedContact.getPhoneNumber() + ". ");
        }

        if (!updatedContact.getEmail().equals(originalEmail)) {
            activities.add("Updated Contact email from " + originalEmail + " to " + updatedContact.getEmail() + ". ");
        }

        if (!updatedContact.getNotes().equals(originalNotes)) {
            activities.add("Updated the notes of Contact with name:" + updatedContact.getFname() + " " + updatedContact.getLname() + ". ");
        }

        // Add the activities to the user's activity list
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            for (String activityDescription : activities) {
                Activity activity = new Activity(activityDescription, new Date(), user);
                activityRepository.save(activity);
            }
        }
    }

    // get user's contacts
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("/myContacts")
    public List<Contact> myContacts(Authentication authentication){

        // extract the currently authenticated user's username from Authentication
        String username = authentication.getName();
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if(optionalUser.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found !"
            );
        }

        User user = optionalUser.get();

        // return the user's tasks
        return new ArrayList<>(user.getContacts());
    }

    // get the appointments between a contact and the logged in user
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("/{contact_id}/appointments")
    public List<Appointment> getAppointments(@PathVariable long contact_id, Authentication authentication){

        Optional<Contact> optionalContact= contactRepository.findById(contact_id);

        if(optionalContact.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Contact with ID : " + contact_id + " not found !"
            );
        }
        Contact contact = optionalContact.get();

        // extract the currently authenticated user's username from Authentication
        String username = authentication.getName();
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if(optionalUser.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found !"
            );
        }

        User user = optionalUser.get();
        List<Appointment> commonAppointments = new ArrayList<>();

        for(Appointment appointment : appointmentRepository.findAll()){

            if(appointment.getContacts() != null && appointment.getContacts().contains(contact)
                    && appointment.getUsers() != null && appointment.getUsers().contains(user)) {
                commonAppointments.add(appointment);
            }
        }

        return commonAppointments;
    }
}




