import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import styles from './Message.module.scss';
import Button from '~/components/Button';
import { faEllipsisVertical, faFaceGrinWide, faReply } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Message({ sender = false, text = false, children, onClick, img = false, ...passprops }) {
    const [actionMessage, setActionMessage] = useState(false);

    let Msg = 'p';
    const classname = cx('content-message', {
        text,
    });

    const props = {
        onClick,
        ...passprops,
    };

    if (img) {
        Msg = 'img';
    }

    const handleDisplayAction = () => {
        setActionMessage(true);
    };

    const handleHideAction = () => {
        setActionMessage(false);
    };

    return (
        <div className={cx('wrapper', { sender })} onMouseOver={handleDisplayAction} onMouseOut={handleHideAction}>
            <Msg className={cx(classname)} {...props}>
                {children}
            </Msg>
            {actionMessage && (
                <div className={cx('message-sended-actions')}>
                    <Button message_sended leftIcon={<FontAwesomeIcon icon={faFaceGrinWide} />}></Button>
                    <Button message_sended leftIcon={<FontAwesomeIcon icon={faReply} />}></Button>
                    <Button message_sended leftIcon={<FontAwesomeIcon icon={faEllipsisVertical} />}></Button>
                </div>
            )}
        </div>
    );
}

export default Message;
