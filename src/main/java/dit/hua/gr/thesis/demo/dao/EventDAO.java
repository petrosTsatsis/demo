package dit.hua.gr.thesis.demo.dao;

import dit.hua.gr.thesis.demo.entities.Event;

import java.util.List;

public interface EventDAO {

    // find all events
    public List<Event> findAll();

    // create an event
    public void save(Event event);

    // find event by id
    public Event findById(int id);

    // delete event by id
    public void delete(int id);
}
