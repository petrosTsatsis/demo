package dit.hua.gr.thesis.demo.dao;

import dit.hua.gr.thesis.demo.entities.Appointment;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class AppointmentDAOImpl implements AppointmentDAO {

    @Autowired
    private EntityManager entityManager;

    // find all appointments
    @Override
    @Transactional
    public List<Appointment> findAll() {
        TypedQuery<Appointment> query = entityManager.createQuery("from Appointment ", Appointment.class);
        List<Appointment> appointments = query.getResultList();
        return appointments;
    }

    // create a new appointment
    @Override
    @Transactional
    public void save(Appointment appointment) {
        Appointment theAppointment = entityManager.merge(appointment);
    }

    // find appointment by id
    @Override
    @Transactional
    public Appointment findById(int id) {
        return entityManager.find(Appointment.class, id);
    }

    // delete appointment by id
    @Override
    @Transactional
    public void delete(int id) {
        Appointment appointment= entityManager.find(Appointment.class, id);
        entityManager.remove(appointment);
    }
}
