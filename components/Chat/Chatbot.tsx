export type Messages = [string, string | null][];

import { useState, useEffect } from "react";
import { loadTokenizer } from '../../lib/tokenizer';
import { functions } from "../../pages/login";
import { httpsCallable, HttpsCallableResult } from "firebase/functions";
import { Button, Input } from "@nextui-org/react";
import { auth, app } from "../../pages/login";
import { getFirestore, doc, setDoc } from "firebase/firestore";

export const Chatbot = ({ messages, setMessages, chatSession, chatSessions, maxTokens, temperature, topP, repetitionPenalty, systemMessage }: { messages: Messages, setMessages: any, chatSession: any, chatSessions: any, maxTokens: number, temperature: number, topP: number, repetitionPenalty: number, systemMessage: string }) => {

  const [userMessage, setUserMessage] = useState("");
  const [imageInput, setImageInput] = useState<File>(new File([], ""));
  const [imageDescription, setImageDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const image_to_text = httpsCallable(functions, 'image_to_text', { limitedUseAppCheckTokens: true });
  const text_generation = httpsCallable(functions, 'text_generation', { limitedUseAppCheckTokens: true });

  const [tokenizer, setTokenizer] = useState<any>(null);
  const [requestTokenCounts, setRequestTokenCounts] = useState<Array<{ date: string, count: number }>>([]);
  const [responseTokenCounts, setResponseTokenCounts] = useState<Array<{ date: string, count: number }>>([]);
  const [currentDate, setCurrentDate] = useState("");
  let started = false;

  useEffect(() => {
    const today = new Date().toDateString();
    if (today !== currentDate) {
      setCurrentDate(today);
      setRequestTokenCounts([]);
      setResponseTokenCounts([]);
    }
  }, [currentDate]);

  useEffect(() => {
    const loadAsyncData = async () => {
      setTokenizer(await loadTokenizer());
    };
    if (!started) {
      started = true;
      loadAsyncData();
      setCurrentDate(new Date().toDateString());
    }
  });

  const handleUserMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserMessage(e.target.value);
  };

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImageInput(e.target.files[0]);
  };

  const handleImageInputUpload = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!imageInput || imageInput.size === 0) return;
    const file = imageInput;
    if (imageInput) {
      setLoading(true);
      try {
        const readAsDataURL = (fileBlob: Blob) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(fileBlob);
          });
        };
        // request the image to text API
        try {
          const base64 = await readAsDataURL(file);
          const imageToTextResult = await image_to_text({ file: base64 }) as HttpsCallableResult<{ generated_text: string }>;
          setImageDescription(imageToTextResult.data.generated_text);
          setLoading(false);
        } catch (error) {
          console.error(error);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
  };

  const handleImageInputClear = () => {
    setImageInput(new File([], ""));
    setImageDescription("");
  };

  const generateConversationHistory = (messages: Messages, userMessage: string, systemMessage: string) => {
    let history = `System: ${systemMessage}\n${messages.map(([userMessage, aiResponse]) => {
      return `User: ${userMessage}\nAssistant: ${aiResponse}`;
    }).join("\n")}`;
    history += `\nUser: ${userMessage}\nAssistant:`;
    return history;
  }

  const handleUserMessageSend = async () => {
    try {
      setLoading(true);

      if (imageDescription.length > 0) {
        setUserMessage(`${userMessage}\nImage Description: ${imageDescription}`);
      }

      // request text generation api
      const response = await text_generation({
        inputs: generateConversationHistory(messages, userMessage, systemMessage),
        maxTokens: maxTokens,
        temperature: temperature,
        topP: topP,
        repetitionPenalty: repetitionPenalty,
        returnFullText: false,
      }) as HttpsCallableResult<{ generated_text: string }>;

      const newMessages: Messages = [
        ...messages,
        [userMessage, response.data.generated_text]
      ];

      setMessages(newMessages);
      setUserMessage("");
      setImageDescription("");

      // Update token counts
      const currentDate = new Date().toDateString();
      let currentRequestTokenCount = requestTokenCounts.find(tc => tc.date === currentDate);
      let currentResponseTokenCount = responseTokenCounts.find(tc => tc.date === currentDate);

      if (currentRequestTokenCount) {
        currentRequestTokenCount.count += tokenizer.tokenize(userMessage).length;
      } else {
        currentRequestTokenCount = { date: currentDate, count: tokenizer.tokenize(userMessage).length };
        setRequestTokenCounts([...requestTokenCounts, currentRequestTokenCount]);
      }

      if (currentResponseTokenCount) {
        currentResponseTokenCount.count += tokenizer.tokenize(response.data.generated_text).length;
      } else {
        currentResponseTokenCount = { date: currentDate, count: tokenizer.tokenize(response.data.generated_text).length };
        setResponseTokenCounts([...responseTokenCounts, currentResponseTokenCount]);
      }

      // Update Firestore with the new messages and token counts
      const db = getFirestore(app);
      const chatSessionId = chatSession?.chatSessionId;
      if (auth.currentUser && chatSessionId) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(userRef, {
          chatSessions: {
            ...chatSessions,
            [chatSessionId]: {
              ...chatSession,
              messages: newMessages,
            },
          },
          tokenCounts: {
            requestTokenCounts: requestTokenCounts,
            responseTokenCounts: responseTokenCounts,
          },
        }, { merge: true });
      } else {
        console.error("Firebase User not logged in or chat session not started");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-between h-full rounded-xl shadow-lg p-4 mb-4">
      <div className="overflow-y-auto">
        {messages.map(([userMessage, aiResponse], index) => (
          <div key={index}>
            <div className="flex items-end justify-start">
              <div className="max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl p-4 my-2 rounded-lg text-gray-100">
                <p className="break-words">{userMessage}</p>
              </div>
            </div>
            {aiResponse && (
              <div className="flex items-end justify-end">
                <div className="max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl p-4 my-2 rounded-lg text-gray-100 ai-response">
                  <p className="break-words">{aiResponse}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {loading && (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      )}
      <div className="mt-4 flex flex-wrap items-center justify-between">
        <Input
          type="file"
          accept="image/*"
          className="w-full md:w-auto mb-4 md:mb-0 py-2 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          onChange={handleImageInputChange}
        />
        <Button className="w-full md:w-auto mb-4 md:mb-0 md:ml-4 py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" onClick={handleImageInputUpload}>
          Upload
        </Button>
        <Button className="w-full md:w-auto mb-4 md:mb-0 md:ml-4 py-2 px-4 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75" onClick={handleImageInputClear}>
          Clear Image
        </Button>
        <Input
          type="text"
          className="w-full md:flex-grow mb-4 md:mb-0 md:ml-4 py-2 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          value={userMessage}
          onChange={handleUserMessageChange}
          placeholder="Type a message..."
        />
        <Button className="w-full md:w-auto py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" onClick={handleUserMessageSend}>
          Send
        </Button>
      </div>
    </div>
  );
};