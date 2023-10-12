package dit.hua.gr.thesis.demo.service;

import dit.hua.gr.thesis.demo.dao.AppointmentDAO;
import dit.hua.gr.thesis.demo.entities.Appointment;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentServiceImpl implements AppointmentService{

    @Autowired
    private AppointmentDAO appointmentDAO;

    // find all appointments
    @Override
    @Transactional
    public List<Appointment> findAll() {
        return appointmentDAO.findAll();
    }

    // create a new appointment
    @Override
    @Transactional
    public void save(Appointment appointment) {
        appointmentDAO.save(appointment);
    }

    // find appointment by id
    @Override
    @Transactional
    public Appointment findById(int id) {
        return appointmentDAO.findById(id);
    }

    // delete appointment by id
    @Override
    @Transactional
    public void delete(int id) {
        appointmentDAO.delete(id);
    }
}
