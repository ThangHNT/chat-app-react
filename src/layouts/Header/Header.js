import { useMemo, memo, useEffect, useContext } from 'react';
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

const cx = classNames.bind(styles);

function Header({ currentUser = true }) {
    // console.log('Header');
    const { handleInitSocket } = useContext(SocketContext);

    const user = useMemo(() => {
        return JSON.parse(localStorage.getItem('chat-app-hnt'));
    }, []);

    useEffect(() => {
        if (user) {
            const socket = io(host);
            socket.auth = { userId: user._id };
            handleInitSocket(socket);
        }
        // eslint-disable-next-line
    }, [user]);

    const handleLogout = () => {
        localStorage.removeItem('chat-app-hnt');
    };

    return (
        <header className={cx('header', { 'wrapper-content': true })}>
            <Link to="/" className={cx('logo-link')}>
                <Image src="/logo.png" alt="logo" className={cx('logo')} />
            </Link>
            <h1>Chat app</h1>
            {currentUser ? (
                <Tippy
                    interactive
                    delay={[100, 200]}
                    // visible
                    placement="bottom-end"
                    render={(attrs) => (
                        <div className={cx('current-user-menu')} tabIndex="-1" {...attrs}>
                            <Button children="Tài khoản" text leftIcon={<FontAwesomeIcon icon={faUser} />} />
                            <Button
                                onClick={handleLogout}
                                children="Đăng xuất"
                                text
                                to="/login"
                                leftIcon={<FontAwesomeIcon icon={faArrowRightFromBracket} />}
                            />
                        </div>
                    )}
                >
                    {user === null ? (
                        <Image
                            src="https://toanthaydinh.com/wp-content/uploads/2020/04/wallpaper-4k-hinh-nen-4k-hinh-anh-ve-ruong-bac-thang-dep_101311157-1400x788-1.jpg"
                            alt="avatar"
                            arounded
                            className={cx('current-user')}
                        />
                    ) : (
                        <Image src={user.avatar} alt="avatar" arounded className={cx('current-user')} />
                    )}
                </Tippy>
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
