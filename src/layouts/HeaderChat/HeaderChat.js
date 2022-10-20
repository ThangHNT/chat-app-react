import { useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faPhone, faVideo } from '@fortawesome/free-solid-svg-icons';
import Image from '~/components/Image';
import Button from '~/components/Button';
import classNames from 'classnames/bind';
import styles from './HeaderChat.module.scss';
import PositiveStatus from '~/components/PositiveStatus';
import { SettingContext } from '~/components/Context/SettingContext';
import { CallContext } from '~/components/Context/CallContext';

const cx = classNames.bind(styles);

function HeaderChat({ receiver, onClick, hideSetting }) {
    // console.log('header-chat');
    const { darkLightMode } = useContext(SettingContext);
    const { handleDisplayCallVideo } = useContext(CallContext);

    useEffect(() => {
        hideSetting();
        // eslint-disable-next-line
    }, []);

    const handleDisplayCallVideoModal = () => {
        handleDisplayCallVideo();
    };

    return (
        <div className={cx('wrapper', { darkmode: darkLightMode })}>
            <div className={cx('receiver')}>
                <div>
                    <div className={cx('wrapper-img')}>
                        <Image darkmode={darkLightMode} arounded normal src={receiver.avatar} />
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
                <Button
                    noTitle
                    leftIcon={<FontAwesomeIcon icon={faVideo} onClick={handleDisplayCallVideoModal} />}
                ></Button>
                <Button noTitle leftIcon={<FontAwesomeIcon icon={faCircleInfo} onClick={onClick} />}></Button>
            </div>
        </div>
    );
}

export default HeaderChat;
