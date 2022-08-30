import { createContext, useEffect, useState } from 'react';

const SocketContext = createContext();

function SocketContextProvider({ children }) {
    // console.log('socket-context');

    const [newUser, setNewUser] = useState();
    const [userList, setUserList] = useState([]);
    const [socket, setSocket] = useState();

    const handleInitSocket = (socket) => {
        setSocket(socket);
    };

    console.log(userList);

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
                console.log(data);
            });
        }
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
            // console.log(userList);
            // console.log('from', socket.id);
            // console.log('to', to);
            const data2 = {
                to: to,
                from: socket.id,
                content,
            };
            socket.emit('send message', data2);
        }
    };

    const values = { newUser, userList, handleSendMessage, handleInitSocket };

    return <SocketContext.Provider value={values}>{children}</SocketContext.Provider>;
}

export { SocketContextProvider, SocketContext };
