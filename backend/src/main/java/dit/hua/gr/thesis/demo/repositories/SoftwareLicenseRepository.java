package dit.hua.gr.thesis.demo.repositories;

import dit.hua.gr.thesis.demo.entities.SoftwareLicense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SoftwareLicenseRepository extends JpaRepository<SoftwareLicense, Long> {
}
