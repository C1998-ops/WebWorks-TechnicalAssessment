import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuthSession } from "../utils/authState";

export const Logout: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    clearAuthSession();
    navigate("/login", { replace: true });
  }, [navigate]);
  
  return null;
};
