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

const cx = classNames.bind(styles);

function Messages({ receiver, darkmodeMsg = false }) {
    // console.log('Messages');
    const { backgroundImage, handleSetBackgroundImage } = useContext(SettingContext);
    const ChatContent = useContext(ChatContentContext);
    const {
        newMessage,
        messageSended,
        newBackgroundImage,
        checkGetMessagesFromDB,
        handlSetMessageSended,
        handleCheckGetMessagesFromDB,
        handleSetNewMessage,
        handleRemoveSocketEvent,
    } = useContext(SocketContext);

    const [scrollDown, setScrollDown] = useState(false);
    const [messages, setMessages] = useState([]);

    const sender = useMemo(() => {
        return JSON.parse(localStorage.getItem('chat-app-hnt'))._id;
    }, []);

    const contentRef = useRef();
    const backgroundRef = useRef();

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
            // console.log('new msg', newMessage.content);
            if (newMessage.sender === receiver.id) {
                setMessages((pre) => {
                    return [...pre, ...newMessage.content];
                });
                document.title = 'Chat app';
                handleSetNewMessage(undefined);
            }
        }
        // eslint-disable-next-line
    }, [newMessage]);

    // hiện tin nhắn trên đoạn chat khi vừa ấn enter
    useEffect(() => {
        const msg = ChatContent.messages;
        if (msg) {
            // console.log(msg);
            const arr = msg.content.map((message) => {
                return {
                    text: message.type === 'text' ? message.text : '',
                    img: message.type === 'img' ? message.img : '',
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
        }
        // eslint-disable-next-line
    }, [ChatContent.messages]);

    // cuộn tin nhắn xuống dưới cùng khi load xog đoạn chat
    useEffect(() => {
        contentRef.current.scrollTop = contentRef.current.scrollHeight;
        // eslint-disable-next-line
    }, [messages]);

    // tải messages từ database lần đầu, lần sau lấy từ client store
    useEffect(() => {
        const messagesSended = messageSended.get(receiver.id);
        if (messagesSended) {
            // console.log(messagesSended);
            // click vào messageItem lần đầu khi có tin nhắn mới
            const checkGetData = checkGetMessagesFromDB.some((userId) => {
                return userId === receiver.id;
            });
            if (!checkGetData) {
                // nếu chưa load data from db lần đầu
                // console.log('can goi api');
                axios
                    .post(`${host}/api/get/messages`, {
                        sender: sender,
                        receiver: receiver.id,
                    })
                    .then((data) => {
                        // console.log('data from db', data.data.arr);
                        if (data.data.status) {
                            let data2 = data.data.arr;
                            setMessages([...data2, ...messagesSended]);
                            handleCheckGetMessagesFromDB(receiver.id);
                            handlSetMessageSended(receiver.id, data2, true);
                        }
                    })
                    .catch((error) => {
                        console.log('loi lay tin nhan 2');
                    });
            } else {
                // từ lần 2 chỉ load data từ bộ nhớ client
                // console.log('ko can goi api');
                // console.log(messagesSended);
                setMessages([...messagesSended]);
            }
        } else {
            // click vào messageItem khi chưa có tn mới và load data from db
            // console.log('get data from db');
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
                        handlSetMessageSended(receiver.id, data2);
                        handleCheckGetMessagesFromDB(receiver.id);
                    }
                })
                .catch((error) => {
                    console.log('loi lay tin nhan');
                });
        }
        // eslint-disable-next-line
    }, []);

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
                {/* {messages.length > 0 &&
                    messages.map((message, index) => (
                        <div key={index} className={cx('message-item')}>
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
                                    : message.file}
                            </Message>
                        </div>
                    ))} */}
                <Message
                    type="revoked"
                    receiver="62f0bda97ed6bdef2eae1ea7"
                    time="14 : 12"
                    sender={true}
                    messageId="62fd0377bfd8faa6b0b2dc14"
                    messageBody={contentRef}
                    reaction=""
                    darkmodeMsg={false}
                >
                    {'tin nhan da thu hoi'}
                </Message>
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
