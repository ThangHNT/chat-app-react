import { useContext, useRef, useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import ChatContent from '~/layouts/ChatContent';
import Sidebar from '~/layouts/Sidebar';
import styles from './HomeContent.module.scss';
import { ChatContentContext } from '~/components/Context/ChatContentContext';

const cx = classNames.bind(styles);

function HomeContent() {
    const ChatContentMsg = useContext(ChatContentContext);

    const [zoomImg, setZoomImg] = useState(false);
    const [imgScr, setImgScr] = useState('');

    const imgRef = useRef();
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
