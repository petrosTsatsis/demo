package dit.hua.gr.thesis.demo.repositories;

import dit.hua.gr.thesis.demo.entities.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
}
