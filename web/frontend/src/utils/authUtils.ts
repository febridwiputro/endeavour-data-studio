// src/utils/authUtils.ts

import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { RootState } from "../store/store";

export const useTokenExpirationHandler = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const checkTokenExpiration = () => {
      if (!accessToken || isTokenExpired(accessToken)) {
        console.warn("Token expired. Logging out...");
        dispatch(logout());
        router.push("/login");
      }
    };

    const isTokenExpired = (token: string): boolean => {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expiration = payload.exp * 1000; // Convert to milliseconds
        return Date.now() >= expiration;
      } catch (error) {
        console.error("Invalid token:", error);
        return true; // Assume expired if decoding fails
      }
    };

    checkTokenExpiration();
  }, [accessToken, dispatch, router]);
};