import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080";

const getPublicContent = () => {
  return axios.get(API_URL, { headers: authHeader() });
};

const getCounts = () => {
  return axios.get(`${API_URL}/home`);
};

const getAllUsers = () => {
  return axios.get(`${API_URL}/Users`, {
    headers: authHeader(),
  });
};

const getUserById = (id) => {
  return axios.get(`${API_URL}/Users/` + id, {
    headers: authHeader(),
  });
};

const getCurrentUser = () => {
  return axios.get(`${API_URL}/User`, {
    headers: authHeader(),
  });
};

const updateUser = (id, user) => {
  return axios.put(API_URL + "/Profile/edit-profile/" + id, user, {
    headers: authHeader(),
  });
};

// method to delete a task
const deleteUser = (id) => {
  return axios.delete(API_URL + "/Users/" + id, {
    headers: authHeader(),
  });
};

const UserService = {
  getPublicContent,
  getCounts,
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  deleteUser,
};

export default UserService;
