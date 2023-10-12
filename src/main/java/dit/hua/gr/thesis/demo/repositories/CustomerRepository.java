package dit.hua.gr.thesis.demo.repositories;

import dit.hua.gr.thesis.demo.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);
}
