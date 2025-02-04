// src/utils/authUtils.ts

import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { logout, setTokens } from "../features/auth/authSlice";
import { RootState } from "../store/store";
import api from "@/services/apiConfig";

export const useTokenExpirationHandler = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const checkTokenExpiration = async () => {
      if (!accessToken) {
        console.warn("No access token. Logging out...");
        dispatch(logout());
        router.push("/login");
        return;
      }

      if (isTokenExpired(accessToken)) {
        console.warn("Access token expired. Attempting to refresh...");
        await refreshAccessToken();
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

    const refreshAccessToken = async () => {
      if (!refreshToken) {
        console.warn("No refresh token available. Logging out...");
        dispatch(logout());
        router.push("/login");
        return;
      }

      try {
        const response = await api.post("/auth/refresh-token", {
          refresh_token: refreshToken,
        });

        if (response.data.access_token) {
          console.log("Successfully refreshed access token.");
          dispatch(setTokens({ accessToken: response.data.access_token, refreshToken }));
          localStorage.setItem("accessToken", response.data.access_token);
        } else {
          console.warn("Failed to refresh access token. Logging out...");
          dispatch(logout());
          router.push("/login");
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
        dispatch(logout());
        router.push("/login");
      }
    };

    checkTokenExpiration();
  }, [accessToken, refreshToken, dispatch, router]);
};


// import { useEffect } from "react";
// import { useRouter } from "next/router";
// import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../features/auth/authSlice";
// import { RootState } from "../store/store";

// export const useTokenExpirationHandler = () => {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const { accessToken } = useSelector((state: RootState) => state.auth);

//   useEffect(() => {
//     const checkTokenExpiration = () => {
//       if (!accessToken || isTokenExpired(accessToken)) {
//         console.warn("Token expired. Logging out...");
//         dispatch(logout());
//         router.push("/login");
//       }
//     };

//     const isTokenExpired = (token: string): boolean => {
//       try {
//         const payload = JSON.parse(atob(token.split(".")[1]));
//         const expiration = payload.exp * 36000; // Convert to milliseconds
//         return Date.now() >= expiration;
//       } catch (error) {
//         console.error("Invalid token:", error);
//         return true; // Assume expired if decoding fails
//       }
//     };

//     checkTokenExpiration();
//   }, [accessToken, dispatch, router]);
// };