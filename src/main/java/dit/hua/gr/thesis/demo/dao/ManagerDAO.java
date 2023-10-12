package dit.hua.gr.thesis.demo.dao;

import dit.hua.gr.thesis.demo.entities.Manager;

import java.util.List;

public interface ManagerDAO {

    // find all managers
    public List<Manager> findAll();

    // create a manager
    public void save(Manager manager);

    // find manager by id
    public Manager findById(int id);

    // delete manager by id
    public void delete(int id);
}
