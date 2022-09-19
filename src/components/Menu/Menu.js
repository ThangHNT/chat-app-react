import React, { memo, useContext } from 'react';
import classNames from 'classnames/bind';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import Button from '~/components/Button';
import 'tippy.js/dist/tippy.css';
import styles from './Menu.module.scss';
import host from '~/ulties/serverHost';
import { SocketContext } from '~/components/Context/SocketContext';

const cx = classNames.bind(styles);

const actionsMessageItem = [
    {
        text: 'Chan',
        icon: <FontAwesomeIcon icon={faBan} />,
        action: 'block-user',
    },
    {
        text: 'Xoa doan chat',
        icon: <FontAwesomeIcon icon={faTrashCan} />,
        action: 'delete-messages',
    },
];

function Menu({ sender, receiver }) {
    const { handleBlockUser } = useContext(SocketContext);

    const handleAction = async (e) => {
        const target = e.currentTarget;
        const action = target.getAttribute('action');
        handleBlockUser({ sender, receiver });
        const { data } = await axios.post(`${host}/api/${action}`, { sender, receiver });
        if (!data.status) {
            console.log('loi ' + action);
        }
    };

    return actionsMessageItem.map((item, index) => {
        return (
            <div key={index} action={item.action} className={cx('wrapper')} onClick={handleAction}>
                <Button messageItem text leftIcon={item.icon} children={item.text} />
            </div>
        );
    });
}

export default memo(Menu);
