package dit.hua.gr.thesis.demo.service;

import dit.hua.gr.thesis.demo.entities.Software;

import java.util.List;

public interface SoftwareService {

    // find all software
    public List<Software> findAll();

    // create a software
    public void save(Software software);

    // find software by id
    public Software findById(int id);

    // delete software by id
    public void delete(int id);
}
