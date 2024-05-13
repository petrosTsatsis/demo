import axios from "axios";
import authHeader from "./auth-header";

const COMPANY_REST_API_URL = "http://localhost:8080/Companies";

class CompanyService {
  // method to get all the companies
  getAllCompanies() {
    return axios.get(COMPANY_REST_API_URL, { headers: authHeader() });
  }

  // method to get a company by the id
  getCompanyById(id) {
    return axios.get(COMPANY_REST_API_URL + "/id/" + id, {
      headers: authHeader(),
    });
  }

  // method to get a company by the name
  getCompanyByName(name) {
    return axios.get(COMPANY_REST_API_URL + "/companyName/" + name, {
      headers: authHeader(),
    });
  }

  // method to add a new company
  addCompany(company) {
    return axios.post(COMPANY_REST_API_URL + "/add-company", company, {
      headers: authHeader(),
    });
  }

  // method to delete a company
  deleteCompany(id) {
    return axios.delete(COMPANY_REST_API_URL + "/" + id, {
      headers: authHeader(),
    });
  }

  // method to update a company
  updateCompany(id, company) {
    return axios.put(
      COMPANY_REST_API_URL + "/" + id + "/edit-company",
      company,
      {
        headers: authHeader(),
      }
    );
  }

  // method to get the companys's contacts
  getContacts(id) {
    return axios.get(COMPANY_REST_API_URL + "/" + id + "/contacts", {
      headers: authHeader(),
    });
  }

  // method to add contacts to a company
  addContactToCompany(id, contacts) {
    return axios.post(
      COMPANY_REST_API_URL + "/" + id + "/add-contact",
      contacts,
      {
        headers: authHeader(),
      }
    );
  }

  // method to remove a contact from a company
  removeContact(contact) {
    return axios.delete(COMPANY_REST_API_URL + "/remove-contact", {
      data: contact,
      headers: authHeader(),
    });
  }
}

export default new CompanyService();
