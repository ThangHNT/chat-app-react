import React, { useState, memo, useEffect, useMemo, useRef } from 'react';
import classNames from 'classnames/bind';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import styles from './Sidebar.module.scss';
import Search from '~/components/Search';
import MessageItem from '~/components/MessageItem';
import Button from '~/components/Button';
import host from '~/ulties/serverHost';

const cx = classNames.bind(styles);

function Sidebar() {
    // console.log('sidebar');
    const [listUser, setListUser] = useState([]);
    const currentUser = useMemo(() => {
        return JSON.parse(localStorage.getItem('chat-app-hnt'));
    }, []);

    const sidebarContentRef = useRef();

    useEffect(() => {
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        sidebarContentRef.current.scrollTop = sidebarContentRef.current.scrollHeight;
    });

    useEffect(() => {
        if (currentUser) {
            axios.post(`${host}/api/message-item`, { sender: currentUser._id }).then((data) => {
                const data2 = data.data;
                if (data2.status) {
                    setListUser(data2.userList);
                } else {
                    console.log('loi lay ds user');
                }
            });
        }
    }, [currentUser]);

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
                    <div key={index} userid={item.id} className={cx('wrapper-message-item')}>
                        <MessageItem receiver={item.id} avatar={item.avatar} username={item.username} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default memo(Sidebar);
