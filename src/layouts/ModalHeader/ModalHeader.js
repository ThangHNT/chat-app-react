import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './ModalHeader.module.scss';

const cx = classNames.bind(styles);

function ModalHeader({ title, onClick }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('body')}>
                <span>{title}</span>
                <FontAwesomeIcon icon={faXmark} className={cx('close-icon')} onClick={onClick} />
            </div>
        </div>
    );
}

export default ModalHeader;
