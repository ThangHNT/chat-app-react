import { useContext, useState, useLayoutEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import ModalHeader from '../ModalHeader';
import styles from './Setting.module.scss';
import { SettingContext } from '~/components/Context/SettingContext';
import ModalFooter from '../ModalFooter';

const cx = classNames.bind(styles);

function Setting() {
    const { handleSetDisplayGeneralSetting, soundSetting } = useContext(SettingContext);

    const [sound, setSound] = useState({ ...soundSetting });
    const [currentSound, setCurrentSound] = useState({ ...soundSetting });

    const inputRef = useRef();
    const inputRef2 = useRef();
    const inputRef3 = useRef();

    useLayoutEffect(() => {
        // console.log(soundSetting);
        inputRef.current.checked = soundSetting.notify;
        inputRef2.current.checked = soundSetting.textting;
        inputRef3.current.checked = soundSetting.send;
        // eslint-disable-next-line
    }, []);

    const handleGetChangeSetting = (e) => {
        const target = e.currentTarget;
        const checked = target.checked;
        const type = target.getAttribute('sound');
        if (checked) {
            setCurrentSound((pre) => {
                pre[type] = true;
                return { ...pre };
            });
        } else {
            setCurrentSound((pre) => {
                pre[type] = false;
                return { ...pre };
            });
        }
    };

    const handleStoreSetting = () => {};

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <ModalHeader title="Cài đặt" onClick={handleSetDisplayGeneralSetting} />
            </div>
            <div className={cx('body')}>
                <div className={cx('item')}>
                    <div className={cx('title')}>Âm thanh thông báo</div>
                    <div className={cx('selection')}>
                        <input
                            ref={inputRef}
                            type="checkbox"
                            sound="notify"
                            className={cx('switch-btn')}
                            onClick={handleGetChangeSetting}
                        ></input>
                    </div>
                </div>
                <div className={cx('item')}>
                    <div className={cx('title')}>Âm thanh soạn tin nhắn</div>
                    <div className={cx('selection')}>
                        <input
                            ref={inputRef2}
                            type="checkbox"
                            sound="textting"
                            className={cx('switch-btn')}
                            onClick={handleGetChangeSetting}
                        ></input>
                    </div>
                </div>
                <div className={cx('item')}>
                    <div className={cx('title')}>Âm thanh gửi tin nhắn</div>
                    <div className={cx('selection')}>
                        <input
                            ref={inputRef3}
                            type="checkbox"
                            sound="send"
                            className={cx('switch-btn')}
                            onClick={handleGetChangeSetting}
                        ></input>
                    </div>
                </div>
            </div>
            <div className={cx('footer')}>
                <ModalFooter
                    clickToClose={handleSetDisplayGeneralSetting}
                    clickToStore={handleStoreSetting}
                    canStore={
                        sound.send !== currentSound.send ||
                        sound.textting !== currentSound.textting ||
                        sound.notify !== currentSound.notify
                    }
                />
            </div>
        </div>
    );
}

export default Setting;
