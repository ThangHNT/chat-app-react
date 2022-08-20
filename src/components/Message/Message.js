import React, { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faFaceGrinWide, faReply } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './Message.module.scss';
import { ChatContentContext } from '~/components/Context/ChatContentContext';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

function Message({ sender = false, time, type, children, onClick, ...passprops }) {
    const ChatContent = useContext(ChatContentContext);

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

    const handleZoomImg = (e) => {
        ChatContent.handleZoomImgae(e.target.src);
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
                    onClick={handleZoomImg}
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
