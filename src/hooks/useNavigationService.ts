import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import navigationService from "@/lib/services/navigationService";

export const useNavigationService = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize the navigation service with the navigate function
    navigationService.setNavigateFunction(navigate);
  }, [navigate]);

  return navigationService;
};
