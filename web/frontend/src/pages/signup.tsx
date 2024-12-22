// src/pages/signup.tsx

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../features/auth/authSlice";
import { RootState } from "../store/store";
import { useRouter } from "next/router";
import { FiEye, FiEyeOff } from "react-icons/fi";
import AlertBase from "@/components/base/AlertBase";

interface SignUpPageProps {
  onBackToLogin: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    type: "info" as "success" | "error" | "warning" | "info",
    message: "",
  });

  const dispatch = useDispatch<any>();
  const router = useRouter();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleAlert = (type: "success" | "error" | "warning" | "info", message: string) => {
    setAlert({ show: false, type, message });
    setTimeout(() => setAlert({ show: true, type, message }), 100);
  };

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      handleAlert("warning", "All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      handleAlert("error", "Passwords do not match!");
      return;
    }

    try {
      const result = await dispatch(register({ email, password, confirm_password: confirmPassword }));
      if (register.fulfilled.match(result)) {
        handleAlert("success", "Account created successfully! Redirecting...");
        setTimeout(() => {
          router.push({
            pathname: "/verify-code",
            query: { email },
          });
        }, 3000);
      } else {
        handleAlert("error", result.payload || "Registration failed.");
      }
    } catch (err) {
      console.error(err);
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign Up</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignUp();
            }}
          >
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-600">
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
            <div className="mb-4 relative">
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-600">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                className="w-full p-3 border rounded-lg mt-2 focus:ring focus:ring-blue-200 focus:outline-none"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                onClick={toggleConfirmPasswordVisibility}
                className="absolute inset-y-0 right-4 top-9 cursor-pointer text-gray-600"
              >
                {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </span>
            </div>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <button
              type="submit"
              className="w-full bg-[#1a4f9d] text-white py-3 rounded-lg hover:bg-blue-500 hover:bg-opacity-70 transition"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-500 text-center">
            Already have an account?{" "}
            <span
              onClick={onBackToLogin}
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

export default SignUpPage;


// // src/pages/signup.tsx

// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { register } from "../features/auth/authSlice";
// import { FiEye, FiEyeOff } from "react-icons/fi";

// interface SignUpPageProps {
//   onBackToLogin: () => void;
// }

// const SignUpPage: React.FC<SignUpPageProps> = ({ onBackToLogin }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const dispatch = useDispatch<any>();
//   const { loading, error } = useSelector((state: any) => state.auth);

//   const togglePasswordVisibility = () => setShowPassword(!showPassword);
//   const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

//   const handleSignUp = async () => {
//     if (!email || !password || !confirmPassword) {
//       alert("All fields are required.");
//       return;
//     }

//     if (password !== confirmPassword) {
//       alert("Passwords do not match.");
//       return;
//     }

//     const result = await dispatch(register({ email, password, confirm_password: confirmPassword }));
//     if (register.fulfilled.match(result)) {
//       alert("Account created successfully! Please check your email for verification.");
//       onBackToLogin(); // Navigate back to login
//     }
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Left Section */}
//       <div className="flex flex-col items-center justify-center w-1/2 bg-[#1a4f9d] p-12">
//         <div className="flex items-center space-x-4">
//           <h1 className="text-5xl font-bold text-white">Data Studio</h1>
//         </div>
//       </div>

//       {/* Right Section */}
//       <div className="flex flex-col justify-center items-center w-1/2 bg-white p-12">
//         <div className="max-w-sm w-full">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign Up</h2>
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               handleSignUp();
//             }}
//           >
//             <div className="mb-4">
//               <label htmlFor="email" className="block text-sm font-medium text-gray-600">
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
//               <label htmlFor="password" className="block text-sm font-medium text-gray-600">
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
//             <div className="mb-4 relative">
//               <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-600">
//                 Confirm Password
//               </label>
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 id="confirm-password"
//                 className="w-full p-3 border rounded-lg mt-2 focus:ring focus:ring-blue-200 focus:outline-none"
//                 placeholder="Confirm your password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//               />
//               <span
//                 onClick={toggleConfirmPasswordVisibility}
//                 className="absolute inset-y-0 right-4 top-9 cursor-pointer text-gray-600"
//               >
//                 {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
//               </span>
//             </div>
//             {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
//             <button
//               type="submit"
//               className="w-full bg-[#1a4f9d] text-white py-3 rounded-lg hover:bg-blue-500 hover:bg-opacity-70 transition"
//               disabled={loading}
//             >
//               {loading ? "Signing up..." : "Sign Up"}
//             </button>
//           </form>
//           <p className="mt-4 text-sm text-gray-500 text-center">
//             Already have an account?{" "}
//             <span
//               onClick={onBackToLogin}
//               className="text-[#1a4f9d] font-semibold cursor-pointer hover:underline"
//             >
//               Log in
//             </span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUpPage;


