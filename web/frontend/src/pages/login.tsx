// src/pages/login.tsx

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useRouter } from "next/router";
import { FiEye, FiEyeOff } from "react-icons/fi";
import AlertBase from "@/components/base/AlertBase";

interface LoginPageProps {
  onSignUp: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSignUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    type: "error" as "success" | "error" | "info" | "warning",
    message: "",
  });

  const dispatch = useDispatch<any>();
  const router = useRouter();
  const { loading, error } = useSelector((state: any) => state.auth);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleAlert = (type: "success" | "error" | "info" | "warning", message: string) => {
    setAlert({ show: false, type, message });
    setTimeout(() => setAlert({ show: true, type, message }), 100);
  };

  // const handleLogin = async () => {
  //   if (!email || !password) {
  //     handleAlert("error", "Email and password are required.");
  //     return;
  //   }
  
  //   try {
  //     const result = await dispatch(login({ email, password }));
  //     if (login.fulfilled.match(result)) {
  //       handleAlert("success", "Login successful! Redirecting...");
  //       localStorage.setItem("accessToken", result.payload); // Ensure token is saved
  //       setTimeout(() => router.push("/home"), 2000); // Redirect to home page
  //     } else {
  //       handleAlert("error", "Invalid credentials. Please try again.");
  //     }
  //   } catch (err) {
  //     console.error("Login error:", err);
  //     handleAlert("error", "An unexpected error occurred.");
  //   }
  // };
  
  const handleLogin = async () => {
    if (!email || !password) {
      handleAlert("error", "Email and password are required.");
      return;
    }
  
    try {
      const result = await dispatch(login({ email, password }));
      if (login.fulfilled.match(result)) {
        handleAlert("success", "Login successful! Redirecting...");
        setTimeout(() => {
          router.push("/home"); // Redirect to the homepage
        }, 1000);
      } else {
        handleAlert("error", "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      handleAlert("error", "An unexpected error occurred.");
    }
  };
  

  // const handleLogin = async () => {
  //   if (!email || !password) {
  //     handleAlert("error", "Email and password are required.");
  //     return;
  //   }
  
  //   try {
  //     const result = await dispatch(login({ email, password }));
  //     if (login.fulfilled.match(result)) {
  //       handleAlert("success", "Login successful! Redirecting...");
  //       setTimeout(() => router.push("/home"), 2000);
  //     } else {
  //       handleAlert("error", "Login failed. Please try again.");
  //     }
  //   } catch (err) {
  //     console.error("Login error:", err);
  //     handleAlert("error", "An unexpected error occurred.");
  //   }
  // };
  
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
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full p-3 border rounded-lg mt-2 focus:ring focus:ring-blue-200 focus:outline-none"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-4 top-9 cursor-pointer text-gray-600"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </span>
            </div>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <button
              type="submit"
              className="w-full bg-[#1a4f9d] text-white py-3 rounded-lg hover:bg-blue-500 hover:bg-opacity-70 transition"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-500 text-center">
            Forgot your password?{" "}
            <span
              onClick={() => router.push("/forgot-password")}
              className="text-[#1a4f9d] font-semibold cursor-pointer hover:underline"
            >
              Reset it
            </span>
          </p>
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


// src/pages/login.tsx

// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { login } from "../features/auth/authSlice";
// import { useRouter } from "next/router";
// import { FiEye, FiEyeOff } from "react-icons/fi";
// import AlertBase from "@/components/base/AlertBase";

// const LoginPage: React.FC = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [alert, setAlert] = useState({
//     show: false,
//     type: "error" as "success" | "error" | "info" | "warning",
//     message: "",
//   });

//   const dispatch = useDispatch<any>();
//   const router = useRouter();
//   const { accessToken, loading, error } = useSelector((state: any) => state.auth);

//   const togglePasswordVisibility = () => setShowPassword(!showPassword);

//   const handleAlert = (type: "success" | "error" | "info" | "warning", message: string) => {
//     setAlert({ show: false, type, message });
//     setTimeout(() => setAlert({ show: true, type, message }), 100);
//   };

//   const handleLogin = async () => {
//     if (!email || !password) {
//       handleAlert("error", "Email and password are required.");
//       return;
//     }

//     try {
//       const result = await dispatch(login({ email, password }));
//       if (login.fulfilled.match(result)) {
//         handleAlert("success", "Login successful! Redirecting...");
//         setTimeout(() => router.push("/"), 2000); // Redirect to home page on successful login
//       }
//     } catch (err) {
//       console.error(err);
//       handleAlert("error", "An unexpected error occurred.");
//     }
//   };

//   useEffect(() => {
//     if (accessToken) {
//       router.push("/"); // Redirect to home if already logged in
//     }
//   }, [accessToken, router]);

//   return (
//     <div className="flex h-screen">
//       {/* Left Section */}
//       <div className="flex flex-col items-center justify-center w-1/2 bg-[#1a4f9d] p-12">
//         <div className="flex items-center space-x-4">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="4em"
//             height="4em"
//             viewBox="0 0 2048 2048"
//             fill="none"
//           >
//             <path
//               fill="white"
//               d="M2048 640h-640V482L691 960l717 478v-158h640v640h-640v-328l-768-512v200H0V640h640v200l768-512V0h640zm-512 768v384h384v-384zM512 1152V768H128v384zM1536 128v384h384V128z"
//             />
//           </svg>
//           <div>
//             <h1 className="text-5xl font-bold text-white">Data Studio</h1>
//             <p className="text-lg text-white mt-2">
//               A full-fledged open-source solution for data labeling
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Right Section */}
//       <div className="flex flex-col justify-center items-center w-1/2 bg-white p-12">
//         <div className="max-w-sm w-full">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Log in</h2>
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               handleLogin();
//             }}
//           >
//             <div className="mb-4">
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-600"
//               >
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 className="w-full p-3 border rounded-lg mt-2 focus:ring focus:ring-blue-200 focus:outline-none"
//                 placeholder="you@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>
//             <div className="mb-4 relative">
//               <label
//                 htmlFor="password"
//                 className="block text-sm font-medium text-gray-600"
//               >
//                 Password
//               </label>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 id="password"
//                 className="w-full p-3 border rounded-lg mt-2 focus:ring focus:ring-blue-200 focus:outline-none"
//                 placeholder="Your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               <span
//                 onClick={togglePasswordVisibility}
//                 className="absolute inset-y-0 right-4 top-9 cursor-pointer text-gray-600"
//               >
//                 {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
//               </span>
//             </div>
//             {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
//             <button
//               type="submit"
//               className="w-full bg-[#1a4f9d] text-white py-3 rounded-lg hover:bg-blue-500 hover:bg-opacity-70 transition"
//               disabled={loading}
//             >
//               {loading ? "Logging in..." : "Log In"}
//             </button>
//           </form>
//           <p className="mt-4 text-sm text-gray-500 text-center">
//             Forgot your password?{" "}
//             <span
//               onClick={() => router.push("/forgot-password")}
//               className="text-[#1a4f9d] font-semibold cursor-pointer hover:underline"
//             >
//               Reset it
//             </span>
//           </p>
//           <p className="mt-4 text-sm text-gray-500 text-center">
//             Don't have an account?{" "}
//             <span
//               onClick={() => router.push("/signup")}
//               className="text-[#1a4f9d] font-semibold cursor-pointer hover:underline"
//             >
//               Sign up
//             </span>
//           </p>
//         </div>
//       </div>

//       {/* Alert */}
//       <AlertBase
//         show={alert.show}
//         type={alert.type}
//         message={alert.message}
//         onClose={() => setAlert({ ...alert, show: false })}
//       />
//     </div>
//   );
// };

// export default LoginPage;





// // src/pages/login.tsx

// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { login } from "../features/auth/authSlice";
// import { useRouter } from "next/router";
// import { FiEye, FiEyeOff } from "react-icons/fi";

// const LoginPage: React.FC = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const dispatch = useDispatch<any>();
//   const router = useRouter();
//   const { accessToken, loading, error } = useSelector((state: any) => state.auth);

//   const togglePasswordVisibility = () => setShowPassword(!showPassword);

//   const handleLogin = async () => {
//     if (!email || !password) {
//       alert("Email and password are required.");
//       return;
//     }

//     const result = await dispatch(login({ email, password }));
//     if (login.fulfilled.match(result)) {
//       router.push("/"); // Redirect to home page on successful login
//     }
//   };

//   useEffect(() => {
//     if (accessToken) {
//       router.push("/"); // Redirect to home if already logged in
//     }
//   }, [accessToken, router]);

//   return (
//     <div className="flex h-screen">
//       {/* Left Section */}
//       <div className="flex flex-col items-center justify-center w-1/2 bg-[#1a4f9d] p-12">
//         <div className="flex items-center space-x-4">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="4em"
//             height="4em"
//             viewBox="0 0 2048 2048"
//             fill="none"
//           >
//             <path
//               fill="white"
//               d="M2048 640h-640V482L691 960l717 478v-158h640v640h-640v-328l-768-512v200H0V640h640v200l768-512V0h640zm-512 768v384h384v-384zM512 1152V768H128v384zM1536 128v384h384V128z"
//             />
//           </svg>
//           <div>
//             <h1 className="text-5xl font-bold text-white">Data Studio</h1>
//             <p className="text-lg text-white mt-2">
//               A full-fledged open-source solution for data labeling
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Right Section */}
//       <div className="flex flex-col justify-center items-center w-1/2 bg-white p-12">
//         <div className="max-w-sm w-full">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Log in</h2>
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               handleLogin();
//             }}
//           >
//             <div className="mb-4">
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-600"
//               >
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 className="w-full p-3 border rounded-lg mt-2 focus:ring focus:ring-blue-200 focus:outline-none"
//                 placeholder="you@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>
//             <div className="mb-4 relative">
//               <label
//                 htmlFor="password"
//                 className="block text-sm font-medium text-gray-600"
//               >
//                 Password
//               </label>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 id="password"
//                 className="w-full p-3 border rounded-lg mt-2 focus:ring focus:ring-blue-200 focus:outline-none"
//                 placeholder="Your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               <span
//                 onClick={togglePasswordVisibility}
//                 className="absolute inset-y-0 right-4 top-9 cursor-pointer text-gray-600"
//               >
//                 {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
//               </span>
//             </div>
//             {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
//             <button
//               type="submit"
//               className="w-full bg-[#1a4f9d] text-white py-3 rounded-lg hover:bg-blue-500 hover:bg-opacity-70 transition"
//               disabled={loading}
//             >
//               {loading ? "Logging in..." : "Log In"}
//             </button>
//           </form>
//           <p className="mt-4 text-sm text-gray-500 text-center">
//             Forgot your password?{" "}
//             <span
//               onClick={() => router.push("/forgot-password")}
//               className="text-[#1a4f9d] font-semibold cursor-pointer hover:underline"
//             >
//               Reset it
//             </span>
//           </p>
//           <p className="mt-4 text-sm text-gray-500 text-center">
//             Don't have an account?{" "}
//             <span
//               onClick={() => router.push("/signup")}
//               className="text-[#1a4f9d] font-semibold cursor-pointer hover:underline"
//             >
//               Sign up
//             </span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { login } from "../features/auth/authSlice";
// import { useRouter } from "next/router";

