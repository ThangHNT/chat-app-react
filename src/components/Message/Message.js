import React, { useEffect, useContext, memo, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faFaceGrinWide, faReply, faFileLines } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './Message.module.scss';
import { ChatContentContext } from '~/components/Context/ChatContentContext';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

function Message({ sender = false, time, type, children, onClick, ...passprops }) {
    // console.log('message==');
    const ChatContent = useContext(ChatContentContext);
    const btnRef = useRef();
    const timeRef = useRef();

    useEffect(() => {
        timeRef.current.style.display = 'none';
        btnRef.current.style.display = 'none';
    }, []);

    const classname = cx('content-message', {});
    const props = {
        onClick,
        ...passprops,
    };

    const handleDisplayAction = () => {
        timeRef.current.style.display = 'flex';
        btnRef.current.style.display = 'flex';
    };

    const handleHideAction = () => {
        timeRef.current.style.display = 'none';
        btnRef.current.style.display = 'none';
    };

    const handleZoomImg = (e) => {
        ChatContent.handleZoomImgae(e.target.src);
    };

    return (
        <div className={cx('wrapper', { sender })} onMouseOver={handleDisplayAction} onMouseOut={handleHideAction}>
            {type === 'text' && (
                <p className={cx(classname)} {...props}>
                    {children}
                </p>
            )}
            {type === 'img' && (
                <img
                    className={cx('img-message')}
                    onClick={handleZoomImg}
                    src={`data:image/jpeg;base64,${children}`}
                    alt="message-img"
                />
            )}
            {type === 'text-file' && (
                <a
                    className={cx('wrapper-file-message')}
                    href={`data:attachment/text,${encodeURIComponent(children.content)}`}
                    download="text.txt"
                >
                    <FontAwesomeIcon className={cx('file-icon')} icon={faFileLines} />
                    <p>{children.filename}</p>
                </a>
            )}
            <div ref={btnRef} className={cx('message-sended-actions')}>
                <Button message_sended leftIcon={<FontAwesomeIcon icon={faFaceGrinWide} />}></Button>
                <Button message_sended leftIcon={<FontAwesomeIcon icon={faReply} />}></Button>
                <Button message_sended leftIcon={<FontAwesomeIcon icon={faEllipsisVertical} />}></Button>
            </div>
            <span ref={timeRef} className={cx('time-message')}>
                {time}
            </span>
        </div>
    );
}

export default memo(Message);
