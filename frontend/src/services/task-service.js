import axios from "axios";
import authHeader from "./auth-header";

const TASK_REST_API_URL = "http://localhost:8080/Tasks";

class TaskService {
  // method to get the user's tasks
  getMyTasks() {
    return axios.get(TASK_REST_API_URL + "/myTasks", {
      headers: authHeader(),
    });
  }
  // method to get a task by id
  getTask(id) {
    return axios.get(TASK_REST_API_URL + "/" + id, {
      headers: authHeader(),
    });
  }

  // method to add a task
  addTask(task) {
    return axios.post(TASK_REST_API_URL + "/add-task", task, {
      headers: authHeader(),
    });
  }

  // method to delete a task
  deleteTask(id) {
    return axios.delete(TASK_REST_API_URL + "/" + id, {
      headers: authHeader(),
    });
  }

  // method to update a task
  updateTask(id, task) {
    return axios.put(TASK_REST_API_URL + "/" + id + "/edit-task", task, {
      headers: authHeader(),
    });
  }
}

export default new TaskService();
