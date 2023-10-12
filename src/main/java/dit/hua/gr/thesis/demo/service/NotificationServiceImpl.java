package dit.hua.gr.thesis.demo.service;

import dit.hua.gr.thesis.demo.dao.NotificationDAO;
import dit.hua.gr.thesis.demo.entities.Notification;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService{

    @Autowired
    private NotificationDAO notificationDAO;

    // find all notifications
    @Override
    @Transactional
    public List<Notification> findAll() {
        return notificationDAO.findAll();
    }

    // create a new notification
    @Override
    @Transactional
    public void save(Notification notification) {
        notificationDAO.save(notification);
    }

    // find notification by id
    @Override
    @Transactional
    public Notification findById(int id) {
        return notificationDAO.findById(id);
    }

    // delete notification by id
    @Override
    @Transactional
    public void delete(int id) {
        notificationDAO.delete(id);
    }
}
