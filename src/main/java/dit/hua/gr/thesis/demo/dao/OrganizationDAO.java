package dit.hua.gr.thesis.demo.dao;

import dit.hua.gr.thesis.demo.entities.Organization;

import java.util.List;

public interface OrganizationDAO {

    // find all organizations
    public List<Organization> findAll();

    // create an organization
    public void save(Organization organization);

    // find appointment by id
    public Organization findById(int id);

    // delete organization by id
    public void delete(int id);
}
