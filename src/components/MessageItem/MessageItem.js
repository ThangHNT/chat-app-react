import { useEffect, useState, memo } from 'react';
import classNames from 'classnames/bind';
import axios from 'axios';
import styles from './MessageItem.module.scss';
import Image from '~/components/Image';
import host from '~/ulties/serverHost';

const cx = classNames.bind(styles);

function MessageItem({ receiver, avatar, username }) {
    console.log('render-item');
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
                    data2.message.sender === senderId
                        ? setlastestMessage('Ban: ' + data2.message.text)
                        : setlastestMessage(data2.message.text);
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
