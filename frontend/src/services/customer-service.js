import axios from "axios";
import authHeader from "./auth-header";

const CUSTOMER_REST_API_URL = "http://localhost:8080/Customers";

class CustomerService {
  // method to get all the customers
  getAllCustomers() {
    return axios.get(CUSTOMER_REST_API_URL, { headers: authHeader() });
  }

  // method to get a customer by the id
  getCustomer(id) {
    return axios.get(CUSTOMER_REST_API_URL + "/" + id, {
      headers: authHeader(),
    });
  }

  // method to add a new customer
  addCustomer(customer) {
    return axios.post(CUSTOMER_REST_API_URL + "/add-customer", customer, {
      headers: authHeader(),
    });
  }

  // method to delete a customer
  deleteCustomer(id) {
    return axios.delete(CUSTOMER_REST_API_URL + "/" + id, {
      headers: authHeader(),
    });
  }

  // method to get the customer's purchases
  getPurchases(id) {
    return axios.get(CUSTOMER_REST_API_URL + "/" + id + "/purchases", {
      headers: authHeader(),
    });
  }

  // method to get the customer's certificates
  getCertificates(id) {
    return axios.get(CUSTOMER_REST_API_URL + "/" + id + "/SSLCertificates", {
      headers: authHeader(),
    });
  }

  // method to get the customer's licenses
  getLicenses(id) {
    return axios.get(CUSTOMER_REST_API_URL + "/" + id + "/SoftwareLicenses", {
      headers: authHeader(),
    });
  }

  // method to get the customer's and the user's common appointments
  getCommonAppointments(id) {
    return axios.get(CUSTOMER_REST_API_URL + "/" + id + "/appointments", {
      headers: authHeader(),
    });
  }

  // method to update a customer
  updateCustomer(id, customer) {
    return axios.put(
      CUSTOMER_REST_API_URL + "/" + id + "/edit-customer",
      customer,
      {
        headers: authHeader(),
      }
    );
  }
}

export default new CustomerService();
