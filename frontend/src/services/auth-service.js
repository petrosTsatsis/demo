import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/auth/";

const register = (
  username,
  email,
  password,
  role,
  fname,
  lname,
  description,
  phoneNumber
) => {
  return axios.post(
    API_URL + "signup",
    {
      username,
      email,
      password,
      role,
      fname,
      lname,
      description,
      phoneNumber,
    },
    { headers: authHeader() }
  );
};

const login = async (username, password) => {
  try {
    const response = await axios.post(API_URL + "signin", {
      username,
      password,
    });
    if (response.data.accessToken) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;
