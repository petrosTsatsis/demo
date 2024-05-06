import axios from "axios";
import authHeader from "./auth-header";

const CONTACTS_REST_API_URL = "http://localhost:8080/Contacts";

class ContactService {
  // method to get all the contacts
  getAllContacts() {
    return axios.get(CONTACTS_REST_API_URL, { headers: authHeader() });
  }

  // method to get contact by id
  getContactById(id) {
    return axios.get(CONTACTS_REST_API_URL + "/" + id, {
      headers: authHeader(),
    });
  }

  // method to add a new contact
  addContact(contact) {
    return axios.post(CONTACTS_REST_API_URL + "/add-contact", contact, {
      headers: authHeader(),
    });
  }

  // method to delete a contact
  deleteContact(id) {
    return axios.delete(CONTACTS_REST_API_URL + "/" + id, {
      headers: authHeader(),
    });
  }

  // method to update a contact
  updateContact(id, contact) {
    return axios.put(
      CONTACTS_REST_API_URL + "/" + id + "/edit-contact",
      contact,
      {
        headers: authHeader(),
      }
    );
  }

  // method to get the user's contacts
  getMyContacts() {
    return axios.get(CONTACTS_REST_API_URL + "/myContacts", {
      headers: authHeader(),
    });
  }

  // method to get the contact's and the user's common appointments
  getCommonAppointments(id) {
    return axios.get(CONTACTS_REST_API_URL + "/" + id + "/appointments", {
      headers: authHeader(),
    });
  }
}

export default new ContactService();
