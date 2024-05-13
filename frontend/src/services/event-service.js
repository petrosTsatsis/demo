import axios from "axios";
import authHeader from "./auth-header";

const EVENT_REST_API_URL = "http://localhost:8080/Events";

class EventService {
  // method to get all the events
  getAllEvents() {
    return axios.get(EVENT_REST_API_URL, { headers: authHeader() });
  }

  // method to get an event by id
  getEvent(id) {
    return axios.get(EVENT_REST_API_URL + "/" + id, {
      headers: authHeader(),
    });
  }

  // method to delete an event
  deleteEvent(id) {
    return axios.delete(EVENT_REST_API_URL + "/" + id, {
      headers: authHeader(),
    });
  }
}

export default new EventService();
