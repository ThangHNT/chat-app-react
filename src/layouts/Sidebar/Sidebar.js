import React, { useState, memo, useEffect, useMemo, useRef, useContext, useLayoutEffect } from 'react';
import classNames from 'classnames/bind';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import styles from './Sidebar.module.scss';
import Search from '~/components/Search';
import MessageItem from '~/components/MessageItem';
import host from '~/ulties/serverHost';
import { SettingContext } from '~/components/Context/SettingContext';
import { useDebounce } from '~/hooks';

const cx = classNames.bind(styles);

function Sidebar() {
    // console.log('sidebar');
    const { handleChangeDarkLightMode, darkLightMode } = useContext(SettingContext);
    const [listUser, setListUser] = useState([]);
    const currentUser = useMemo(() => {
        return JSON.parse(localStorage.getItem('chat-app-hnt'));
    }, []);

    const debounce = useDebounce(darkLightMode, 2500);

    const checkboxRef = useRef();
    const sidebarContentRef = useRef();

    useEffect(() => {
        // console.log(debounce);
        if (debounce !== undefined) {
            axios
                .post(`${host}/api/change/general-settings`, {
                    type: 'dark mode',
                    value: darkLightMode,
                    userId: currentUser._id,
                })
                .catch(() => console.log('loi thay doi dark mode to data base'));
        }
        // eslint-disable-next-line
    }, [debounce]);

    useLayoutEffect(() => {
        handleChangeDarkLightModeHtml();
        checkboxRef.current.checked = darkLightMode;
        // eslint-disable-next-line
    }, [darkLightMode]);

    useEffect(() => {
        if (currentUser) {
            axios.post(`${host}/api/message-item`, { sender: currentUser._id }).then((data) => {
                const data2 = data.data;
                if (data2.status) {
                    const arr = data2.userList.slice(0, 7);
                    setListUser(arr);
                } else {
                    console.log('loi lay ds user');
                }
            });
        }
    }, [currentUser]);

    const handleChangeMode = () => {
        handleChangeDarkLightMode();
        handleChangeDarkLightModeHtml();
    };

    const handleChangeDarkLightModeHtml = () => {
        const html = document.querySelector('html');
        darkLightMode === false ? html.classList.remove('darkmode') : html.classList.add('darkmode');
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header', { darkmode: darkLightMode })}>
                <div className={cx('action')}>
                    <h3>USERS</h3>
                    <label className={cx('dark-mode-btn')}>
                        <input
                            ref={checkboxRef}
                            className={cx('checkbox')}
                            type="checkbox"
                            onClick={handleChangeMode}
                        />
                        <div className={cx('dark-mode')}>
                            <FontAwesomeIcon className={cx('sun-icon')} icon={faSun} />
                            <FontAwesomeIcon className={cx('moon-icon')} icon={faMoon} />
                            <div className={cx('ball')}></div>
                        </div>
                    </label>
                </div>
                <div className={cx('search')}>
                    <Search darkmode={darkLightMode} />
                </div>
            </div>
            <div ref={sidebarContentRef} className={cx('content')}>
                {listUser.map((item, index) => (
                    <div key={index} userid={item.id} className={cx('wrapper-message-item')}>
                        <MessageItem
                            darkmode={darkLightMode}
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
