import { createContext, useEffect, useState } from 'react';

const SocketContext = createContext();

function SocketContextProvider({ children }) {
    // console.log('socket-context');
    const [userList, setUserList] = useState([]);
    const [socket, setSocket] = useState();
    const [newMessage, setNewMessage] = useState();
    const [messageSended, setMessageSended] = useState(new Map());
    const [checkGetDataFromDB, setCheckGetDataFromDB] = useState([]);
    const [newUser, setNewUser] = useState();
    const [userDisconnect, setUserDisconnect] = useState();
    const [newReaction, setNewReaction] = useState();
    // console.log(userList);

    // lắng nghe event từ socket
    useEffect(() => {
        if (socket) {
            socket.on('users', (users) => {
                // console.log('get all users');
                setUserList(users);
            });
            socket.on('user just connected', (user) => {
                // console.log('new user');
                setNewUser(user);
                setUserList((pre) => [...pre, user]);
            });
            socket.on('private message', (data) => {
                // console.log(data.content);
                handleCheckGetDataFromDB(data.sender);
                handlSetMessageSended(data.sender, data.content);
                setNewMessage(data);
            });
            socket.on('private reaction message', (data) => {
                // console.log(data);
                handlSetMessageSended(data.sender, [data], false, true);
                setNewReaction(data);
            });
            socket.on('user disconnected', (socketId) => {
                setUserDisconnect(socketId);
            });
        }
        // eslint-disable-next-line
    }, [socket]);

    // khoi tao socket
    const handleInitSocket = (socket) => {
        setSocket(socket);
    };

    // kiểm tra xem đã lấy dữ liệu chưa, lấy r thì thêm userid vào mảng
    const handleCheckGetDataFromDB = (userId) => {
        setCheckGetDataFromDB((pre) => [...pre, userId]);
    };

    // lưu tin nhắn vào bộ nhớ của client
    const handlSetMessageSended = (key, value, fromDB = false, reaction = false) => {
        const checkKey = messageSended.has(key);
        // console.log(value);
        if (!checkKey) {
            if (!reaction) {
                messageSended.set(key, value);
            }
        } else {
            if (fromDB) {
                const oldData = messageSended.get(key);
                setMessageSended(() => {
                    return messageSended.set(key, [...value, ...oldData]);
                });
            } else {
                const oldData = messageSended.get(key);
                if (reaction) {
                    console.log(value);
                    oldData.forEach((data) => {
                        if (data.id === value[0].messageId) {
                            data.reactionIcon = value[0].icon;
                        }
                    });
                }
                setMessageSended(() => {
                    return messageSended.set(key, [...oldData, ...value]);
                });
            }
        }
    };

    // thay đổi ds người online
    const handleSetUserList = (newUserList) => {
        setUserList(newUserList);
    };

    // set tin nhắn mới
    const handleSetNewMessage = (message) => {
        setNewMessage(message);
    };

    // set reaction icon mới
    const handleSetNewReaction = (reaction) => {
        setNewReaction(reaction);
    };

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
        userDisconnect,
        newUser,
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
        handleSetUserList,
    };

    return <SocketContext.Provider value={values}>{children}</SocketContext.Provider>;
}

export { SocketContextProvider, SocketContext };
