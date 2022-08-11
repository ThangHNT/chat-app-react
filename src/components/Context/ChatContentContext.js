import { useState, createContext } from 'react';

const ChatContentContext = createContext();

function ChatContentProvider({ children }) {
    const [receiver, setReciever] = useState();

    const handleDisplayChatContent = (userId) => {
        setReciever(userId);
    };

    const values = {
        receiver,
        handleDisplayChatContent,
    };

    return <ChatContentContext.Provider value={values}>{children}</ChatContentContext.Provider>;
}

export { ChatContentContext, ChatContentProvider };
