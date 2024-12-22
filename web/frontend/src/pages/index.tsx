// src/pages/index.tsx

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import LoginPage from "./login";
import SignUpPage from "./signup";

const IndexPage: React.FC = () => {
  const [currentPage, setCurrentPage] = React.useState<"login" | "signup">("login");
  const { accessToken } = useSelector((state: any) => state.auth);
  const router = useRouter();

  useEffect(() => {
    const token = accessToken || localStorage.getItem("accessToken");
    if (token) {
      router.push("/home");
    }
  }, [accessToken, router]);

  const handleNavigateToSignUp = () => setCurrentPage("signup");
  const handleNavigateToLogin = () => setCurrentPage("login");

  return (
    <>
      {currentPage === "login" ? (
        <LoginPage onSignUp={handleNavigateToSignUp} />
      ) : (
        <SignUpPage onBackToLogin={handleNavigateToLogin} />
      )}
    </>
  );
};


// const IndexPage: React.FC = () => {
//   const [currentPage, setCurrentPage] = React.useState<"login" | "signup">("login");
//   const { accessToken } = useSelector((state: any) => state.auth);
//   const router = useRouter();

//   useEffect(() => {
//     if (accessToken) {
//       console.log("Access token detected, navigating to home...");
//       router.push("/home");
//     }
//   }, [accessToken, router]);

//   const handleNavigateToSignUp = () => setCurrentPage("signup");
//   const handleNavigateToLogin = () => setCurrentPage("login");

//   return (
//     <>
//       {currentPage === "login" ? (
//         <LoginPage onSignUp={handleNavigateToSignUp} />
//       ) : (
//         <SignUpPage onBackToLogin={handleNavigateToLogin} />
//       )}
//     </>
//   );
// };

// export default IndexPage;