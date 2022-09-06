import { useEffect, useState, useMemo, memo, useContext, useRef } from 'react';
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

const cx = classNames.bind(styles);

function Messages({ receiver }) {
    // console.log('Messages');
    const ChatContent = useContext(ChatContentContext);
    const {
        newMessage,
        handlSetMessageSended,
        checkGetDataFromDB,
        handleCheckGetDataFromDB,
        handleSetNewMessage,
        messageSended,
    } = useContext(SocketContext);

    const sender = useMemo(() => {
        return JSON.parse(localStorage.getItem('chat-app-hnt'))._id;
    }, []);
    const [messages, setMessages] = useState([]);

    const contentRef = useRef();
    const [scrollDown, setScrollDown] = useState(false);

    // nhận tin nhắn mới nhất từ socket
    useEffect(() => {
        if (newMessage) {
            // console.log('new msg', newMessage);
            if (newMessage.sender === receiver.id) {
                setMessages((pre) => {
                    return [...pre, ...newMessage.content];
                });
                // khi chua goi api send message
                handlSetMessageSended(receiver.id, newMessage.content);

                // khi goi api send message
                /*
                const checkGetData = checkGetDataFromDB.some((userId) => {
                    return userId === receiver.id;
                });
                if (checkGetData) {
                    handlSetMessageSended(receiver.id, newMessage.content);
                } */
                handleSetNewMessage(undefined);
            }
        }
        // eslint-disable-next-line
    }, [newMessage]);

    // hiện tin nhắn trên đoạn chat khi vừa ấn enter
    useEffect(() => {
        const msg = ChatContent.messages;
        if (msg) {
            const arr = msg.content.map((message) => {
                return {
                    text: message.type === 'text' ? message.text : '',
                    img: message.type === 'img' ? message.img : '',
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

    // tải messages từ database
    useEffect(() => {
        const messagesSended = messageSended.get(receiver.id);
        if (messagesSended) {
            // click vào messageItem lần đầu khi có tin nhắn mới
            const checkGetData = checkGetDataFromDB.some((userId) => {
                return userId === receiver.id;
            });
            if (!checkGetData) {
                // nếu chưa load data from db lần đầu
                // console.log('can goi api');
                axios
                    .post(`${host}/api/get-messages`, {
                        sender: sender,
                        receiver: receiver.id,
                    })
                    .then((data) => {
                        let data2 = data.data.arr;
                        // console.log('data from db', data2);
                        setMessages([...data2, ...messagesSended]);
                        handleCheckGetDataFromDB(receiver.id);
                        handlSetMessageSended(receiver.id, data2, true);
                    })
                    .catch((error) => {
                        console.log('loi lay tin nhan');
                    });
            } else {
                // từ lần 2 chỉ load data từ bộ nhớ client
                // console.log('ko can goi api');
                setMessages([...messagesSended]);
            }
        } else {
            // click vào messageItem khi chưa có tn mới và load data from db
            // console.log('get data from db');
            axios
                .post(`${host}/api/get-messages`, {
                    sender: sender,
                    receiver: receiver.id,
                })
                .then((data) => {
                    let data2 = data.data.arr;
                    // console.log('data from db', data2);
                    setMessages([...data2]);
                    handlSetMessageSended(receiver.id, data2);
                    handleCheckGetDataFromDB(receiver.id);
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
        return `${date.getHours()} : ${date.getMinutes()}`;
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

    return (
        <div ref={contentRef} onScroll={handleScroll} className={cx('wrapper')}>
            {messages.length > 0 &&
                messages.map((message, index) => (
                    <div key={index} className={cx('message-item')}>
                        <Message
                            type={message.type}
                            time={getTime(messages[index].time)}
                            sender={sender === message.sender}
                        >
                            {message.type === 'text' ? message.text : message.img}
                        </Message>
                    </div>
                ))}
            {scrollDown && (
                <div onClick={handleScrollDown} className={cx('scroll-down-btn')}>
                    <Button noTitle scrollDown normal circle leftIcon={<FontAwesomeIcon icon={faArrowDown} />} />
                </div>
            )}
        </div>
    );
}

export default memo(Messages);
