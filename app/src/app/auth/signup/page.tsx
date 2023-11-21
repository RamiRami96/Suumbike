"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";

import { signUp } from "../../../services/auth/signUp";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Wallpaper from "../components/wallpaper";

import { validateAvatar } from "@/utils/validateAvatar";
import { validateAge } from "@/utils/validateAge";
import { calculateAge } from "@/utils/calculateAge";

type FieldValues = {
  name: string;
  age: string;
  sex: "male" | "female";
  password: string;
  tgNickname: string;
  avatar: File | null;
};

export default function Page() {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FieldValues>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: FieldValues) => {
    if (!data.avatar) return;

    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("age", String(calculateAge(data.age)));
    formData.append("tgNickname", data.tgNickname);
    formData.append("sex", data.sex);
    formData.append("password", data.password);
    formData.append("avatar", data.avatar);

    const response = await signUp(formData);

    if (typeof response === "string") {
      setError(response);
    } else {
      setError("");
      setLoading(true);
      router.push("/auth/signin");
    }
  };

  return (
    <section className="flex justify-center">
      <Wallpaper />
      <div className="w-5/6 md:w-3/6 flex justify-center mt-8 mb-8">
        <div className="flex flex-col items-center w-full md:w-2/3">
          <h4 className="text-center mb-4 text-pink-400">Sign up</h4>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div>
              <Controller
                rules={{
                  required: "This field is required",
                  minLength: {
                    value: 2,
                    message: "Minimum number of letters is 2",
                  },
                  maxLength: {
                    value: 15,
                    message: "Maximum number of letters is 15",
                  },
                }}
                name="name"
                control={control}
                render={({ field }) => (
                  <input
                    className={
                      "form-control block w-full px-4 py-4 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-pink-400 focus:outline-none"
                    }
                    placeholder="Name"
                    {...field}
                    aria-label="Name"
                    aria-invalid={errors.name ? "true" : "false"}
                  />
                )}
              />
              <div
                role="alert"
                className={"text-red-500 text-xs h-8 flex items-center"}
              >
                {errors.name?.message || ""}
              </div>
            </div>
            <div>
              <Controller
                name="age"
                control={control}
                rules={{
                  required: "This field is required",
                  validate: validateAge,
                }}
                render={({ field }) => (
                  <input
                    type="date"
                    className={
                      "form-control block w-full px-4 py-4 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-pink-400 focus:outline-none"
                    }
                    placeholder="Date of Birth"
                    {...field}
                    aria-label="Date of Birth"
                    aria-invalid={errors.age ? "true" : "false"}
                  />
                )}
              />
              <div
                role="alert"
                className={"text-red-500 text-xs h-8 flex items-center"}
              >
                {errors.age?.message || ""}
              </div>
            </div>
            <div>
              <Controller
                rules={{
                  required: "This field is required",
                  maxLength: {
                    value: 15,
                    message: "Maximum number of letters is 15",
                  },
                }}
                name="tgNickname"
                control={control}
                render={({ field }) => (
                  <input
                    className={
                      "form-control block w-full px-4 py-4 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-pink-400 focus:outline-none"
                    }
                    placeholder="Telegram Nickname"
                    {...field}
                    aria-label="Telegram Nickname"
                    aria-invalid={errors.tgNickname ? "true" : "false"}
                  />
                )}
              />
              <div
                role="alert"
                className={"text-red-500 text-xs h-8 flex items-center"}
              >
                {errors.tgNickname?.message || ""}
              </div>
            </div>
            <div>
              <Controller
                rules={{
                  required: "This field is required",
                }}
                name="sex"
                control={control}
                render={({ field }) => (
                  <select
                    className="form-select block w-full px-4 py-4 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-pink-400 focus:outline-none"
                    aria-label="Select sex"
                    {...field}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                )}
              />
              <div
                role="alert"
                className={"text-red-500 text-xs h-8 flex items-center"}
              >
                {errors.sex?.message || ""}
              </div>
            </div>
            <div>
              <Controller
                name="password"
                rules={{
                  required: "This field is required",
                  minLength: {
                    value: 8,
                    message: "Minimum number of letters is 8",
                  },
                  maxLength: {
                    value: 15,
                    message: "Maximum number of letters is 15",
                  },
                }}
                control={control}
                render={({ field }) => (
                  <input
                    type="password"
                    className={
                      "form-control block w-full px-4 py-4 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-pink-400 focus:outline-none"
                    }
                    placeholder="Password"
                    {...field}
                    aria-label="Password"
                    aria-invalid={errors.password ? "true" : "false"}
                  />
                )}
              />
              <div
                role="alert"
                className={"text-red-500 text-xs h-8 flex items-center"}
              >
                {errors.password?.message || ""}
              </div>
            </div>
            <div>
              <Controller
                name="avatar"
                control={control}
                rules={{
                  required: "This field is required",
                  validate: validateAvatar,
                }}
                render={({ field }) => (
                  <div className="flex items-center">
                    <label
                      className="text-sm font-medium text-gray-700 cursor-pointer bg-white py-4 px-4 rounded border border-gray-300 shadow-sm hover:bg-blue-100 transition duration-300 w-full"
                      htmlFor="avatar"
                    >
                      {field.value?.name ? field.value.name : "Upload Avatar"}
                    </label>
                    <input
                      id="avatar"
                      className="hidden"
                      type="file"
                      accept=".png, .jpg, .jpeg"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                      aria-label="Avatar"
                      aria-invalid={errors.avatar ? "true" : "false"}
                    />
                  </div>
                )}
              />
              <div
                role="alert"
                className={"text-red-500 text-xs h-8 flex items-center"}
              >
                {error ?? (errors.avatar?.message || "")}
              </div>
            </div>
            <button
              disabled={isSubmitting || loading}
              type="submit"
              className="bg-pink-400 disabled:bg-pink-300 hover:bg-pink-400 text-white py-3 px-4 rounded transition duration-300 w-full mt-1"
            >
              Sign Up
            </button>
          </form>
          <div className="text-sm mt-4">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-pink-400">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
