package dit.hua.gr.thesis.demo.repositories;

import dit.hua.gr.thesis.demo.entities.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {

    Boolean existsByEmail(String email);

    Boolean existsByPhoneNumber(String phoneNumber);
}
