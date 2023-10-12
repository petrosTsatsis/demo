package dit.hua.gr.thesis.demo.dao;

import dit.hua.gr.thesis.demo.entities.Customer;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import jakarta.websocket.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CustomerDAOImpl implements CustomerDAO{

    @Autowired
    private EntityManager entityManager;

    // find all customers
    @Override
    @Transactional
    public List<Customer> findAll() {
        TypedQuery<Customer> query = entityManager.createQuery("from Customer", Customer.class);
        List<Customer> customers = query.getResultList();
        return customers;
    }

    // create a new customer
    @Override
    @Transactional
    public void save(Customer customer) {
        Customer theCustomer = entityManager.merge(customer);
    }

    // find customer by id
    @Override
    @Transactional
    public Customer findById(int id) {
        return entityManager.find(Customer.class, id);
    }

    // delete customer by id
    @Override
    @Transactional
    public void delete(int id) {
        Customer customer = entityManager.find(Customer.class, id);
        entityManager.remove(customer);
    }
}
