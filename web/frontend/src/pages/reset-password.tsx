// src/pages/reset-password.tsx

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { verifyCode, resendCode } from "../features/auth/authSlice";
import AlertBase from "@/components/base/AlertBase";

const ResetPasswordPage: React.FC = () => {
  const router = useRouter();
  const { email: queryEmail } = router.query;
  const [email, setEmail] = useState<string | null>(null);
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    type: "success" as "success" | "error" | "info" | "warning",
    message: "",
  });

  const dispatch = useDispatch<any>();

  // Set email from query params
  useEffect(() => {
    if (queryEmail && typeof queryEmail === "string") {
      setEmail(queryEmail);
    } else {
      setAlert({
        show: true,
        type: "error",
        message: "Email is missing. Redirecting to forgot password.",
      });
      setTimeout(() => router.push("/forgot-password"), 3000);
    }
  }, [queryEmail, router]);

  // Handle alert display
  const handleAlert = (type: "success" | "error" | "info" | "warning", message: string) => {
    setAlert({ show: false, type, message });
    setTimeout(() => setAlert({ show: true, type, message }), 100);
  };

  // Handle input change for verification code
  const handleInputChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return; // Allow only digits
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
  };

  // Verify the code
  const handleVerifyCode = async () => {
    if (!email) {
      handleAlert("error", "Email is missing. Please try again.");
      return;
    }

    if (code.some((digit) => digit === "")) {
      handleAlert("warning", "Please enter all 6 digits.");
      return;
    }

    setLoading(true);
    try {
      const verificationCode = code.join("");
      const result = await dispatch(verifyCode({ email, code: verificationCode }));

      if (verifyCode.fulfilled.match(result)) {
        handleAlert(
          "success",
          "Code verified successfully! Redirecting to update password..."
        );
        setTimeout(() => {
          router.push({ pathname: "/update-password", query: { email } });
        }, 3000);
      } else {
        handleAlert("error", result.payload || "Invalid verification code.");
      }
    } catch (err) {
      console.error(err);
      handleAlert("error", "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Resend the verification code
  const handleResendCode = async () => {
    if (!email) {
      handleAlert("error", "Email is missing. Cannot resend code.");
      return;
    }

    setLoading(true);
    try {
      const result = await dispatch(resendCode({ email }));

      if (resendCode.fulfilled.match(result)) {
        handleAlert("success", "Verification code resent successfully!");
      } else {
        handleAlert("error", result.payload || "Failed to resend code.");
      }
    } catch (err) {
      console.error(err);
      handleAlert("error", "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="flex flex-col items-center justify-center w-1/2 bg-[#1a4f9d] p-12">
        <div className="flex items-center space-x-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="4em"
            height="4em"
            viewBox="0 0 2048 2048"
            fill="none"
          >
            <path
              fill="white"
              d="M2048 640h-640V482L691 960l717 478v-158h640v640h-640v-328l-768-512v200H0V640h640v200l768-512V0h640zm-512 768v384h384v-384zM512 1152V768H128v384zM1536 128v384h384V128z"
            />
          </svg>
          <div>
            <h1 className="text-5xl font-bold text-white">Data Studio</h1>
            <p className="text-lg text-white mt-2">
              A full-fledged open-source solution for data labeling
            </p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col justify-center items-center w-1/2 bg-white p-12">
        <div className="max-w-sm w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Verify Email</h2>
          <p className="text-sm text-gray-500 mb-6">
            Enter the 6-digit verification code sent to your email: <b>{email}</b>
          </p>
          <div className="flex justify-between mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength={1}
                className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
                value={digit}
                onChange={(e) => handleInputChange(e.target.value, index)}
              />
            ))}
          </div>
          <button
            onClick={handleVerifyCode}
            className={`w-full bg-[#1a4f9d] text-white py-3 rounded-lg hover:bg-blue-500 hover:bg-opacity-70 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
          <p className="mt-4 text-sm text-gray-500 text-center">
            Didn’t receive the code?{" "}
            <span
              onClick={handleResendCode}
              className="text-[#1a4f9d] font-semibold cursor-pointer hover:underline"
            >
              Resend Code
            </span>
          </p>
        </div>
      </div>

      {/* Alert */}
      <AlertBase
        show={alert.show}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ ...alert, show: false })}
      />
    </div>
  );
};

export default ResetPasswordPage;
