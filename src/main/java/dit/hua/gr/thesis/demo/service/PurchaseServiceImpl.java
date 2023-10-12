package dit.hua.gr.thesis.demo.service;

import dit.hua.gr.thesis.demo.dao.PurchaseDAO;
import dit.hua.gr.thesis.demo.entities.Purchase;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PurchaseServiceImpl implements PurchaseService{

    @Autowired
    private PurchaseDAO purchaseDAO;

    // find all purchases
    @Override
    @Transactional
    public List<Purchase> findAll() {
        return purchaseDAO.findAll();
    }

    // create a new purchase
    @Override
    @Transactional
    public void save(Purchase purchase) {
        purchaseDAO.save(purchase);
    }

    // find purchase by id
    @Override
    @Transactional
    public Purchase findById(int id) {
        return purchaseDAO.findById(id);
    }

    // delete purchase by id
    @Override
    @Transactional
    public void delete(int id) {
        purchaseDAO.delete(id);
    }
}
