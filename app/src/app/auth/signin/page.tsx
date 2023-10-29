"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm, Controller } from "react-hook-form";
import { error_style, input_style } from "../helpers";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Wallpaper from "../components/wallpaper";

type FieldValues = {
  tgNickname: string;
  password: string;
};

export default function Page() {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FieldValues>();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (formData: FieldValues) => {
    try {
      const res = await signIn("credentials", {
        redirect: false,
        tgNickname: formData.tgNickname,
        password: formData.password,
      });

      if (res?.error) {
        setError("Nickname or password is wrong");
      } else {
        setLoading(true);
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="flex justify-center">
      <Wallpaper />
      <div className="w-5/6 md:w-3/6 flex justify-center mt-8 mb-4">
        <div className="flex flex-col items-center w-full md:w-2/3">
          <h4 className="text-center mb-4">Sign in</h4>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
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
                    className={input_style}
                    placeholder="Telegram Nickname"
                    {...field}
                    aria-label="Telegram Nickname"
                    aria-invalid={errors.tgNickname ? "true" : "false"}
                  />
                )}
              />
              <div role="alert" className={error_style}>
                {errors.tgNickname?.message || ""}
              </div>
            </div>
            <div>
              <Controller
                name="password"
                rules={{
                  required: "This field is required",
                }}
                control={control}
                render={({ field }) => (
                  <input
                    type="password"
                    className={input_style}
                    placeholder="Password"
                    {...field}
                    aria-label="Password"
                    aria-invalid={errors.password ? "true" : "false"}
                  />
                )}
              />
              <div className={error_style}>
                {errors.password?.message || ""}
              </div>
            </div>
            <div role="alert" className={error_style}>
              {error}
            </div>
            <button
              disabled={isSubmitting || loading}
              type="submit"
              className="bg-pink-400 disabled:bg-pink-300 hover:bg-pink-400 text-white py-3 px-4 rounded transition duration-300 w-full"
            >
              Sign In
            </button>
          </form>
          <div className="text-sm mt-4">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-pink-400">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
