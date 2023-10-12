package dit.hua.gr.thesis.demo.service;

import dit.hua.gr.thesis.demo.entities.Purchase;

import java.util.List;

public interface PurchaseService {

    // find all purchases
    public List<Purchase> findAll();

    // create a purchase
    public void save(Purchase purchase);

    // find purchase by id
    public Purchase findById(int id);

    // delete purchase by id
    public void delete(int id);
}
