package dit.hua.gr.thesis.demo.repositories;

import dit.hua.gr.thesis.demo.entities.SSLCertificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SSLCertificateRepository extends JpaRepository<SSLCertificate, Long> {
}
