package dit.hua.gr.thesis.demo.dao;

import dit.hua.gr.thesis.demo.entities.Notification;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class NotificationDAOImpl implements NotificationDAO{

    @Autowired
    private EntityManager entityManager;

    // find all notifications
    @Override
    @Transactional
    public List<Notification> findAll() {
        TypedQuery<Notification> query = entityManager.createQuery("from Notification ", Notification.class);
        List<Notification> notifications = query.getResultList();
        return notifications;
    }

    // create a new notification
    @Override
    @Transactional
    public void save(Notification notification) {
        Notification theNotification = entityManager.merge(notification);
    }

    // find notification by id
    @Override
    @Transactional
    public Notification findById(int id) {
        return entityManager.find(Notification.class, id);
    }

    // delete notification by id
    @Override
    @Transactional
    public void delete(int id) {
        Notification notification = entityManager.find(Notification.class, id);
        entityManager.remove(notification);
    }
}
