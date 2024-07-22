import { IUserDetail } from "@/components/pages/dashboard/dashboardPages/users/userDetail/interface";
import { authStore } from "@/lib/store/authStore";
import { BASE_API_URL } from "@/lib/variables/variables";
// import axios from "axios";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../global-interceptor";

export const useAuth = () => {
  const { accessToken } = authStore();
  const navigate = useNavigate();

  const fetchUserData = useCallback(async () => {
    // console.log("accessToken:", accessToken);
    try {
      const response = await api.get(`${BASE_API_URL}api/auth/current-user/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      //   console.log("API response:", response.data);
      const userData: IUserDetail = response.data;
    //   console.log("userData:", userData);
      return userData;
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Display error message or handle it accordingly
      navigate("/unauthorized");
    }
  }, [accessToken, navigate]);

  return { fetchUserData };
};
