import { memo, useContext, useEffect, useMemo } from 'react';
import axios from 'axios';
import host from '~/ulties/serverHost';
import classNames from 'classnames/bind';
import ChatContent from '~/layouts/ChatContent';
import Sidebar from '~/layouts/Sidebar';
import styles from './HomeContent.module.scss';
import Modal from '~/layouts/Modal';
import { SettingContext } from '~/components/Context/SettingContext';

const cx = classNames.bind(styles);

function HomeContent() {
    // console.log('home-content');

    const { handleChangeDarkLightMode } = useContext(SettingContext);
    const user = useMemo(() => {
        return JSON.parse(localStorage.getItem('chat-app-hnt'));
    }, []);
    useEffect(() => {
        if (user) {
            axios
                .get(`${host}/api/get/general-settings/?userId=${user._id}`)
                .then(({ data }) => {
                    const darkMode = data.setting.darkMode;
                    handleChangeDarkLightMode(true, darkMode);
                })
                .catch(() => console.log('lay cài đặt chung bị lỗi'));
        }
        // eslint-disable-next-line
    }, [user]);

    return (
        <div className={cx('wrapper')}>
            <Sidebar className={cx('sidebar')} />
            <ChatContent className={cx('chat-content')} />
            <Modal />
        </div>
    );
}

export default memo(HomeContent);
