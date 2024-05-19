"use client";

import { Button } from "@nextui-org/react";
import { useEffect, useState, useRef, ComponentPropsWithRef } from 'react';
import Image from "next/legacy/image";
import { motion, useAnimation } from 'framer-motion';
import { FcGoogle } from "react-icons/fc";
import { MdRocketLaunch } from "react-icons/md";
import '../styles/landing.css';
import { PiChatsCircleFill } from "react-icons/pi";
import sampleImage from '../public/sample.png';
import { FcComboChart } from "react-icons/fc";
import { useMediaQuery } from 'react-responsive';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';

type Ripple = {
  x: number;
  y: number;
  size: number;
};

const DIcon = ({ children }: { children: JSX.Element }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (ref.current !== null) {
      if (isHovered) {
        ref.current.style.transform = 'rotateY(-180deg)';
      } else {
        ref.current.style.transform = 'rotateY(0deg)';
      }
    }
  }, [isHovered]);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="icon-container relative w-full h-32 mb-6"
    >
      {children}
    </div>
  );
};

const HolographicDisplay = () => {
  return (
    <div className="holographic-display">
      <FcComboChart size="100%" />
    </div>
  );
};

type EnhancedButtonProps = ComponentPropsWithRef<typeof Button> & {
  text: string;
  icon: JSX.Element;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  variant?: string;
};

const EnhancedButton: React.FC<EnhancedButtonProps> = ({ text, icon, onClick, radius, className, variant }) => {
  return (
    <Button
      radius={radius}
      variant={variant}
      className={`button-3d button-signup ${className || ''}`}
      onClick={onClick}
    >
      <span className="flex items-center justify-center gap-2">
        {text}
        {icon}
      </span>
      <div className="button-ripple" />
    </Button>
  );
};


// custom hook for ripple after button clicks
const useRippleEffect = () => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    const newRipple: Ripple = { x, y, size };

    setRipples((prevRipples) => [...prevRipples, newRipple]);

    setTimeout(() => {
      setRipples((prevRipples) => prevRipples.slice(1));
    }, 900);
  };

  return { ripples, createRipple };
};

