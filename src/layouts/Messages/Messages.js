import { useEffect, useState, memo, useContext, useRef } from 'react';
import classNames from 'classnames/bind';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Messages.module.scss';
import Message from '~/components/Message';
import host from '~/ulties/serverHost';
import { ChatContentContext } from '~/components/Context/ChatContentContext';
import Button from '~/components/Button';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Messages({ receiver }) {
    console.log('Messagessss');
    const ChatContent = useContext(ChatContentContext);
    const sender = JSON.parse(localStorage.getItem('chat-app-hnt'))._id;
    const [messages, setMessages] = useState([]);

    const contentRef = useRef();
    const [scrollDown, setScrollDown] = useState(false);

    // cuộn tin nhắn xuống dưới cùng khi load xog đoạn chat
    useEffect(() => {
        contentRef.current.scrollTop = contentRef.current.scrollHeight;
        // eslint-disable-next-line
    }, [messages]);

    // hiện tin nhắn trên đoạn chat khi vừa ấn enter
    useEffect(() => {
        // console.log(ChatContent.messages);
        // let msg = ChatContent.messages;
        // if (msg) {
        //     const newMessage = {
        //         text: msg.msg,
        //         img: msg.msg,
        //         sender,
        //         time: new Date().getTime(),
        //         type: msg.type,
        //     };
        //     setMessages((pre) => {
        //         return [...pre, newMessage];
        //     });
        // }
        // eslint-disable-next-line
    }, [ChatContent.messages]);

    // tải messages từ database
    useEffect(() => {
        const senderId = JSON.parse(localStorage.getItem('chat-app-hnt'))._id;
        axios
            .post(`${host}/api/get-messages`, {
                sender: senderId,
                receiver: receiver.id,
            })
            .then((data) => {
                let data2 = data.data.arr;
                // console.log(data2);
                setMessages([...data2]);
            })
            .catch((error) => {
                console.log('loi lay tin nhan');
            });
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
