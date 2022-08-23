import { useContext, useRef, useState, useEffect, useMemo } from 'react';
import classNames from 'classnames/bind';
import { io } from 'socket.io-client';
import ChatContent from '~/layouts/ChatContent';
import Sidebar from '~/layouts/Sidebar';
import styles from './HomeContent.module.scss';
import { ChatContentContext } from '~/components/Context/ChatContentContext';
import host from '~/ulties/serverHost';

const cx = classNames.bind(styles);

function HomeContent() {
    const ChatContentMsg = useContext(ChatContentContext);
    const currentUser = useMemo(() => {
        return JSON.parse(localStorage.getItem('chat-app-hnt'));
    }, []);
    const [zoomImg, setZoomImg] = useState(false);
    const [imgScr, setImgScr] = useState('');

    const imgRef = useRef();
    const socket = useRef();

    useEffect(() => {
        socket.current = io(host);
        // console.log(socket.current);
        socket.current.auth = { username: currentUser.username };
        socket.current.on('user connected', (user) => {
            // console.log(user);
        });
        socket.current.on('users', (users) => {
            console.log(users);
        });
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        document.addEventListener('click', (e) => {
            if (imgRef.current) {
                let isClickInside = imgRef.current.contains(e.target);
                if (!isClickInside) {
                    setZoomImg(false);
                    ChatContentMsg.handleZoomImgae('');
                }
            }
        });
        return () => {
            document.removeEventListener('click', (e) => {});
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (ChatContentMsg.zoomImg) {
            setZoomImg(true);
            setImgScr(ChatContentMsg.zoomImg);
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    setZoomImg(false);
                    ChatContentMsg.handleZoomImgae('');
                }
            });
        }
        // eslint-disable-next-line
    }, [ChatContentMsg.zoomImg]);

    return (
        <div className={cx('wrapper')}>
            <Sidebar className={cx('sidebar')} />
            <ChatContent className={cx('chat-content')} />
            {zoomImg && (
                <div className={cx('modal')}>
                    <div className={cx('modal-overlay')}></div>
                    <div className={cx('modal-content')}>
                        <img ref={imgRef} className={cx('img')} src={imgScr} alt="anh dep" />
                    </div>
                </div>
            )}
        </div>
    );
}

export default HomeContent;
