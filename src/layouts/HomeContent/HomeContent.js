import classNames from 'classnames/bind';
import ChatContent from '~/layouts/ChatContent';
import Sidebar from '~/layouts/Sidebar';
import styles from './HomeContent.module.scss';

const cx = classNames.bind(styles);

function HomeContent() {
    return (
        <div className={cx('wrapper')}>
            <Sidebar className={cx('sidebar')} />
            <ChatContent className={cx('chat-content')} />
        </div>
    );
}

export default HomeContent;
