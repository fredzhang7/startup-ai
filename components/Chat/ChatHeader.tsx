import { FC, useState } from "react";
import { Heading, Text } from "@chakra-ui/react";
import { InfoCircledIcon } from "@radix-ui/react-icons";

interface ChatHeaderProps {
  title: string;
  intro: string;
}

const ChatHeader: FC<ChatHeaderProps> = ({ title, intro }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="flex items-center justify-between p-4 rounded-lg shadow-md transition duration-100 ease-in-out transform hover:-translate-y-1 hover:scale-105 max-w-3xl">
      <div className="flex flex-col justify-start">
        <Heading className="text-2xl font-bold text-gray-100 leading-tight">
          {title}
        </Heading>
        <Text className="mt-2 text-md text-gray-300">
          {intro}
        </Text>
      </div>
      <div className="relative flex items-center">
        <button
          className="p-2 rounded-full hover:bg-gray-400 transition duration-100 ease-in-out focus:outline-none focus:ring focus:border-blue-300"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <InfoCircledIcon className="h-6 w-6 text-gray-100" />
        </button>
        {showTooltip && (
          <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg z-50" style={{ minWidth: '250px', maxWidth: '400px' }}>
            <Text className="text-sm text-gray-700">
              With Chat mode, users can have a conversation about input text and optional image input
              with a large language model that can be personalized by adjusting the input sliders
              on the right and see how they affect the responses. View the previous chat sessions
              on the left.
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;