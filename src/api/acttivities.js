import axiosInstance from "../axios";

export const getScreenshot = async (payload) => {
    try {
        const response = await axiosInstance.post("/clients/screenshot", payload);
        return {
          success: true,
          message: response.data.message,
          result: response.data.data
        };
      } catch (error) {
        console.error("API Error:", error);
        return {
          success: false,
          message: error.response?.data?.message || "Something went wrong",
          error:error.response?.data?.error || "Something went wrong",
        };
      }
  };