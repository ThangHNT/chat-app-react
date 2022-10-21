import { useState, createContext, useEffect } from 'react';

const UserContext = createContext();

function UserProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [friends, setFriends] = useState();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('chat-app-hnt'));
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    const handleGetListFriend = (friendList) => {
        const map = new Map();
        friendList.forEach((item) => {
            map.set(item.id, { avatar: item.avatar, username: item.username });
        });
        setFriends(map);
    };

    const handleSeCurrenttUser = (user) => {
        setCurrentUser(user);
    };

    const values = {
        currentUser,
        friends,
        handleSeCurrenttUser,
        handleGetListFriend,
    };

    return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
}

export { UserContext, UserProvider };
