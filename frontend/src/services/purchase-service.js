import axios from "axios";
import authHeader from "./auth-header";

const PURCHASE_REST_API_URL = "http://localhost:8080/Purchases";

class PurchaseService {
  // method to get all the purchases
  getAllPurchases() {
    return axios.get(PURCHASE_REST_API_URL, { headers: authHeader() });
  }

  // method to get a purchase by the id
  getPurchase(id) {
    return axios.get(PURCHASE_REST_API_URL + "/" + id, {
      headers: authHeader(),
    });
  }

  // method to add a new purchase
  addPurchase(purchase) {
    return axios.post(PURCHASE_REST_API_URL + "/add-purchase", purchase, {
      headers: authHeader(),
    });
  }

  // method to delete a purchase
  deletePurchase(id) {
    return axios.delete(PURCHASE_REST_API_URL + "/" + id, {
      headers: authHeader(),
    });
  }

  // method to update a purchase
  updatePurchase(id, purchase) {
    return axios.put(
      PURCHASE_REST_API_URL + "/" + id + "/edit-purchase",
      purchase,
      {
        headers: authHeader(),
      }
    );
  }
}

export default new PurchaseService();
