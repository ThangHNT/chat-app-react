import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faChevronDown, faChevronUp, faFont, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './Setting.module.scss';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';

const cx = classNames.bind(styles);

function Setting({ receiver }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('body')}>
                <div className={cx('item', { theme: true })}>
                    <FontAwesomeIcon className={cx('icon')} icon={faEthereum} />
                    <span>Thay đổi chủ đề</span>
                    <div className={cx('arrow')}>
                        <FontAwesomeIcon className={cx('icon')} icon={faChevronDown} />
                        <FontAwesomeIcon className={cx('icon')} icon={faChevronUp} />
                    </div>
                </div>
                <div className={cx('item', { changeNickName: true })}>
                    <FontAwesomeIcon className={cx('icon')} icon={faFont} />
                    <span>Chỉnh sửa biệt danh</span>
                </div>
                <div className={cx('item', { search: true })}>
                    <FontAwesomeIcon className={cx('icon')} icon={faMagnifyingGlass} />
                    <span>Tìm kiếm trong cuộc trò chuyện</span>
                </div>
                <div className={cx('item', { block: true })}>
                    <FontAwesomeIcon className={cx('icon')} icon={faBan} />
                    <span>Chặn {receiver.username} </span>
                </div>
            </div>
        </div>
    );
}

export default Setting;
