package dit.hua.gr.thesis.demo.service;

import dit.hua.gr.thesis.demo.dao.EventDAO;
import dit.hua.gr.thesis.demo.entities.Event;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventServiceImpl implements EventService{

    @Autowired
    private EventDAO eventDAO;

    // find all events
    @Override
    @Transactional
    public List<Event> findAll() {
        return eventDAO.findAll();
    }

    // create a new event
    @Override
    @Transactional
    public void save(Event event) {
        eventDAO.save(event);
    }

    // find event by id
    @Override
    @Transactional
    public Event findById(int id) {
        return eventDAO.findById(id);
    }

    // delete event by id
    @Override
    @Transactional
    public void delete(int id) {
        eventDAO.delete(id);
    }
}
