package dit.hua.gr.thesis.demo.repositories;

import dit.hua.gr.thesis.demo.entities.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
}
