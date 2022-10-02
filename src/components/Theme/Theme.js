import { useContext, useState, useMemo, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import classNames from 'classnames/bind';
import styles from './Theme.module.scss';
import host from '~/ulties/serverHost';
import { SettingContext } from '~/components/Context/SettingContext';
import { SocketContext } from '~/components/Context/SocketContext';

const cx = classNames.bind(styles);

function Theme({ receiver }) {
    // console.log('theme');
    const Socket = useContext(SocketContext);
    const [theme, setTheme] = useState(false);
    const { handleDisplayThemeList, themeList, handleSetTheme } = useContext(SettingContext);
    const Setting = useContext(SettingContext);

    const user = useMemo(() => {
        return JSON.parse(localStorage.getItem('chat-app-hnt'));
    }, []);

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
            await handleSetTheme(receiver, theme);
            toast.success('Thay đổi chủ đề thành công');
            const data = await axios.post(`${host}/api/change-theme`, {
                sender: user._id,
                receiver: receiver,
                theme,
            });
            // console.log(theme);
            Socket.handleChangeTheme(user._id, receiver, theme);
            if (!data.status) {
                console.log('yeu cau doi theme that bai');
                if (!data.data.status) {
                    console.log('doi theme loi');
                }
            }
            handleSetDisplayThemeList();
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('theme-header')}>
                <span>Chủ Đề</span>
                <FontAwesomeIcon icon={faXmark} className={cx('close-icon')} onClick={handleSetDisplayThemeList} />
            </div>
            <div className={cx('theme-list')}>
                {themeList.map((item, index) => {
                    return (
                        <div
                            key={index}
                            id={`${index}`}
                            className={cx('theme-item', {
                                active: Setting.theme.get(receiver) === String(index),
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
                <span className={cx('store-btn', { canChange: theme })} onClick={handleChangeTheme}>
                    Lưu
                </span>
            </div>
            <ToastContainer
                position="bottom-center"
                autoClose={2000}
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

export default memo(Theme);
