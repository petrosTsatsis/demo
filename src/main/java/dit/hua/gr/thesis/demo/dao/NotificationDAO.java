package dit.hua.gr.thesis.demo.dao;

import dit.hua.gr.thesis.demo.entities.Notification;

import java.util.List;

public interface NotificationDAO {

    // find all notifications
    public List<Notification> findAll();

    // create a notification
    public void save(Notification notification);

    // find notification by id
    public Notification findById(int id);

    // delete notification by id
    public void delete(int id);
}
