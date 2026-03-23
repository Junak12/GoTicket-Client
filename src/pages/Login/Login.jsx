import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LuMail, LuLock } from "react-icons/lu";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import Swal from "sweetalert2"; 

import loginLogo from "../../assets/loginLogo.jpg";
import { useAuth } from "../../hooks/Auth/useAuth";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const Login = () => {
  const { signInUser, googleLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });


  const onSubmit = async (data) => {
    try {
      Swal.fire({
        title: "Logging in...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const result = await signInUser(data.email, data.password);

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: `Welcome back ${result.user?.email}`,
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message,
      });
    }
  };


  const handleGoogleLogin = async () => {
    try {
      Swal.fire({
        title: "Signing in with Google...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const result = await googleLogin();

      Swal.fire({
        icon: "success",
        title: "Welcome!",
        text: `Hello ${result.user?.displayName || "User"}`,
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Google Login Failed",
        text: error.message,
      });
    }
  };

  return (
    <div className="mt-10 flex items-center justify-center bg-[#ACD487]/20 py-30 px-4 rounded-4xl">
      <div className="max-w-5xl flex overflow-hidden rounded-xl shadow-xl bg-white dark:bg-[#ACD487] transition">
        {/* LEFT IMAGE */}
        <div className="w-1/2 hidden md:block">
          <img
            className="w-full h-full object-cover"
            src={loginLogo}
            alt="Login"
          />
        </div>

        {/* RIGHT FORM */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-10">
          <div className="w-full max-w-sm space-y-6">
            <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-black">
              Welcome Back
            </h1>

            <form
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {/* Email */}
              <div className="relative">
                <LuMail className="absolute top-3.5 left-3 text-gray-400 dark:text-black/70" />
                <input
                  type="email"
                  placeholder="Email"
                  {...register("email")}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-black/30 bg-transparent text-gray-900 dark:text-black focus:outline-none focus:ring-2 focus:ring-[#ACD487]"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <LuLock className="absolute top-3.5 left-3 text-gray-400 dark:text-black/70" />
                <input
                  type="password"
                  placeholder="Password"
                  {...register("password")}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-black/30 bg-transparent text-gray-900 dark:text-black focus:outline-none focus:ring-2 focus:ring-[#ACD487]"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-[#ACD487] hover:bg-[#9BCB75] text-gray-900 font-semibold"
              >
                Login
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center">
              <div className="flex-1 h-px bg-gray-300 dark:bg-black/30"></div>
              <span className="px-3 text-sm text-gray-500 dark:text-black">
                OR
              </span>
              <div className="flex-1 h-px bg-gray-300 dark:bg-black/30"></div>
            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-lg border border-gray-300 dark:border-black/30 hover:bg-gray-100 dark:hover:bg-[#9BCB75]"
            >
              <FcGoogle size={20} />
              <span className="text-gray-800 dark:text-black font-medium">
                Continue with Google
              </span>
            </button>

            {/* Register */}
            <p className="text-center text-gray-600 dark:text-black text-sm">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-[#ACD487] dark:text-black font-semibold hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
