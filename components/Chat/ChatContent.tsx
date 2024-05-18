import { useState, useEffect } from "react";
import { Chatbot, Messages } from "./Chatbot";
import { Sliders } from "./Settings";
import { ChatSessions } from "./ChatSessions";
import { Export } from "./Export";
import { auth } from "../../pages/login";
import { getFirestore, collection, doc, setDoc, addDoc, onSnapshot } from "firebase/firestore";
import { Button } from "@nextui-org/react";

type ChatSession = {
  chatSessionId: string;
  userId: string;
  name: string;
  messages: Messages;
  timestamp: number;
};

function generateNewChatSessionId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const adjectives = [
  "Quick", "Brave", "Calm", "Eager", "Fancy", "Gentle", "Happy", "Jolly", "Kind", "Lively", "Nice", "Odd", "Proud", "Silly", "Witty", "Zany"
];

const nouns = [
  "Ant", "Bear", "Cat", "Duck", "Eagle", "Frog", "Goat", "Horse", "Iguana", "Jellyfish", "Koala", "Lion", "Mouse", "Nightingale", "Owl", "Penguin", "Quail", "Rabbit", "Snail", "Tiger", "Unicorn", "Vulture", "Whale", "X-rayFish", "Yak", "Zebra"
];

function generateNewChatSessionName() {
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${randomAdjective}${randomNoun}`;
}

export const ChatContent = () => {
  // variables for the chatbot component
  const [messages, setMessages] = useState<Messages>([]);

  // variables for the sliders component
  const [maxTokens, setMaxTokens] = useState(1024);
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0);
  const [repetitionPenalty, setRepetitionPenalty] = useState(1);
  const [systemMessage, setSystemMessage] = useState("");

  // variables for the chat sessions component
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [chatSessionName, setChatSessionName] = useState("");
  const [chatSessions, setChatSessions] = useState({});

  useEffect(() => {
    const db = getFirestore();
    const uid = auth.currentUser?.uid;

    if (uid) {
      const docRef = doc(db, "chatSessions", uid);

      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          // convert the object to an array
          const chatSessionsArray = Object.keys(data).map(chatSessionId => ({
            chatSessionId,
            ...data[chatSessionId]
          }));
          // sort the array by descending timestamp order
          chatSessionsArray.sort((a, b) => b.timestamp - a.timestamp);
          setChatSessions(chatSessionsArray);
        } else {
          console.log("No such document!");
        }
      });

      return () => unsubscribe();
    }
  }, []);

  // when the chat session starts, create the document
  const handleChatSessionStart = async () => {
    const chatSessionId = generateNewChatSessionId();
    const name = generateNewChatSessionName();
    const newChatSession: ChatSession = {
      chatSessionId,
      userId: auth.currentUser?.uid || "",
      name,
      messages: [],
      timestamp: Date.now(),
    };
    await addDoc(collection(getFirestore(), "chatSessions"), newChatSession);
    setChatSession(newChatSession);
  };

  const handleChatSessionLoad = (chatSession: any) => {
    setChatSession(chatSession);
    setMessages(chatSession.messages);
    setChatSessionName(chatSession.name);
  };

  const handleChatSessionSave = async () => {
    if (messages.length > 1) {
      try {
        const db = getFirestore();
        const chatSessionId = chatSession?.chatSessionId;
        if (auth.currentUser && chatSessionId) {
          const userRef = doc(db, "users", auth.currentUser.uid);
          await setDoc(userRef, {
            chatSessions: {
              ...chatSessions,
              [chatSessionId]: {
                ...chatSession,
                messages: messages,
              },
            },
          }, { merge: true });
        } else {
          console.error("Firebase User not logged in or chat session not started");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleExport = (messages: Messages) => {
    const chatSessionId = chatSession?.chatSessionId || generateNewChatSessionId();
    const name = chatSessionName || generateNewChatSessionName();
    const newChatSession: ChatSession = {
      chatSessionId,
      userId: auth.currentUser?.uid || "",
      name,
      messages,
      timestamp: Date.now(),
    };
    return newChatSession;
  };

  // handle the chat session name change
  const handleChatSessionNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatSessionName(e.target.value);
  };

  // update the chat session name when loading a chat session
  useEffect(() => {
    if (chatSession) {
      setChatSessionName(chatSession.name);
    }
  }, [chatSession]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-8">
      <div className="col-span-1 md:col-span-3 lg:col-span-3 xl:col-span-3">
        <ChatSessions
          chatSessions={chatSessions}
          handleChatSessionLoad={handleChatSessionLoad}
          handleChatSessionStart={handleChatSessionStart}
        />
        <div className="mt-4">
          <div className="flex mb-4">
            <input
              type="text"
              className="w-3/4 py-2 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              value={chatSessionName}
              onChange={handleChatSessionNameChange}
              placeholder="Enter chat session name..."
            />
            <Button className="w-1/4 py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 ml-4" onClick={handleChatSessionSave}>
              Save
            </Button>
          </div>
          <Export handleExport={() => handleExport(messages as Messages)} />
        </div>
      </div>
      <div className="col-span-1 md:col-span-6 lg:col-span-6 xl:col-span-6">
        <Chatbot messages={messages} setMessages={setMessages} chatSession={chatSession} chatSessions={chatSessions} maxTokens={maxTokens} temperature={temperature} topP={topP} repetitionPenalty={repetitionPenalty} systemMessage={systemMessage} />
      </div>
      <div className="col-span-1 md:col-span-3 lg:col-span-3 xl:col-span-3">
        <Sliders
          maxTokens={maxTokens}
          setMaxTokens={setMaxTokens}
          temperature={temperature}
          setTemperature={setTemperature}
          topP={topP}
          setTopP={setTopP}
          repetitionPenalty={repetitionPenalty}
          setRepetitionPenalty={setRepetitionPenalty}
          systemMessage={systemMessage}
          setSystemMessage={setSystemMessage}
        />
      </div>
    </div>
  );
};