import classNames from 'classnames/bind';
import styles from './MessageItem.module.scss';
import Image from '~/components/Image';

const cx = classNames.bind(styles);

function MessageItem({ avatar, title, message }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('avatar')}>
                <Image src={avatar} avatar alt="avatar" />
            </div>
            <div className={cx('info')}>
                <span className={cx('title')}>{title}</span>
                <p className={cx('message')}>{message}</p>
            </div>
        </div>
    );
}

export default MessageItem;
