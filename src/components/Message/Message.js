import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faFaceGrinWide, faReply } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './Message.module.scss';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

function Message({ sender = false, time, type, children, onClick, ...passprops }) {
    const [actionMessage, setActionMessage] = useState(false);
    const classname = cx('content-message', {});

    const props = {
        onClick,
        ...passprops,
    };

    const handleDisplayAction = () => {
        setActionMessage(true);
    };

    const handleHideAction = () => {
        setActionMessage(false);
    };

    const onload = (e) => {
        const target = e.target;
        // const naturalHeight = target.naturalHeight;
        // const naturalWidth = target.naturalWidth;
        // console.log(naturalWidth, naturalHeight);
        target.style.width = `${480 * 0.6}px`;
        target.style.height = `${480 * 0.6}px`;
    };

    return (
        <div className={cx('wrapper', { sender })} onMouseOver={handleDisplayAction} onMouseOut={handleHideAction}>
            {type === 'text' ? (
                <p className={cx(classname)} {...props}>
                    {children}
                </p>
            ) : (
                <img
                    className={cx('img-message')}
                    onLoad={onload}
                    src={`data:image/jpeg;base64,${children}`}
                    alt="message-img"
                />
            )}
            {actionMessage && (
                <div className={cx('message-sended-actions')}>
                    <Button message_sended leftIcon={<FontAwesomeIcon icon={faFaceGrinWide} />}></Button>
                    <Button message_sended leftIcon={<FontAwesomeIcon icon={faReply} />}></Button>
                    <Button message_sended leftIcon={<FontAwesomeIcon icon={faEllipsisVertical} />}></Button>
                </div>
            )}
            {actionMessage && <span className={cx('time-message')}>{time}</span>}
        </div>
    );
}

export default Message;
