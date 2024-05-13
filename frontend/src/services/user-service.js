import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080";

const getPublicContent = () => {
  return axios.get(API_URL, { headers: authHeader() });
};

// method to get all the users
const getAllUsers = () => {
  return axios.get(`${API_URL}/Users`, {
    headers: authHeader(),
  });
};

// method to get a user by id
const getUserById = (id) => {
  return axios.get(`${API_URL}/Users/` + id, {
    headers: authHeader(),
  });
};

// method to get the current logged in user
const getCurrentUser = () => {
  return axios.get(`${API_URL}/User`, {
    headers: authHeader(),
  });
};

// method to update a user
const updateUser = (id, user) => {
  return axios.put(API_URL + "/Profile/edit-profile/" + id, user, {
    headers: authHeader(),
  });
};

// method to delete a user
const deleteUser = (id) => {
  return axios.delete(API_URL + "/Users/" + id, {
    headers: authHeader(),
  });
};

const UserService = {
  getPublicContent,
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  deleteUser,
};

export default UserService;
