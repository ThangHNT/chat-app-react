import { useState, createContext } from 'react';

const ChatContentContext = createContext();

function ChatContentProvider({ children }) {
    // console.log('chat-context');
    const [receiver, setReciever] = useState();
    const [messages, setMessages] = useState();
    const [fileInput, setFileInput] = useState('');
    const [zoomImg, setZoomImg] = useState();

    const handleDisplayChatContent = (userId) => {
        setReciever(userId);
    };

    const handleAddMessage = (messages) => {
        setMessages(messages);
    };

    const handleGetFileInput = (string) => {
        setFileInput(string);
    };

    const handleZoomImgae = (src) => {
        setZoomImg(src);
    };

    const values = {
        receiver,
        zoomImg,
        messages,
        fileInput,
        handleDisplayChatContent,
        handleAddMessage,
        handleGetFileInput,
        handleZoomImgae,
    };

    return <ChatContentContext.Provider value={values}>{children}</ChatContentContext.Provider>;
}

export { ChatContentContext, ChatContentProvider };
