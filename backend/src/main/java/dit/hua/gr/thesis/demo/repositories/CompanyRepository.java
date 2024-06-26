package dit.hua.gr.thesis.demo.repositories;

import dit.hua.gr.thesis.demo.entities.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    Boolean existsByEmail(String email);

    Boolean existsByPhoneNumber(String phoneNumber);

    Optional<Company> findCompanyByName(String name);
}
