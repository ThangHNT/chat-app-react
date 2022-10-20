import { createContext, useState } from 'react';

const CallContext = createContext();

function CallProvider({ children }) {
    const [displayCallVideo, setDisplayCallVideo] = useState();

    const handleDisplayCallVideo = () => {
        setDisplayCallVideo((pre) => !pre);
    };

    const values = {
        displayCallVideo,
        handleDisplayCallVideo,
    };

    return <CallContext.Provider value={values}>{children}</CallContext.Provider>;
}

export { CallContext, CallProvider };
