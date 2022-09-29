import { createContext, useEffect, useState } from 'react';

const SocketContext = createContext();

function SocketContextProvider({ children }) {
    // console.log('socket-context');
    const [userList, setUserList] = useState([]);
    const [socket, setSocket] = useState();
    const [newMessage, setNewMessage] = useState();
    const [messageSended, setMessageSended] = useState(new Map());
    const [blockStatus, setBlockStatus] = useState(new Map());
    const [checkGetMessagesFromDB, setCheckGetMessagesFromDB] = useState([]);
    const [newUser, setNewUser] = useState();
    const [userDisconnect, setUserDisconnect] = useState();
    const [newReaction, setNewReaction] = useState();
    const [preventation, setPreventation] = useState();
    const [reactionRemoved, setReactionRemoved] = useState();
    const [theme, setTheme] = useState(new Map());
    const [changeTheme, setChangeTheme] = useState();

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
                document.title = 'Co tin nhan moi';
                handleCheckGetMessagesFromDB(data.sender);
                handlSetMessageSended(data.sender, data.content);
                setNewMessage(data);
            });
            socket.on('private reaction message', (data) => {
                // console.log(data);
                handlSetMessageSended(data.sender, [data], false, true);
                setNewReaction(data);
            });
            socket.on('user is blocked', ({ receiver, sender }) => {
                // console.log(sender);
                setPreventation({ receiver, sender, block: true });
            });
            socket.on('user is unblocked', ({ receiver, sender }) => {
                // console.log(sender);
                setPreventation({ receiver, sender, unblock: true });
            });
            socket.on('remove reaction icon private', ({ receiver, messageId }) => {
                // console.log(receiver);
                handleRemoveMessageSended(receiver, messageId, true);
                setReactionRemoved(messageId);
            });
            socket.on('change theme private', (data) => {
                // console.log(data);
                // handleChangeThemeSocket(data.user, data.theme);
                setChangeTheme(data);
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

    // phát sự kiện thay đổi chủ đề
    const handleChangeTheme = (sender, receiver, theme) => {
        let to = getSocketIdFromReceiverId(userList, receiver);
        socket.emit('change theme', { from: socket.id, to, sender, theme });
    };

    // lắng nghe event thay đổi chủ đề
    const handleChangeThemeSocket = (key, value) => {
        const oldData = theme.get(key);
        // console.log(oldData);
        if (oldData) {
            setTheme(() => {
                return oldData.set(key, value);
            });
        } else {
            setTheme(theme.set(key, value));
        }
    };

    // kiểm tra xem đã lấy dữ liệu chưa, lấy r thì thêm userid vào mảng
    const handleCheckGetMessagesFromDB = (userId) => {
        setCheckGetMessagesFromDB((pre) => [...pre, userId]);
    };

    // set tình trạng chặn
    const handleSetBlockStatus = (key, value) => {
        const checkKey = blockStatus.has(key);
        if (!checkKey) {
            blockStatus.set(key, { value });
        } else {
            const oldData = blockStatus.get(key);
            setBlockStatus(() => {
                return blockStatus.set(key, [...oldData, ...value]);
            });
        }
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
                    // console.log(value);
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

    // xóa bỏ tin nhắn đã gửi
    const handleRemoveMessageSended = (key, value, reaction = false) => {
        const checkKey = messageSended.has(key);
        if (checkKey) {
            const oldData = messageSended.get(key);
            if (reaction) {
                oldData.forEach((item) => {
                    if (item.id === value) {
                        item.reactionIcon = '';
                    }
                });
            }
        }
    };

    // phát sự kiện xóa bỏ reaction icon
    const handleRemoveReactionIcon = (receiver, messageId) => {
        handleRemoveMessageSended(receiver, messageId, true);
        let to = getSocketIdFromReceiverId(userList, receiver);
        socket.emit('remove reaction icon', { from: socket.id, to, receiver, messageId });
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

    // lấy socketId từ receiver id
    const getSocketIdFromReceiverId = (users, receiver) => {
        let to = '';
        for (let i = 0; i < users.length; i++) {
            if (users[i].userId === receiver) {
                to = users[i].socketId;
                break;
            }
        }
        return to;
    };

    // phát sự kiện chặn ng dùng
    const handleBlockUser = ({ sender, receiver }) => {
        // console.log(sender, receiver);
        let to = getSocketIdFromReceiverId(userList, receiver);
        socket.emit('block-user', { from: socket.id, to, sender, receiver });
    };

    // phát sự kiện bỏ chặn ng dùng
    const handleUnblockUser = ({ sender, receiver }) => {
        let to = getSocketIdFromReceiverId(userList, receiver);
        socket.emit('unblock-user', { from: socket.id, to, sender, receiver });
    };

    // gửi tin nhắn
    const handleSendMessage = (data, reactionIcon = false) => {
        if (userList.length > 0) {
            const { receiver, content, icon, messageId, sender } = data;
            let to = getSocketIdFromReceiverId(userList, receiver);
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
        preventation,
        blockStatus,
        userDisconnect,
        newUser,
        socket,
        userList,
        newMessage,
        messageSended,
        checkGetMessagesFromDB,
        newReaction,
        reactionRemoved,
        theme,
        changeTheme,
        handlSetMessageSended,
        handleSendMessage,
        handleSetNewMessage,
        handleInitSocket,
        handleCheckGetMessagesFromDB,
        handleSetNewReaction,
        handleSetUserList,
        handleSetBlockStatus,
        handleBlockUser,
        handleUnblockUser,
        handleRemoveMessageSended,
        handleRemoveReactionIcon,
        handleChangeTheme,
    };

    return <SocketContext.Provider value={values}>{children}</SocketContext.Provider>;
}

export { SocketContextProvider, SocketContext };