// interface LoginPageProps {
//   onSignUp?: () => void; // Tambahkan properti opsional
// }

// const LoginPage: React.FC<LoginPageProps> = ({ onSignUp }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const dispatch = useDispatch<any>();
//   const router = useRouter();
//   const { accessToken, loading, error } = useSelector((state: any) => state.auth);

//   const handleLogin = async () => {
//     if (email && password) {
//       const result = await dispatch(login({ email, password }));
//       if (login.fulfilled.match(result)) {
//         router.push("/"); // Redirect ke Home page
//       }
//     }
//   };

//   useEffect(() => {
//     if (accessToken) {
//       router.push("/"); // Redirect ke Home jika sudah login
//     }
//   }, [accessToken, router]);

//   return (
//     <div className="flex h-screen">
//       {/* Left Section */}
//       <div className="flex flex-col items-center justify-center w-1/2 bg-[#1a4f9d] p-12">
//         <div className="flex items-center space-x-4">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="4em"
//             height="4em"
//             viewBox="0 0 2048 2048"
//             fill="none"
//           >
//             <rect width="2048" height="2048" fill="none" />
//             <path
//               fill="white"
//               d="M2048 640h-640V482L691 960l717 478v-158h640v640h-640v-328l-768-512v200H0V640h640v200l768-512V0h640zm-512 768v384h384v-384zM512 1152V768H128v384zM1536 128v384h384V128z"
//             />
//           </svg>
//           <div>
//             <h1 className="text-5xl font-bold text-white">Data Studio</h1>
//             <p className="text-lg text-white mt-2">
//               A full-fledged open-source solution for data labeling
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Right Section */}
//       <div className="flex flex-col justify-center items-center w-1/2 bg-white p-12">
//         <div className="max-w-sm w-full">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Log in</h2>
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               handleLogin();
//             }}
//           >
//             <div className="mb-4">
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-600"
//               >
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 className="w-full p-3 border rounded-lg mt-2 focus:ring focus:ring-blue-200 focus:outline-none"
//                 placeholder="you@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>
//             <div className="mb-4">
//               <label
//                 htmlFor="password"
//                 className="block text-sm font-medium text-gray-600"
//               >
//                 Password
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 className="w-full p-3 border rounded-lg mt-2 focus:ring focus:ring-blue-200 focus:outline-none"
//                 placeholder="Your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//             {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
//             <button
//               type="submit"
//               className="w-full bg-[#1a4f9d] text-white py-3 rounded-lg hover:bg-blue-500 hover:bg-opacity-70 transition"
//               disabled={loading}
//             >
//               {loading ? "Logging in..." : "Log In"}
//             </button>
//           </form>
//           <p className="mt-4 text-sm text-gray-500 text-center">
//             Don't have an account?{" "}
//             <span
//               onClick={onSignUp}
//               className="text-[#1a4f9d] font-semibold cursor-pointer hover:underline"
//             >
//               Sign up
//             </span>
//           </p>
//           {onSignUp && (
//             <p className="mt-4 text-sm text-gray-500 text-center">
//               Don't have an account?{" "}
//               <span
//                 onClick={onSignUp}
//                 className="text-[#1a4f9d] font-semibold cursor-pointer hover:underline"
//               >
//                 Sign up
//               </span>
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;