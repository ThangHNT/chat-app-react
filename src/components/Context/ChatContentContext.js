import { useState, createContext } from 'react';

const ChatContentContext = createContext();

function ChatContentProvider({ children }) {
    const [receiver, setReciever] = useState();
    const [messages, setMessages] = useState();
    const [base64String, setbase64String] = useState('');

    const handleDisplayChatContent = (userId) => {
        setReciever(userId);
    };

    const handleAddMessage = (message) => {
        setMessages(message);
    };

    const handleGetBase64 = (string) => {
        setbase64String(string);
    };

    const values = {
        receiver,
        handleDisplayChatContent,
        messages,
        handleAddMessage,
        base64String,
        handleGetBase64,
    };

    return <ChatContentContext.Provider value={values}>{children}</ChatContentContext.Provider>;
}

export { ChatContentContext, ChatContentProvider };
