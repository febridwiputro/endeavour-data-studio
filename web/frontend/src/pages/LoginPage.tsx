import React, { useState } from "react";

const LoginPage: React.FC<{ onLogin: () => void; onSignUp: () => void }> = ({
  onLogin,
  onSignUp,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Perform login validation here if needed
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="flex flex-col items-center justify-center w-1/2 bg-[#1a4f9d] p-12">
        <div className="flex items-center space-x-4">
          {/* Updated Logo */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="4em"
            height="4em"
            viewBox="0 0 2048 2048"
            fill="none"
          >
            <rect width="2048" height="2048" fill="none" />
            <path
              fill="white"
              d="M2048 640h-640V482L691 960l717 478v-158h640v640h-640v-328l-768-512v200H0V640h640v200l768-512V0h640zm-512 768v384h384v-384zM512 1152V768H128v384zM1536 128v384h384V128z"
            />
          </svg>
          {/* Text Section */}
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
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-3 border rounded-lg mt-2 focus:ring focus:ring-blue-200 focus:outline-none"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#1a4f9d] text-white py-3 rounded-lg hover:bg-blue-500 hover:bg-opacity-70 transition"
            >
              Log In
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-500 text-center">
            Don't have an account?{" "}
            <span
              onClick={onSignUp}
              className="text-[#1a4f9d] font-semibold cursor-pointer hover:underline"
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
