import { createContext, useState } from 'react';

const MessageContext = createContext();

function MessageProvider({ children }) {
    const [messages, setMessages] = useState(new Map());

    const handleSetMessages = (key, value, messageId, reaction = false, revoke = false) => {
        const allMessage = messages.get(key);
        // console.log(key);
        if (allMessage) {
            if (revoke) {
                allMessage.forEach((item) => {
                    if (item.id === messageId) {
                        item.reactionIcon = value;
                        item.type = 'revoked';
                        item.text = 'Tin nhắn đã bị thu hồi';
                        item.file = undefined;
                        item.video = undefined;
                        item.audio = undefined;
                    }
                });
                setMessages((pre) => {
                    return pre.set(key, [...allMessage]);
                });
            }
            if (!reaction) {
                setMessages((pre) => {
                    return pre.set(key, [...allMessage, ...value]);
                });
            } else {
                allMessage.forEach((item) => {
                    if (item.id === messageId) {
                        item.reactionIcon = value;
                    }
                });
                setMessages((pre) => {
                    return pre.set(key, [...allMessage]);
                });
            }
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