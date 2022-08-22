import React, { useState, memo, useEffect, useMemo, useContext, useRef } from 'react';
import classNames from 'classnames/bind';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import styles from './Sidebar.module.scss';
import Search from '~/components/Search';
import MessageItem from '~/components/MessageItem';
import Button from '~/components/Button';
import host from '~/ulties/serverHost';
import { ChatContentContext } from '~/components/Context/ChatContentContext';

const cx = classNames.bind(styles);

function Sidebar() {
    // console.log('sidebar');
    const UserChatContent = useContext(ChatContentContext);
    const [listUser, setListUser] = useState([]);
    const senderId = useMemo(() => {
        return JSON.parse(localStorage.getItem('chat-app-hnt'))._id;
    }, []);

    const sidebarContentRef = useRef();

    useEffect(() => {
        sidebarContentRef.current.scrollTop = sidebarContentRef.current.scrollHeight;
    });

    useEffect(() => {
        axios.post(`${host}/api/message-item`, { sender: senderId }).then((data) => {
            const data2 = data.data;
            if (data2.status) {
                setListUser(data2.userList);
            } else {
                console.log('loi lay ds user');
            }
        });
    }, [senderId]);

    const handleClickMessageItem = (e) => {
        // lấy root element
        const rootdiv = e.currentTarget;
        UserChatContent.handleDisplayChatContent(rootdiv.getAttribute('userid'));
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <div className={cx('action')}>
                    <h3>USERS</h3>
                    <Button circle>
                        <FontAwesomeIcon icon={faEllipsis} />
                    </Button>
                </div>
                <div className={cx('search')}>
                    <Search />
                </div>
            </div>
            <div ref={sidebarContentRef} className={cx('content')}>
                {listUser.map((item, index) => (
                    <div
                        key={index}
                        userid={item.id}
                        className={cx('wrapper-message-item')}
                        onClick={handleClickMessageItem}
                    >
                        <MessageItem receiver={item.id} avatar={item.avatar} username={item.username} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default memo(Sidebar);
