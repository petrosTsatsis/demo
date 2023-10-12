package dit.hua.gr.thesis.demo.service;

import dit.hua.gr.thesis.demo.dao.ManagerDAO;
import dit.hua.gr.thesis.demo.entities.Manager;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ManagerServiceImpl implements ManagerService{

    @Autowired
    private ManagerDAO managerDAO;

    // find all managers
    @Override
    @Transactional
    public List<Manager> findAll() {
        return managerDAO.findAll();
    }

    // create a new manager
    @Override
    @Transactional
    public void save(Manager manager) {
        managerDAO.save(manager);
    }

    // find manager by id
    @Override
    @Transactional
    public Manager findById(int id) {
        return managerDAO.findById(id);
    }

    // delete manager by id
    @Override
    @Transactional
    public void delete(int id) {
        managerDAO.delete(id);
    }
}
