import { useEffect, useState, useRef, memo, useMemo } from 'react';
import classNames from 'classnames/bind';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faEllipsis, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import styles from './MessageItem.module.scss';
import Image from '~/components/Image';
import host from '~/ulties/serverHost';
import Button from '~/components/Button';
import Menu from '~/components/Menu';
import PositiveStatus from '~/components/PositiveStatus';

const cx = classNames.bind(styles);

const actionsMessageItem = [
    {
        text: 'Chan',
        icon: <FontAwesomeIcon icon={faBan} />,
    },
    {
        text: 'Xoa doan chat',
        icon: <FontAwesomeIcon icon={faTrashCan} />,
    },
];

function MessageItem({ receiver, avatar, username, searchResult = false }) {
    // console.log('message-item');
    const [lastestMessage, setlastestMessage] = useState();
    const [menuMessageItem, setmenuMessageItem] = useState(false);
    const senderId = useMemo(() => {
        return JSON.parse(localStorage.getItem('chat-app-hnt'))._id;
    }, []);

    const btnRef = useRef();

    // lấy tin nhắn mới nhất
    useEffect(() => {
        if (!searchResult) {
            axios
                .post(`${host}/api/lastest-message`, {
                    receiver: receiver,
                    sender: senderId,
                })
                .then((data) => {
                    const data2 = data.data;
                    if (data2.status) {
                        if (data2.message.message.sender === senderId) {
                            if (data2.message.message.type === 'text') {
                                setlastestMessage('Ban: ' + data2.message.message.text);
                            } else {
                                setlastestMessage('Ban gui 1 anh ');
                            }
                        } else {
                            setlastestMessage(data2.message.message.text);
                        }
                    }
                })
                .catch((error) => {
                    console.log('loi lay tin nhan gan nhat');
                });
        }
        // eslint-disable-next-line
    }, []);

    // ẩn menu messageItem khi click chỗ khác
    useEffect(() => {
        document.addEventListener('click', (e) => {
            if (btnRef.current) {
                if (!btnRef.current.contains(e.target)) {
                    setmenuMessageItem(false);
                }
            }
        });

        return () => {
            document.removeEventListener('click', (e) => {});
        };
    }, []);

    // display menu-action
    const handleDisplayMenu = (e) => {
        setmenuMessageItem(!menuMessageItem);
    };

    return (
        <div className={cx('wrapper', { searchResult })}>
            <div className={cx('avatar')}>
                <Image small={searchResult ? true : false} src={avatar} avatar alt="avatar" />
                <PositiveStatus receiver={receiver} />
            </div>
            <div className={cx('info')}>
                {searchResult ? (
                    <span className={cx('long-name')}>{username}</span>
                ) : (
                    <span className={cx('username')}>{username}</span>
                )}
                {!searchResult && <p className={cx('message')}>{lastestMessage}</p>}
            </div>
            {!searchResult && (
                <div className={cx('action-btns')}>
                    <div className={cx('wrapper-btn')} ref={btnRef} onClick={handleDisplayMenu}>
                        <Button circle>
                            <FontAwesomeIcon icon={faEllipsis} />
                        </Button>
                    </div>
                    {menuMessageItem && (
                        <div className={cx('message-item-action-menu')}>
                            <Menu elements={actionsMessageItem} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default memo(MessageItem);
