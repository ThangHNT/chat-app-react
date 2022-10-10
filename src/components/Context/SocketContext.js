import { createContext, useEffect, useState } from 'react';

const SocketContext = createContext();

function SocketContextProvider({ children }) {
    // console.log('socket-context');
    const [userList, setUserList] = useState([]);
    const [socket, setSocket] = useState();
    const [newMessage, setNewMessage] = useState(new Map());
    const [blockStatus, setBlockStatus] = useState(new Map());
    const [newUser, setNewUser] = useState();
    const [userDisconnect, setUserDisconnect] = useState();
    const [newReaction, setNewReaction] = useState();
    const [preventation, setPreventation] = useState();
    const [reactionRemoved, setReactionRemoved] = useState();
    const [newTheme, setNewTheme] = useState();
    const [newBackgroundImage, setNewBackgroundImage] = useState();
    const [getSetting, setGetSetting] = useState(new Map());

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
                // console.log(data);
                document.title = 'Co tin nhan moi';
                handleSetNewMessage(data.sender, data.content);
            });
            socket.on('private reaction message', (data) => {
                // console.log(data);
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
                setReactionRemoved(messageId);
            });
            socket.on('change theme private', (data) => {
                // console.log(data);
                setNewTheme(data);
            });
            socket.on('change background private', (data) => {
                // console.log(data);
                setNewBackgroundImage(data);
            });

            socket.on('revoke message private', (data) => {
                // console.log(data);
                // setNewMessage({ sender: data.sender, revoked: true, messageId: data.messageId });
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

    const handleSetNewMessage = (sender, content, remove = false) => {
        if (!remove) {
            setNewMessage({ sender, content });
        } else {
            setNewMessage(undefined);
        }
    };

    // phát sự kiện thay đổi setting (lấy setting lần đầu từ db)
    const handleChangeSetting = (key, value) => {
        if (key && value) {
            setGetSetting((pre) => {
                return pre.set(key, value);
            });
        }
    };

    // bỏ event thay đổi chủ đề và ảnh nền
    const handleRemoveSocketEvent = (theme = false, backgroundImage = false) => {
        if (theme) {
            setNewTheme(undefined);
        }
        if (backgroundImage) {
            setNewBackgroundImage(undefined);
        }
    };

    const handleSetBackground = (sender, receiver, background) => {
        let to = getSocketIdFromReceiverId(userList, receiver);
        socket.emit('change background', { from: socket.id, to, sender, background });
    };

    // phát sự kiện thay đổi chủ đề
    const handleChangeTheme = (sender, receiver, theme) => {
        let to = getSocketIdFromReceiverId(userList, receiver);
        socket.emit('change theme', { from: socket.id, to, sender, theme });
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
    // phát sự kiện xóa bỏ reaction icon
    const handleRemoveReactionIcon = (receiver, messageId) => {
        let to = getSocketIdFromReceiverId(userList, receiver);
        socket.emit('remove reaction icon', { from: socket.id, to, receiver, messageId });
    };

    // thay đổi ds người online
    const handleSetUserList = (newUserList) => {
        setUserList(newUserList);
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
        newReaction,
        reactionRemoved,
        newTheme,
        newBackgroundImage,
        getSetting,
        handleSendMessage,
        handleSetNewMessage,
        handleInitSocket,
        handleSetNewReaction,
        handleSetUserList,
        handleSetBlockStatus,
        handleBlockUser,
        handleUnblockUser,
        handleRemoveReactionIcon,
        handleChangeTheme,
        handleSetBackground,
        handleChangeSetting,
        handleRemoveSocketEvent,
    };

    return <SocketContext.Provider value={values}>{children}</SocketContext.Provider>;
}

export { SocketContextProvider, SocketContext };
