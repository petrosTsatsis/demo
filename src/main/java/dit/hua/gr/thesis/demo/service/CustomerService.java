package dit.hua.gr.thesis.demo.service;

import dit.hua.gr.thesis.demo.entities.Customer;

import java.util.List;

public interface CustomerService {

    // find all customers
    public List<Customer> findAll();

    // create a customer
    public void save(Customer customer);

    // find customer by id
    public Customer findById(int id);

    // delete customer by id
    public void delete(int id);
}
