import classNames from 'classnames/bind';
import styles from './ChatContent.module.scss';

const cx = classNames.bind(styles);

function ChatContent() {
    return (
        <div className={cx('wrapper')}>
            <h1> chat content</h1>
        </div>
    );
}

export default ChatContent;
