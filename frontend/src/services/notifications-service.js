import axios from "axios";
import authHeader from "./auth-header";

const NOTIFICATION_REST_API_URL = "http://localhost:8080/Notifications/";

class NotificationService {
  MyNotifications() {
    return axios.get(NOTIFICATION_REST_API_URL + "myNotifications", {
      headers: authHeader(),
    });
  }

  getNotificationById(id) {
    return axios.get(NOTIFICATION_REST_API_URL + id, {
      headers: authHeader(),
    });
  }

  updateNotification(id, notification) {
    return axios.put(
      NOTIFICATION_REST_API_URL + id + "/edit-notification",
      notification,
      {
        headers: authHeader(),
      }
    );
  }

    // method to delete a purchase
    deleteNotification(id) {
      return axios.delete(NOTIFICATION_REST_API_URL + id, {
        headers: authHeader(),
      });
    }
}

export default new NotificationService();
