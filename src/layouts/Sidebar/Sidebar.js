import React, { useState, memo, useEffect, useMemo, useRef, useContext } from 'react';
import classNames from 'classnames/bind';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import styles from './Sidebar.module.scss';
import Search from '~/components/Search';
import MessageItem from '~/components/MessageItem';
import host from '~/ulties/serverHost';
import { SettingContext } from '~/components/Context/SettingContext';

const cx = classNames.bind(styles);

function Sidebar() {
    // console.log('sidebar');
    const { handleChangeDarkLightMode } = useContext(SettingContext);
    const [listUser, setListUser] = useState([]);
    const [darkMode, setDarkMode] = useState(false);
    const currentUser = useMemo(() => {
        return JSON.parse(localStorage.getItem('chat-app-hnt'));
    }, []);

    const sidebarContentRef = useRef();

    // useEffect(() => {
    //     // eslint-disable-next-line
    // }, []);

    useEffect(() => {
        if (currentUser) {
            axios.post(`${host}/api/message-item`, { sender: currentUser._id }).then((data) => {
                const data2 = data.data;
                if (data2.status) {
                    const arr = data2.userList.slice(0, 6);
                    setListUser(arr);
                } else {
                    console.log('loi lay ds user');
                }
            });
        }
    }, [currentUser]);

    const handleChangeMode = () => {
        handleChangeDarkLightMode();
        // console.log(darkMode);
        setDarkMode((pre) => !pre);
        const html = document.querySelector('html');
        darkMode === true ? html.classList.remove('darkmode') : html.classList.add('darkmode');
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header', { darkmode: darkMode })}>
                <div className={cx('action')}>
                    <h3>USERS</h3>
                    <label className={cx('dark-mode-btn')}>
                        <input className={cx('checkbox')} type="checkbox" onClick={handleChangeMode} />
                        <div className={cx('dark-mode')}>
                            <FontAwesomeIcon className={cx('sun-icon')} icon={faSun} />
                            <FontAwesomeIcon className={cx('moon-icon')} icon={faMoon} />
                            <div className={cx('ball')}></div>
                        </div>
                    </label>
                </div>
                <div className={cx('search')}>
                    <Search darkmode={darkMode} />
                </div>
            </div>
            <div ref={sidebarContentRef} className={cx('content')}>
                {listUser.map((item, index) => (
                    <div key={index} userid={item.id} className={cx('wrapper-message-item')}>
                        <MessageItem
                            darkmode={darkMode}
                            receiver={item.id}
                            avatar={item.avatar}
                            username={item.username}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default memo(Sidebar);
