import { memo, useContext, useEffect } from 'react';
import axios from 'axios';
import host from '~/ulties/serverHost';
import classNames from 'classnames/bind';
import ChatContent from '~/layouts/ChatContent';
import Sidebar from '~/layouts/Sidebar';
import styles from './HomeContent.module.scss';
import Modal from '~/layouts/Modal';
import { SettingContext } from '~/components/Context/SettingContext';
import { UserContext } from '~/components/Context/UserContext';

const cx = classNames.bind(styles);

function HomeContent() {
    // console.log('home-content');
    const { currentUser } = useContext(UserContext);
    const { handleChangeDarkLightMode } = useContext(SettingContext);
    useEffect(() => {
        if (currentUser) {
            axios
                .get(`${host}/api/get/general-settings/?userId=${currentUser._id}`)
                .then(({ data }) => {
                    // console.log(data);
                    const darkMode = data.setting.darkMode;
                    handleChangeDarkLightMode(true, darkMode);
                })
                .catch(() => console.log('lay cài đặt chung bị lỗi'));
        }
        // eslint-disable-next-line
    }, [currentUser]);

    return (
        <div className={cx('wrapper')}>
            <Sidebar className={cx('sidebar')} />
            <ChatContent className={cx('chat-content')} />
            <Modal />
        </div>
    );
}

export default memo(HomeContent);
