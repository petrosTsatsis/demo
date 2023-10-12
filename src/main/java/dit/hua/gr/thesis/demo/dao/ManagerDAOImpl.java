package dit.hua.gr.thesis.demo.dao;

import dit.hua.gr.thesis.demo.entities.Manager;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ManagerDAOImpl implements ManagerDAO{

    @Autowired
    private EntityManager entityManager;

    // find all managers
    @Override
    @Transactional
    public List<Manager> findAll() {
        TypedQuery<Manager> query = entityManager.createQuery("from Manager", Manager.class);
        List<Manager> managers = query.getResultList();
        return managers;
    }

    // create a new manager
    @Override
    @Transactional
    public void save(Manager manager) {
        Manager theManager = entityManager.merge(manager);
    }

    // find manager by id
    @Override
    @Transactional
    public Manager findById(int id) {
        return entityManager.find(Manager.class, id);
    }

    // delete manager by id
    @Override
    @Transactional
    public void delete(int id) {
        Manager manager = entityManager.find(Manager.class, id);
        entityManager.remove(manager);
    }
}
