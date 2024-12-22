// src/pages/login.tsx

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useRouter } from "next/router";
import { FiEye, FiEyeOff } from "react-icons/fi";
import AlertBase from "@/components/base/AlertBase";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    type: "error" as "success" | "error" | "info" | "warning",
    message: "",
  });
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useDispatch<any>();
  const router = useRouter();
  const { loading, error } = useSelector((state: any) => state.auth);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSignUp = () => {
    router.push("/signup");
  };

  const handleAlert = (
    type: "success" | "error" | "info" | "warning",
    message: string
  ) => {
    setAlert({ show: false, type, message });
    setTimeout(() => setAlert({ show: true, type, message }), 100);
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true); // Set checkbox ke true jika email ditemukan
    }
  }, []);

  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      handleAlert("error", "Email and password are required.");
      return;
    }

    try {
      const result = await dispatch(login({ email, password }));

      if (result.meta.requestStatus === "fulfilled") {
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        handleAlert("success", "Login successful! Redirecting...");
        setTimeout(() => {
          router.push("/home");
        }, 1000);
      } else {
        handleAlert(
          "error",
          result.payload || "Login failed. Please try again."
        );
      }
    } catch (err) {
      console.error("Login error:", err);
      handleAlert("error", "An unexpected error occurred.");
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Log in</h2>
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <span
              onClick={handleSignUp}
              className="text-blue-600 font-semibold text-sm cursor-pointer hover:underline"
            >
              Sign up
            </span>
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 border rounded-lg mt-2 focus:ring focus:ring-blue-200 focus:outline-none"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4 relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full p-3 pr-10 border rounded-lg mt-2 focus:ring focus:ring-blue-200 focus:outline-none"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-600"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </span>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe} // Hubungkan dengan state
                  onChange={handleRememberMeChange} // Tangani perubahan
                  className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-md"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-3 block text-sm text-gray-800"
                >
                  Remember me
                </label>
              </div>
              <div>
                <a
                  onClick={() => router.push("/forgot-password")}
                  className="text-blue-600 font-semibold text-sm cursor-pointer hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-[#1a4f9d] text-white py-3 rounded-lg hover:bg-blue-500 hover:bg-opacity-70 transition"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>
          <div className="my-4 flex items-center gap-4">
            <hr className="w-full border-gray-300" />
            <p className="text-sm text-gray-800 text-center">or</p>
            <hr className="w-full border-gray-300" />
          </div>
          <div className="space-x-6 flex justify-center mt-6">
            <button type="button" className="border-none outline-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32px"
                className="inline"
                viewBox="0 0 512 512"
              >
                <path
                  fill="#fbbd00"
                  d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z"
                  data-original="#fbbd00"
                />
                <path
                  fill="#0f9d58"
                  d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z"
                  data-original="#0f9d58"
                />
                <path
                  fill="#31aa52"
                  d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z"
                  data-original="#31aa52"
                />
                <path
                  fill="#3c79e6"
                  d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z"
                  data-original="#3c79e6"
                />
                <path
                  fill="#cf2d48"
                  d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z"
                  data-original="#cf2d48"
                />
                <path
                  fill="#eb4132"
                  d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z"
                  data-original="#eb4132"
                />
              </svg>
            </button>
            <button type="button" className="border-none outline-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32px"
                fill="#000"
                viewBox="0 0 22.773 22.773"
              >
                <path
                  d="M15.769 0h.162c.13 1.606-.483 2.806-1.228 3.675-.731.863-1.732 1.7-3.351 1.573-.108-1.583.506-2.694 1.25-3.561C13.292.879 14.557.16 15.769 0zm4.901 16.716v.045c-.455 1.378-1.104 2.559-1.896 3.655-.723.995-1.609 2.334-3.191 2.334-1.367 0-2.275-.879-3.676-.903-1.482-.024-2.297.735-3.652.926h-.462c-.995-.144-1.798-.932-2.383-1.642-1.725-2.098-3.058-4.808-3.306-8.276v-1.019c.105-2.482 1.311-4.5 2.914-5.478.846-.52 2.009-.963 3.304-.765.555.086 1.122.276 1.619.464.471.181 1.06.502 1.618.485.378-.011.754-.208 1.135-.347 1.116-.403 2.21-.865 3.652-.648 1.733.262 2.963 1.032 3.723 2.22-1.466.933-2.625 2.339-2.427 4.74.176 2.181 1.444 3.457 3.028 4.209z"
                  data-original="#000000"
                ></path>
              </svg>
            </button>
            <button type="button" className="border-none outline-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32px"
                fill="#007bff"
                viewBox="0 0 167.657 167.657"
              >
                <path
                  d="M83.829.349C37.532.349 0 37.881 0 84.178c0 41.523 30.222 75.911 69.848 82.57v-65.081H49.626v-23.42h20.222V60.978c0-20.037 12.238-30.956 30.115-30.956 8.562 0 15.92.638 18.056.919v20.944l-12.399.006c-9.72 0-11.594 4.618-11.594 11.397v14.947h23.193l-3.025 23.42H94.026v65.653c41.476-5.048 73.631-40.312 73.631-83.154 0-46.273-37.532-83.805-83.828-83.805z"
                  data-original="#010002"
                ></path>
              </svg>
            </button>
          </div>
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

export default LoginPage;
