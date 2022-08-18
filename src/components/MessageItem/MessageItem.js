import { useEffect, useState, memo } from 'react';
import classNames from 'classnames/bind';
import axios from 'axios';
import styles from './MessageItem.module.scss';
import Image from '~/components/Image';
import host from '~/ulties/serverHost';

const cx = classNames.bind(styles);

function MessageItem({ receiver, avatar, username }) {
    const [lastestMessage, setlastestMessage] = useState();

    useEffect(() => {
        const senderId = JSON.parse(localStorage.getItem('chat-app-hnt'))._id;
        axios
            .post(`${host}/api/lastest-message`, {
                receiver: receiver.id,
                sender: senderId,
            })
            .then((data) => {
                const data2 = data.data;
                if (data2.status) {
                    if (data2.message.message.sender === senderId) {
                        if (data2.message.message.type === 'text') {
                            setlastestMessage('Ban: ' + data2.message.message.text);
                        } else {
                            setlastestMessage('Ban gui 1 anh ');
                        }
                    } else {
                        setlastestMessage(data2.message.message.text);
                    }
                }
            })
            .catch((error) => {
                console.log('loi lay tin nhan gan nhat');
            });
    }, [receiver.id]);

    return (
        <div className={cx('wrapper-message-item')}>
            <div className={cx('avatar')}>
                <Image src={avatar} avatar alt="avatar" />
                <span className="online"></span>
            </div>
            <div className={cx('info')}>
                <span className={cx('username')}>{username}</span>
                <p className={cx('message')}>{lastestMessage}</p>
            </div>
        </div>
    );
}

export default memo(MessageItem);
