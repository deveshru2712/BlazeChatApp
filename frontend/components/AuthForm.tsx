"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAppTheme } from "@/hooks/useTheme";
import authStore from "@/store/auth.store";
import FormField from "./FormField";
import { Button } from "./ui/button";
import { Form } from "./ui/form";

const authFormSchema = (type: FormType) => {
  return z.object({
    username:
      type === "sign-up"
        ? z
            .string()
            .min(3, "Username must be at least 3 characters long")
            .max(15, "Username must be less than 20 characters")
        : z.string().optional(),
    email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(15, "Password must be less than 50 characters"),
  });
};

export default function AuthForm({ type }: { type: FormType }) {
  const { classes } = useAppTheme();

  const router = useRouter();
  const formSchema = authFormSchema(type);

  const { signUp, logIn } = authStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
    // This ensures validation happens on change and submit
    mode: "all",
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Trigger validation manually to show all errors
    const isValid = await form.trigger();
    if (!isValid) {
      return; // Stop submission if validation fails
    }

    if (type == "sign-in") {
      await logIn(values);
      router.push("/message");
    } else {
      await signUp(values as { username: string; email: string; password: string });
      router.push("/message");
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center px-6">
      <div className={`${classes.border} border shadow-md lg:min-w-[566px] px-8 py-6 rounded-2xl`}>
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl md:text-4xl font-bold">
            {type == "sign-in" ? (
              <div className="flex flex-col md:flex-row items-center gap-0 md:gap-2">
                <span className="animated-warm-gradient-text hover:brightness-110 transition-all duration-300 cursor-pointer">
                  Welcome
                </span>
                <span className="">Back to Blaze 🔥</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="animated-warm-gradient-text hover:brightness-110 transition-all duration-300 cursor-pointer">
                  Create
                </span>
                <span className="">an Account 🔥</span>
              </div>
            )}
          </h1>
          <span className="text-center text-base md:text-xl font-semibold">
            {type == "sign-in"
              ? "Your messages are waiting. Log in to see them!"
              : "Sign up today, your messages are just a click away."}
          </span>
        </div>
        <div>
          <Form {...form}>
            <form className="w-full space-y-6 mt-4" onSubmit={form.handleSubmit(onSubmit)}>
              {type == "sign-up" && (
                <FormField
                  control={form.control}
                  label="Username"
                  name="username"
                  type="text"
                  placeholder="your name"
                />
              )}

              <FormField
                control={form.control}
                label="Email"
                name="email"
                type="email"
                placeholder="Your email address"
              />

              <FormField
                control={form.control}
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
              />

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-400 to-red-400 text-white text-lg font-semibold cursor-pointer py-2 active:scale-105 duration-300 transition-all hover:shadow-lg hover:shadow-orange-400/30"
                disabled={!form.formState.isValid || form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? "Processing..."
                  : type == "sign-in"
                    ? "Sign in"
                    : "Create an account"}
              </Button>
            </form>
          </Form>
          <p className={`text-center font-semibold text-lg mt-3`}>
            {type == "sign-in" ? "No account yet?" : "Already have an account?"}
            <Link href={type != "sign-in" ? "/sign-in" : "/sign-up"} className="ml-0.5">
              <span className="font-bold  animated-warm-gradient-text">
                {type != "sign-in" ? "Sign in" : "Sign up"}
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
