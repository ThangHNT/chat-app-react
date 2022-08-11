import classNames from 'classnames/bind';
import ChatContent from '~/layouts/ChatContent';
import Sidebar from '~/layouts/Sidebar';
import styles from './HomeContent.module.scss';
import { ChatContentProvider } from '~/components/Context/ChatContentContext';

const cx = classNames.bind(styles);

function HomeContent() {
    return (
        <div className={cx('wrapper')}>
            <ChatContentProvider>
                <Sidebar className={cx('sidebar')} />
                <ChatContent className={cx('chat-content')} />
            </ChatContentProvider>
        </div>
    );
}

export default HomeContent;
