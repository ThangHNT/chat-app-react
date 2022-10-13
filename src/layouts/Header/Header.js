import { memo, useEffect, useContext } from 'react';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faCircleQuestion, faUser } from '@fortawesome/free-solid-svg-icons';
import { io } from 'socket.io-client';
import host from '~/ulties/serverHost';
import { Link } from 'react-router-dom';
import styles from './Header.module.scss';
import Image from '~/components/Image';
import Button from '~/components/Button';
import { SocketContext } from '~/components/Context/SocketContext';
import { ChatContentContext } from '~/components/Context/ChatContentContext';
import { SettingContext } from '~/components/Context/SettingContext';
import { UserContext } from '~/components/Context/UserContext';

const cx = classNames.bind(styles);

function Header() {
    // console.log('Header');
    const { currentUser } = useContext(UserContext);
    const { darkLightMode } = useContext(SettingContext);
    const { handleInitSocket, socket, messageSended } = useContext(SocketContext);
    const { handleDisplayChatContent, handleAddMessage } = useContext(ChatContentContext);

    useEffect(() => {
        if (currentUser) {
            const socket = io(host);
            socket.auth = { userId: currentUser._id };
            handleInitSocket(socket);
        }
        // eslint-disable-next-line
    }, [currentUser]);

    const handleLogout = () => {
        localStorage.removeItem('chat-app-hnt');
        socket.close();
        messageSended.clear();
        handleDisplayChatContent('');
        handleAddMessage('');
    };

    return (
        <header className={cx('header', { darkmode: darkLightMode, darkmodeBorder: darkLightMode })}>
            <div className={cx('wrapper-logo')}>
                <Link to={currentUser ? '/' : '/login'} className={cx('logo-link')}>
                    <Image src="/logo.png" alt="logo" className={cx('logo')} />
                </Link>
                <span className={cx('header-title')}>Welcome</span>
            </div>
            <h1 className={cx('app-name')}>Chat app</h1>
            {currentUser ? (
                <div className={cx('user-info')}>
                    <span className={cx('user-name')}>{currentUser.username}</span>
                    <Tippy
                        interactive
                        delay={[100, 200]}
                        // visible
                        placement="bottom-end"
                        render={(attrs) => (
                            <div className={cx('user-menu', { darkmode: darkLightMode })} tabIndex="-1" {...attrs}>
                                <Button
                                    darkmodeBtn={darkLightMode}
                                    children="Tài khoản"
                                    text
                                    to="/account"
                                    leftIcon={<FontAwesomeIcon icon={faUser} />}
                                />
                                <Button
                                    darkmodeBtn={darkLightMode}
                                    onClick={handleLogout}
                                    children="Đăng xuất"
                                    text
                                    href="/login"
                                    leftIcon={<FontAwesomeIcon icon={faArrowRightFromBracket} />}
                                />
                            </div>
                        )}
                    >
                        <div className={cx('current-user')}>
                            {currentUser === null ? (
                                <Image
                                    src="https://toanthaydinh.com/wp-content/uploads/2020/04/wallpaper-4k-hinh-nen-4k-hinh-anh-ve-ruong-bac-thang-dep_101311157-1400x788-1.jpg"
                                    alt="avatar"
                                    arounded
                                    darkmode={darkLightMode}
                                />
                            ) : (
                                <Image darkmode={darkLightMode} avatar src={currentUser.avatar} alt="avatar" arounded />
                            )}
                        </div>
                    </Tippy>
                </div>
            ) : (
                <div className={cx('help')}>
                    <span>Trợ giúp</span>
                    <FontAwesomeIcon icon={faCircleQuestion} />
                </div>
            )}
        </header>
    );
}

export default memo(Header);
