import axios from "axios";
import authHeader from "./auth-header";

const CERTIFICATE_REST_API_URL = "http://localhost:8080/SSLCertificates";

class SslCertificateService {
  // method to get all the ssl certificates
  getCertificates() {
    return axios.get(CERTIFICATE_REST_API_URL, { headers: authHeader() });
  }

  // method to get a certificate by id
  getCertificateById(id) {
    return axios.get(CERTIFICATE_REST_API_URL + "/" + id, {
      headers: authHeader(),
    });
  }

  // method to update a certificate
  updateCertificate(id, certificate) {
    return axios.put(
      CERTIFICATE_REST_API_URL + "/" + id + "/edit-certificate",
      certificate,
      {
        headers: authHeader(),
      }
    );
  }

  // method to add a certificate
  addSSLCertificate(sslCertificate, customerId) {
    return axios.post(
      CERTIFICATE_REST_API_URL + "/add-certificate/customers/" + customerId,
      sslCertificate,
      {
        headers: authHeader(),
      }
    );
  }

  // method to delete a certificate
  deleteSSLCertificate(id) {
    return axios.delete(CERTIFICATE_REST_API_URL + "/" + id, {
      headers: authHeader(),
    });
  }
}

export default new SslCertificateService();
