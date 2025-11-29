import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Custom hook to access auth context easily
 */
export const useAuth = () => {
  return useContext(AuthContext);
};
