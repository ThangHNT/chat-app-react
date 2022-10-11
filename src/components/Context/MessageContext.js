import { createContext, useState } from 'react';

const MessageContext = createContext();

function MessageProvider({ children }) {
    const [messages, setMessages] = useState(new Map());
    const [removeMessage, setRemoveMessage] = useState();
    const [lastestMsg, setLastMsg] = useState();

    const handleSetLastestMsg = (msg) => {
        setLastMsg(msg);
    };

    const handleSetRemoveMessage = (messageId) => {
        setRemoveMessage(messageId);
    };

    const handleSetMessages = (key, value, messageId, reaction = false, revoke = false, remove = false) => {
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
            } else if (remove) {
                handleSetRemoveMessage({ messageId, receiver: key });
                let index = '';
                allMessage.forEach((item, thisIndex) => {
                    if (item.id === messageId) {
                        index = thisIndex;
                    }
                });
                allMessage.splice(index, 1);
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
        removeMessage,
        lastestMsg,
        handleSetMessages,
        handleSetRemoveMessage,
        handleSetLastestMsg,
    };

    return <MessageContext.Provider value={values}>{children}</MessageContext.Provider>;
}

export { MessageContext, MessageProvider };
