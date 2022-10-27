import { createContext, useState } from 'react';

const CallContext = createContext();

function CallProvider({ children }) {
    const [displayCallVideo, setDisplayCallVideo] = useState();
    const [recipient, setRecipient] = useState(false);
    const [newCall, setNewCall] = useState(false);
    const [refuseCall, setRefuseCall] = useState(false);

    const handleSetRefuseCall = (value) => {
        setRefuseCall(value);
    };

    const handleSetRecipient = (value) => {
        setRecipient(value);
    };

    const handleSetNewCall = (user) => {
        setNewCall(user);
    };

    const handleDisplayCallVideo = (data = false, value) => {
        if (data) {
            setDisplayCallVideo(value);
        } else {
            setDisplayCallVideo((pre) => !pre);
        }
    };

    const values = {
        displayCallVideo,
        recipient,
        newCall,
        refuseCall,
        handleDisplayCallVideo,
        handleSetRecipient,
        handleSetNewCall,
        handleSetRefuseCall,
    };

    return <CallContext.Provider value={values}>{children}</CallContext.Provider>;
}

export { CallContext, CallProvider };
