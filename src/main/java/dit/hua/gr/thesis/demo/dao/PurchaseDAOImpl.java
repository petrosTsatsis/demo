package dit.hua.gr.thesis.demo.dao;


import dit.hua.gr.thesis.demo.entities.Purchase;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PurchaseDAOImpl implements PurchaseDAO{

    @Autowired
    private EntityManager entityManager;

    // find all purchases
    @Override
    @Transactional
    public List<Purchase> findAll() {
        TypedQuery<Purchase> query = entityManager.createQuery("from Purchase ", Purchase.class);
        List<Purchase> purchases = query.getResultList();
        return purchases;
    }

    // create a new purchase
    @Override
    @Transactional
    public void save(Purchase purchase) {
        Purchase thePurchase = entityManager.merge(purchase);
    }

    // find purchase by id
    @Override
    @Transactional
    public Purchase findById(int id) {
        return entityManager.find(Purchase.class, id);
    }

    // delete purchase by id
    @Override
    @Transactional
    public void delete(int id) {
        Purchase purchase = entityManager.find(Purchase.class, id);
        entityManager.remove(purchase);
    }

}
