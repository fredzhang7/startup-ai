import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input } from "@nextui-org/react";
import { Root as Label } from '@radix-ui/react-label';
import { Text } from "@chakra-ui/react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./login";
import { ErrorMessage } from "@hookform/error-message";
import Image from "next/image";
import logoImage from "../public/logo.png";
import { useRouter } from "next/router";

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = (data: object) => {
    setLoading(true);
    const { email } = data as { email: string };

    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Password reset email sent!");
        router.push("/login");
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.error(error.code, errorMessage);
        alert(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
      <div className="w-full max-w-md space-y-8 p-8 bg-white bg-opacity-90 rounded-xl shadow-xl transform transition-all duration-500 ease-in-out">
        <div className="flex justify-center py-8">
          <Image src={logoImage} alt="Logo" width={80} height={80} priority />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 px-8 pb-8">
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </Label>
            <Input
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
              className="mt-1 block w-full p-1 rounded-md border-2 border-gray-200 shadow-sm"
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
          <div>
            <Button
              type="submit"
              variant="shadow"
              size="lg"
              isLoading={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400 hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Send password reset email
            </Button>
          </div>
          <div className="text-sm mt-6 text-center">
            <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Back to login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}