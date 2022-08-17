import React, { useState, useEffect, useContext } from 'react';
import classNames from 'classnames/bind';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faEllipsis, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import styles from './Sidebar.module.scss';
import Search from '~/components/Search';
import Button from '~/components/Button';
import MessageItem from '~/components/MessageItem';
import Menu from '~/components/Menu';
import host from '~/ulties/serverHost';
import { ChatContentContext } from '~/components/Context/ChatContentContext';

const cx = classNames.bind(styles);

const actionsMessageItem = [
    {
        text: 'Chan',
        icon: <FontAwesomeIcon icon={faBan} />,
    },
    {
        text: 'Xoa doan chat',
        icon: <FontAwesomeIcon icon={faTrashCan} />,
    },
];

function Sidebar() {
    const UserChatContent = useContext(ChatContentContext);
    const [menuMessageItem, setmenuMessageItem] = useState(-1);
    const [listUser, setListUser] = useState([]);

    useEffect(() => {
        const senderId = JSON.parse(localStorage.getItem('chat-app-hnt'))._id;
        axios.post(`${host}/api/message-item`, { sender: senderId }).then((data) => {
            const data2 = data.data;
            if (data2.status) {
                setListUser(data2.userList);
            } else {
                console.log('loi lay ds user');
            }
        });
    }, []);

    const handleDisplayMenu = (e) => {
        // lấy element div
        const div = e.target.closest('div');
        setmenuMessageItem((pre) => {
            return pre !== Number(div.id) ? Number(div.id) : -1;
        });
    };

    const handleClickMessageItem = (e) => {
        // lấy root element
        const rootdiv = e.currentTarget;
        UserChatContent.handleDisplayChatContent(rootdiv.getAttribute('userid'));
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <div className={cx('action')}>
                    <h3>USER</h3>
                    <Button circle>
                        <FontAwesomeIcon icon={faEllipsis} />
                    </Button>
                </div>
                <div className={cx('search')}>
                    <Search />
                </div>
            </div>
            <div className={cx('content')}>
                {listUser.map((item, index) => (
                    <div
                        key={index}
                        userid={item.id}
                        className={cx('wrapper-message-item')}
                        onClick={handleClickMessageItem}
                    >
                        <MessageItem receiver={item} avatar={item.avatar} username={item.username} />
                        <div id={index} className={cx('wrapper-btn')} onClick={handleDisplayMenu}>
                            <Button circle>
                                <FontAwesomeIcon icon={faEllipsis} />
                            </Button>
                        </div>
                        {menuMessageItem === index && (
                            <div className={cx('message-item-action-menu')}>
                                <Menu elements={actionsMessageItem} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Sidebar;
