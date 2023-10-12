package dit.hua.gr.thesis.demo.dao;

import dit.hua.gr.thesis.demo.entities.Appointment;

import java.util.List;

public interface AppointmentDAO {

    // find all appointment
    public List<Appointment> findAll();

    // create a appointment
    public void save(Appointment appointment);

    // find appointment by id
    public Appointment findById(int id);

    // delete appointment by id
    public void delete(int id);
}
