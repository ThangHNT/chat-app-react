import { useContext, useState } from 'react';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import styles from './DeleteMessage.module.scss';
import { SettingContext } from '~/components/Context/SettingContext';

const cx = classNames.bind(styles);

function DeleteMessage() {
    const { handleSetDisplayRemoveMessageModal } = useContext(SettingContext);

    const [selected, setSlected] = useState(false);

    const handleCloseDeleteMessageModal = () => {
        handleSetDisplayRemoveMessageModal();
    };

    const handleSelectRemoveType = (e) => {
        const removeType = e.currentTarget.getAttribute('removetype');
        console.log(typeof removeType);
        setSlected(removeType);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('close-btn')} onClick={handleCloseDeleteMessageModal}>
                <FontAwesomeIcon icon={faXmark} />
            </div>
            <div className={cx('header')}>Bạn muốn gỡ tin nhắn này phía ai ?</div>
            <div className={cx('body')}>
                <span className={cx({ chose: selected === '0' })} onClick={handleSelectRemoveType} removetype="0">
                    Thu hồi với mọi người
                </span>
                <span className={cx({ chose: selected === '1' })} onClick={handleSelectRemoveType} removetype="1">
                    Xóa ở phía bạn
                </span>
            </div>
            <div className={cx('footer')}>
                <span className={cx('store-btn', { disabled: !selected })}>Lưu</span>
            </div>
        </div>
    );
}

export default DeleteMessage;
