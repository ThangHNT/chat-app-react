import classNames from 'classnames/bind';
import styles from './Account.module.scss';
import Image from '~/components/Image';
const cx = classNames.bind(styles);

function Account() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('avatar')}>
                <Image
                    arounded
                    large
                    src="https://d1hjkbq40fs2x4.cloudfront.net/2016-01-31/files/1045.jpg"
                    alt="avatar"
                />
                <div className={cx('choose-img-btn-wrapper')}>
                    <div className={cx('choose-img-btn')}>Thay doi avatar</div>
                    <input className={cx('choose-img-input')} type="file" />
                </div>
            </div>
            <div className={cx('main-info')}></div>
        </div>
    );
}

export default Account;
