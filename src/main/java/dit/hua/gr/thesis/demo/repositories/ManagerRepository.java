package dit.hua.gr.thesis.demo.repositories;

import dit.hua.gr.thesis.demo.entities.Manager;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ManagerRepository extends JpaRepository<Manager, Integer> {

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);
}
