import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faPhone, faVideo } from '@fortawesome/free-solid-svg-icons';
import Image from '~/components/Image';
import Button from '~/components/Button';
import classNames from 'classnames/bind';
import styles from './HeaderChat.module.scss';
import PositiveStatus from '~/components/PositiveStatus';

const cx = classNames.bind(styles);

function HeaderChat({ receiver }) {
    // console.log('header-chat');
    return (
        <div className={cx('wrapper')}>
            <div className={cx('receiver')}>
                <div>
                    <div className={cx('wrapper-img')}>
                        <Image arounded src={receiver.avatar} />
                        <PositiveStatus receiver={receiver.id} />
                    </div>
                </div>
                <div className={cx('info')}>
                    <span>{receiver.username}</span>
                    {/* <p>Dang hoat dong</p> */}
                </div>
            </div>
            <div className={cx('action-btns')}>
                <Button noTitle leftIcon={<FontAwesomeIcon icon={faPhone} />}></Button>
                <Button noTitle leftIcon={<FontAwesomeIcon icon={faVideo} />}></Button>
                <Button noTitle leftIcon={<FontAwesomeIcon icon={faCircleInfo} />}></Button>
            </div>
        </div>
    );
}

export default HeaderChat;