package dit.hua.gr.thesis.demo.repositories;

import dit.hua.gr.thesis.demo.entities.ERole;
import dit.hua.gr.thesis.demo.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(ERole name);
}
