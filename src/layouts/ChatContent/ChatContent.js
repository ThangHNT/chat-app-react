import React, { useState, useEffect, useContext, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faPhone, faSpinner, faVideo } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './ChatContent.module.scss';
import Image from '~/components/Image';
import Button from '~/components/Button';
import Messages from '~/layouts/Messages';
import { ChatContentContext } from '~/components/Context/ChatContentContext';
import SendMessage from '~/layouts/SendMessage';
import host from '~/ulties/serverHost';

const cx = classNames.bind(styles);

function ChatContent() {
    const ChatContent = useContext(ChatContentContext);
    const [receiver, setReceiver] = useState();
    const [loading, setLoading] = useState(false);

    // lấy thông tin ng nhận khi ấn vào user bên sidebar
    useEffect(() => {
        if (ChatContent.receiver) {
            setLoading(true);
            fetch(`${host}/api/receiver/${encodeURIComponent(ChatContent.receiver)}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.status) {
                        setReceiver(data.data);
                    } else {
                        alert(data.msg);
                    }
                })
                .then(() => {
                    setLoading(false);
                })
                .catch((err) => {
                    console.log('Loi lay ng nhan');
                });
        }
    }, [ChatContent.receiver]);

    return (
        <div className={cx('wrapper')}>
            {receiver && !loading && (
                <div className={cx('header')}>
                    <div className={cx('receiver')}>
                        <div>
                            <div className={cx('wrapper-img')}>
                                <Image arounded src={receiver.avatar} />
                                <span className="online"></span>
                            </div>
                        </div>
                        <div className={cx('info')}>
                            <span>{receiver.username}</span>
                            <p>Dang hoat dong</p>
                        </div>
                    </div>
                    <div className={cx('action-btns')}>
                        <Button noTitle leftIcon={<FontAwesomeIcon icon={faPhone} />}></Button>
                        <Button noTitle leftIcon={<FontAwesomeIcon icon={faVideo} />}></Button>
                        <Button noTitle leftIcon={<FontAwesomeIcon icon={faCircleInfo} />}></Button>
                    </div>
                </div>
            )}
            {receiver && !loading && (
                <div className={cx('content')}>
                    {/* Nội dung tin nhắn */}
                    <Messages receiver={receiver} />
                </div>
            )}
            {receiver && !loading && (
                <div className={cx('send-message')}>
                    {/* phần soạn tin nhắn send message area */}
                    <SendMessage receiver={receiver} />
                </div>
            )}
            {/* khi chưa chọn messageItem(người nhận) hiện lên ảnh */}
            {!receiver && !loading && (
                <Image noneReceiver src="https://cdn-icons-png.flaticon.com/512/2312/2312512.png" alt="no thing" />
            )}

            {loading && <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />}
        </div>
    );
}

export default memo(ChatContent);
