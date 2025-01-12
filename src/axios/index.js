import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Replace with your API URL
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptors for handling requests and responses
axiosInstance.interceptors.request.use(
  (config) => {
    // Add Authorization or other headers if needed
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
