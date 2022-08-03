import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import styles from './ChatContent.module.scss';
import Image from '~/components/Image';
import Button from '~/components/Button';
import { faCircleInfo, faPhone, faVideo } from '@fortawesome/free-solid-svg-icons';
import Message from '~/components/Message';

const cx = classNames.bind(styles);

function ChatContent() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <div className={cx('reciever')}>
                    <div>
                        <div className={cx('wrapper-img')}>
                            <Image
                                arounded
                                src="https://nhattientuu.com/wp-content/uploads/2020/08/hinh-anh-dep-1.jpg"
                            />
                            <span className="online"></span>
                        </div>
                    </div>
                    <div className={cx('info')}>
                        <span>Thang</span>
                        <p>Dang hoat dong</p>
                    </div>
                </div>
                <div className={cx('action-btns')}>
                    <Button noTitle leftIcon={<FontAwesomeIcon icon={faPhone} />}></Button>
                    <Button noTitle leftIcon={<FontAwesomeIcon icon={faVideo} />}></Button>
                    <Button noTitle leftIcon={<FontAwesomeIcon icon={faCircleInfo} />}></Button>
                </div>
            </div>
            <div className={cx('content')}>
                <div className={cx('messages')}>
                    <Message text />
                </div>
                <div className={cx('send-message')}></div>
            </div>
        </div>
    );
}

export default ChatContent;
