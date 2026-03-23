import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LuUser, LuMail, LuLock } from "react-icons/lu";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import Swal from "sweetalert2";

import registerLogo from "../../assets/loginLogo.jpg";
import { useAuth } from "../../hooks/Auth/useAuth";
import useAxios from "../../hooks/Axios/useAxios";

// Zod schema including photo validation
const registerSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm password is required" }),
    photo: z.any().refine((file) => file?.length === 1, {
      message: "Profile photo is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const Register = () => {
  const { createUser, googleLogin } = useAuth();
  const navigate = useNavigate();
  const instance = useAxios();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  // Handle form submit
  const onSubmit = async (data) => {
    try {
      const photoFile = data.photo[0]; // Get File object
      const result = await createUser(
        data.name,
        data.email,
        data.password,
        photoFile,
      );
      const user = result.user;

      const userInfo = {
        name: data.name,
        email: user.email,
        photo: user.photoURL || "",
        role: "user",
        createdAt: new Date(),
      };

      await instance.post("/user", userInfo);

      Swal.fire({
        icon: "success",
        title: "Account Created",
        text: `Welcome ${data.name}!`,
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message,
      });
    }
  };

  // Google login
  const handleGoogleRegister = async () => {
    try {
      const result = await googleLogin();
      const user = result.user;

      const userInfo = {
        name: user.displayName || "No Name",
        email: user.email,
        photo: user.photoURL || "",
        role: "user",
        createdAt: new Date(),
      };

      await instance.post("/user", userInfo);

      Swal.fire({
        icon: "success",
        title: "Welcome!",
        text: `Hello ${user.displayName || "User"}`,
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
    <div className="flex items-center justify-center py-10 px-4 bg-gray-50 dark:bg-slate-900 rounded-4xl mt-10">
      <div className="max-w-5xl flex overflow-hidden rounded-xl shadow-xl bg-white dark:bg-slate-800 transition">
        {/* Left Image */}
        <div className="w-1/2 hidden md:block">
          <img
            className="w-full h-full object-cover"
            src={registerLogo}
            alt="Register"
          />
        </div>

        {/* Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-10">
          <div className="w-full max-w-sm space-y-6">
            <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
              Create Account
            </h1>

            <form
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {/* Name */}
              <div className="relative">
                <LuUser className="absolute top-3.5 left-3 text-gray-400 dark:text-gray-300" />
                <input
                  type="text"
                  placeholder="Name"
                  {...formRegister("name")}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent text-gray-800 dark:text-gray-100"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="relative">
                <LuMail className="absolute top-3.5 left-3 text-gray-400 dark:text-gray-300" />
                <input
                  type="email"
                  placeholder="Email"
                  {...formRegister("email")}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent text-gray-800 dark:text-gray-100"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <LuLock className="absolute top-3.5 left-3 text-gray-400 dark:text-gray-300" />
                <input
                  type="password"
                  placeholder="Password"
                  {...formRegister("password")}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent text-gray-800 dark:text-gray-100"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <LuLock className="absolute top-3.5 left-3 text-gray-400 dark:text-gray-300" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  {...formRegister("confirmPassword")}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent text-gray-800 dark:text-gray-100"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Profile Photo */}
              <div className="relative">
                <label
                  htmlFor="photo"
                  className="flex items-center gap-2 w-full cursor-pointer px-3 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LuUser className="text-gray-400 dark:text-gray-300" />
                  <span>
                    {formRegister("photo")[0]?.name || "Upload Profile Photo"}
                  </span>
                  <input
                    id="photo"
                    type="file"
                    accept="image/*"
                    {...formRegister("photo")}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </label>
                {errors.photo && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.photo.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-[#ACD487] hover:bg-[#9BCB75] text-gray-900 font-semibold transition"
              >
                Register
              </button>
            </form>

            {/* OR Divider */}
            <div className="flex items-center">
              <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
              <span className="px-3 text-sm text-gray-500 dark:text-gray-300">
                OR
              </span>
              <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogleRegister}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FcGoogle size={20} />
              <span className="text-gray-800 dark:text-gray-100 font-medium">
                Continue with Google
              </span>
            </button>

            {/* Login Link */}
            <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#ACD487] dark:text-[#9BCB75] font-semibold hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
