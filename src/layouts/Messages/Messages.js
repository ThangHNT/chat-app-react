import { useEffect, useState, memo, useContext } from 'react';
import classNames from 'classnames/bind';
import axios from 'axios';
import styles from './Messages.module.scss';
import Message from '~/components/Message';
import host from '~/ulties/serverHost';
import { ChatContentContext } from '~/components/Context/ChatContentContext';

const cx = classNames.bind(styles);

function Messages({ receiver }) {
    const ChatContent = useContext(ChatContentContext);
    const sender = JSON.parse(localStorage.getItem('chat-app-hnt'))._id;
    const [messages, setMessages] = useState([]);

    // hiện tin nhắn trên đoạn chat khi vừa ấn enter
    useEffect(() => {
        const newMessage = {
            content: ChatContent.messages,
            sender,
            time: new Date().getTime(),
        };
        setMessages((pre) => {
            return [...pre, newMessage];
        });
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
                console.log(data2);
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

    return (
        <div className={cx('wrapper')}>
            {messages &&
                messages.map((message, index) => (
                    <div key={index} className={cx('message-item')}>
                        {sender === message.sender ? (
                            <Message time={getTime(messages[index].time)} sender text></Message>
                        ) : (
                            <Message time={getTime(messages[index].time)} text></Message>
                        )}
                    </div>
                ))}
        </div>
    );
}

export default memo(Messages);
