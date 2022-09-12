import { createContext, useEffect, useState } from 'react';

const SocketContext = createContext();

function SocketContextProvider({ children }) {
    // console.log('socket-context');
    const [userList, setUserList] = useState([]);
    const [socket, setSocket] = useState();
    const [newMessage, setNewMessage] = useState();
    const [messageSended, setMessageSended] = useState(new Map());
    const [checkGetDataFromDB, setCheckGetDataFromDB] = useState([]);
    const [newReaction, setNewReaction] = useState();

    // khoi tao socket
    const handleInitSocket = (socket) => {
        setSocket(socket);
    };

    // kiểm tra xem đã lấy dữ liệu chưa, lấy r thì thêm userid vào mảng
    const handleCheckGetDataFromDB = (userId) => {
        setCheckGetDataFromDB((pre) => [...pre, userId]);
    };

    // lưu tin nhắn vào bộ nhớ của client
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

    // set tin nhắn mới
    const handleSetNewMessage = (message) => {
        setNewMessage(message);
    };

    // set reaction icon mới
    const handleSetNewReaction = (reaction) => {
        setNewReaction(reaction);
    };

    // lắng nghe event từ socket
    useEffect(() => {
        if (socket) {
            socket.on('users', (users) => {
                // console.log(users);
                setUserList(users);
            });
            socket.on('user just connected', (user) => {
                // console.log(user);
                setUserList((pre) => [...pre, user]);
            });
            socket.on('private message', (data) => {
                // console.log(data.content);
                setNewMessage(data);
            });
            socket.on('private reaction message', (data) => {
                // console.log(data);
                setNewReaction(data);
            });
            socket.on('user disconnected', (socketId) => {
                let newUsers = [];
                userList.forEach((user) => {
                    if (user.socketId !== socketId) {
                        newUsers.push(user);
                    }
                });
                // console.log(socketId);
                setUserList([...newUsers]);
            });
        }
        // eslint-disable-next-line
    }, [socket]);

    // gửi tin nhắn
    const handleSendMessage = (data, reactionIcon = false) => {
        if (userList.length > 0) {
            const { receiver, content, icon, messageId, sender } = data;
            let to = '';
            for (let i = 0; i < userList.length; i++) {
                if (userList[i].userId === receiver) {
                    to = userList[i].socketId;
                    break;
                }
            }
            let message;
            if (reactionIcon) {
                // khi gửi reaction icon
                message = {
                    sender,
                    to,
                    from: socket.id,
                    icon,
                    receiver,
                    messageId,
                };
                socket.emit('send reaction icon', message);
                return;
            } else {
                message = {
                    sender,
                    to,
                    from: socket.id,
                    content,
                    receiver,
                };
            }
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
        userList,
        newMessage,
        messageSended,
        checkGetDataFromDB,
        newReaction,
        handlSetMessageSended,
        handleSendMessage,
        handleSetNewMessage,
        handleInitSocket,
        handleCheckGetDataFromDB,
        handleSetNewReaction,
    };

    return <SocketContext.Provider value={values}>{children}</SocketContext.Provider>;
}

export { SocketContextProvider, SocketContext };
