import React, { memo, useContext } from 'react';
import classNames from 'classnames/bind';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import Button from '~/components/Button';
import 'tippy.js/dist/tippy.css';
import styles from './Menu.module.scss';
import host from '~/ulties/serverHost';
import { SocketContext } from '~/components/Context/SocketContext';
import { ChatContentContext } from '~/components/Context/ChatContentContext';

const cx = classNames.bind(styles);

const actionsMessageItem = [
    {
        text: 'Xoa doan chat',
        icon: <FontAwesomeIcon icon={faTrashCan} />,
        action: 'delete-messages',
    },
];

function Menu({ sender, receiver }) {
    const { handleBlockUser } = useContext(SocketContext);
    const { handleSetBlockStatus } = useContext(ChatContentContext);

    return actionsMessageItem.map((item, index) => {
        return (
            <div key={index} action={item.action} className={cx('wrapper')}>
                <Button darkmodeBtn={false} messageItem text leftIcon={item.icon} children={item.text} />
            </div>
        );
    });
}

export default memo(Menu);
