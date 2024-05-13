import axios from "axios";
import authHeader from "./auth-header";

const LICENSE_REST_API_URL = "http://localhost:8080/SoftwareLicences";

class SoftwareLicenceService {
  // method to get all the software licenses
  getLicenses() {
    return axios.get(LICENSE_REST_API_URL, { headers: authHeader() });
  }

  // method to get a license by id
  getLicenseById(id) {
    return axios.get(LICENSE_REST_API_URL + "/" + id, {
      headers: authHeader(),
    });
  }

  // method to delete a license
  deleteSoftwareLicense(id) {
    return axios.delete(LICENSE_REST_API_URL + "/" + id, {
      headers: authHeader(),
    });
  }

  // method to update a license
  updateLicense(id, license) {
    return axios.put(
      LICENSE_REST_API_URL + "/" + id + "/edit-license",
      license,
      {
        headers: authHeader(),
      }
    );
  }
}

export default new SoftwareLicenceService();
