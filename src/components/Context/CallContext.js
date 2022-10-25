import { createContext, useState } from 'react';

const CallContext = createContext();

function CallProvider({ children }) {
    const [displayCallVideo, setDisplayCallVideo] = useState();
    const [initCall, setInitCall] = useState(false);
    const [waitUserAnswer, setWaitUserAnswer] = useState();
    const [newCall, setNewCall] = useState(false);

    const handleInitCall = (value) => {
        setInitCall(value);
    };

    const handleSetNewCall = (user) => {
        setNewCall(user);
    };

    const handleSetWaitUserAnswer = (user) => {
        setWaitUserAnswer(user);
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
        initCall,
        waitUserAnswer,
        newCall,
        handleDisplayCallVideo,
        handleInitCall,
        handleSetWaitUserAnswer,
        handleSetNewCall,
    };

    return <CallContext.Provider value={values}>{children}</CallContext.Provider>;
}

export { CallContext, CallProvider };
