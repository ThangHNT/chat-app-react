import { useState, createContext, useEffect } from 'react';

const UserContext = createContext();

function UserProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('chat-app-hnt'));
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    const handleSeCurrenttUser = (user) => {
        setCurrentUser(user);
    };

    const values = {
        currentUser,
        handleSeCurrenttUser,
    };

    return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
}

export { UserContext, UserProvider };
