import { useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { Button } from "@nextui-org/react";
import { Root as Label } from '@radix-ui/react-label';
import { Text } from "@chakra-ui/react";
import { LockClosedIcon } from "@radix-ui/react-icons";
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from "firebase/auth";

import { logoImage } from '../pages/login';
import { auth } from '../pages/login';
import Image from "next/image";

export const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = (data: object) => {
    setLoading(true);
    const { email, password } = data as { email: string; password: string };

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        router.push("/chat");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.error(errorCode, errorMessage);
        setError(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-8 bg-white bg-opacity-90 rounded-xl shadow-2xl transform transition-all duration-500 ease-in-out">
        <div className="flex justify-center py-8">
          <Image src={logoImage} alt="Logo" width={80} height={80} priority />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 px-8 pb-8">
          {/* Email Input */}
          <div className="flex flex-col">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email address</Label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="mt-1 block w-full p-1 rounded-md border-2 border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-peach-500 focus:border-transparent"
            />
            <ErrorMessage
              errors={errors}
              name="email"
              render={({ message }) => (
                <Text variant="error" className="mt-2 text-sm text-red-600">
                  {message}
                </Text>
              )}
            />
          </div>
          {/* Password Input */}
          <div className="flex flex-col">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
              })}
              className="mt-1 block w-full p-1 rounded-md border-2 border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-peach-500 focus:border-transparent"
            />
            <ErrorMessage
              errors={errors}
              name="password"
              render={({ message }) => (
                <Text variant="error" className="mt-2 text-sm text-red-600">
                  {message}
                </Text>
              )}
            />
          </div>
          {/* Confirm Password Input */}
          <div className="flex flex-col">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm password</Label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="current-password"
              required
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              className="mt-1 block w-full p-1 rounded-md border-2 border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-peach-500 focus:border-transparent"
            />
            <ErrorMessage
              errors={errors}
              name="confirmPassword"
              render={({ message }) => (
                <Text variant="error" className="mt-2 text-sm text-red-600">
                  {message}
                </Text>
              )}
            />
          </div>
          {/* Error Message */}
          {error && (
            <Text variant="error" className="mt-2 text-sm text-red-600">
              {error}
            </Text>
          )}
          {/* Sign Up Button */}
          <div>
            <Button
              type="submit"
              variant="shadow"
              size="lg"
              isLoading={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400 hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-peach-500"
            >
              <LockClosedIcon className="mr-3 h-5 w-5" />
              Sign up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}