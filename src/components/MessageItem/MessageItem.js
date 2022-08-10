import React from 'react';

import classNames from 'classnames/bind';
import styles from './MessageItem.module.scss';
import Image from '~/components/Image';

const cx = classNames.bind(styles);

function MessageItem({ userId, avatar, username, message, onClick }) {
    return (
        <div className={cx('wrapper')} userid={userId} onClick={onClick}>
            <div className={cx('avatar')}>
                <Image src={avatar} avatar alt="avatar" />
                <span className="online"></span>
            </div>
            <div className={cx('info')}>
                <span className={cx('username')}>{username}</span>
                <p className={cx('message')}>{message}</p>
            </div>
        </div>
    );
}

export default MessageItem;
