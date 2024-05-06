package dit.hua.gr.thesis.demo.repositories;

import dit.hua.gr.thesis.demo.entities.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
