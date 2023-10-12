package dit.hua.gr.thesis.demo.service;

import dit.hua.gr.thesis.demo.dao.SoftwareDAO;
import dit.hua.gr.thesis.demo.entities.Software;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SoftwareServiceImpl implements SoftwareService{

    @Autowired
    private SoftwareDAO softwareDAO;

    // find all softwares
    @Override
    @Transactional
    public List<Software> findAll() {
        return softwareDAO.findAll();
    }

    // create a new software
    @Override
    @Transactional
    public void save(Software software) {
        softwareDAO.save(software);
    }

    // find software by id
    @Override
    @Transactional
    public Software findById(int id) {
        return softwareDAO.findById(id);
    }

    // delete software by id
    @Override
    @Transactional
    public void delete(int id) {
        softwareDAO.delete(id);
    }
}
