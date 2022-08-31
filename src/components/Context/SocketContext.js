import { createContext, useEffect, useState } from 'react';

const SocketContext = createContext();

function SocketContextProvider({ children }) {
    console.log('socket-context');

    const [newUser, setNewUser] = useState();
    const [userList, setUserList] = useState([]);
    const [socket, setSocket] = useState();
    const [newMessage, setNewMessage] = useState('');

    const handleInitSocket = (socket) => {
        setSocket(socket);
    };

    useEffect(() => {
        if (socket) {
            socket.on('users', (users) => {
                // console.log(users);
                setUserList(users);
            });
            socket.on('user just connected', (user) => {
                // console.log(user);
                setNewUser(user);
                setUserList((pre) => [...pre, user]);
            });
            socket.on('private message', (data) => {
                // console.log(data.content);
                setNewMessage(data.content);
            });
            socket.on('user disconnected', (socketId) => {
                let newUsers = [];
                userList.forEach((user) => {
                    if (user.socketId !== socketId) {
                        newUsers.push(user);
                    }
                });
                setUserList(newUsers);
            });
        }
        // eslint-disable-next-line
    }, [socket]);

    const handleSendMessage = (data) => {
        if (userList.length > 0) {
            const { receiver, content } = data;
            let to = '';
            for (let i = 0; i < userList.length; i++) {
                if (userList[i].userId === receiver) {
                    to = userList[i].socketId;
                    break;
                }
            }
            const message = {
                to,
                from: socket.id,
                content,
            };
            socket.emit('send message', message);
            // console.log('from', socket.id);
            // console.log('to', to);
        }
    };

    const values = { newUser, userList, newMessage, handleSendMessage, handleInitSocket };

    return <SocketContext.Provider value={values}>{children}</SocketContext.Provider>;
}

export { SocketContextProvider, SocketContext };
