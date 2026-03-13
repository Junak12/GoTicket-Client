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
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });


const Register = () => {
  const { createUser, googleLogin } = useAuth();
  const navigate = useNavigate();
  const axios = useAxios();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });


  const onSubmit = async (data) => {
    try {
      const result = await createUser(data.name, data.email, data.password);
      const user = result.user;

      const userInfo = {
        name: data.name,
        email: user.email,
        photo: user.photoURL || "",
        role: "user",
        createdAt: new Date(),
      };

      await axios.post("/user", userInfo);

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

      await axios.post("/user", userInfo);

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
    <div className="mt-10 flex items-center justify-center bg-[#ACD487]/20 py-10 px-4 rounded-4xl">
      <div className="max-w-5xl flex overflow-hidden rounded-xl shadow-xl bg-white dark:bg-[#ACD487] transition">

        <div className="w-1/2 hidden md:block">
          <img
            className="w-full h-full object-cover"
            src={registerLogo}
            alt="Register"
          />
        </div>


        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-10">
          <div className="w-full max-w-sm space-y-6">
            <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-black">
              Create Account
            </h1>


            <form
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >

              <div className="relative">
                <LuUser className="absolute top-3.5 left-3 text-gray-400 dark:text-black/70" />
                <input
                  type="text"
                  placeholder="Name"
                  {...formRegister("name")}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-black/30 bg-transparent"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>


              <div className="relative">
                <LuMail className="absolute top-3.5 left-3 text-gray-400 dark:text-black/70" />
                <input
                  type="email"
                  placeholder="Email"
                  {...formRegister("email")}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-black/30 bg-transparent"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>


              <div className="relative">
                <LuLock className="absolute top-3.5 left-3 text-gray-400 dark:text-black/70" />
                <input
                  type="password"
                  placeholder="Password"
                  {...formRegister("password")}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-black/30 bg-transparent"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <LuLock className="absolute top-3.5 left-3 text-gray-400 dark:text-black/70" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  {...formRegister("confirmPassword")}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-black/30 bg-transparent"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-[#ACD487] hover:bg-[#9BCB75] text-gray-900 font-semibold"
              >
                Register
              </button>
            </form>


            <div className="flex items-center">
              <div className="flex-1 h-px bg-gray-300 dark:bg-black/30"></div>
              <span className="px-3 text-sm text-gray-500 dark:text-black">
                OR
              </span>
              <div className="flex-1 h-px bg-gray-300 dark:bg-black/30"></div>
            </div>


            <button
              onClick={handleGoogleRegister}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-lg border border-gray-300 dark:border-black/30 hover:bg-gray-100 dark:hover:bg-[#9BCB75]"
            >
              <FcGoogle size={20} />
              <span className="text-gray-800 dark:text-black font-medium">
                Continue with Google
              </span>
            </button>


            <p className="text-center text-gray-600 dark:text-black text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#ACD487] dark:text-black font-semibold hover:underline"
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
