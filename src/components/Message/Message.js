import React, { useState } from 'react';
import Tippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faFaceGrinWide, faReply } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './Message.module.scss';
import Button from '~/components/Button';
import Image from '~/components/Image';

const cx = classNames.bind(styles);

function Message({ sender = false, time, text = false, children, onClick, img = false, ...passprops }) {
    const [actionMessage, setActionMessage] = useState(false);

    const classname = cx('content-message', {
        text,
    });

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

    return (
        <div className={cx('wrapper', { sender })} onMouseOver={handleDisplayAction} onMouseOut={handleHideAction}>
            <Tippy
                // visible
                placement="bottom-start"
                render={(attrs) => (
                    <div className={cx('message-created')} tabIndex="-1" {...attrs}>
                        {time}
                    </div>
                )}
            >
                {!img && (
                    <p className={cx(classname)} {...props}>
                        {children}
                    </p>
                )}
                {img && <Image />}
            </Tippy>
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
