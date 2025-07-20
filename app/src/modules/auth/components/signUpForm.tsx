"use client";

import { useForm, Controller } from "react-hook-form";
import { signUp } from "@/modules/auth/services/signUp";
import { useRouter } from "next/navigation";
import Wallpaper from "@/modules/auth/components/wallpaper";
import { validateAvatar } from "@/modules/auth/helpers/validateAvatar";
import { validateAge } from "@/modules/auth/helpers/validateAge";
import { calculateAge } from "@/modules/auth/helpers/calculateAge";
import { useErrorState } from "@/modules/auth/hooks/useErrorState";
import { ERROR_MESSAGE } from "@/modules/auth/const/errors.const";
import Link from "next/link";

// Form field types
 type FieldValues = {
  name: string;
  age: string;
  sex: "male" | "female";
  password: string;
  tgNickname: string;
  avatar: File | null;
};

export default function SignUpForm() {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FieldValues>();
  const { error, setError, loading, setLoading } = useErrorState();
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
          <h4 className="text-center mb-4 text-pink-600">Sign up</h4>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div>
              <Controller
                rules={{
                  required: ERROR_MESSAGE.REQUIRED_FIELD,
                  minLength: {
                    value: 2,
                    message: ERROR_MESSAGE.MIN_LENGTH_2,
                  },
                  maxLength: {
                    value: 15,
                    message: ERROR_MESSAGE.MAX_LENGTH_15,
                  },
                }}
                name="name"
                control={control}
                render={({ field }) => (
                  <input
                    className={
                      "form-control block w-full px-4 py-4 text-sm font-normal bg-clip-padding border rounded transition ease-in-out m-0 focus:outline-none bg-dark-purple border-pink-600 text-white placeholder:text-white focus:border-pink-700"
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
                  required: ERROR_MESSAGE.REQUIRED_FIELD,
                  validate: validateAge,
                }}
                render={({ field }) => (
                  <input
                    type="date"
                    className={
                      "form-control block w-full px-4 py-4 text-sm font-normal bg-clip-padding border rounded transition ease-in-out m-0 focus:outline-none bg-dark-purple border-pink-600 text-white placeholder:text-white focus:border-pink-700"
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
                  required: ERROR_MESSAGE.REQUIRED_FIELD,
                  maxLength: {
                    value: 15,
                    message: ERROR_MESSAGE.MAX_LENGTH_15,
                  },
                }}
                name="tgNickname"
                control={control}
                render={({ field }) => (
                  <input
                    className={
                      "form-control block w-full px-4 py-4 text-sm font-normal bg-clip-padding border rounded transition ease-in-out m-0 focus:outline-none bg-dark-purple border-pink-600 text-white placeholder:text-white focus:border-pink-700"
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
                  required: ERROR_MESSAGE.REQUIRED_FIELD,
                }}
                name="sex"
                control={control}
                render={({ field }) => (
                  <select
                    className="form-select block w-full px-4 py-4 text-sm font-normal bg-clip-padding border rounded transition ease-in-out m-0 focus:outline-none bg-dark-purple border-pink-600 text-white placeholder:text-white focus:border-pink-700"
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
                  required: ERROR_MESSAGE.REQUIRED_FIELD,
                  minLength: {
                    value: 8,
                    message: ERROR_MESSAGE.MIN_LENGTH_8,
                  },
                  maxLength: {
                    value: 15,
                    message: ERROR_MESSAGE.MAX_LENGTH_15,
                  },
                }}
                control={control}
                render={({ field }) => (
                  <input
                    type="password"
                    className={
                      "form-control block w-full px-4 py-4 text-sm font-normal bg-clip-padding border rounded transition ease-in-out m-0 focus:outline-none bg-dark-purple border-pink-600 text-white placeholder:text-white focus:border-pink-700"
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
                  required: ERROR_MESSAGE.REQUIRED_FIELD,
                  validate: validateAvatar,
                }}
                render={({ field }) => (
                  <div className="flex items-center">
                    <label
                      className="text-sm font-medium text-white cursor-pointer bg-dark-purple py-4 px-4 rounded border border-pink-600 shadow-sm transition duration-300 w-full"
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
              className="bg-pink-600 disabled:bg-pink-300 hover:bg-pink-600 text-white py-3 px-4 rounded transition duration-300 w-full mt-1"
            >
              Sign Up
            </button>
          </form>
          <div className="text-sm mt-4">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-pink-600">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 