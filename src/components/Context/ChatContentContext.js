import { useState, createContext } from 'react';

const ChatContentContext = createContext();

function ChatContentProvider({ children }) {
    const [receiver, setReciever] = useState();
    const [messages, setMessages] = useState('');

    const handleDisplayChatContent = (userId) => {
        setReciever(userId);
    };

    const handleAddMessage = (message) => {
        setMessages(message);
    };

    const values = {
        receiver,
        handleDisplayChatContent,
        messages,
        handleAddMessage,
    };

    return <ChatContentContext.Provider value={values}>{children}</ChatContentContext.Provider>;
}

export { ChatContentContext, ChatContentProvider };
