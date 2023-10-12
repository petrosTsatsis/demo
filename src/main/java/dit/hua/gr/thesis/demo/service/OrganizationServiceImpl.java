package dit.hua.gr.thesis.demo.service;

import dit.hua.gr.thesis.demo.dao.OrganizationDAO;
import dit.hua.gr.thesis.demo.entities.Organization;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrganizationServiceImpl implements OrganizationService{

    @Autowired
    private OrganizationDAO organizationDAO;

    // find all organizations
    @Override
    @Transactional
    public List<Organization> findAll() {
        return organizationDAO.findAll();
    }

    // create a new organization
    @Override
    @Transactional
    public void save(Organization organization) {
        organizationDAO.save(organization);
    }

    // find organization by id
    @Override
    @Transactional
    public Organization findById(int id) {
        return organizationDAO.findById(id);
    }

    // delete organization by id
    @Override
    @Transactional
    public void delete(int id) {
        organizationDAO.delete(id);
    }
}
