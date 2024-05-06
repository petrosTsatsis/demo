package dit.hua.gr.thesis.demo.repositories;

import dit.hua.gr.thesis.demo.entities.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
}