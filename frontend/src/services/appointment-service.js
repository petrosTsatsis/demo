import axios from "axios";
import authHeader from "./auth-header";

const APPOINTMENT_REST_API_URL = "http://localhost:8080/Appointments";

class AppointmentService {

  getAppointment(id) {
    return axios.get(APPOINTMENT_REST_API_URL + "/" + id, {
      headers: authHeader(),
    });
  }

  // method to add a new appointment
  createAppointment(appointment) {
    return axios.post(
      APPOINTMENT_REST_API_URL + "/book-appointment",
      appointment,
      {
        headers: authHeader(),
      }
    );
  }
  // method to update an appointment
  updateAppointment(id, appointment) {
    return axios.put(APPOINTMENT_REST_API_URL + "/" + id + "/edit-appointment" , appointment, {
      headers: authHeader(),
    });
  }
  // method to delete an appointment
  deleteAppointment(id) {
    return axios.delete(APPOINTMENT_REST_API_URL + "/" + id, {
      headers: authHeader(),
    });
  }
}

export default new AppointmentService();