const FeatureCard = ({ title, description, icon, gradientFrom, gradientTo, positionClasses, isImageCard }: any) => {
  const cardRef = useRef(null);
  const controls = useAnimation();
  const isDesktopOrLaptop = useMediaQuery({ query: '(min-device-width: 1224px)' });

  const imageContainerClasses = classNames('image-container relative w-full h-full', {
    'rounded-lg': isImageCard,
  });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, ref: React.RefObject<HTMLDivElement>) => {
    const { clientX, clientY } = event;
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    ref.current.style.transform = `rotateY(${x * 30}deg) rotateX(${y * 30}deg)`;
  };

  const handleMouseLeave = (ref: any) => {
    ref.current.style.transform = 'rotateY(0deg) rotateX(0deg)';
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={(event) => handleMouseMove(event, cardRef)}
      onMouseLeave={() => handleMouseLeave(cardRef)}
      animate={controls}
      className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-lg p-8 shadow-lg mb-8 feature-card ${positionClasses}`}
    >
      <div className={`icon-container relative w-full ${isImageCard ? 'h-64' : 'h-32'} mb-2`}>
        {isImageCard ? (
          <div className={imageContainerClasses}>
            <Image
              src={sampleImage}
              alt="Generated Image"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        ) : (
          icon
        )}
      </div>
      <div className={`content-container ${isImageCard && isDesktopOrLaptop ? 'mt-4' : ''}`}>
        <h4 className="text-2xl font-bold mb-2">{title}</h4>
        <p>{description}</p>
      </div>
    </motion.div>
  );
};

const AdvancedFeaturesDescription = () => {
  const sentences = [
    "Experience a secure login and user data storage system at the security level of Google services, with more robust security measures than Discord, including the latest captcha algorithm, anti-DDoS, rate limiting, user verification, security checks, protection against unauthorized attempts (e.g. replay attacks), and strong data encryption algorithms.",
    "Engage with a multimodal AI capable of human-like image understanding and conversation in a chat UI that organizes saved chats by time and offers customizable model parameters never seen in ChatGPT.",
    "Utilize an admin dashboard that not only tracks usage history but also accurately forecasts future usage trends.",
    "Unlock creative potential with personalized image generation powered by handpicked, top-quality API endpoints."
  ];

  return (
    <section className="py-20 transition duration-500 ease-in-out">
      <div className="container mx-auto px-4 mt-16 mb-16">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full px-4">
            <div className="max-w-xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-10 shadow-lg transform hover:scale-105 transition duration-300">
                A Production-Ready, Secure, and Scalable UI
              </h2>
              <div className="mb-8 leading-relaxed">
                {sentences.map((sentence, index) => (
                  <p key={index} className="drop-cap">
                    {sentence}
                  </p>
                ))}
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <span className="bg-blue-200 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold shadow-md hover:shadow-xl transition duration-300">Secure</span>
                <span className="bg-purple-200 text-purple-800 rounded-full px-3 py-1 text-sm font-semibold shadow-md hover:shadow-xl transition duration-300">User-friendly</span>
                <span className="bg-green-200 text-green-800 rounded-full px-3 py-1 text-sm font-semibold shadow-md hover:shadow-xl transition duration-300">State-of-the-art</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeaturesList = () => {
  return (
    <section className="border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="py-12 md:py-20">
          <div className="max-w-3xl mx-auto text-center pb-8 pt-20">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">From seamless chat experiences to advanced image generation, explore the capabilities that make us stand out.</p>
          </div>
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* Predictive Cost Analytics */}
            <div className="col-start-3 row-start-1 transform translate-y-8">
              <FeatureCard
                title="Predictive Cost Analytics"
                description="Accurately predict future costs based on your usage history."
                gradientFrom="from-violet-200"
                gradientTo="to-violet-300"
                icon={<HolographicDisplay />}
              />
            </div>
            {/* Intuitive Chat UI */}
            <div className="col-start-2 row-start-1 transform translate-y-16">
              <FeatureCard
                title="Intuitive Chat UI"
                description="Engage with an AI that understands and responds like a human."
                gradientFrom="from-orange-200"
                gradientTo="to-orange-300"
                icon={<DIcon><PiChatsCircleFill size="100%" /></DIcon>}
              />
            </div>
            {/* Advanced Image Generation */}
            <div className="col-start-1 row-start-1 transform translate-y-24">
              <FeatureCard
                title="Advanced Image Generation"
                description="Create stunning visuals from simple text prompts."
                gradientFrom="from-blue-200"
                gradientTo="to-blue-300"
                icon={
                  <div className="image-container relative w-full h-full">
                    <Image
                      src={sampleImage}
                      alt="Generated Image"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                }
                isImageCard
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


const Testimonial = ({ title, description, name, role }: any) => (
  <div className="bg-white rounded shadow-lg p-6">
    <div className="text-gray-800">
      <div className="text-lg font-semibold mb-1">{title}</div>
      <p className="text-sm">{description}</p>
      <div className="mt-4">
        <Image src="/profile.png" alt={`Profile picture of ${name}`} width={50} height={50} className="rounded-full" />
        <div className="text-xs font-semibold">{name}, {role}</div>
      </div>
    </div>
  </div>
);
const testimonials = [
  {
    title: "Incredible Experience",
    description: "Startup AI transformed the way we interact with our customers. The AI's ability to understand and respond naturally is remarkable.",
    name: "John Doe",
    role: "CEO of Acme Inc."
  },
  {
    title: "Stunning Visuals",
    description: "The image generation feature is a game-changer. It's like having professional photographers and designers on demand.",
    name: "Jane Smith",
    role: "Freelance Artist"
  },
  {
    title: "Robust and Secure",
    description: "I trust Startup AI with sensitive data. Throughout their development process, security has been a top priority.",
    name: "Alex Johnson",
    role: "Data Analyst"
  },
];


export default function Home() {
  const controls = useAnimation();
  const { ripples, createRipple } = useRippleEffect();
  const router = useRouter();

  const handleSignUpClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(event);
    // Redirect to the login page without full page reload
    router.push('/login');
  };

  useEffect(() => {
    controls.start({
      scale: [1, 1.05, 1],
      rotate: [0, 10, -10, 0],
      transition: { duration: 2, loop: Infinity, ease: 'easeInOut' }
    });
  }, [controls]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      <div className="absolute inset-0" style={{ backgroundImage: 'url(/hero.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8 }}></div>

      <br></br><br></br>

      <section className="relative pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="pt-40 pb-12 md:pt-40 md:pb-20">
            <div className="text-center">
              <div className="hero-text">
                <motion.h1
                  initial={{ scale: 0 }}
                  animate={{ rotate: 360, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }}
                  className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4"
                  style={{ color: '#374151' }}
                >
                  Welcome to <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">Startup AI</span>
                </motion.h1>
                <p className="text-xl text-gray-600 mb-8">Discover the future of AI-driven applications with our <br></br>cutting-edge, secure, and scalable platform.</p>

                <EnhancedButton
                  radius="full"
                  className="bg-gradient-to-r from-orange-400 to-orange-300"
                  variant="shadow"
                  text="Sign Up"
                  icon={<MdRocketLaunch />}
                  onClick={handleSignUpClick}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <FeaturesList />

      {/* Secure Authentication section */}
      <section className="border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16">
          <div className="py-12 md:py-20">
            <DIcon>
              <FcGoogle size="100%" />
            </DIcon>
            <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
              <h2 className="text-3xl font-bold mb-4">Secure Authentication</h2>
              <p className="text-xl text-gray-600">Protect your data with Google's robust security measures.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Line */}
      <div className="horizontal-line"></div>

      {/* Advanced Features section */}
      <AdvancedFeaturesDescription />

      {/* Horizontal Line */}
      <div className="horizontal-line"></div>

      {/* Testimonials section */}
      <section className="py-28 pb-36">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:py-20">
          <h2 className="text-3xl font-bold text-center mb-8">What Users Are Saying</h2>
          {/* Testimonials */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Testimonial key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Horizontal Line */}
      <div className="horizontal-line"></div>

      {/* Call to action section */}
      <section className="mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="py-8 px-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-gray-100 mb-4">Ready to get started?</h3>
            <p className="text-gray-100 mb-8">Join the AI revolution today. Sign up for Startup AI to <br></br>unlock the full potential of your business.</p>
            <EnhancedButton
              radius="full"
              variant="shadow"
              className="relative overflow-hidden bg-gradient-to-r from-red-400 to-orange-400 text-gray-100 font-medium"
              text="Get Started"
              icon={<MdRocketLaunch />}
              onClick={handleSignUpClick}
            />
          </div>
        </div>
      </section>

      <footer className="text-center lg:text-left">
        <div className="text-gray-700 text-center p-4">
          © {new Date().getFullYear()} Startup AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}