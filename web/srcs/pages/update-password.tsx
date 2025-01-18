// src/pages/update-password.tsx

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { passwordUpdate } from "../features/auth/authSlice";
import AlertBase from "@/components/base/AlertBase";
import { FiEye, FiEyeOff } from "react-icons/fi";

const UpdatePasswordPage: React.FC = () => {
  const router = useRouter();
  const { email: queryEmail } = router.query;
  const [email, setEmail] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    type: "success" as "success" | "error" | "info" | "warning",
    message: "",
  });

  const dispatch = useDispatch<any>();

  useEffect(() => {
    if (queryEmail && typeof queryEmail === "string") {
      setEmail(queryEmail);
    } else {
      setAlert({
        show: true,
        type: "error",
        message: "Email is missing. Redirecting to login.",
      });
      setTimeout(() => router.push("/login"), 3000);
    }
  }, [queryEmail, router]);

  const handleUpdatePassword = async () => {
    if (!email || !newPassword || !confirmPassword) {
      setAlert({
        show: true,
        type: "error",
        message: "Please fill out all fields.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setAlert({
        show: true,
        type: "error",
        message: "Passwords do not match.",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await dispatch(passwordUpdate({ email, new_password: newPassword }));
      if (passwordUpdate.fulfilled.match(result)) {
        setAlert({
          show: true,
          type: "success",
          message: "Password updated successfully! Redirecting to login...",
        });
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setAlert({
          show: true,
          type: "error",
          message: result.payload || "Failed to update password.",
        });
      }
    } catch (err) {
      console.error(err);
      setAlert({
        show: true,
        type: "error",
        message: "An unexpected error occurred.",
      });
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Password</h2>
          <p className="text-sm text-gray-500 mb-6">
            Enter your new password for <b>{email}</b>
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdatePassword();
            }}
          >
            <div className="mb-4 relative">
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-600"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="new-password"
                  className="w-full p-3 pr-10 border rounded-lg mt-2 focus:ring focus:ring-blue-200 focus:outline-none"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-600"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </span>
              </div>
            </div>
            <div className="mb-4 relative">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-600"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm-password"
                  className="w-full p-3 pr-10 border rounded-lg mt-2 focus:ring focus:ring-blue-200 focus:outline-none"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-600"
                >
                  {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </span>
              </div>
            </div>
            <button
              type="submit"
              className={`w-full bg-[#1a4f9d] text-white py-3 rounded-lg hover:bg-blue-500 hover:bg-opacity-70 transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Updating Password..." : "Update Password"}
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-500 text-center">
            Remembered your password?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-[#1a4f9d] font-semibold cursor-pointer hover:underline"
            >
              Log in
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

export default UpdatePasswordPage;
