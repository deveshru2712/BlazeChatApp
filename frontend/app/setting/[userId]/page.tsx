"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormField from "@/components/FormField";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import authStore from "@/store/auth.store";
import updateStore from "@/store/update.store";

export default function Page() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const updateFormSchema = z
    .object({
      username: z
        .string()
        .min(3, "Username must be at least 3 characters long")
        .max(15, "Username must be less than 20 characters")
        .optional(),
      email: z.string().email("Please enter a valid email address").optional(),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .max(15, "Password must be less than 50 characters"),
      profilePicture: z.string().optional(),
    })
    .refine((data) => data.email || data.profilePicture || data.username || data.password, {
      message: "At least one field (username, email, or profile picture) must be provided",
      path: ["root"],
    });

  const form = useForm<z.infer<typeof updateFormSchema>>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      email: undefined,
      username: undefined,
      password: undefined,
      profilePicture: undefined,
    },
    mode: "all",
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { user: currentUser, authCheck } = authStore();
  const { uploadImage, formValue } = updateStore();

  // Set preview image from current user profile picture
  useEffect(() => {
    if (currentUser?.profilePicture && !previewImage) {
      setPreviewImage(currentUser.profilePicture);
    }
  }, [currentUser?.profilePicture, previewImage]);

  useEffect(() => {
    if (formValue?.profilePicture) {
      form.setValue("profilePicture", formValue.profilePicture);
      setPreviewImage(formValue.profilePicture);
    }
  }, [formValue?.profilePicture, form]);

  if (!currentUser) {
    return null;
  }

  const { updateProfile } = updateStore();
  async function onSubmit(values: z.infer<typeof updateFormSchema>) {
    await updateProfile(values);
    authCheck();
  }

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      await uploadImage(file);
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col">
      <Navbar />
      <div className="flex flex-1 w-full border-t border-slate-200/60 overflow-hidden justify-center items-center">
        <Card className="w-full max-w-sm backdrop-blur-2xl">
          <CardHeader className="text-center pb-3">
            <div className="flex justify-center mb-2">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      alt="Profile preview"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleProfilePictureClick}
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center border-2 border-white"
                >
                  <Camera className="w-3 h-3 text-white" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
            <CardTitle className="text-lg">Update your profile</CardTitle>
            <CardDescription className="text-sm">Update your profile information</CardDescription>
          </CardHeader>
          <CardContent className="py-3">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-3">
                  {/* Current Values Display Section */}
                  <div className="mb-2 p-2 dark:bg-gray-800/50 rounded-lg border">
                    <h3 className="text-xs font-semibold dark:text-gray-200 mb-1">
                      Current Profile Information
                    </h3>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="dark:text-gray-300">Username:</span>
                        <span className="font-medium dark:text-gray-200">
                          {currentUser.username || "Not set"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="dark:text-gray-300">Email:</span>
                        <span className="font-medium dark:text-gray-200">
                          {currentUser.email || "Not set"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <FormField
                    control={form.control}
                    name="username"
                    label="Username"
                    placeholder={currentUser.username || "Enter username"}
                    type="text"
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    label="Email"
                    placeholder={currentUser.email || "Enter email"}
                    type="email"
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    label="Password"
                    placeholder="Enter password"
                    type="password"
                  />
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="pt-2">
            <Button type="submit" className="w-full" onClick={form.handleSubmit(onSubmit)}>
              Update Profile
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
