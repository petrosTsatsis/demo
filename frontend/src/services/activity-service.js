import axios from "axios";
import authHeader from "./auth-header";

const ACTIVITIES_REST_API_URL = "http://localhost:8080/Activities";

class ActivityService {
  // method to get the latest activities of the user
  getLatestActivities() {
    return axios.get(ACTIVITIES_REST_API_URL + "/latest-activities", {
      headers: authHeader(),
    });
  }

  // method to delete an activity
  deleteActivity(id) {
    return axios.delete(ACTIVITIES_REST_API_URL + "/" + id, {
      headers: authHeader(),
    });
  }
}

export default new ActivityService();
