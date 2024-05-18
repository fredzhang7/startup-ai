import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDownIcon, ChevronUpIcon, ExitIcon } from "@radix-ui/react-icons";
import { Button, Avatar } from "@nextui-org/react";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { auth } from "../pages/login";
import logoImage from "../public/logo.png";

import { ThemeSwitcher } from './ThemeSwitcher';

export const Logout = ({ variant = 'shadow', size = 'lg', className = '' }: { variant?: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | "ghost", size?: "sm" | "md" | "lg", className?: string }) => {
  const router = useRouter();
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        router.push("/login");
      })
      .catch((error) => {
        console.error(error);
        alert(error.message);
      });
  };

  return (
    <div>
      <button
        onClick={handleLogout}
        className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${className}`}
      >
        <ExitIcon className="mr-2 h-5 w-5" />
        Logout
      </button>
    </div>
  );
};

export default function NavBar({ name, email, image }: { name: string; email: string; image: string; } = { name: "John Doe", email: "john.doe@example.com", image: "../public/profile.png" }) {
  const [selected, setSelected] = useState("");
  const [user, setUser] = useState({ name, email, image });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setSelected(router.pathname);
  }, [router.pathname]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="navbar shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Image
                src={logoImage}
                alt="Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {/* Dynamic Link Styling */}
              {['/dashboard', '/draw', '/chat'].map((path) => (
                <Link
                  href={path}
                  key={path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm leading-5 transition duration-150 ease-in-out ${selected === path ? 'border-indigo-500 text-white font-semibold' : 'border-transparent text-white hover:border-gray-300 font-medium'}`}
                >
                  {path.substring(1, 2).toUpperCase() + path.substring(2)}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {/* User Menu */}
            <div className="ml-3 relative">
              <div onClick={toggleDropdown} className="cursor-pointer">
                <Avatar
                  isBordered color="default"
                  src={user.image}
                  alt={user.name}
                  className="inline-block h-10 w-10 rounded-full ring-2"
                  fallback=""
                />
                {isDropdownOpen ? (
                  <ChevronUpIcon className="inline-block ml-2 h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDownIcon className="inline-block ml-2 h-5 w-5 text-gray-500" />
                )}
              </div>
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <Link
                    href="/profile"
                    className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${selected === "/profile" ? 'bg-gray-100' : ''}`}
                  >
                    Your Profile
                  </Link>
                  <Link
                    href="/settings"
                    className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${selected === "/settings" ? 'bg-gray-100' : ''}`}
                  >
                    Settings
                  </Link>
                  <Logout variant="shadow" size="lg" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" />
                </div>
              )}
            </div>
            <ThemeSwitcher />
          </div>
          {/* Mobile Menu Button */}
          <div className="mr-2 flex items-center sm:hidden">
            <Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className="hidden h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}