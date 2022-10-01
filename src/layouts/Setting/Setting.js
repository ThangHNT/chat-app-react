import { useState, useMemo, useContext } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faBan, faFont, faImage, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import host from '~/ulties/serverHost';
import styles from './Setting.module.scss';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import { SettingContext } from '~/components/Context/SettingContext';
import { SocketContext } from '~/components/Context/SocketContext';

const cx = classNames.bind(styles);

function Setting({ receiver, darkmode }) {
    const { blockStatus, handlSetBlockStatus, handleDisplayThemeList, handleSetBackground } =
        useContext(SettingContext);
    const { handleBlockUser, handleUnblockUser } = useContext(SocketContext);
    const [background, setBackground] = useState(false);
    const [imageInput, setImageInput] = useState(false);

    const currentUser = useMemo(() => {
        return JSON.parse(localStorage.getItem('chat-app-hnt'));
    }, []);

    const handleBlock = async (e) => {
        if (blockStatus.block) {
            handleUnblockUser({ sender: currentUser._id, receiver: receiver.id });
            const { data } = await axios.post(`${host}/api/unblock-user`, {
                sender: currentUser._id,
                receiver: receiver.id,
            });
            if (!data.status) {
                console.log('loi block-user');
            }
        } else {
            handleBlockUser({ sender: currentUser._id, receiver: receiver.id });
            const { data } = await axios.post(`${host}/api/block-user`, {
                sender: currentUser._id,
                receiver: receiver.id,
            });
            if (!data.status) {
                console.log('loi block-user');
            }
        }
        handlSetBlockStatus({ blocked: blockStatus.blocked, block: !blockStatus.block, receiver: receiver.id });
    };

    const handleSetBackgroundImage = (e) => {
        setBackground((pre) => !pre);
    };

    const handleChooseImage = (e) => {
        const reader = new FileReader();
        if (e.target.files) {
            let file = e.target.files[0];
            // console.log(file);
            reader.readAsDataURL(file);
            reader.onload = () => {
                let base64String = reader.result;
                // console.log(base64String);
                setImageInput(base64String);
            };
        }
    };

    const handleStoreBackgroundImage = () => {
        handleSetBackground(imageInput);
        // axios
        //     .post(`${host}/api/set/background-image`, {
        //         sender: currentUser._id,
        //         receiver: receiver.id,
        //         image: imageInput,
        //     })
        //     .then(({ data }) => {
        //         console.log(data);
        //     })
        //     .catch((err) => console.log('loi doi anh nen'));
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('body', { darkmode: darkmode })}>
                <div className={cx('item', { darkmodeItem: darkmode })}>
                    <div className={cx('title')} onClick={handleDisplayThemeList}>
                        <FontAwesomeIcon className={cx('icon')} icon={faEthereum} />
                        <span>Thay đổi chủ đề</span>
                    </div>
                </div>
                <div className={cx('item', { darkmodeItem: darkmode })}>
                    <div className={cx('title')} onClick={handleSetBackgroundImage}>
                        <FontAwesomeIcon className={cx('icon')} icon={faImage} />
                        <span>Thay đổi ảnh nền</span>
                    </div>
                    <div className={cx('arrow')}>
                        {background ? (
                            <FontAwesomeIcon className={cx('icon')} icon={faAngleUp} />
                        ) : (
                            <FontAwesomeIcon className={cx('icon')} icon={faAngleDown} />
                        )}
                    </div>
                    {background && (
                        <div className={cx('choose-background')}>
                            <input
                                onChange={handleChooseImage}
                                className={cx('background-input')}
                                type="file"
                                accept="image/*"
                            />
                            <span
                                className={cx('store-background-btn', { disabled: !imageInput })}
                                onClick={handleStoreBackgroundImage}
                            >
                                Lưu
                            </span>
                        </div>
                    )}
                </div>
                <div className={cx('item', { changeNickName: true, darkmodeItem: darkmode })}>
                    <div className={cx('title')}>
                        <FontAwesomeIcon className={cx('icon')} icon={faFont} />
                        <span>Chỉnh sửa biệt danh</span>
                    </div>
                </div>
                <div className={cx('item', { search: true, darkmodeItem: darkmode })}>
                    <div className={cx('title')}>
                        <FontAwesomeIcon className={cx('icon')} icon={faMagnifyingGlass} />
                        <span>Tìm kiếm trong cuộc trò chuyện</span>
                    </div>
                </div>
                <div className={cx('item', { block: true, darkmodeItem: darkmode })} onClick={handleBlock}>
                    <div className={cx('title')}>
                        <FontAwesomeIcon className={cx('icon')} icon={faBan} />
                        {blockStatus.block ? (
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
