import React, { useState, useEffect, useContext, useMemo, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import axios from 'axios';
import styles from './ChatContent.module.scss';
import Image from '~/components/Image';
import Messages from '~/layouts/Messages';
import { ChatContentContext } from '~/components/Context/ChatContentContext';
import SendMessage from '~/layouts/SendMessage';
import host from '~/ulties/serverHost';
import HeaderChat from '~/layouts/HeaderChat';

const cx = classNames.bind(styles);

function ChatContent() {
    // console.log('Chat-content');
    const ChatContent = useContext(ChatContentContext);
    const [receiver, setReceiver] = useState();
    const [loading, setLoading] = useState(false);
    const [blockStatus, setBlockStatus] = useState(false);

    const currentUser = useMemo(() => {
        return JSON.parse(localStorage.getItem('chat-app-hnt'));
    }, []);

    // lấy thông tin ng nhận khi ấn vào user bên sidebar
    useEffect(() => {
        if (ChatContent.receiver) {
            setLoading(true);
            // console.log(ChatContent.receiver);
            (async function () {
                // kiểm tra tình trạng chặn
                const { data } = await axios.post(`${host}/api/check-block-status`, {
                    currentUser: currentUser._id,
                    receiver: ChatContent.receiver,
                });
                if (data.status) {
                    // console.log(data);
                    setBlockStatus(data.blocked);
                } else {
                    console.log('loi check block status');
                }
            })();
            axios
                .get(`${host}/api/receiver/${ChatContent.receiver}`)
                .then((data) => {
                    const data2 = data.data;
                    if (data2.status) {
                        // console.log(data2.data);
                        setReceiver(data2.data);
                    } else {
                        alert(data2.msg);
                    }
                })
                .then(() => {
                    setLoading(false);
                })
                .catch((err) => {
                    console.log('Loi lay ng nhan');
                });
        }
        // eslint-disable-next-line
    }, [ChatContent.receiver]);

    return (
        <div className={cx('wrapper')}>
            {receiver && !loading && <HeaderChat receiver={receiver} />}
            {receiver && !loading && (
                <div className={cx('content')}>
                    {/* Nội dung tin nhắn */}
                    <Messages receiver={receiver} />
                </div>
            )}
            {receiver && !loading && (
                <div className={cx('send-message')}>
                    {/* phần soạn tin nhắn send message area */}
                    <SendMessage receiver={receiver} blockStatus={blockStatus} />
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
