import axios from "axios";
import authHeader from "./auth-header";

const SOFTWARE_REST_API_URL = "http://localhost:8080/Software";

class SoftwareService {

  // method to get all software
  getAllSoftware() {
    return axios.get(SOFTWARE_REST_API_URL, { headers: authHeader() });
  }

  // method to get a software by the id
  getSoftware(id) {
    return axios.get(SOFTWARE_REST_API_URL + "/" + id, {
      headers: authHeader(),
    });
  }

    // method to add a new software
    addSoftware(software) {
      return axios.post(SOFTWARE_REST_API_URL + "/add-software", software, {
        headers: authHeader(),
      });
    }

  // method to delete a software
  deleteSoftware(id) {
    return axios.delete(SOFTWARE_REST_API_URL + "/" + id, {
      headers: authHeader(),
    }); 
  }

  // method to get the softwares's purchases
  getPurchases(id) {
    return axios.get(SOFTWARE_REST_API_URL + "/" + id + "/purchases", {
      headers: authHeader(),
    });
  }

    // method to get the softwares's software licenses
    getLicenses(id) {
      return axios.get(SOFTWARE_REST_API_URL + "/" + id + "/softwareLicenses", {
        headers: authHeader(),
      });
    }

      // method to get the softwares's customers
  getCustomers(id) {
    return axios.get(SOFTWARE_REST_API_URL + "/" + id + "/customers", {
      headers: authHeader(),
    });
  }

  // method to update a software
  updateSoftware(id, software) {
    return axios.put(
      SOFTWARE_REST_API_URL + "/" + id + "/edit-software",
      software,
      {
        headers: authHeader(),
      }
    );
  }
}

export default new SoftwareService();
