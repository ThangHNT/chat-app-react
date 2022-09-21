import { useState, useMemo, useContext } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faChevronRight, faChevronLeft, faFont, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import host from '~/ulties/serverHost';
import styles from './Setting.module.scss';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import { SettingContext } from '~/components/Context/SettingContext';
import { SocketContext } from '~/components/Context/SocketContext';

const cx = classNames.bind(styles);

function Setting({ receiver }) {
    const { blockStatus, handlSetBlockStatus } = useContext(SettingContext);
    const { handleBlockUser, handleUnblockUser } = useContext(SocketContext);

    const [openThemes, setOpenThemes] = useState(true);

    const currentUser = useMemo(() => {
        return JSON.parse(localStorage.getItem('chat-app-hnt'));
    }, []);

    const handleDisplayTheme = () => {
        setOpenThemes((pre) => !pre);
    };

    const handleBlock = async (e) => {
        if (blockStatus === 'block') {
            handlSetBlockStatus('false');
            handleUnblockUser({ sender: currentUser._id, receiver: receiver.id });
        } else {
            handlSetBlockStatus('block');
            handleBlockUser({ sender: currentUser._id, receiver: receiver.id });
        }
        // const { data } = await axios.post(`${host}/api/block-user`, { sender: currentUser._id, receiver: receiver.id });
        // if (!data.status) {
        //     console.log('loi block-user');
        // }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('body')}>
                <div className={cx('item')}>
                    <div className={cx('title')} onClick={handleDisplayTheme}>
                        <FontAwesomeIcon className={cx('icon')} icon={faEthereum} />
                        <span>Thay đổi chủ đề</span>
                        <div className={cx('arrow')}>
                            {openThemes && <FontAwesomeIcon className={cx('icon')} icon={faChevronRight} />}
                            {!openThemes && <FontAwesomeIcon className={cx('icon')} icon={faChevronLeft} />}
                        </div>
                    </div>
                    {!openThemes && (
                        <div className={cx('theme-list')}>
                            <div className={cx('theme-item')}>
                                <span className={cx('theme1')}></span>
                            </div>
                            <div className={cx('theme-item')}>
                                <span className={cx('theme2')}></span>
                            </div>
                            <div className={cx('theme-item')}>
                                <span className={cx('theme3')}></span>
                            </div>
                            <div className={cx('theme-item')}>
                                <span className={cx('theme4')}></span>
                            </div>
                            <div className={cx('theme-item')}>
                                <span className={cx('theme5')}></span>
                            </div>
                        </div>
                    )}
                </div>
                <div className={cx('item', { changeNickName: true })}>
                    <div className={cx('title')}>
                        <FontAwesomeIcon className={cx('icon')} icon={faFont} />
                        <span>Chỉnh sửa biệt danh</span>
                    </div>
                </div>
                <div className={cx('item', { search: true })}>
                    <div className={cx('title')}>
                        <FontAwesomeIcon className={cx('icon')} icon={faMagnifyingGlass} />
                        <span>Tìm kiếm trong cuộc trò chuyện</span>
                    </div>
                </div>
                <div className={cx('item', { block: true })} onClick={handleBlock}>
                    <div className={cx('title')}>
                        <FontAwesomeIcon className={cx('icon')} icon={faBan} />
                        {blockStatus === 'block' ? (
                            <span>Bỏ Chặn {receiver.username} </span>
                        ) : (
                            <span>Chặn {receiver.username} </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Setting;
