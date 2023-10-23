package dit.hua.gr.thesis.demo.controllers;

import dit.hua.gr.thesis.demo.entities.Contact;
import dit.hua.gr.thesis.demo.entities.Software;
import dit.hua.gr.thesis.demo.repositories.ContactRepository;
import org.hibernate.result.UpdateCountOutput;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.relational.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/contacts")
@CrossOrigin("*")
public class ContactController {

    @Autowired
    private ContactRepository contactRepository;

    // get all contacts
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("")
    public List<Contact> getAllContacts(){
        return contactRepository.findAll();
    }

    // get contact by id
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("{contact_id}")
    public ResponseEntity<?> getContactById(@PathVariable int contact_id){
        Optional<Contact> optionalContact = contactRepository.findById(contact_id);
        if(optionalContact.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Contact with ID : " + contact_id + " not found !"
            );
        }
        Contact contact = optionalContact.get();

        return ResponseEntity.ok(contact);
    }

    // delete contact by id
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @DeleteMapping("/{contact_id}")
    public ResponseEntity<String> deleteContact(@PathVariable int contact_id){
        Optional<Contact> optionalContact = contactRepository.findById(contact_id);
        if(optionalContact.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Contact with ID : " + contact_id + " not found !"
            );
        }
        Contact contact = optionalContact.get();

        contactRepository.delete(contact);

        return ResponseEntity.ok("Contact with ID " + contact_id + " successfully deleted ! ");
    }

    // update contact
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @PutMapping("/{contact_id}/edit-contact")
    public ResponseEntity<String> updateContact(@PathVariable int contact_id, @RequestBody Contact theContact){

        Optional<Contact> optionalContact = contactRepository.findById(contact_id);
        if(optionalContact.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Contact with ID : " + contact_id + " not found !"
            );
        }
        Contact updateContact = optionalContact.get();

        // update contact
        updateContact.setName(theContact.getName());
        updateContact.setTitle(theContact.getTitle());
        updateContact.setType(theContact.getType());
        updateContact.setPriority(theContact.getPriority());
        updateContact.setPhoneNumber(theContact.getPhoneNumber());
        updateContact.setEmail(theContact.getEmail());
        updateContact.setNotes(theContact.getNotes());

        contactRepository.save(updateContact);
        return ResponseEntity.ok("Contact updated successfully !");
    }

}
