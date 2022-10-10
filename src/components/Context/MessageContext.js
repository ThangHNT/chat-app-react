import { createContext, useState } from 'react';

const MessageContext = createContext();

function MessageProvider({ children }) {
    const [messages, setMessages] = useState(new Map());

    const handleSetMessages = (key, value) => {
        const allMessage = messages.get(key);
        // console.log(key, value);
        if (allMessage) {
            setMessages((pre) => {
                return pre.set(key, [...allMessage, ...value]);
            });
        } else {
            setMessages((pre) => {
                return pre.set(key, value);
            });
        }
    };

    const values = {
        messages,
        handleSetMessages,
    };

    return <MessageContext.Provider value={values}>{children}</MessageContext.Provider>;
}

export { MessageContext, MessageProvider };