// // src/pages/signup.tsx

// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { register } from "../features/auth/authSlice";
// import { RootState } from "../store/store";
// import { useRouter } from "next/router";
// import { FiEye, FiEyeOff } from "react-icons/fi";
// import AlertBase from "@/components/base/AlertBase";

// const SignUpPage: React.FC = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertType, setAlertType] = useState<"success" | "error" | "warning" | "info">("info");
//   const [alertMessage, setAlertMessage] = useState("");

//   const dispatch = useDispatch<any>();
//   const router = useRouter();
//   const { loading, error } = useSelector((state: RootState) => state.auth);

//   const togglePasswordVisibility = () => setShowPassword(!showPassword);
//   const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

//   const handleAlert = (type: "success" | "error" | "warning" | "info", message: string) => {
//     setAlertType(type);
//     setAlertMessage(message);
//     setShowAlert(false); // Reset state
//     setTimeout(() => {
//       setShowAlert(true); // Show alert
//     }, 100);
//   };

//   const handleSignUp = async () => {
//     if (!email || !password || !confirmPassword) {
//       handleAlert("warning", "All fields are required!");
//       return;
//     }

//     if (password !== confirmPassword) {
//       handleAlert("error", "Passwords do not match!");
//       return;
//     }

//     try {
//       const result = await dispatch(
//         register({ email, password, confirm_password: confirmPassword })
//       );

//       if (register.fulfilled.match(result)) {
//         handleAlert("success", "Account created successfully! Redirecting...");
//         setTimeout(() => {
//           router.push({
//             pathname: "/verify-code",
//             query: { email },
//           });
//         }, 3000);
//       } else {
//         handleAlert("error", result.payload || "Registration failed.");
//       }
//     } catch (err) {
//       console.error(err);
//       handleAlert("error", "An unexpected error occurred.");
//     }
//   };

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
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign Up</h2>
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               handleSignUp();
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
//             <div className="mb-4 relative">
//               <label
//                 htmlFor="confirm-password"
//                 className="block text-sm font-medium text-gray-600"
//               >
//                 Confirm Password
//               </label>
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 id="confirm-password"
//                 className="w-full p-3 border rounded-lg mt-2 focus:ring focus:ring-blue-200 focus:outline-none"
//                 placeholder="Confirm your password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//               />
//               <span
//                 onClick={toggleConfirmPasswordVisibility}
//                 className="absolute inset-y-0 right-4 top-9 cursor-pointer text-gray-600"
//               >
//                 {showConfirmPassword ? (
//                   <FiEyeOff size={20} />
//                 ) : (
//                   <FiEye size={20} />
//                 )}
//               </span>
//             </div>
//             {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
//             <button
//               type="submit"
//               className="w-full bg-[#1a4f9d] text-white py-3 rounded-lg hover:bg-blue-500 hover:bg-opacity-70 transition"
//               disabled={loading}
//             >
//               {loading ? "Signing up..." : "Sign Up"}
//             </button>
//           </form>
//           <p className="mt-4 text-sm text-gray-500 text-center">
//             Already have an account?{" "}
//             <span
//               onClick={() => router.push("/login")}
//               className="text-[#1a4f9d] font-semibold cursor-pointer hover:underline"
//             >
//               Log in
//             </span>
//           </p>
//         </div>
//       </div>

//       {/* Alert */}
//       <AlertBase
//         show={showAlert}
//         type={alertType}
//         message={alertMessage}
//         onClose={() => setShowAlert(false)}
//       />
//     </div>
//   );
// };

// export default SignUpPage;