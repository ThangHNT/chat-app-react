import { createContext, useEffect, useState } from 'react';

const SocketContext = createContext();

function SocketContextProvider({ children }) {
    console.log('socket-context');

    const [newUser, setNewUser] = useState();
    const [userList, setUserList] = useState([]);
    const [socket, setSocket] = useState();

    const handleInitSocket = (socket) => {
        setSocket(socket);
    };

    useEffect(() => {
        if (socket) {
            socket.on('users', (users) => {
                // console.log('get users');
                setUserList(users);
            });
            socket.on('user just connected', (user) => {
                // console.log(user);
                setNewUser(user);
            });
        }
    }, [socket]);

    const handleSendMessage = (data) => {};

    const values = { newUser, userList, handleSendMessage, handleInitSocket };

    return <SocketContext.Provider value={values}>{children}</SocketContext.Provider>;
}

export { SocketContextProvider, SocketContext };
