package dit.hua.gr.thesis.demo.dao;

import dit.hua.gr.thesis.demo.entities.Organization;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class OrganizationDAOImpl implements OrganizationDAO{

    @Autowired
    private EntityManager entityManager;

    // find all appointments
    @Override
    @Transactional
    public List<Organization> findAll() {
        TypedQuery<Organization> query = entityManager.createQuery("from Organization ", Organization.class);
        List<Organization> organizations = query.getResultList();
        return organizations;
    }

    // create a new organization
    @Override
    @Transactional
    public void save(Organization organization) {
        Organization theOrganization = entityManager.merge(organization);
    }

    // find organization by id
    @Override
    @Transactional
    public Organization findById(int id) {
        return entityManager.find(Organization.class, id);
    }

    // delete organization by id
    @Override
    @Transactional
    public void delete(int id) {
        Organization organization = entityManager.find(Organization.class, id);
        entityManager.remove(organization);
    }
}
