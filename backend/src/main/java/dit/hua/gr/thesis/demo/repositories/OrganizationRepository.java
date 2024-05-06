package dit.hua.gr.thesis.demo.repositories;

import dit.hua.gr.thesis.demo.entities.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganizationRepository extends JpaRepository<Company, Long> {
}
