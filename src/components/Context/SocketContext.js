import { createContext, useEffect, useState } from 'react';

const SocketContext = createContext();

function SocketContextProvider({ children }) {
    // console.log('socket-context');

    const [newUser, setNewUser] = useState();
    const [userList, setUserList] = useState([]);
    const [socket, setSocket] = useState();
    const [newMessage, setNewMessage] = useState();
    const [messageSended, setMessageSended] = useState(new Map());
    const [checkGetDataFromDB, setCheckGetDataFromDB] = useState([]);

    const handleInitSocket = (socket) => {
        setSocket(socket);
    };

    const handleCheckGetDataFromDB = (userId) => {
        setCheckGetDataFromDB((pre) => [...pre, userId]);
    };

    const handlSetMessageSended = (key, value, fromDB = false) => {
        const checkKey = messageSended.has(key);
        if (!checkKey) {
            messageSended.set(key, value);
        } else {
            if (fromDB) {
                const oldData = messageSended.get(key);
                setMessageSended(() => {
                    return messageSended.set(key, [...value, ...oldData]);
                });
            } else {
                const oldData = messageSended.get(key);
                setMessageSended(() => {
                    return messageSended.set(key, [...oldData, ...value]);
                });
            }
        }
    };

    const handleSetNewMessage = (message) => {
        setNewMessage(message);
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
                setNewMessage(data);
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
            const { receiver, content, sender } = data;
            let to = '';
            for (let i = 0; i < userList.length; i++) {
                if (userList[i].userId === receiver) {
                    to = userList[i].socketId;
                    break;
                }
            }
            const message = {
                sender,
                to,
                from: socket.id,
                content,
                receiver,
            };
            const formatMessage = content.map((msg) => {
                return {
                    ...msg,
                    sender,
                };
            });
            handlSetMessageSended(receiver, formatMessage);
            socket.emit('send message', message);
            // console.log('from', socket.id);
            // console.log('to', to);
        }
    };

    const values = {
        socket,
        newUser,
        userList,
        newMessage,
        messageSended,
        checkGetDataFromDB,
        handlSetMessageSended,
        handleSendMessage,
        handleSetNewMessage,
        handleInitSocket,
        handleCheckGetDataFromDB,
    };

    return <SocketContext.Provider value={values}>{children}</SocketContext.Provider>;
}

export { SocketContextProvider, SocketContext };
