import axios from "axios";
import authHeader from "./auth-header";

const CERTIFICATE_REST_API_URL = "http://localhost:8080/SSLCertificates";

class SslCertificateService {
  getCertificates() {
    return axios.get(CERTIFICATE_REST_API_URL, { headers: authHeader() });
  }

  getCertificateById(id) {
    return axios.get(CERTIFICATE_REST_API_URL + "/" + id, {
      headers: authHeader(),
    });
  }

  updateCertificate(id, certificate) {
    return axios.put(CERTIFICATE_REST_API_URL + "/" + id + "/edit-certificate", certificate, {
      headers: authHeader(),
    });
  }

  addSSLCertificate(sslCertificate, customerId) {
    return axios.post(CERTIFICATE_REST_API_URL + "/add-certificate/customers/" + customerId, sslCertificate, {
      headers: authHeader(),
    });
  }

  deleteSSLCertificate(id) {
    return axios.delete(CERTIFICATE_REST_API_URL + "/" + id, {
      headers: authHeader(),
    });
  }
}

export default new SslCertificateService();