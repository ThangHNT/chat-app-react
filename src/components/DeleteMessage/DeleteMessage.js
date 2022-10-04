import { useContext, useState, useEffect, memo } from 'react';
import axios from 'axios';
import host from '~/ulties/serverHost';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import styles from './DeleteMessage.module.scss';
import { SettingContext } from '~/components/Context/SettingContext';

const cx = classNames.bind(styles);

function DeleteMessage() {
    const { displayRemoveMessageModal, handleSetDisplayRemoveMessageModal } = useContext(SettingContext);

    const [selected, setSlected] = useState(false);
    const [messageInfo, setMessageInfo] = useState();

    useEffect(() => {
        if (displayRemoveMessageModal) {
            setMessageInfo(displayRemoveMessageModal);
        }
        // console.log(displayRemoveMessageModal);
        // eslint-disable-next-line
    }, []);

    const handleCloseDeleteMessageModal = () => {
        handleSetDisplayRemoveMessageModal('');
    };

    const handleSelectRemoveType = (e) => {
        const removeType = e.currentTarget.getAttribute('removetype');
        setSlected(removeType);
    };

    const handleStoreRemoveMessage = () => {
        if (messageInfo && selected) {
            handleSetDisplayRemoveMessageModal('');
            axios
                .post(`${host}/api/revoked-message`, { type: selected, ...messageInfo })
                .then(({ data }) => {
                    // console.log(data);
                })
                .catch(() => {
                    console.log('loi gỡ bỏ tin nhắn');
                });
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('close-btn')} onClick={handleCloseDeleteMessageModal}>
                <FontAwesomeIcon icon={faXmark} />
            </div>
            <div className={cx('header')}>Bạn muốn gỡ tin nhắn này phía ai ?</div>
            <div className={cx('body')}>
                <span
                    className={cx({ chose: selected === 'revoked' })}
                    onClick={handleSelectRemoveType}
                    removetype="revoked"
                >
                    Thu hồi với mọi người
                </span>
                <span
                    className={cx({ chose: selected === 'delete' })}
                    onClick={handleSelectRemoveType}
                    removetype="delete"
                >
                    Xóa ở phía bạn
                </span>
            </div>
            <div className={cx('footer')}>
                <span className={cx('store-btn', { disabled: !selected })} onClick={handleStoreRemoveMessage}>
                    Lưu
                </span>
            </div>
        </div>
    );
}

export default memo(DeleteMessage);
