'use client';

import NavBar from '../components/NavBar';
import { ChatContent } from '../components/Chat/ChatContent';
import { auth } from './login';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import "../styles/chat.css";

const ChatPage = () => {
  const router = useRouter();

  useEffect(() => {
    auth.onAuthStateChanged((user: any) => {
      if (!user) {
        router.push('/login');
      }
    });
  }, [router]);

  const user = auth.currentUser; //  || { displayName: "John Doe", email: "johndoe@gmail.com", photoURL: "../public/profile.png" }

  if (!user) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen text-white"
    >
      <div className="navbar-container">
        <NavBar name={(user.displayName || "")} email={(user.email || "")} image={(user.photoURL || "")} />
      </div>
      <main className="container mx-auto p-4 space-y-6">
        <div className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl">
          <ChatContent />
        </div>
      </main>
    </motion.div>
  );
};

export default ChatPage;