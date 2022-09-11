import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceGrinWide } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './ReactMessageIcon.module.scss';
import sadIcon from '~/assets/images/sad-reaction-icon.png';
import hahaIcon from '~/assets/images/haha-reaction-icon.png';
import heartIcon from '~/assets/images/heart-reaction-icon.png';
import AngryIcon from '~/assets/images/angry-reaction-icon.png';
import surprisedIcon from '~/assets/images/surprised-reaction-icon.png';
import likeIcon from '~/assets/images/like-reaction-icon.png';

const cx = classNames.bind(styles);

function ReactMessageIcon() {
    const handleClickIcon = () => {
        console.log('click reaction icon');
    };

    return (
        <div className={cx('wrapper')}>
            <FontAwesomeIcon className={cx('represent-icon')} icon={faFaceGrinWide} />
            <div className={cx('react-icon-list')}>
                <img className={cx('react-icon')} onClick={handleClickIcon} src={heartIcon} alt="heart-icon" />
                <img className={cx('react-icon')} onClick={handleClickIcon} src={hahaIcon} alt="haha-icon" />
                <img className={cx('react-icon')} onClick={handleClickIcon} src={surprisedIcon} alt="surprised-icon" />
                <img className={cx('react-icon')} onClick={handleClickIcon} src={sadIcon} alt="sad-icon" />
                <img className={cx('react-icon')} onClick={handleClickIcon} src={AngryIcon} alt="angry-icon" />
                <img className={cx('react-icon')} onClick={handleClickIcon} src={likeIcon} alt="like-icon" />
            </div>
        </div>
    );
}

export default ReactMessageIcon;
