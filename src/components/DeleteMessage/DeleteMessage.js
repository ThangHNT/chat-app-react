import classNames from 'classnames/bind';
import styles from './DeleteMessage.module.scss';

const cx = classNames.bind(styles);

function DeleteMessage() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>Bạn muốn gỡ tin nhắn này phía ai ?</div>
            <div className={cx('body')}>
                <span>Thu hồi với mọi người</span>
                <span>Xóa ở phía bạn</span>
            </div>
            <div className={cx('footer')}>Đóng</div>
        </div>
    );
}

export default DeleteMessage;
