import { useEffect, useState, useMemo, memo, useContext, useRef, useLayoutEffect } from 'react';
import classNames from 'classnames/bind';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import styles from './Messages.module.scss';
import Message from '~/components/Message';
import host from '~/ulties/serverHost';
import Button from '~/components/Button';
import { ChatContentContext } from '~/components/Context/ChatContentContext';
import { SocketContext } from '~/components/Context/SocketContext';
import { SettingContext } from '~/components/Context/SettingContext';
import { MessageContext } from '~/components/Context/MessageContext';

const cx = classNames.bind(styles);

function Messages({ receiver, darkmodeMsg = false }) {
    // console.log('Messages');
    const Messages = useContext(MessageContext);
    const { backgroundImage, handleSetBackgroundImage } = useContext(SettingContext);
    const ChatContent = useContext(ChatContentContext);
    const {
        newMessage,
        handleSetNewMessage,
        newBackgroundImage,
        handleRemoveSocketEvent,
        revokeMessage,
        handleRevokeMessage,
    } = useContext(SocketContext);

    const [scrollDown, setScrollDown] = useState(false);
    const [messages, setMessages] = useState([]);

    const sender = useMemo(() => {
        return JSON.parse(localStorage.getItem('chat-app-hnt'))._id;
    }, []);

    const contentRef = useRef();
    const backgroundRef = useRef();

    // tải messages từ database lần đầu, lần sau lấy từ client store
    useEffect(() => {
        const checkGetMessagesFromDB = Messages.messages.get(receiver.id);
        // console.log(checkGetMessagesFromDB);
        if (checkGetMessagesFromDB) {
            setMessages([...checkGetMessagesFromDB]);
        } else {
            axios
                .post(`${host}/api/get/messages`, {
                    sender: sender,
                    receiver: receiver.id,
                })
                .then((data) => {
                    if (data.data.status) {
                        let data2 = data.data.arr;
                        // console.log('data from db', data2);
                        setMessages([...data2]);
                        Messages.handleSetMessages(receiver.id, data2);
                    }
                })
                .catch((error) => {
                    console.log('loi lay tin nhan');
                });
        }
        // eslint-disable-next-line
    }, []);

    // lắng nghe event thu hồi or xóa tin nhắn từ socket
    useEffect(() => {
        if (revokeMessage) {
            // console.log(revokeOrRemoveMessage);
            let { sender, messageId } = revokeMessage;
            messages.forEach((item) => {
                if (item.id === messageId) {
                    item.reactionIcon = '';
                    item.type = 'revoked';
                    item.text = 'Tin nhắn đã bị thu hồi';
                    item.file = undefined;
                    item.video = undefined;
                    item.audio = undefined;
                }
            });
            setMessages(messages);
            Messages.handleSetMessages(sender, '', messageId, false, true);
        }
        handleRevokeMessage();
        // eslint-disable-next-line
    }, [revokeMessage]);

    // cập nhật giao diện khi xóa tin nhắn
    useEffect(() => {
        if (Messages.removeMessage) {
            if (Messages.removeMessage.receiver === receiver.id) {
                let index;
                messages.forEach((item, thisIndex) => {
                    if (item.id === Messages.removeMessage.messageId) {
                        index = thisIndex;
                    }
                });
                if (index) {
                    messages.splice(index, 1);
                    setMessages([...messages]);
                    let lastestMessge = messages[messages.length - 1];
                    if (lastestMessge) {
                        let checkYourMsg = lastestMessge.sender !== receiver.id;
                        // console.log(checkYourMsg);
                        Messages.handleSetLastestMsg({
                            yourMsg: checkYourMsg,
                            receiver: receiver.id,
                            message: lastestMessge,
                        });
                    }
                }
                Messages.handleSetRemoveMessage(undefined);
            }
        }
        // eslint-disable-next-line
    }, [Messages.removeMessage]);

    // thay đổi ảnh nền khi nhận event từ socket
    useLayoutEffect(() => {
        if (newBackgroundImage) {
            if (newBackgroundImage.user === receiver.id) {
                handleSetBackgroundImage(receiver.id, newBackgroundImage.backgroundImage);
                handleRemoveSocketEvent(false, true);
            }
        }
        // eslint-disable-next-line
    }, [newBackgroundImage]);

    // thay đổi ảnh nền
    useLayoutEffect(() => {
        const userId = receiver.id;
        backgroundImage.forEach((item) => {
            if (item.id === userId) {
                if (item.backgroundImage === '') {
                    backgroundRef.current.style.display = 'none';
                } else {
                    handleChangeBackgroundMessage(item.backgroundImage);
                }
            }
        });
        // eslint-disable-next-line
    }, [backgroundImage]);

    // nhận tin nhắn mới nhất từ socket
    useEffect(() => {
        if (newMessage) {
            if (newMessage.sender === receiver.id) {
                // console.log('new message');
                setMessages((pre) => {
                    return [...pre, ...newMessage.content];
                });
                Messages.handleSetMessages(receiver.id, newMessage.content);
                handleSetNewMessage('', '', true);
                document.title = 'Chap App';
            }
        }
        // eslint-disable-next-line
    }, [newMessage]);

    // hiện tin nhắn trên đoạn chat khi vừa ấn enter
    useEffect(() => {
        const msg = ChatContent.messages;
        if (msg) {
            if (msg.receiver === receiver.id) {
                // console.log('an enter');
                const arr = msg.content.map((message) => {
                    return {
                        text: message.type === 'text' ? message.text : '',
                        img: message.type === 'img' ? message.img : '',
                        id: message.id,
                        file:
                            message.type === 'text-file' ||
                            message.type === 'doc-file' ||
                            message.type === 'pdf-file' ||
                            message.type === 'excel-file' ||
                            message.type === 'video' ||
                            message.type === 'audio'
                                ? {
                                      content: message.file.content,
                                      filename: message.file.filename,
                                      size: message.file.size,
                                  }
                                : '',
                        sender,
                        time: new Date().getTime(),
                        type: message.type,
                    };
                });
                setMessages((pre) => {
                    return [...pre, ...arr];
                });
                ChatContent.handleAddMessage(undefined);
                Messages.handleSetMessages(receiver.id, arr);
            }
        }
        // eslint-disable-next-line
    }, [ChatContent.messages]);

    // cuộn tin nhắn xuống dưới cùng khi load xog đoạn chat
    useEffect(() => {
        contentRef.current.scrollTop = contentRef.current.scrollHeight;
        // eslint-disable-next-line
    }, [messages]);

    // chuyển đổi thời gian về dạng giờ phút cho mỗi tin nhắn
    const getTime = (millisecond) => {
        const date = new Date(millisecond);
        let hours = String(date.getHours());
        let minutes = String(date.getMinutes());
        hours = hours.length < 2 ? `0${hours}` : hours;
        minutes = minutes.length < 2 ? `0${minutes}` : minutes;
        return `${hours} : ${minutes}`;
    };

    const handleScroll = () => {
        let currentScrollTop = contentRef.current.scrollTop;
        let firstScollTop = contentRef.current.scrollHeight - contentRef.current.clientHeight;
        if (firstScollTop - currentScrollTop > 350) {
            setScrollDown(true);
        } else {
            setScrollDown(false);
        }
    };

    const handleScrollDown = () => {
        contentRef.current.scrollTop = contentRef.current.scrollHeight;
    };

    const handleChangeBackgroundMessage = (background) => {
        backgroundRef.current.style.display = 'block';
        backgroundRef.current.style.backgroundImage = `url(${background})`;
    };

    return (
        <div ref={contentRef} onScroll={handleScroll} className={cx('wrapper')}>
            <div className={cx('body')}>
                {messages.length > 0 &&
                    messages.map((message, index) => (
                        <div key={index} className={cx('message-item')}>
                            {/* {console.log(message)} */}
                            <Message
                                type={message.type}
                                receiver={receiver.id}
                                time={getTime(messages[index].time)}
                                sender={sender === message.sender}
                                messageId={message.id}
                                messageBody={contentRef}
                                reaction={message.reactionIcon}
                                darkmodeMsg={darkmodeMsg}
                            >
                                {message.type === 'text'
                                    ? message.text
                                    : message.type === 'img'
                                    ? message.img
                                    : message.type === 'revoked'
                                    ? message.text
                                    : message.file}
                            </Message>
                        </div>
                    ))}
            </div>
            <div ref={backgroundRef} className={cx('background-image')}></div>
            {scrollDown && (
                <div onClick={handleScrollDown} className={cx('scroll-down-btn')}>
                    <Button noTitle scrollDown normal circle leftIcon={<FontAwesomeIcon icon={faArrowDown} />} />
                </div>
            )}
        </div>
    );
}

export default memo(Messages);
