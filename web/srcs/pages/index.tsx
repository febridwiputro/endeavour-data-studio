// src/pages/index.tsx

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { RootState } from "../store/store";

const IndexPage: React.FC = () => {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    const token = accessToken || localStorage.getItem("accessToken");

    if (token) {
      console.log("Token ditemukan. Navigasi ke /home");
      router.push("/home");
    } else {
      console.log("Token tidak ditemukan. Navigasi ke /login");
      router.push("/login");
    }
  }, [accessToken, router]);

  return null;
};

export default IndexPage;
