import { useContext, useRef, useState, useEffect, useMemo, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import host from '~/ulties/serverHost';
import styles from './Modal.module.scss';
import { ChatContentContext } from '~/components/Context/ChatContentContext';
import { SettingContext } from '~/components/Context/SettingContext';

const cx = classNames.bind(styles);

function Modal() {
    const ChatContentMsg = useContext(ChatContentContext);
    const { displayTheme, handleDisplayThemeList, themeList, handleSetTheme } = useContext(SettingContext);
    const Setting = useContext(SettingContext);

    const [zoomImg, setZoomImg] = useState(false);
    const [imgSrc, setImgSrc] = useState('');
    const [theme, setTheme] = useState(false);

    const user = useMemo(() => {
        return JSON.parse(localStorage.getItem('chat-app-hnt'));
    }, []);

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

    const handleSetDisplayThemeList = () => {
        handleDisplayThemeList();
        setTheme(false);
    };

    const handleGetTheme = (e) => {
        const target = e.currentTarget;
        target.style.backgroundColor = '#aaa';
        themeList.forEach((item, index) => {
            if (index !== Number(target.id)) {
                document.getElementById(index).style.backgroundColor = '#fff';
            }
        });
        if (Setting.theme !== target.id) {
            setTheme(target.id);
        } else {
            setTheme(false);
        }
    };

    const handleChangeTheme = async (e) => {
        if (theme) {
            handleSetTheme(theme);
            toast.success('Thay đổi chủ đề thành công');
            // console.log(theme);
            const data = await axios.post(`${host}/api/change-theme`, {
                sender: user._id,
                receiver: ChatContentMsg.receiver,
                theme,
            });
            if (!data.status) {
                console.log('thay doi theme loi');
            }
        }
    };

    return (
        <div className={cx('wrapper')}>
            {(zoomImg || displayTheme) && (
                <div className={cx('modal')}>
                    <div className={cx('modal-overlay')}></div>
                    <div className={cx('modal-content')}>
                        {displayTheme ? (
                            <div className={cx('theme-wrapper')}>
                                <div className={cx('theme-header')}>
                                    <span>Chủ Đề</span>
                                    <FontAwesomeIcon
                                        icon={faXmark}
                                        className={cx('close-icon')}
                                        onClick={handleSetDisplayThemeList}
                                    />
                                </div>
                                <div className={cx('theme-list')}>
                                    {themeList.map((item, index) => {
                                        return (
                                            <div
                                                key={index}
                                                id={`${index}`}
                                                className={cx('theme-item', {
                                                    active: Setting.theme === String(index),
                                                })}
                                                onClick={handleGetTheme}
                                            >
                                                <div className={cx(`${item.type}`)}></div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className={cx('theme-footer')}>
                                    <span className={cx('cancel-btn')} onClick={handleSetDisplayThemeList}>
                                        Hủy
                                    </span>
                                    <span
                                        // disabled={theme}
                                        className={cx('store-btn', { canChange: theme })}
                                        onClick={handleChangeTheme}
                                    >
                                        Lưu
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <img ref={imgRef} className={cx('img')} src={imgSrc} alt="anh dep" />
                        )}
                    </div>
                </div>
            )}
            <ToastContainer
                position="bottom-center"
                autoClose={2500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
            />
        </div>
    );
}

export default memo(Modal);
