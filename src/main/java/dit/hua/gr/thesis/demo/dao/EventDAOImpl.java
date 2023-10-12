package dit.hua.gr.thesis.demo.dao;

import dit.hua.gr.thesis.demo.entities.Event;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class EventDAOImpl implements EventDAO{

    @Autowired
    private EntityManager entityManager;

    // find all events
    @Override
    @Transactional
    public List<Event> findAll() {
        TypedQuery<Event> query = entityManager.createQuery("from Event", Event.class);
        List<Event> events = query.getResultList();
        return events;
    }

    // create a new event
    @Override
    @Transactional
    public void save(Event event) {
        Event theEvent = entityManager.merge(event);
    }

    // find event by id
    @Override
    @Transactional
    public Event findById(int id) {
        return entityManager.find(Event.class, id);
    }

    // delete event by id
    @Override
    @Transactional
    public void delete(int id) {
        Event event = entityManager.find(Event.class, id);
        entityManager.remove(event);
    }
}
