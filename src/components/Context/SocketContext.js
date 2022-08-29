import { createContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import host from '~/ulties/serverHost';

const SocketContext = createContext();

function SocketContextProvider({ children }) {
    // console.log('socket-context');

    const [newUser, setNewUser] = useState();
    const [userList, setUserList] = useState([]);
    const [currentUser, setCurrentUser] = useState();
    const [socket, setSocket] = useState();
    useEffect(() => {
        if (currentUser) {
            const socket = io(host);
            socket.auth = { userId: currentUser._id };
            setSocket(socket);
        }
    }, [currentUser]);

    useEffect(() => {
        if (socket) {
            socket.on('users', (users) => {
                console.log(users);
                setUserList(users);
            });
            socket.on('user just connected', (user) => {
                console.log(user);
                setNewUser(user);
            });
        }
    }, [socket]);

    const handleSetCurrentUser = (user) => {
        setCurrentUser(user);
    };

    const handleSendMessage = (data) => {};

    const values = { newUser, userList, handleSendMessage, handleSetCurrentUser };

    return <SocketContext.Provider value={values}>{children}</SocketContext.Provider>;
}

export { SocketContextProvider, SocketContext };
