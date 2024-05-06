import axios from "axios";
import authHeader from "./auth-header";

const LICENSE_REST_API_URL = "http://localhost:8080/SoftwareLicences";

class SoftwareLicenceService {
  getLicenses() {
    return axios.get(LICENSE_REST_API_URL, { headers: authHeader() });
  }

  getLicenseById(id) {
    return axios.get(LICENSE_REST_API_URL + "/" + id, {
      headers: authHeader(),
    });
  }

  deleteSoftwareLicense(id) {
    return axios.delete(LICENSE_REST_API_URL + "/" + id, {
      headers: authHeader(),
    });
  }

  updateLicense(id, license) {
    return axios.put(LICENSE_REST_API_URL + "/" + id + "/edit-license", license, {
      headers: authHeader(),
    });
  }
}

export default new SoftwareLicenceService();