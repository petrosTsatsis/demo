package dit.hua.gr.thesis.demo.repositories;

import dit.hua.gr.thesis.demo.entities.Software;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SoftwareRepository extends JpaRepository<Software, Long> {
}
