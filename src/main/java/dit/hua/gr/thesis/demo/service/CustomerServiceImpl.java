package dit.hua.gr.thesis.demo.service;

import dit.hua.gr.thesis.demo.dao.CustomerDAO;
import dit.hua.gr.thesis.demo.entities.Customer;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService{

    @Autowired
    private CustomerDAO customerDAO;

    // find all customers
    @Override
    @Transactional
    public List<Customer> findAll() {
        return customerDAO.findAll();
    }

    // create a new customer
    @Override
    @Transactional
    public void save(Customer customer) {
        customerDAO.save(customer);
    }

    // find customer by id
    @Override
    @Transactional
    public Customer findById(int id) {
        return customerDAO.findById(id);
    }

    // delete customer by id
    @Override
    @Transactional
    public void delete(int id) {
        customerDAO.delete(id);
    }
}
