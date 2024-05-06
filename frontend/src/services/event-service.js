import axios from "axios";
import authHeader from "./auth-header";

const EVENT_REST_API_URL = "http://localhost:8080/Events";

class EventService {
  getAllEvents() {
    return axios.get(EVENT_REST_API_URL, { headers: authHeader() });
  }

  getEvent(id) {
    return axios.get(EVENT_REST_API_URL + "/" + id, {
      headers: authHeader(),
    });
  }

    // method to delete an Event
    deleteEvent(id) {
      return axios.delete(EVENT_REST_API_URL + "/" + id, {
        headers: authHeader(),
      });
    }
}

export default new EventService();
