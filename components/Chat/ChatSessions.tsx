import { useState } from "react";
import { getFirestore, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { IconButton } from "@radix-ui/themes";
import { Cross1Icon, Pencil2Icon } from "@radix-ui/react-icons";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "@radix-ui/react-dialog";
import { Input, Button } from "@nextui-org/react";

import ChatHeader from './ChatHeader';

type Props = {
  chatSessions: any;
  handleChatSessionLoad: (chatSession: any) => void;
  handleChatSessionStart: () => void;
};

export const ChatSessions = ({ chatSessions, handleChatSessionLoad, handleChatSessionStart }: Props) => {
  const [editName, setEditName] = useState("");
  const [editId, setEditId] = useState("");

  const handleChatSessionClick = (chatSession: any) => {
    handleChatSessionLoad(chatSession);
  };

  const handleChatSessionDelete = async (chatSession: any) => {
    try {
      await deleteDoc(doc(getFirestore(), "chatSessions", chatSession.id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleChatSessionEdit = (chatSession: any) => {
    setEditName(chatSession.name);
    setEditId(chatSession.id);
  };

  const handleChatSessionUpdate = async () => {
    try {
      await updateDoc(doc(getFirestore(), "chatSessions", editId), {
        name: editName,
      });
    } catch (error) {
      console.error(error);
    }
    setEditName("");
    setEditId("");
  };

  const handleEditNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditName(event.target.value);
  };

  return (
    <div className="p-8 rounded-xl shadow-lg transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105">
      <ChatHeader title="Chat with AI" intro="Have fun discussions and explore new ideas." />
      {chatSessions && chatSessions.docs && (
        <ul className="list-none">
          {chatSessions.docs.map((doc: any) => {
            const chatSession = doc;
            return (
              <li key={doc.id} className="flex items-center justify-between bg-white p-4 rounded-lg my-4 shadow transition duration-300 ease-in-out hover:bg-yellow-100">
                <div className="text-lg font-medium text-gray-500 cursor-pointer hover:underline" onClick={() => handleChatSessionClick(chatSession)}>
                  {chatSession.name}
                </div>
                <div className="flex space-x-4">
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <IconButton onClick={() => handleChatSessionEdit(chatSession)} className="text-gray-500 hover:text-gray-500">
                        <Pencil2Icon />
                      </IconButton>
                    </Tooltip.Trigger>
                    <Tooltip.Content side="top" align="center" className="bg-white p-2 rounded-md shadow-lg text-sm">
                      Edit chat session name
                    </Tooltip.Content>
                  </Tooltip.Root>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <IconButton onClick={() => handleChatSessionDelete(chatSession)} className="text-gray-500 hover:text-gray-500">
                        <Cross1Icon />
                      </IconButton>
                    </Tooltip.Trigger>
                    <Tooltip.Content side="top" align="center" className="bg-white p-2 rounded-md shadow-lg text-sm">
                      Delete chat session
                    </Tooltip.Content>
                  </Tooltip.Root>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="shadow" className="w-full py-2 px-4 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75">
            Click to start a new Chat
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-lg p-4 bg-white shadow-xl">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Create new chat session</h3>
          <Input placeholder="Enter chat session name" className="mb-4" />
          <div className="flex justify-end space-x-4">
            <DialogClose asChild>
              <Button color="secondary" className="bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="shadow" className="bg-blue-500 font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" onClick={handleChatSessionStart}>Create</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="shadow" className="w-full py-2 px-4 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-75 mt-4">Update chat session name</Button>
        </DialogTrigger>
        <DialogContent className="rounded-lg p-4 bg-white shadow-xl">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Update chat session name</h3>
          <Input value={editName} onChange={handleEditNameChange} placeholder="Enter chat session name" className="mb-4" />
          <div className="flex justify-end space-x-4">
            <DialogClose asChild>
              <Button color="secondary" className="bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="shadow" onClick={handleChatSessionUpdate} className="bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">Update</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};