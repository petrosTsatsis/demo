package dit.hua.gr.thesis.demo.dao;



import dit.hua.gr.thesis.demo.entities.Software;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class SoftwareDAOImpl implements SoftwareDAO{

    @Autowired
    private EntityManager entityManager;

    // find all softwares
    @Override
    @Transactional
    public List<Software> findAll() {
        TypedQuery<Software> query = entityManager.createQuery("from Software", Software.class);
        List<Software> softwares = query.getResultList();
        return softwares;
    }

    // create a new software
    @Override
    @Transactional
    public void save(Software software) {
        Software theSoftware = entityManager.merge(software);
    }

    // find software by id
    @Override
    @Transactional
    public Software findById(int id) {
        return entityManager.find(Software.class, id);
    }

    // delete software by id
    @Override
    @Transactional
    public void delete(int id) {
        Software software = entityManager.find(Software.class, id);
        entityManager.remove(software);
    }
}
