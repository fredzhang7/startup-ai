import { useState } from "react";
import { ThemeSwitcher } from "../components/ThemeSwitcher";
import { SignUpForm } from "../components/SignUpForm";
import { Card, CardHeader, CardBody, Button, Divider } from "@nextui-org/react";
import { Text } from "@chakra-ui/react";

import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { Root as Label } from '@radix-ui/react-label';
import { LockClosedIcon } from "@radix-ui/react-icons";
import { getAuth, signInWithEmailAndPassword, browserSessionPersistence, browserLocalPersistence, setPersistence } from "firebase/auth";
import { initializeApp } from "firebase/app";
import Image from "next/image";
import logoImage from "../public/logo.png";

import { useRouter } from "next/router";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// get firebase function from app
import { getFunctions } from "firebase/functions";
const functions = getFunctions(app, "us-west1");

export { auth, logoImage, app, functions };

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const onSubmit = (data: object) => {
    setLoading(true);
    const { email, password } = data as { email: string; password: string };

    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    setPersistence(auth, persistence)
      .then(() => {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
            router.push("/chat");
          })
          .catch((error) => {
            const errorMessage = `Login failed with code ${error.code}: ${error.message}`;
            console.error(errorMessage);
            setError(errorMessage);
          })
          .finally(() => {
            setLoading(false);
          });
      });
  };

  return (
    <div className="flex flex-col items-center justify-center p-4  bg-gray-50">
      <div className="w-full max-w-md space-y-8 bg-white bg-opacity-90 rounded-xl shadow-2xl transform transition-all duration-500 ease-in-out">
        <div className="flex justify-center py-8">
          <Image src={logoImage} alt="Logo" width={80} height={80} priority />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 px-8 pb-8">
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </Label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className="mt-1 block w-full p-1 rounded-md border-2 border-gray-200 shadow-sm"
            />
            {errors.email && (
              <ErrorMessage
                errors={errors}
                name="email"
                render={({ message }) => (
                  <Text variant="error" className="mt-2 text-sm text-red-600">
                    {message}
                  </Text>
                )}
              />
            )}
          </div>
          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </Label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters long',
                },
              })}
              className="mt-1 block w-full p-1 rounded-md border-2 border-gray-200 shadow-sm"
            />
            {errors.password && (
              <ErrorMessage
                errors={errors}
                name="password"
                render={({ message }) => (
                  <Text variant="error" className="mt-2 text-sm text-red-600">
                    {message}
                  </Text>
                )}
              />
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="border-2 border-gray-300 rounded text-green-500 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 cursor-pointer">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </a>
            </div>
          </div>
          {error && (
            <Text variant="error" className="mt-2 text-sm text-red-600">
              {error}
            </Text>
          )}
          <div>
            <Button
              type="submit"
              variant="shadow"
              size="lg"
              isLoading={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400 hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <LockClosedIcon className="mr-3 h-5 w-5" />
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};


import { SocialIcon } from 'react-social-icons'
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider, TwitterAuthProvider } from "firebase/auth";

const GoogleIcon = <SocialIcon network="google" url="www.google.com" className="mr-3 h-5 w-5 text-white" />;
const GitHubIcon = <SocialIcon network="github" url="www.github.com" className="mr-3 h-5 w-5 text-white" />;
const TwitterIcon = <SocialIcon network="twitter" url="www.twitter.com" className="mr-3 h-5 w-5 text-white" />;

export const SocialLogin = () => {
  const googleProvider = new GoogleAuthProvider();
  const githubAuthProvider = new GithubAuthProvider();
  const twitterProvider = new TwitterAuthProvider();

  return (
    <div className="flex flex-col gap-4">
      <SocialButton provider={googleProvider} icon={GoogleIcon} color="from-orange-400 via-red-500 to-yellow-500">
        Sign in with Google
      </SocialButton>
      <SocialButton provider={githubAuthProvider} icon={GitHubIcon} color="from-gray-700 via-gray-800 to-gray-900">
        Sign in with GitHub
      </SocialButton>
      <SocialButton provider={twitterProvider} icon={TwitterIcon} color="from-blue-400 via-blue-500 to-blue-600">
        Sign in with Twitter
      </SocialButton>
    </div>
  );
};

const SocialButton = ({ provider, color, icon, children }: { provider: GoogleAuthProvider | GithubAuthProvider | TwitterAuthProvider, color: string, icon: JSX.Element, children: string }) => {
  const auth = getAuth();
  const router = useRouter();

  function handleSocialLogin() {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log(user);
        router.push("/chat");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        let credential;
        if (provider instanceof GoogleAuthProvider) {
          credential = GoogleAuthProvider.credentialFromError(error);
        } else if (provider instanceof GithubAuthProvider) {
          credential = GithubAuthProvider.credentialFromError(error);
        } else {
          credential = TwitterAuthProvider.credentialFromError(error);
        }
        console.error(errorCode, errorMessage, email, credential);
      });
  }

  return (
    <Button
      variant="shadow"
      size="lg"
      onClick={handleSocialLogin}
      className={`flex items-center justify-center text-white font-bold py-2 px-4 rounded bg-gradient-to-r ${color}`}
    >
      {icon}
      {children}
    </Button>
  );
};

export default function LoginPage() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
      <Card className="max-w-lg w-full space-y-8 p-8 bg-white bg-opacity-90 shadow-2xl rounded-2xl transform transition-all duration-500 ease-in-out">
        <CardHeader className="flex justify-between items-center">
          <ThemeSwitcher />
          <div className="space-x-4">
            <TabButton active={tabIndex === 0} onClick={() => setTabIndex(0)}>
              Log in
            </TabButton>
            <TabButton active={tabIndex === 1} onClick={() => setTabIndex(1)}>
              Sign up
            </TabButton>
          </div>
        </CardHeader>
        <Divider className="border-gray-200" />
        <CardBody className="space-y-6">
          {tabIndex === 0 ? <LoginForm /> : <SignUpForm />}
          <Divider className="my-6 border-gray-200" />
          <SocialLogin />
        </CardBody>
      </Card>
    </div>
  );
}

export const TabButton = ({ active, children, onClick }: { active: boolean, children: string, onClick: () => void }) => {
  const activeStyles = 'bg-gradient-to-r from-[#36D1DC] to-[#5B86E5] text-white shadow-lg';
  const inactiveStyles = 'bg-gray-300 text-gray-500 shadow-sm hover:bg-gray-400';
  return (
    <Button
      onClick={onClick}
      className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ease-in-out transform hover:scale-110 ${active ? activeStyles : inactiveStyles}`}
    >
      {children}
    </Button>
  );
};