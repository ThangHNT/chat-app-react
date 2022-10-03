import { useContext, useRef, useState, useEffect, memo } from 'react';
import classNames from 'classnames/bind';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Modal.module.scss';
import { ChatContentContext } from '~/components/Context/ChatContentContext';
import { SettingContext } from '~/components/Context/SettingContext';
import Theme from '~/components/Theme';
import DeleteMessage from '~/components/DeleteMessage';

const cx = classNames.bind(styles);

function Modal() {
    const ChatContentMsg = useContext(ChatContentContext);

    const { displayTheme, displayRemoveMessageModal } = useContext(SettingContext);

    const [zoomImg, setZoomImg] = useState(false);
    const [imgSrc, setImgSrc] = useState('');

    const imgRef = useRef();

    // đóng modal khi click bên ngoài
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
            setImgSrc(ChatContentMsg.zoomImg);
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
            {(zoomImg || displayTheme || displayRemoveMessageModal) && (
                <div className={cx('modal')}>
                    <div className={cx('modal-overlay')}></div>
                    <div className={cx('modal-content')}>
                        {displayTheme && <Theme receiver={ChatContentMsg.receiver} />}
                        {zoomImg && <img ref={imgRef} className={cx('img')} src={imgSrc} alt="anh dep" />}
                        {displayRemoveMessageModal && <DeleteMessage />}
                    </div>
                </div>
            )}
        </div>
    );
}

export default memo(Modal);
